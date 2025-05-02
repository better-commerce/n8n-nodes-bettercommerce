import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
    NodeApiError,
} from 'n8n-workflow';
import { BetterCommerceClient } from '../../../Utils/Client';
export { Description } from './Description';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this, 'b2b');
    const customerClient = new BetterCommerceClient(credentials, this, 'customer');
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
            const customerEmail = this.getNodeParameter('email', i) as string;
            
            // Step 1: Get customer by email to find userId
            let userId = '00000000-0000-0000-0000-000000000000'; // Default empty GUID
            
            try {
                // Try to get customer by email
                const customerResponse = await customerClient.post<IDataObject>(`/${customerEmail}/exists`, {});
                if (customerResponse.result && typeof customerResponse.result === 'object') {
                    userId = (customerResponse.result as IDataObject).id as string || userId;
                    console.log(`Customer exists with userId: ${userId}`);
                } else {
                    // Customer not found
                    returnData.push({ json: { error: 'Customer not found' } });
                    continue;
                }
            } catch (error) {
                // Customer not found or API error
                returnData.push({ json: { error: 'Customer not found or API error' } });
                continue;
            }
            
            // Step 2: Get quotes for the user
            try {
                // Get additional options
                const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
                
                // Set pagination parameters
                const currentPage = additionalOptions.currentPage as number || 1;
                const pageSize = additionalOptions.pageSize as number || 100;
                
                // Get quotes for the user
                const quotesResponse = await client.get<IDataObject>(
                    `/${userId}/quotes`,
                    {
                        currentPage,
                        pageSize,
                    }
                );
                
                if (quotesResponse && quotesResponse.result) {
                    returnData.push({ json: quotesResponse });
                } else {
                    returnData.push({ json: { error: 'No quotes found for this customer' } });
                }
            } catch (error) {
                returnData.push({ json: { error: 'Failed to retrieve quotes: ' + error.message } });
            }
        } catch (error) {
            if (this.continueOnFail()) {
                returnData.push({ json: { error: error.message } });
                continue;
            }
            throw new NodeApiError(this.getNode(), error);
        }
    }

    return [returnData];
}
