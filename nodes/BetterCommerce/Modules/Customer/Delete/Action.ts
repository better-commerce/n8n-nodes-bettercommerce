import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
  } from 'n8n-workflow';
  import { BetterCommerceClient} from '../../../Utils/Client';
  
  export {Description}  from './Description'
  export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this,"customer"); // Pass 'this' as IExecuteFunctions
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const customerId = this.getNodeParameter('customerId', 0) as string;
    for (let i = 0; i < items.length; i++) {
        try {
            const customer = await client.delete<IDataObject>(`/${customerId}/delete`);
            returnData.push({ json: customer });
        } catch (error) {
            if (this.continueOnFail()) {
                returnData.push({ json: { error: error.message } });
                continue;
            }
            throw error;
        }
    }

    return [returnData];
}