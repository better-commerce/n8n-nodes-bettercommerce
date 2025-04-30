import {
    INodeType,
    INodeTypeDescription,
    INodeExecutionData,
    IExecuteFunctions,
    NodeConnectionType,
    NodeOperationError, // Add this import
    IHttpRequestOptions, // Add this for method type safety
} from 'n8n-workflow';
import axios from 'axios';
import { endpointConfigs } from './endpointConfigs';
import { betterCommerceProperties } from './betterCommerceProperties'; // Importing properties


export class BetterCommerce implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'BetterCommerce',
        name: 'betterCommerce',
        icon: 'file:logo.svg',
        group: ['transform'],
        version: 1,
        description: 'Manage products, orders, customers, etc. in BetterCommerce',
        defaults: {
            name: 'BetterCommerce',
            color: '#1F4B64',
        },
        inputs: [
            {
                type: NodeConnectionType.Main,  // Correct connection type for inputs
                required: true,
                displayName: 'Input',
            },
        ],
        outputs: [
            {
                type: NodeConnectionType.Main,  // Correct connection type for outputs
                required: true,
                displayName: 'Output',
            },
        ],
        credentials: [
            {
                name: 'betterCommerce', // MUST match your credential's 'name' property
                required: true,
            },
        ],
        properties: betterCommerceProperties,

    };

    // This method must use IExecuteFunctions to access data from the workflow
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const credentials = await this.getCredentials('betterCommerce');
        const token = await getAccessToken(this);

        const returnData: INodeExecutionData[] = [];
        // Extract parameters
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        const configKey = `${resource}.${operation}`;
        const config = endpointConfigs[configKey];
        

        // Build request
        

        let endpoint = config.endpoint;
        let method = config.method;
        let body;
        
        if (!config) {
            throw new Error(`Unsupported operation: ${configKey}`);
        }
                   
        // Handle path parameters
        if (config.pathParams) {
            config.pathParams.forEach((param: string) => {
                const value = this.getNodeParameter(param, 0) as string;
                endpoint = endpoint.replace(`{${param}}`, value);
            });
        }
        if(method=='convertToOrder'){
                // fetch the basket from the api 
                // prepare the convert to order  object from the basket response
                // just modify the payemnt method 

        }else{  
            // Handle body parameters
            if (config.bodyParam) {
                let bodyTemp: Record<string, any> = {};
            // Check if bodyParam is a string (single parameter) or an array (multiple parameters)
                //console.log(config.bodyParam);
                if (Array.isArray(config.bodyParam)) {
                    // Iterate over bodyParam array and construct the body
                    config.bodyParam.forEach((param: string) => {
                        const value = this.getNodeParameter(param, 0) as string;
                        bodyTemp[param] = value;
                    });

                } else {
                    // If bodyParam is a string, just add the single parameter to the body
                    const value = this.getNodeParameter(config.bodyParam, 0) as string;
                    bodyTemp[config.bodyParam] = value;
                }
                body=bodyTemp
            }
        }
        // Example of query parameters handling
        let queryParams = '';
        if (config.queryParams) {
        queryParams = config.queryParams
            .map((param: string) => `${param}=${this.getNodeParameter(param, 0)}`)
            .join('&');
            if (queryParams) {
                endpoint += `?${queryParams}`;
            }
        }
         const baseUrl = credentials.baseApiUrl || 'https://api20.dev-omnicx.com'; // Default if no credentials are provided
        // Construct the HTTP request options
        const options = {
            url: `${baseUrl}${endpoint}`,
            //url: `${resourceBaseUrls[resource]}${endpoint}`,
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: body??{}, // Use 'data' instead of 'body' for axios POST/PUT requests
        };

        try {
            const response = await this.helpers.httpRequest(options as IHttpRequestOptions);
            console.log(options)
            returnData.push({ json: response });
            return [returnData];
        } catch (error) {
            console.log(options)

            throw new NodeOperationError(this.getNode(), 'API request failed: ' + error.message);
        }
    }
    
}
// ---- OUTSIDE the class ----
async function getAccessToken(that: IExecuteFunctions): Promise<string> {
	const credentials = await that.getCredentials('betterCommerce') as {
		authUrl: string;
		clientId: string;
		clientSecret: string;
	};

	const authUrl = credentials.authUrl;
	const clientId = credentials.clientId;
	const clientSecret = credentials.clientSecret;

	const response = await axios.post(authUrl, 
		new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: clientSecret,
		}), {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
    console.log(response.data)

	return response.data.access_token;
}
