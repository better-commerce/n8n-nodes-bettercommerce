import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
    NodeApiError,
} from 'n8n-workflow';
import { BetterCommerceClient } from '../../../Utils/Client';
export { Description } from './Description';

// Define the webhook configuration interface
interface IWebhookConfig {
    event: string;
    url: string;
    description?: string;
    includeMetadata?: boolean;
    headers?: Record<string, string>;
}

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

            if (additionalFields.includeMetadata !== undefined) {
                webhookConfig.includeMetadata = additionalFields.includeMetadata as boolean;
            }

            if (Object.keys(headers).length > 0) {
                webhookConfig.headers = headers;
            }
            
            // Register the webhook with BetterCommerce
            const response = await client.createWebhook(webhookConfig);
            
            returnData.push({
                json: {
                    success: true,
                    webhookId: response.id,
                    event: response.event,
                    url: response.url,
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


