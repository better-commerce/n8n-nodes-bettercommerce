import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
    NodeApiError,
} from 'n8n-workflow';
import { BetterCommerceClient } from '../../../Utils/Client';
import { IWebhookConfig } from '../../../Utils/Interfaces';
export { Description } from './Description';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this, 'webhook');
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
            const event = this.getNodeParameter('event', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
            
            // For regular nodes, we need to get the webhook URL from parameters
            // This is different from trigger nodes which can use getNodeWebhookUrl
            const webhookUrl = this.getNodeParameter('webhookUrl', i, '') as string;
            
            if (!webhookUrl) {
                throw new Error('No webhook URL provided. Please enter a valid webhook URL.');
            }
            
            // Create webhook configuration
            const webhookConfig: IWebhookConfig = {
                event,
                url: webhookUrl,
                includeMetadata: additionalFields.includeMetadata as boolean,
            };
            
            // Register the webhook with BetterCommerce
            const response = await client.createWebhook(webhookConfig) as IDataObject;
            
            // Store the webhook ID for later deletion
            const webhookData = this.getWorkflowStaticData('node');
            webhookData.webhookId = response.recordId || response.id;
            
            returnData.push({
                json: {
                    success: true,
                    webhookId: response.recordId || response.id,
                    event: `${response.entityType}.${response.eventType}`,
                    url: response.destination,
                    createdAt: response.createdAt,
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
