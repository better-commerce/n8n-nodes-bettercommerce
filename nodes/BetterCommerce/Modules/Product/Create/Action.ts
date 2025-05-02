import {
    IExecuteFunctions,
    INodeExecutionData,
    NodeApiError,
    IDataObject
} from 'n8n-workflow';
import { BetterCommerceClient } from '../../../Utils/Client';
 export {Description}  from './Description'

// Execute function
export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this, 'product');
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
            const params: IDataObject = {
                name: this.getNodeParameter('name', i) as string,
                productCode: this.getNodeParameter('productCode', i) as string,
                stockCode: this.getNodeParameter('stockCode', i) as string,
                itemTypes: this.getNodeParameter('itemTypes', i) as number,
                sellPrice: this.getNodeParameter('sellPrice', i) as number,
                ...this.getNodeParameter('additionalFields', i, {}) as IDataObject,
            };

            const product = await client.create<IDataObject>('/api/v1/product/create', params);
            returnData.push({ json: product });
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