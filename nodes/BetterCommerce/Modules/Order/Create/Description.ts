import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Customer Email',
        name: 'customerEmail',
        type: 'string',
        required: true,
        default: '',
        description: 'Email of the customer placing the order',
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Products',
        name: 'products',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        description: 'Products to add to the order',
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'productValues',
                displayName: 'Product',
                values: [
                    {
                        displayName: 'Stock Code',
                        name: 'stockCode',
                        type: 'string',
                        default: '',
                        description: 'Stock code of the product',
                        required: true,
                    },
                    {
                        displayName: 'Quantity',
                        name: 'quantity',
                        type: 'number',
                        default: 1,
                        description: 'Quantity of the product',
                        required: true,
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Payment Type',
        name: 'paymentType',
        type: 'options',
        options: [
            { name: 'Credit', value: 'Credit' },
            { name: 'PrePaid', value: 'PrePaid' },
            { name: 'PayPal', value: 'PayPal' },
            { name: 'Invoice', value: 'Invoice' },
        ],
        default: 'Credit',
        required: true,
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Shipping Address',
        name: 'shippingAddress',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: false,
        },
        default: {},
        required: true,
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'addressFields',
                displayName: 'Address Fields',
                values: [
                    {
                        displayName: 'First Name',
                        name: 'firstName',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Last Name',
                        name: 'lastName',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Address Line 1',
                        name: 'addressLine1',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Address Line 2',
                        name: 'addressLine2',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'City',
                        name: 'city',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'State/County',
                        name: 'county',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Postal Code',
                        name: 'postCode',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Country',
                        name: 'country',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Phone Number',
                        name: 'phoneNumber',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Use Same Address for Billing',
        name: 'useSameAddressForBilling',
        type: 'boolean',
        default: true,
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Billing Address',
        name: 'billingAddress',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: false,
        },
        default: {},
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['create'],
                useSameAddressForBilling: [false],
            },
        },
        options: [
            {
                name: 'addressFields',
                displayName: 'Address Fields',
                values: [
                    {
                        displayName: 'First Name',
                        name: 'firstName',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Last Name',
                        name: 'lastName',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Address Line 1',
                        name: 'addressLine1',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Address Line 2',
                        name: 'addressLine2',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'City',
                        name: 'city',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'State/County',
                        name: 'county',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Postal Code',
                        name: 'postCode',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Country',
                        name: 'country',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Phone Number',
                        name: 'phoneNumber',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
];

