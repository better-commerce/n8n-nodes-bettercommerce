import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all webhooks or just one',
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['get'],
            },
        },
    },
    {
        displayName: 'Webhook ID',
        name: 'webhookId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the webhook to get',
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['get'],
                returnAll: [false],
            },
        },
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['get'],
                returnAll: [true],
            },
        },
        options: [
            {
                displayName: 'Event',
                name: 'event',
                type: 'string',
                default: '',
                description: 'Filter webhooks by event',
            },
            {
                displayName: 'Is Active',
                name: 'isActive',
                type: 'boolean',
                default: true,
                description: 'Filter webhooks by active status',
            },
        ],
    },
];