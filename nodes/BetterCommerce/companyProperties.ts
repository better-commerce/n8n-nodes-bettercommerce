import { INodeProperties } from 'n8n-workflow';

export const companyProperties: INodeProperties[] = [
    
    {
        displayName: 'Company ID',
        name: 'companyId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['companies'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Business Type',
        name: 'businessType',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['companies'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Registered Number',
        name: 'registeredNumber',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['companies'],
            operation: ['create'],
          },
        },
      },
    //   {
    //     displayName: 'Price List ID',
    //     name: 'priceListId',
    //     type: 'string',
    //     default: '',
    //     displayOptions: {
    //       show: {
    //         resource: ['companies'],
    //         operation: ['create'],
    //       },
    //     },
    //   },
    //   {
    //     displayName: 'Customer Group ID',
    //     name: 'customerGroupId',
    //     type: 'string',
    //     default: '',
    //     displayOptions: {
    //       show: {
    //         resource: ['companies'],
    //         operation: ['create'],
    //       },
    //     },
    //   },
      {
        displayName: 'Company User Role',
        name: 'companyUserRole',
        type: 'number',
        default: 0,
        displayOptions: {
          show: {
            resource: ['companies'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Address',
        name: 'address',
        type: 'collection',
        placeholder: 'Add Address Fields',
        default: {},
        displayOptions: {
          show: {
            resource: ['companies'],
            operation: ['create'],
          },
        },
        options: [
            { displayName:'Title', name: 'title', type: 'string', default: '' },
            { displayName:'Name', name: 'state', type: 'string', default: '' },
            { displayName:'First Name', name: 'firstName', type: 'string', default: '' },
            { displayName:'LastName', name: 'lastName', type: 'string', default: '' },
            { displayName:'City', name: 'city', type: 'string', default: '' },
            { displayName:'Address Line1', name: 'address1', type: 'string', default: '' },
            { displayName:'Address Line2', name: 'address2', type: 'string', default: '' },
            //{ displayName:'Address Line3' name: 'address3', type: 'string', default: '' },
            { displayName:'Phon No', name: 'phoneNo', type: 'string', default: '' },
            { displayName:'Country', name: 'country', type: 'string', default: '' },
            { displayName:'Country Code', name: 'countryCode', type: 'string', default: '' },
            { displayName:'PostCode', name: 'postCode', type: 'string', default: '' },
            //{ displayName:'Company Name' name: 'companyName', type: 'string', default: '' },
            { displayName:'Mobile No', name: 'mobileNo', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Parent Company Code',
        name: 'parentCompanyCode',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['companies'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Username',
        name: 'username',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['companies'],
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
            resource: ['companies'],
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
            resource: ['companies'],
            operation: ['create'],
          },
        },
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['companies'],
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
            resource: ['companies'],
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
            resource: ['companies'],
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
            resource: ['companies'],
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
            resource: ['companies'],
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
            resource: ['companies'],
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
            resource: ['companies'],
            operation: ['create'],
          },
        },
      }
      

];