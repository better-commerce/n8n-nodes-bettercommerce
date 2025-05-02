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
    const client = new BetterCommerceClient(credentials, this, 'webhook');
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            
            if (returnAll) {
                // Get all webhooks
                const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                const webhooks = await client.getWebhooks(filters);
                returnData.push({ json: { webhooks } });
            } else {
                // Get a specific webhook
                const webhookId = this.getNodeParameter('webhookId', i) as string;
                const webhook = await client.getWebhook(webhookId);
                // Convert webhook to IDataObject to satisfy the type requirement
                returnData.push({ 
                    json: webhook as unknown as IDataObject 
                });
            }
        } catch (error) {
            if (this.continueOnFail()) {
                returnData.push({ json: { success: false, error: error.message } });
                continue;
            }
            throw new NodeApiError(this.getNode(), error);
        }
    }

    return [returnData];
}
