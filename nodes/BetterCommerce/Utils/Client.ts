import {
    ICredentialDataDecryptedObject,
    IHttpRequestMethods,
    IHttpRequestOptions,
    NodeApiError,
    IExecuteFunctions,
    IDataObject,
    ITriggerFunctions
} from 'n8n-workflow';
import axios from 'axios';
import { UrlManager } from './UrlManager';
import { IWebhookConfig } from './Interfaces';

export class BetterCommerceClient {
    private credentials: ICredentialDataDecryptedObject;
    private executeFunctions: IExecuteFunctions;
    private module: string;

    constructor(
        credentials: ICredentialDataDecryptedObject,
        executeFunctions: IExecuteFunctions | ITriggerFunctions,
        module: string
    ) {
        this.credentials = credentials;
        this.executeFunctions = executeFunctions as IExecuteFunctions; // Type assertion
        this.module = module;
    }

    public async create<T>(endpoint: string, data: IDataObject): Promise<T> {
        console.log(`BetterCommerceClient: Creating resource at ${endpoint}`, data);
        try {
            const response = await this.request<T>('POST', endpoint, data);
            console.log(`BetterCommerceClient: Successfully created resource at ${endpoint}`, response);
            return response;
        } catch (error) {
            console.error(`BetterCommerceClient: Error creating resource at ${endpoint}`, error);
            throw error;
        }
    }
    
    // just not to confuse with create word
    public async post<T>(endpoint: string, data: IDataObject): Promise<T> {
        return this.request<T>('POST', endpoint, data);
    }
    
    public async get<T>(endpoint: string, params?: IDataObject): Promise<T> {
        console.log(`endpoint ${endpoint}`)
        return this.request<T>('GET', endpoint, undefined, params);
    }

    public async update<T>(endpoint: string, data: IDataObject, qs?: IDataObject): Promise<T> {
        return this.request<T>('PUT', endpoint, data, qs);
    }

    public async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>('DELETE', endpoint);
    }

    /**
     * Create a new webhook
     */
    public async createWebhook(config: IWebhookConfig): Promise<IDataObject> {
        console.log('BetterCommerceClient: createWebhook called', config);
        
        // Map our simplified config to the expected BetterCommerce format
        const eventParts = config.event.split('.');
        const entityType = eventParts[0];
        const eventType = eventParts.slice(1).join('.');
        
        const webhookData: IDataObject = {
            name: config.description || `Webhook for ${config.event}`,
            entityType: entityType,
            eventType: eventType,
            webhookEntityTypes: 0,
            webhookEventTypes: 1,
            method: 0,
            destination: config.url,
            isActive: config.isActive !== undefined ? config.isActive : true,
            targetType: 1,
            customHeaders: config.headers ? Object.entries(config.headers).map(([key, value]) => ({ key, value })) : []
        };
        
        console.log('BetterCommerceClient: Webhook payload prepared', webhookData);
        return this.create<IDataObject>('/webhook', webhookData);
    }

    /**
     * Delete a webhook
     */
    public async deleteWebhook(webhookId: string): Promise<void> {
        console.log('BetterCommerceClient: deleteWebhook called', webhookId);
        return this.delete<void>(`/webhook/${webhookId}`);
    }

    /**
     * Get all webhooks
     */
    public async getWebhooks(filters?: IDataObject): Promise<IDataObject[]> {
        console.log('BetterCommerceClient: getWebhooks called', filters);
        return this.get<IDataObject[]>('/webhook', filters);
    }

    /**
     * Get a webhook by ID
     */
    public async getWebhook(webhookId: string): Promise<IDataObject> {
        console.log('BetterCommerceClient: getWebhook called', webhookId);
        return this.get<IDataObject>(`/webhook/${webhookId}`);
    }

    /**
     * Update a webhook
     */
    public async updateWebhook(webhookId: string, config: IDataObject): Promise<IDataObject> {
        console.log('BetterCommerceClient: updateWebhook called', { webhookId, config });
        return this.update<IDataObject>(`/webhook/${webhookId}`, config);
    }

    /**
     * Activate a webhook
     */
    public async activateWebhook(webhookId: string): Promise<IDataObject> {
        return this.post<IDataObject>(`/webhooks/${webhookId}/activate`, {});
    }

    /**
     * Deactivate a webhook
     */
    public async deactivateWebhook(webhookId: string): Promise<IDataObject> {
        return this.post<IDataObject>(`/webhooks/${webhookId}/deactivate`, {});
    }

    private async request<T>(
        method: IHttpRequestMethods,
        endpoint: string,
        body?: IDataObject,
        query?: IDataObject
    ): Promise<T> {
        console.log(`BetterCommerceClient: Starting ${method} request to ${endpoint}`);
        
        const token = await getAccessToken(this.executeFunctions, this.credentials);
        console.log('BetterCommerceClient: Got access token');
        
        const baseUrl = UrlManager.getModuleUrl(this.credentials, this.module);
        console.log(`BetterCommerceClient: Base URL for module ${this.module}: ${baseUrl}`);
        
        const options: IHttpRequestOptions = {
            method,
            url: `${baseUrl}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        
        console.log(`BetterCommerceClient: Making ${method} request to: ${baseUrl}${endpoint}`);
        
        if (body) {
            options.body = body;
            console.log('BetterCommerceClient: Request body:', JSON.stringify(body));
        }
        if (query) {
            options.qs = query;
            console.log('BetterCommerceClient: Request query:', JSON.stringify(query));
        }

        try {
            console.log('BetterCommerceClient: Sending request with options:', JSON.stringify(options, null, 2));
            const response = await this.executeFunctions.helpers.httpRequest(options);
            console.log('BetterCommerceClient: Response received:', JSON.stringify(response));
            return response;
        } catch (error) {
            console.error('BetterCommerceClient: Request failed:', error);
            if (error.response) {
                console.error('BetterCommerceClient: Error response:', JSON.stringify(error.response.data));
            }
            throw new NodeApiError(this.executeFunctions.getNode(), error);
        }
    }
}
// ---- OUTSIDE the class ----

export async function getAccessToken(
    that: IExecuteFunctions,
    credentials: any
): Promise<string> {
    console.log('getAccessToken: Starting token retrieval');
    const authUrl = `${UrlManager.getModuleUrl(credentials, 'auth')}/oauth/token`;
    console.log(`getAccessToken: Auth URL: ${authUrl}`);
    
    const { clientId, clientSecret } = credentials;
    console.log(`getAccessToken: Using client ID: ${clientId}`);
    
    try {
        console.log('getAccessToken: Making token request');
        const response = await axios.post(
            authUrl,
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
        );
        
        console.log('getAccessToken: Token received successfully');
        return response.data.access_token;
    } catch (error) {
        console.error('getAccessToken: Error getting token:', error);
        if (error.response) {
            console.error('getAccessToken: Error response:', JSON.stringify(error.response.data));
        }
        throw error;
    }
}
