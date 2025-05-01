import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
  } from 'n8n-workflow';
  import { BetterCommerceClient} from '../../../Utils/Client';
;
  export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this,'customer');
    const customerId = this.getNodeParameter('customerId', 0) as string;
    const returnData: INodeExecutionData[] = [];
    try {
        const exists = await client.get<IDataObject>(`/${customerId}`,{});
        returnData.push({ json: exists });
    } catch (error) {
        if (this.continueOnFail()) {
            return [[{ json: { error: error.message } }]];
        }
        throw error;
    }
    return [returnData];
}