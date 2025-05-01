import {
    ICredentialDataDecryptedObject,
    IHttpRequestMethods,
    IHttpRequestOptions,
    NodeApiError,
    IExecuteFunctions, // Added import
    IDataObject,
    jsonStringify,
} from 'n8n-workflow';
import axios from 'axios';
import { UrlManager } from './UrlManager';

export class BetterCommerceClient {
    private credentials: ICredentialDataDecryptedObject;
    //private baseUrl: string;
    private executeFunctions: IExecuteFunctions;
    private module : string;
    constructor(
        credentials: ICredentialDataDecryptedObject,
        executeFunctions: IExecuteFunctions, // Changed parameter type
        module: string 
    ) {
        this.credentials = credentials;
        //this.baseUrl = credentials.apiUrl as string || 'https://api.bettercommerce.com';
        this.executeFunctions = executeFunctions;
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
        console.log(jsonStringify(options))
        if (body) options.body = body;
        if (query) options.qs = query;

        try {
            return await this.executeFunctions.helpers.httpRequest(options);
        } catch (error) {
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
