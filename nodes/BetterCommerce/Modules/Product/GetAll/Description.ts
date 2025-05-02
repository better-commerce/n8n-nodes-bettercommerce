import { INodeProperties } from 'n8n-workflow';

export const Description: INodeProperties[] = [
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Free Text Search',
                name: 'freeText',
                type: 'string',
                default: '',
                description: 'Search products by text across multiple fields',
            },
            {
                displayName: 'Brand',
                name: 'brand',
                type: 'string',
                default: '',
                description: 'Filter products by brand name',
            },
            {
                displayName: 'Category',
                name: 'category',
                type: 'string',
                default: '',
                description: 'Filter products by category name',
            },
            {
                displayName: 'Barcode',
                name: 'barcode',
                type: 'string',
                default: '',
                description: 'Filter products by barcode',
            },
            {
                displayName: 'Page Number',
                name: 'currentPage',
                type: 'number',
                default: 1,
                description: 'Page number for pagination',
            },
            {
                displayName: 'Page Size',
                name: 'pageSize',
                type: 'number',
                default: 20,
                description: 'Number of results per page',
            },
            {
                displayName: 'Sort By',
                name: 'sortBy',
                type: 'string',
                default: 'name',
                description: 'Field to sort by (e.g., name, price, createdDate)',
            },
            {
                displayName: 'Sort Order',
                name: 'sortOrder',
                type: 'options',
                options: [
                    {
                        name: 'Ascending',
                        value: 'asc',
                    },
                    {
                        name: 'Descending',
                        value: 'desc',
                    },
                ],
                default: 'asc',
                description: 'Sort order (ascending or descending)',
            },
            {
                displayName: 'Additional Filters (JSON)',
                name: 'additionalFilters',
                type: 'json',
                default: '{}',
                description: 'Additional JSON object containing filter criteria',
            },
        ],
    },
];

