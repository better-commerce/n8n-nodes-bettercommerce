import {
    IExecuteFunctions,
    INodeExecutionData,
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
            const webhookId = this.getNodeParameter('webhookId', i) as string;
            
            // Delete the webhook
            await client.deleteWebhook(webhookId);
            
            returnData.push({
                json: {
                    success: true,
                    webhookId,
                    message: 'Webhook deleted successfully',
                }
            });
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
