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
            { name: 'Checkout', value: 'checkouts' },
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
            // { name: 'Update Shipping Address', value: 'updateShippingAddress' },
            // { name: 'Update Billing Address', value: 'updateBillingAddress' },
            // { name: 'Get Shipping Methods', value: 'getShippingMethods' },
            // { name: 'Update Shipping Method', value: 'updateShippingMethod' },
            // { name: 'Get Payment Methods', value: 'getPaymentMethods' },
        ],
        displayOptions:{
            show:{ resource: ['baskets']}

        },
        default: 'addItems',
        description: 'The operation to perform.',
    },
    {
        displayName: 'Action',
        name: 'operation',
        type: 'options',
        options: [
            { name: 'Update Shipping Address', value: 'updateShippingAddress' },
            { name: 'Update Billing Address', value: 'updateBillingAddress' },
            { name: 'Get Shipping Methods', value: 'getShippingMethods' },
            { name: 'Update Shipping Method', value: 'updateShippingMethod' },
            { name: 'Get Payment Methods', value: 'getPaymentMethods' },
            { name: 'Convert to Order', value: 'convertToOrder' },
        ],
        displayOptions:{
            show:{ resource: ['checkouts']}

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
    // search start 
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
                operation: ['search'],
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
                operation: ['search'],
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
                operation: ['search'],
            },
        },
    },

    // search end
    {
        displayName: 'Phone',
        name: 'telephone',
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
        name: 'firstName',
        type: 'string',
        default: '',
        required: false,
        description: 'The first name of the customer',
        displayOptions: {
            show: {
                resource: ['customers','baskets','checkouts'],
                operation: ['create','search','updateShippingAddress','updateBillingAddress'],
            },
        },
    },
    {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        required: false,
        description: 'The last name of the customer',
        displayOptions: {
            show: {
                resource: ['customers','baskets','checkouts'],
                operation: ['create','search','updateShippingAddress','updateBillingAddress'],
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
            resource: ['baskets','checkouts'],
            operation: ['getById','updateUser','addItem','updateShippingAddress','updateBillingAddress', 'getShippingMethods', 'updateShippingMethod','convertToOrder'],
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
    //   bodyParam: ['title','firstName','lastName','companyName', 'address1', 'address2', 'city','state', 'postcode', 'countryCode','phoneNo']
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
        show: {
            resource: ['checkouts'],
            operation: ['updateShippingAddress','updateBillingAddress'],
        },
        },
    },
    {
        displayName: 'Company',
        name: 'companyName',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
        show: {
            resource: ['checkouts'],
            operation: ['updateShippingAddress','updateBillingAddress'],
        },
        },
    },
    {
        displayName: 'Address Line 1',
        name: 'address1',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['checkouts'],
            operation: ['updateShippingAddress','updateBillingAddress'],
        },
        },
    },
    {
        displayName: 'Address Line 2',
        name: 'address2',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
        show: {
            resource: ['checkouts'],
            operation: ['updateShippingAddress','updateBillingAddress'],
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
            resource: ['checkouts'],
            operation: ['updateShippingAddress','updateBillingAddress'],
        },
        },
    },
    {
        displayName: 'State',
        name: 'state',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
        show: {
            resource: ['checkouts'],
            operation: ['updateShippingAddress','updateBillingAddress'],
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
            resource: ['checkouts'],
            operation: ['updateShippingAddress','updateBillingAddress','getShippingMethods'],
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
            resource: ['checkouts'],
            operation: ['updateShippingAddress','updateBillingAddress'],
        },
        },
    },
    {
        displayName: 'Phone',
        name: 'phoneNo',
        type: 'string',
        default: '',
        required: false,
        description: 'The phone number of the customer',
        displayOptions: {
            show: {
                resource: ['checkouts'],
                operation: ['updateShippingAddress','updateBillingAddress'],
            },
        },
    },
    {
        displayName: 'Same as shipping',
        name: 'sameAsShipping',
        type: 'boolean',
        default: false,
        required: false,
        description: 'The phone number of the customer',
        displayOptions: {
            show: {
                resource: ['checkouts'],
                operation: ['updateBillingAddress'],
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
            resource: ['checkouts'],
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
            resource: ['checkouts'],
            operation: ['updateShippingMethod','getShippingMethods'],
        },
        },
    },
    {
        displayName: 'User Id',
        name: 'userId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
        show: {
            resource: ['baskets'],
            operation: ['updateUser'],
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
            resource: ['checkouts'],
            operation: ['getPaymentMethods'],
          },
        },
        description: 'Country code (e.g., GB)',
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['checkouts'],
            operation: ['getPaymentMethods'],
          },
        },
        description: 'Currency code (e.g., GBP)',
      },
      {
        displayName: 'Basket ID',
        name: 'basketId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['checkouts'],
            operation: ['getPaymentMethods'],
          },
        },
        description: 'Basket ID (GUID)',
      },

    {
        displayName: 'Input Mode',
        name: 'inputMode',
        type: 'options',
        default: 'quick',
        options: [
            { name: 'Quick (Form Fields)', value: 'quick' },
            { name: 'Advanced (Raw JSON)', value: 'advanced' },
        ],
        displayOptions: {
            show: {
                resource: ['checkouts'],
                operation: ['convertToOrder'],
            },
        },
        description: 'Choose how to send the convert-to-order request.',
    },
    {
        displayName: 'Payload (Advanced)',
        name: 'rawBody',
        type: 'json',
        default: '',
        required: true,
        typeOptions: {
            alwaysOpenEditWindow: true,
        },
        displayOptions: {
            show: {
                resource: ['checkout'],
                operation: ['convertToOrder'],
                inputMode: ['advanced'],
            },
        },
        description: 'Full request payload to convert the basket into an order.',
    },
    {
        displayName: 'Selected Payment',
        name: 'selectedPayment',
        type: 'json',
        default: '',
        required: true,
        typeOptions: {
            alwaysOpenEditWindow: true,
        },
        displayOptions: {
            show: {
                resource: ['checkout'],
                operation: ['convertToOrder'],
                inputMode: ['quick'],
            },
        },
    },
];