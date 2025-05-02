import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Product ID',
        name: 'productId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the product to retrieve',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['get'],
            },
        },
    },
];