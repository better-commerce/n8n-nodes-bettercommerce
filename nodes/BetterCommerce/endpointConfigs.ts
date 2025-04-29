interface EndpointConfig {
	endpoint: string;
	method: string;
	bodyParam?: string[];
	pathParams?: string[];
	queryParams?: string[];
	headers?: Record<string, string>;
  }
  
  type EndpointConfigs = Record<string, EndpointConfig>;

export const endpointConfigs:EndpointConfigs  = {
	"products.getAll": {
		"endpoint": "/api/v2/catalog/search/advanced",
		"method": "POST",
		"headers": {
		"Content-Type": "application/json",
		"Accept": "application/json"
		},
		"bodyParam": ["freeText"]
	},
    'products.getById': {
        endpoint: '/api/v2/catalog/product/{id}',
        method: 'GET',
        pathParams: ['id'],
    },
	'products.getByStockCode': {
        endpoint: '/api/v2/catalog/product/{stockCode}/stockcode',
        method: 'GET',
        pathParams: ['stockCode'],
    },

	'customers.getByEmail': {
        endpoint: '/api/v2/commerce/customer/{email}/exists',
        method: 'POST',
        pathParams: ['email'],
    },
	'customers.search': {
        endpoint: '/api/v2/commerce/customer',
        method: 'POST',
        bodyParam: ['email','firstname','lastname'],
    },
	'customers.create': {
        endpoint: '/api/v2/commerce/customer/create',
        method: 'POST',
        bodyParam: ['email','firstname','lastname','phone'],
    },

	'baskets.addItem': {
		endpoint: '/api/v2/commerce/basket/{id}/items/add',
		method: 'PUT',
		pathParams: ['id'],
		bodyParam: ['stockCode', 'qty'],
	  },
	  'baskets.getById': {
		endpoint: '/api/v2/commerce/basket/{id}',
		method: 'GET',
		pathParams: ['id']
	
	},
	'baskets.updateUser': {
		endpoint: '/api/v2/commerce/basket/{id}/user',
		method: 'PUT',
		pathParams: ['id'],
		queryParams: ['userId']
	
	},
  'baskets.updateShippingAddress': {
    endpoint: '/api/v2/commerce/checkout/{id}/addresss',
    method: 'PUT',
    pathParams: ['id'],
    bodyParam: ['addressLine1', 'addressLine2', 'city', 'postcode', 'country'],
  },
  'baskets.getShippingMethods': {
    endpoint: '/api/v2/commerce/checkout/{id}/shipping-methods',
    method: 'GET',
    pathParams: ['id'],
	queryParams: ['countryCode','postCode'],
  },
  'baskets.updateShippingMethod': {
    endpoint: '/api/v2/commerce/checkout/{id}/shipping-method',
    method: 'PUT',
    pathParams: ['id'],
    queryParams: ['shippingMethodId','countryCode'],
  },
  'baskets.getPaymentMethods': {
    endpoint: '/api/v2/commerce/checkout/paymentmethods/{id}',
    method: 'GET',
    pathParams: ['id'],
  },



};
