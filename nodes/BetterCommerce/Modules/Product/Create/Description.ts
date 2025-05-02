import {
   
    INodeProperties,
   
} from 'n8n-workflow';

// Operation description
export const Description: INodeProperties[] = [
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        description: 'Product name',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Product Code',
        name: 'productCode',
        type: 'string',
        required: true,
        default: '',
        description: 'Unique product identifier',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Stock Code',
        name: 'stockCode',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Item Type',
        name: 'itemTypes',
        type: 'number',
        required: true,
        default: 0,
        description: 'Numeric item type identifier',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Sell Price',
        name: 'sellPrice',
        type: 'number',
        required: true,
        default: 0,
        description: 'Retail price including VAT',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Short Description',
                name: 'shortDescription',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Current Stock',
                name: 'currentStock',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'Origin Country',
                name: 'originCountry',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Brand',
                name: 'brand',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Category',
                name: 'category',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Sell Price (Excl VAT)',
                name: 'sellPriceExcVat',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'List Price',
                name: 'listPrice',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'Cost Price',
                name: 'costPrice',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'Cutoff Time',
                name: 'cutoffTime',
                type: 'string',
                default: '',
                description: 'Format: HH:MM:SS',
            },
            {
                displayName: 'Unit of Measure',
                name: 'uom',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Weight (kg)',
                name: 'weight',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'Height (cm)',
                name: 'height',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'Length (cm)',
                name: 'length',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'Width (cm)',
                name: 'width',
                type: 'number',
                default: 0,
            },
            {
                displayName: 'Condition',
                name: 'condition',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Product Family ID',
                name: 'productFamilyId',
                type: 'number',
                default: 0,
            },
        ],
    },
];
