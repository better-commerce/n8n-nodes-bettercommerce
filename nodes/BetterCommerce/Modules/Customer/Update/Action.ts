import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
  } from 'n8n-workflow';
  import { BetterCommerceClient} from '../../../Utils/Client';
  

  export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this,"customer"); // Pass 'this' as IExecuteFunctions
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const customerId= this.getNodeParameter('customerId',0) as string;
    for (let i = 0; i < items.length; i++) {
        try {
            const customer = await client.create<IDataObject>(`/${customerId}/create`, {
                email: this.getNodeParameter('email', i) as string,
                firstName: this.getNodeParameter('firstName', i) as string,
                lastName: this.getNodeParameter('lastName', i) as string,
                title: this.getNodeParameter('title', i, '') as string,
                telephone: this.getNodeParameter('telephone', i, '') as string,
                mobile: this.getNodeParameter('mobile', i, '') as string,
                gender: this.getNodeParameter('gender', i, '') as string,
                nickName: this.getNodeParameter('nickName', i, '') as string,
                birthDate: this.getNodeParameter('birthDate', i, '') as string,
                postCode: this.getNodeParameter('postCode', i, '') as string,
                companyName: this.getNodeParameter('companyName', i, '') as string,
                companyCode: this.getNodeParameter('companyCode', i, '') as string,
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