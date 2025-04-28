import {
	ICredentialType,
	ICredentialTestRequest,
	INodeProperties,
	ICredentialDataDecryptedObject,
	IHttpRequestOptions,
} from 'n8n-workflow';


export class BetterCommerce  implements ICredentialType {
	name = 'betterCommerce';
	displayName = 'BetterCommerce Credentials';
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
			displayName: 'Api URL',
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
	
	
	// This defines how to fetch the token

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions
	): Promise<IHttpRequestOptions> {
		// The actual authentication happens in the test method
		// Here we just prepare the request options
		requestOptions.headers = {
			...requestOptions.headers,
			Authorization: 'Bearer {{$credentials.access_token}}', // This will be replaced by n8n
		};
		return requestOptions;
	}
}
export const betterCommerceCredential = new BetterCommerce();