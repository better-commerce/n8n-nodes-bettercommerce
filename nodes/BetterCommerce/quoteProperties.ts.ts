import { INodeProperties } from 'n8n-workflow';

export const quoteProperties: INodeProperties[] = [
    
    {
        displayName: 'RFQ Lines',
        name: 'lines',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
        options: [
          {
            name: 'Line',
            values: [
              { 'displayName': 'Stock Code', name: 'stockCode', type: 'string', default: '' },
              { 'displayName':'Quantity', name: 'qty', type: 'number', default: 0 },
              { 'displayName':'Target Price', name: 'targetPrice', type: 'number', default: 0 },
            ],
            displayName:'Product Stock Codes'
          },
        ],
      },
      {
        displayName: 'Basket ID',
        name: 'basketId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
      },
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
      },
      {
        displayName: 'Shipping Method Code',
        name: 'shippingMethodCode',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
      },
      {
        displayName: 'Shipping Method Name',
        name: 'shippingMethodName',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
      },
      {
        displayName: 'Currency Code',
        name: 'currencyCode',
        type: 'string',
        default: 'GBP',
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
      },
      {
        displayName: 'Currency Symbol',
        name: 'currencySymbol',
        type: 'string',
        default: '£',
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
      },
      {
        displayName: 'Delivery Instruction',
        name: 'deliveryInstruction',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['quotes'],
            operation: ['submitRfq'],
          },
        },
      },
      {
        displayName: 'Basket ID',
        name: 'id',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['baskets'],
            operation: ['saveQuote'],
          },
        },
        description: 'Unique identifier for the quote (GUID)',
      },
      {
        displayName: 'Purchase Order No.',
        name: 'purchaseOrderNo',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
          show: {
            resource: ['baskets'],
            operation: ['saveQuote'],
          },
        },
        description: 'Purchase order number associated with the quote',
      },
      {
        displayName: 'Quote Name',
        name: 'quoteName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['baskets'],
            operation: ['saveQuote'],
          },
        },
        description: 'A name for the quote to identify it later',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['baskets'],
            operation: ['saveQuote'],
          },
        },
        description: 'The email address associated with the quote',
      }
      
      
      




];