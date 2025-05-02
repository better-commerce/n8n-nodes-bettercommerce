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
            const webhookId = this.getNodeParameter('webhookId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
            
            // Process headers if provided
            const headers: Record<string, string> = {};
            if (updateFields.headers && (updateFields.headers as IDataObject).header) {
                const headerItems = (updateFields.headers as IDataObject).header as IDataObject[];
                for (const header of headerItems) {
                    headers[header.name as string] = header.value as string;
                }
            }
            
            // Create update payload
            const webhookConfig: IDataObject = {};

            if (updateFields.event) {
                webhookConfig.event = updateFields.event as string;
            }

            if (updateFields.webhookUrl) {
                webhookConfig.url = updateFields.webhookUrl as string;
            }

            if (updateFields.description !== undefined) {
                webhookConfig.description = updateFields.description as string;
            }

            if (updateFields.includeMetadata !== undefined) {
                webhookConfig.includeMetadata = updateFields.includeMetadata as boolean;
            }

            if (updateFields.isActive !== undefined) {
                webhookConfig.isActive = updateFields.isActive as boolean;
            }

            if (Object.keys(headers).length > 0) {
                webhookConfig.headers = headers;
            }
            
            // Update the webhook
            const response = await client.updateWebhook(webhookId, webhookConfig);
            
            returnData.push({
                json: {
                    success: true,
                    webhookId: response.id,
                    event: response.event,
                    url: response.url,
                    updatedAt: response.updatedAt,
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