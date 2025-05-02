import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
} from 'n8n-workflow';
import { executeStandardOperation } from '../../../Utils/ActionHelpers';
export { Description } from './Description';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return executeStandardOperation(this, 'customer', async (client, i) => {
        return client.create<IDataObject>('/create', {
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
    });
}
