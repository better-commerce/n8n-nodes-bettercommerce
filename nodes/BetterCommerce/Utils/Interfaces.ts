//import { IDataObject } from 'n8n-workflow';

export interface IWebhookConfig {
    event: string;
    url: string;
    includeMetadata?: boolean;
}

export interface IWebhookResponse {
    id: string;
    event: string;
    url: string;
    includeMetadata: boolean;
    createdAt: string;
    updatedAt: string;
}

// export interface IProductData extends IDataObject {
//     id?: string;
//     name: string;
//     productCode: string;
//     stockCode: string;
//     sellPrice: number;
//     itemTypes: number;
//     [key: string]: any;
// }

// export interface ICustomerData extends IDataObject {
//     id?: string;
//     email: string;
//     firstName?: string;
//     lastName?: string;
//     [key: string]: any;
// }

// export interface IOrderData extends IDataObject {
//     id?: string;
//     orderNumber?: string;
//     customerId?: string;
//     [key: string]: any;
// }

// export interface IQuoteData extends IDataObject {
//     id?: string;
//     quoteNumber?: string;
//     customerId?: string;
//     [key: string]: any;
// }