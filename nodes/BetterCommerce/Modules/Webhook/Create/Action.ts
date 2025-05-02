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
            const webhookUrl = this.getNodeParameter('webhookUrl', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
            
            // Process headers if provided
            const headers: Record<string, string> = {};
            if (additionalFields.headers && (additionalFields.headers as IDataObject).header) {
                const headerItems = (additionalFields.headers as IDataObject).header as IDataObject[];
                for (const header of headerItems) {
                    headers[header.name as string] = header.value as string;
                }
            }
            
            // Create webhook configuration
            const webhookConfig: IWebhookConfig = {
                event,
                url: webhookUrl,
            };

            if (additionalFields.description) {
                webhookConfig.description = additionalFields.description as string;
            }

            if (additionalFields.isActive !== undefined) {
                webhookConfig.isActive = additionalFields.isActive as boolean;
            }

            if (additionalFields.includeMetadata !== undefined) {
                webhookConfig.includeMetadata = additionalFields.includeMetadata as boolean;
            }

            if (Object.keys(headers).length > 0) {
                webhookConfig.headers = headers;
            }
            
            // Register the webhook with BetterCommerce
            const response = await client.createWebhook(webhookConfig) as IDataObject;
            
            returnData.push({
                json: {
                    success: true,
                    webhookId: response.recordId || response.id,
                    name: response.name,
                    entityType: response.entityType,
                    eventType: response.eventType,
                    destination: response.destination,
                    isActive: response.isActive,
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




