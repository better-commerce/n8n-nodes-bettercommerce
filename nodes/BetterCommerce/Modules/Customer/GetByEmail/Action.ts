import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
  } from 'n8n-workflow';
  import { BetterCommerceClient} from '../../../Utils/Client';
  export {Description}  from './Description'
  export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this,'customer');
    const email = this.getNodeParameter('email', 0) as string;
    console.log(`in action execute ${email}`);
    
    const returnData: INodeExecutionData[] = [];
    try {
        const exists = await client.post<IDataObject>(`/${email}/exists`,{});
        console.log(`Customer response: ${JSON.stringify(exists.result)}`);
        
        // Check if result is an array and has at least one item
        if (exists.result && Array.isArray(exists.result) && exists.result.length > 0) {
            // Get the first customer from the array
            //const customer = exists.result[0] as IDataObject;
            returnData.push({ json: exists });
        } else {
            returnData.push({ json: { error: 'Customer not found' } });
        }
    } catch (error) {
        if (this.continueOnFail()) {
            return [[{ json: { error: error.message } }]];
        }
        throw error;
    }
    return [returnData];
}
