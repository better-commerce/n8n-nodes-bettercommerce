import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
        {
            displayName: 'Customer Id',
            name: 'customerId',
            type: 'string',
            required: true,
            default: '',
            displayOptions: {
                show: {
                    resource: ['customer'],
                    operation: ['delete'],
                },
            },
        },

]