import {
    INodeType,
    INodeTypeDescription,
    IWebhookFunctions,
    IWebhookResponseData,
    ILoadOptionsFunctions,
    INodePropertyOptions,
} from 'n8n-workflow';

export class BetterCommerceWebhook implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'BetterCommerce Webhook',
        name: 'betterCommerceWebhook',
        icon: 'file:betterCommerce.svg',
        group: ['trigger'],
        version: 1,
        description: 'Handle BetterCommerce webhook events',
        defaults: {
            name: 'BetterCommerce Webhook',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'betterCommerceApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Event',
                name: 'event',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getWebhookEvents',
                },
                default: '',
                required: true,
            },
            {
                displayName: 'Include Metadata',
                name: 'includeMetadata',
                type: 'boolean',
                default: false,
                description: 'Whether to include additional event metadata in the webhook payload',
            },
        ],
    };

    methods = {
        loadOptions: {
            async getWebhookEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                return [
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
                ];
            }
        }
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const body = this.getBodyData();
        
        // You can add additional processing here if needed
        // For example, you might want to extract specific fields based on the event type
        
        return {
            workflowData: [
                this.helpers.returnJsonArray(body),
            ],
        };
    }
}
