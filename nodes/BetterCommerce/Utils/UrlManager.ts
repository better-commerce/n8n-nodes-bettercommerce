import { ICredentialDataDecryptedObject } from 'n8n-workflow';

interface IUrlConfig {
	module: string;
	url: string;
}

export class UrlManager {
	static getModuleUrl(credentials: ICredentialDataDecryptedObject, module: string): string {
		const env = (credentials.environment || 'prod') as 'dev' | 'prod';
		const urlConfig = credentials.urlConfig as { urls?: IUrlConfig[] };

		const defaults: Record<'prod' | 'dev', Record<string, string>> = {
			prod: {
				product: 'https://pimapi.bettercommerce.io/',
				order: 'https://api20.bettercommerce.io/api/v2/commerce/',
				customer: 'https://api20.bettercommerce.io/',
				quote: 'https://api20.bettercommerce.io/api/v2/commerce/',
				auth: 'https://auth.bettercommerce.io/',
			},
			dev: {
				product: 'https://pimapi.dev-omnicx.com/',
				order: 'https://api20.dev-omnicx.com/api/v2/commerce/',
				customer: 'https://api20.dev-omnicx.com/api/v2/commerce/customer',
				quote: 'https://api20.dev-omnicx.com/api/v2/commerce/',
				auth: 'https://auth.dev-omnicx.com/',
			},
		};

		// Use override if present
		const customUrl = urlConfig?.urls?.find(u => u.module === module)?.url;
		const resolved = customUrl || defaults[env][module];

		if (!resolved) {
			throw new Error(`No URL configured for module: ${module}`);
		}
		console.log(`env : ${env}, resolved url ${resolved}, module ${module}`);	
		return UrlManager.validateUrl(resolved);
	}

    static validateUrl(url: string): string {
        // if (!url.match(`/^https?:\/\/.+/`)) {
        //     throw new Error(`Invalid URL format: ${url}`);
        // }
        console.log(`resolved url ${url}`)
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }
}

