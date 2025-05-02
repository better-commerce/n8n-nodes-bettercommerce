import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        required: true,
        default: '',
        options: [
            {
                name: 'Customer Created',
                value: 'customer.created',
            },
            {
                name: 'Order Created',
                value: 'order.created',
            },
            {
                name: 'Product Updated',
                value: 'product.updated',
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