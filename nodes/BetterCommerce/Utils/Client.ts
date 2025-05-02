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
        return this.request<T>('POST', endpoint, data);
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
        // Map our simplified config to the expected BetterCommerce format
        const webhookData: IDataObject = {
            name: config.description || `Webhook for ${config.event}`,
            entityType: config.event.split('.')[0], // e.g., "order" from "order.created"
            eventType: config.event.split('.')[1], // e.g., "created" from "order.created"
            webhookEntityTypes: 0, // Default value
            webhookEventTypes: 1, // Default value
            method: 0, // Assuming 0 is POST
            destination: config.url,
            isActive: config.isActive !== undefined ? config.isActive : true,
            targetType: 1, // Default value
            customHeaders: config.headers ? Object.entries(config.headers).map(([key, value]) => ({ key, value })) : []
        };
        
        return this.create<IDataObject>('/webhook', webhookData);
    }

    /**
     * Delete a webhook
     */
    public async deleteWebhook(webhookId: string): Promise<void> {
        return this.delete<void>(`/webhook/${webhookId}`);
    }

    /**
     * Get all webhooks
     */
    public async getWebhooks(filters?: IDataObject): Promise<IDataObject[]> {
        return this.get<IDataObject[]>('/webhook', filters);
    }

    /**
     * Get a webhook by ID
     */
    public async getWebhook(webhookId: string): Promise<IDataObject> {
        return this.get<IDataObject>(`/webhook/${webhookId}`);
    }

    /**
     * Update a webhook
     */
    public async updateWebhook(webhookId: string, config: IDataObject): Promise<IDataObject> {
        return this.update<IDataObject>(`/webhooks/${webhookId}`, config);
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
        const token = await getAccessToken(this.executeFunctions, this.credentials);
        const baseUrl = UrlManager.getModuleUrl(this.credentials, this.module);     
        const options: IHttpRequestOptions = {
            method,
            url: `${baseUrl}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        
        console.log(`Making ${method} request to: ${baseUrl}${endpoint}`);
        
        if (body) {
            options.body = body;
            console.log('Request body:', JSON.stringify(body));
        }
        if (query) {
            options.qs = query;
            console.log('Request query:', JSON.stringify(query));
        }

        try {
            const response = await this.executeFunctions.helpers.httpRequest(options);
            console.log('Response received:', JSON.stringify(response));
            return response;
        } catch (error) {
            console.log('Request failed:', error);
            throw new NodeApiError(this.executeFunctions.getNode(), error);
        }
    }
}
// ---- OUTSIDE the class ----

export async function getAccessToken(
	that: IExecuteFunctions,
	credentials: any
): Promise<string> {
	const authUrl = `${UrlManager.getModuleUrl(credentials, 'auth')}/oauth/token`;
	const { clientId, clientSecret } = credentials;
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

	return response.data.access_token;
}
