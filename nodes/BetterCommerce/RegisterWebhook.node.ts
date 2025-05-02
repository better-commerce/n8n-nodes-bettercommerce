import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';
import { BetterCommerceClient } from './Utils/Client';
import { IWebhookConfig } from './Utils/Interfaces';

export class RegisterWebhook implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'BetterCommerce Register Webhook',
        name: 'registerWebhook',
        icon: 'file:betterCommerce.svg',
        group: ['transform'],
        version: 1,
        description: 'Register a webhook with BetterCommerce',
        defaults: {
            name: 'Register Webhook',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'betterCommerceApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Event',
                name: 'event',
                type: 'options',
                options: [
                    // Customer events
                    { name: 'Customer Created', value: 'customer.created' },
                    { name: 'Customer Updated', value: 'customer.updated' },
                    { name: 'Customer Deleted', value: 'customer.deleted' },
                    
                    // Order events
                    { name: 'Order Created', value: 'order.created' },
                    { name: 'Order Updated', value: 'order.updated' },
                    { name: 'Order Deleted', value: 'order.deleted' },
                    { name: 'Order Status Changed', value: 'order.status.changed' },
                    
                    // Product events
                    { name: 'Product Created', value: 'product.created' },
                    { name: 'Product Updated', value: 'product.updated' },
                    { name: 'Product Deleted', value: 'product.deleted' },
                    { name: 'Product Stock Changed', value: 'product.stock.changed' },
                    
                    // Quote events
                    { name: 'Quote Created', value: 'quote.created' },
                    { name: 'Quote Updated', value: 'quote.updated' },
                    { name: 'Quote Deleted', value: 'quote.deleted' },
                    { name: 'Quote Status Changed', value: 'quote.status.changed' },
                ],
                default: 'order.created',
                required: true,
                description: 'Event to subscribe to',
            },
            {
                displayName: 'Webhook URL',
                name: 'webhookUrl',
                type: 'string',
                default: '',
                required: true,
                description: 'URL to receive webhook events',
            },
            {
                displayName: 'Include Metadata',
                name: 'includeMetadata',
                type: 'boolean',
                default: false,
                description: 'Whether to include additional event metadata',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const credentials = await this.getCredentials('betterCommerceApi');
                const client = new BetterCommerceClient(credentials, this, 'webhook');
                
                const event = this.getNodeParameter('event', i) as string;
                const webhookUrl = this.getNodeParameter('webhookUrl', i) as string;
                const includeMetadata = this.getNodeParameter('includeMetadata', i) as boolean;
                
                // Create webhook configuration
                const webhookConfig: IWebhookConfig = {
                    event,
                    url: webhookUrl,
                    includeMetadata,
                };
                
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
                throw new NodeOperationError(this.getNode(), error);
            }
        }

        return [returnData];
    }
}
