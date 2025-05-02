import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        required: true,
        default: '',
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
        required: false,
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
        required: false,
        default: '',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Title',
        name: 'title',
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
        displayName: 'Telephone',
        name: 'telephone',
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
        displayName: 'Mobile',
        name: 'mobile',
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
        displayName: 'Gender',
        name: 'gender',
        type: 'options',
        options: [
            { name: 'Male', value: 'male' },
            { name: 'Female', value: 'female' },
            { name: 'Other', value: 'other' },
            { name: 'Prefer Not to Say', value: '' },
        ],
        default: '',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Nickname',
        name: 'nickName',
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
        displayName: 'Birth Date',
        name: 'birthDate',
        type: 'dateTime',
        default: '',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Post Code',
        name: 'postCode',
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
        displayName: 'Company Name',
        name: 'companyName',
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
        displayName: 'Company Code',
        name: 'companyCode',
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