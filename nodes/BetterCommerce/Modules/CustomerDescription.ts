import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
    NodeApiError,
} from 'n8n-workflow';
import { BetterCommerceClient } from '../Utils/Client';

export async function handleCustomerOperations(
    this: IExecuteFunctions, 
    index: number
): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this);
    const operation = this.getNodeParameter('operation', index) as string;

    try {
        switch (operation) {
            case 'create':
                const createParams = {
                    email: this.getNodeParameter('email', index) as string,
                    firstName: this.getNodeParameter('firstName', index, '') as string,
                    lastName: this.getNodeParameter('lastName', index, '') as string,
                };
                return [{
                    json: await client.create<IDataObject>('/customers', createParams)
                }];

            case 'get':
                const customerId = this.getNodeParameter('customerId', index) as string;
                return [{
                    json: await client.get<IDataObject>(`/customers/${customerId}`)
                }];

            case 'getAll':
                const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
                const qs: IDataObject = {};
                
                if (!returnAll) {
                    qs.limit = this.getNodeParameter('limit', index, 0) as number;
                }
                
                return [{
                    json: await client.get<IDataObject>('/customers', qs)
                }];

            case 'update':
                const updateId = this.getNodeParameter('customerId', index) as string;
                const updateParams = {
                    firstName: this.getNodeParameter('firstName', index, '') as string,
                    lastName: this.getNodeParameter('lastName', index, '') as string,
                };
                return [{
                    json: await client.update<IDataObject>(`/customers/${updateId}`, updateParams)
                }];

            case 'delete':
                const deleteId = this.getNodeParameter('customerId', index) as string;
                await client.delete(`/customers/${deleteId}`);
                return [{
                    json: { success: true }
                }];

            default:
                throw new NodeApiError(this.getNode(), {
                    message: `Unsupported operation: ${operation}`,
                    description: 'The provided operation is not supported',
                });
        }
    } catch (error) {
        throw new NodeApiError(this.getNode(), error);
    }
}