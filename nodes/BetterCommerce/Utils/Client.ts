import {
    ICredentialDataDecryptedObject,
    IHttpRequestMethods,
    IHttpRequestOptions,
    NodeApiError,
    IExecuteFunctions, // Added import
    IDataObject,
} from 'n8n-workflow';

export class BetterCommerceClient {
    private credentials: ICredentialDataDecryptedObject;
    private baseUrl: string;
    private executeFunctions: IExecuteFunctions;

    constructor(
        credentials: ICredentialDataDecryptedObject,
        executeFunctions: IExecuteFunctions // Changed parameter type
    ) {
        this.credentials = credentials;
        this.baseUrl = credentials.apiUrl as string || 'https://api.bettercommerce.com';
        this.executeFunctions = executeFunctions;
    }

    public async create<T>(endpoint: string, data: IDataObject): Promise<T> {
        return this.request<T>('POST', endpoint, data);
    }

    public async get<T>(endpoint: string, params?: IDataObject): Promise<T> {
        return this.request<T>('GET', endpoint, undefined, params);
    }

    public async update<T>(endpoint: string, data: IDataObject): Promise<T> {
        return this.request<T>('PUT', endpoint, data);
    }

    public async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>('DELETE', endpoint);
    }

    private async request<T>(
        method: IHttpRequestMethods,
        endpoint: string,
        body?: IDataObject,
        query?: IDataObject
    ): Promise<T> {
        const options: IHttpRequestOptions = {
            method,
            url: `${this.baseUrl}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.credentials.apiKey}`,
            },
        };

        if (body) options.body = body;
        if (query) options.qs = query;

        try {
            return await this.executeFunctions.helpers.httpRequest(options);
        } catch (error) {
            throw new NodeApiError(this.executeFunctions.getNode(), error);
        }
    }
}