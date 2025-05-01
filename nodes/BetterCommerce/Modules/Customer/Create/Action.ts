import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
  } from 'n8n-workflow';
  import { BetterCommerceClient} from '../../../Utils/Client';
  
  export const description = [
    // ... your existing description properties ...
];
  export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this,"customer"); // Pass 'this' as IExecuteFunctions
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
            const customer = await client.create<IDataObject>('/customer', {
                email: this.getNodeParameter('email', i) as string,
                firstName: this.getNodeParameter('firstName', i, '') as string,
                lastName: this.getNodeParameter('lastName', i, '') as string,

            });

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