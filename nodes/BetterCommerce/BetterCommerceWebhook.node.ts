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
        ],
    };

    methods = {
        loadOptions: {
            async getWebhookEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                return [
                    { name: 'Customer Created', value: 'customer.created' },
                    { name: 'Order Created', value: 'order.created' },
                    { name: 'Product Updated', value: 'product.updated' },
                ];
            }
        }
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const body = this.getBodyData();
        return {
            workflowData: [
                this.helpers.returnJsonArray(body),
            ],
        };
    }
}