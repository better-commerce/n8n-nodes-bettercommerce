import { 
    ITriggerFunctions,
   IExecuteFunctions,IDataObject
} from 'n8n-workflow';
export interface IBetterCommerceCredentials {
    apiKey: string;
    apiUrl?: string;
}

export interface IPaginationOptions {
    limit?: number;
    offset?: number;
}

export type BetterCommerceContext = IExecuteFunctions | (ITriggerFunctions & {
    getNodeWebhookUrl: (name: string) => string;
    getWorkflowStaticData: (type: string) => IDataObject;
});