//import { IDataObject } from 'n8n-workflow';

export interface IWebhookConfig {
    event: string;
    url: string;
    description?: string;
    isActive?: boolean;
    headers?: Record<string, string>;
    includeMetadata?: boolean;
}

export interface IWebhookResponse {
    id: string;
    event: string;
    url: string;
    description: string;
    isActive: boolean;
    headers: Record<string, string>;
    includeMetadata: boolean;
    createdAt: string;
    updatedAt: string;
}
