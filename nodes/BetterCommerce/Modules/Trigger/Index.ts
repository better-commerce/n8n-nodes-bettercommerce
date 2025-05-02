import { INodeProperties } from 'n8n-workflow';
import { Description } from './Webhook/Description';
import { execute } from './Webhook/Action';

export const description: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['trigger'],
            },
        },
        options: [
            {
                name: 'Webhook',
                value: 'webhook',
                description: 'Create a webhook to receive events',
                action: 'Create a webhook',
            },
        ],
        default: 'webhook',
    },
    ...Description,
];

export { Description, execute };
