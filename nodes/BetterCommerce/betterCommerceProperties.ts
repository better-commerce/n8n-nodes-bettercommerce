import { INodeProperties } from 'n8n-workflow';

export const betterCommerceProperties: INodeProperties[] = [
    {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
            { name: 'Products', value: 'products' },
            { name: 'Customers', value: 'customers' },
            { name: 'Baskets', value: 'baskets' },
          //{ name: 'Orders', value: 'orders' },
            //{ name: 'Companies', value: 'companies' },
            { name: 'Quotes', value: 'quotes' },
            //{ name: 'RFQs', value: 'rfqs' },
            //{ name: 'Users', value: 'users' },
        ],
        default: 'products',
        description: 'The resource you want to interact with.',
    },
    {
        displayName: 'Action',
        name: 'operation',
        type: 'options',
        options: [
            { name: 'Get All', value: 'getAll' },
            { name: 'Get By ID', value: 'getById' },
            { name: 'Get By StockCode', value: 'getByStockCode' },
        ],
        displayOptions:{
            show:{ resource: ['products']}

        },
        default: 'getAll',
        description: 'The operation to perform.',
    },
    {
        displayName: 'Action',
        name: 'operation',
        type: 'options',
        options: [
            { name: 'Get By Id', value: 'getById' },
            { name: 'Get By Email', value: 'getByEmail' },
            { name: 'Search', value: 'search' },
            { name: 'Create', value: 'create' },
        ],
        displayOptions:{
            show:{ resource: ['customers']}

        },
        default: 'getByEmail',
        description: 'The operation to perform.',
    },
    {
        displayName: 'Action',
        name: 'operation',
        type: 'options',
        options: [
            { name: 'Get By Id', value: 'getById' },
            { name: 'Add Item', value: 'addItem' },
            { name: 'Update User', value: 'updateUser' },
            { name: 'Update Shipping Address', value: 'updateShippingAddress' },
            { name: 'Get Shipping Methods', value: 'getShippingMethods' },
            { name: 'Update Shipping Method', value: 'updateShippingMethod' },
            { name: 'Get Payment Methods', value: 'getPaymentMethods' },
        ],
        displayOptions:{
            show:{ resource: ['baskets']}

        },
        default: 'addItems',
        description: 'The operation to perform.',
    },
    {
        displayName: 'Free text',
        name: 'freeText',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
            show: {
                resource: ['products'],
                operation: ['getAll'],
            },
        },
        description: 'Search Key',
    },
    {
        displayName: 'Product Id',
        name: 'id',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
            show: {
                resource: ['products'],
                operation: ['getById'],
            },
        },
        description: 'ProductId to fetch',
    },
    {
        displayName: 'StockCode',
        name: 'stockCode',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
            show: {
                resource: ['products'],
                operation: ['getByStockCode'],
            },
        },
        description: 'stockCode to fetch',
    },
    // {
    //     displayName: 'User Name',
    //     name: 'userName',
    //     type: 'string',
    //     default: '',
    //     required: true,
    //     description: 'The username of the customer',
    //     displayOptions: {
    //         show: {
    //             resource: ['customers'],
    //             operation: ['create'],
    //         },
    //     },
    // },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        required: true,
        description: 'The email of the customer',
        displayOptions: {
            show: {
                resource: ['customers'],
                operation: ['getByEmail','create','search'],
            },
        },
    },
    {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        required: false,
        description: 'The phone number of the customer',
        displayOptions: {
            show: {
                resource: ['customers'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'First Name',
        name: 'firstname',
        type: 'string',
        default: '',
        required: false,
        description: 'The first name of the customer',
        displayOptions: {
            show: {
                resource: ['customers'],
                operation: ['create','search'],
            },
        },
    },
    {
        displayName: 'Last Name',
        name: 'lastname',
        type: 'string',
        default: '',
        required: false,
        description: 'The last name of the customer',
        displayOptions: {
            show: {
                resource: ['customers'],
                operation: ['create','search'],
            },
        },
    },
    {
        displayName: 'Current Page',
        name: 'currentPage',
        type: 'number',
        default: 1,
        required: true,
        description: 'The current page of results',
        displayOptions: {
            show: {
                resource: ['customers'],
                operation: ['search'],
            },
        },
    },
    {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        default: 1,
        required: true,
        description: 'The number of results per page',
        displayOptions: {
            show: {
                resource: ['customers'],
                operation: ['search'],
            },
        },
    },

    // basket Id (common for all)
    {
        displayName: 'basket ID',
        name: 'id',
        type: 'string',
        default: '00000000-0000-0000-0000-000000000000',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['getById','addItem','updateShippingAddress', 'getShippingMethods', 'updateShippingMethod', 'getPaymentMethods'],
        },
        },
        description: 'basket ID',
    },
    {
        displayName: 'Stock Code',
        name: 'stockCode',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['addItem'],
        },
        },
        description: 'Stock Code',
    },
    {
        displayName: 'Quantity',
        name: 'qty',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['addItem'],
        },
        },
        description: 'Quantity',
    },
    
    // Address fields for Update Shipping Address
    {
        displayName: 'Address Line 1',
        name: 'addressLine1',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['updateShippingAddress'],
        },
        },
    },
    {
        displayName: 'Address Line 2',
        name: 'addressLine2',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['updateShippingAddress'],
        },
        },
    },
    {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['updateShippingAddress'],
        },
        },
    },
    {
        displayName: 'Postcode',
        name: 'postcode',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['updateShippingAddress'],
        },
        },
    },
    {
        displayName: 'Country',
        name: 'country',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['updateShippingAddress'],
        },
        },
    },
    
    // Shipping Method field for Update Shipping Method
    {
        displayName: 'Shipping Method ID',
        name: 'shippingMethodId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['updateShippingMethod'],
        },
        },
    },
    {
        displayName: 'Country Code',
        name: 'countryCode',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['updateShippingMethod'],
        },
        },
    },

];