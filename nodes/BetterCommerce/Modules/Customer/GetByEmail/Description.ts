import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        required: true,
        description: 'The email address to fetch',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['getByEmail'],
            },
        },
    }
];