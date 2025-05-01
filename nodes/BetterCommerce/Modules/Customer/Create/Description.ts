import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        required: true,
        default: '',
        description: "Customer's email address",
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['create'],
            },
        },
    },
];