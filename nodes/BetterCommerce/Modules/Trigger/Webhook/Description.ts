import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        required: true,
        default: '',
        options: [
            // Customer events
            {
                name: 'Customer Created',
                value: 'customer.created',
            },
            {
                name: 'Customer Updated',
                value: 'customer.updated',
            },
            {
                name: 'Customer Deleted',
                value: 'customer.deleted',
            },
            // Order events
            {
                name: 'Order Created',
                value: 'order.created',
            },
            {
                name: 'Order Updated',
                value: 'order.updated',
            },
            {
                name: 'Order Deleted',
                value: 'order.deleted',
            },
            {
                name: 'Order Status Changed',
                value: 'order.status.changed',
            },
            // Product events
            {
                name: 'Product Created',
                value: 'product.created',
            },
            {
                name: 'Product Updated',
                value: 'product.updated',
            },
            {
                name: 'Product Deleted',
                value: 'product.deleted',
            },
            {
                name: 'Product Stock Changed',
                value: 'product.stock.changed',
            },
            // Quote events
            {
                name: 'Quote Created',
                value: 'quote.created',
            },
            {
                name: 'Quote Updated',
                value: 'quote.updated',
            },
            {
                name: 'Quote Deleted',
                value: 'quote.deleted',
            },
            {
                name: 'Quote Status Changed',
                value: 'quote.status.changed',
            },
        ],
        displayOptions: {
            show: {
                resource: ['trigger'],
                operation: ['webhook'],
            },
        },
    },
    {
        displayName: 'Webhook URL',
        name: 'webhookUrl',
        type: 'string',
        default: '',
        required: true,
        description: 'URL to receive webhook events',
        displayOptions: {
            show: {
                resource: ['trigger'],
                operation: ['webhook'],
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
                resource: ['trigger'],
                operation: ['webhook'],
            },
        },
        options: [
            {
                displayName: 'Include Metadata',
                name: 'includeMetadata',
                type: 'boolean',
                default: false,
                description: 'Whether to include additional event metadata',
            },
        ],
    },
];
