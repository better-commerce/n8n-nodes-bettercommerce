import {
    ICredentialType,
    ICredentialTestRequest,
    INodeProperties,
    ICredentialDataDecryptedObject,
    IHttpRequestOptions,
} from 'n8n-workflow';

export class BetterCommerce implements ICredentialType {
    name = 'betterCommerceApi'; // Changed to match standard naming
    displayName = 'BetterCommerce API Credentials';
    documentationUrl = 'https://docs.bettercommerce.io/';
    properties: INodeProperties[] = [
        {
            displayName: 'Client ID',
            name: 'clientId',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Client Secret',
            name: 'clientSecret',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
        {
            displayName: 'Auth URL',
            name: 'authUrl',
            type: 'string',
            default: 'https://auth.dev-omnicx.com/oauth/token',
            placeholder: 'https://your-domain/connect/token',
        },
        {
            displayName: 'API URL',
            name: 'apiUrl',
            type: 'string',
            default: 'https://api20.dev-omnicx.com',
            placeholder: 'https://api20.dev-omnicx.com',
        },
    ];

    test: ICredentialTestRequest = {
        request: {
            method: 'POST',
            url: '={{$credentials.authUrl}}',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials&client_id={{$credentials.clientId}}&client_secret={{$credentials.clientSecret}}',
        }
    };

    async authenticate(
        credentials: ICredentialDataDecryptedObject,
        requestOptions: IHttpRequestOptions
    ): Promise<IHttpRequestOptions> {
        requestOptions.headers = {
            ...requestOptions.headers,
            Authorization: `Bearer ${credentials.accessToken}`, // Use actual token
        };
        return requestOptions;
    }
}

// Remove this line - n8n will instantiate the class itself
// export const betterCommerceCredential = new BetterCommerceApi();