import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Webhook ID',
        name: 'webhookId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the webhook to delete',
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['delete'],
            },
        },
    },
];