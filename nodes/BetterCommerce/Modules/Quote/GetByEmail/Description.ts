import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        required: true,
        default: '',
        description: 'Email of the customer to get quotes for',
        displayOptions: {
            show: {
                resource: ['quote'],
                operation: ['getByEmail'],
            },
        },
    },
    {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['quote'],
                operation: ['getByEmail'],
            },
        },
        options: [
            {
                displayName: 'Current Page',
                name: 'currentPage',
                type: 'number',
                default: 1,
                description: 'Page number for pagination',
            },
            {
                displayName: 'Page Size',
                name: 'pageSize',
                type: 'number',
                default: 100,
                description: 'Number of results per page',
            },
        ],
    },
];
