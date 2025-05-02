import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
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
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Webhook URL',
        name: 'webhookUrl',
        type: 'string',
        default: '',
        required: true,
        description: 'URL to receive webhook events (should be a publicly accessible URL)',
        placeholder: 'https://your-n8n-instance.com/webhook/path',
        hint: 'This should be the URL of your n8n webhook trigger node',
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
                description: 'Description of the webhook',
            },
            {
                displayName: 'Include Metadata',
                name: 'includeMetadata',
                type: 'boolean',
                default: false,
                description: 'Whether to include additional event metadata',
            },
            {
                displayName: 'Is Active',
                name: 'isActive',
                type: 'boolean',
                default: true,
                description: 'Whether the webhook is active',
            },
            {
                displayName: 'Headers',
                name: 'headers',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                description: 'Custom headers to send with the webhook',
                default: {},
                options: [
                    {
                        name: 'header',
                        displayName: 'Header',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                                description: 'Name of the header',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                description: 'Value of the header',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];