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
        bodyParam: ['email','firstName','lastName','telephone'],
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
  'checkouts.updateShippingAddress': {
    endpoint: '/api/v2/commerce/checkout/{id}/address-shipping',
    method: 'PUT',
    pathParams: ['id'],
    bodyParam: ['title','firstName','lastName','companyName', 'address1', 'address2', 'city','state', 'postcode', 'countryCode','phoneNo']
  },
  'checkouts.updateBillingAddress': {
    endpoint: '/api/v2/commerce/checkout/{id}/address-billing',
    method: 'PUT',
    pathParams: ['id'],
    queryParams: ['sameAsShipping'],
    bodyParam: ['title','firstName','lastName','companyName', 'address1', 'address2', 'city','state', 'postcode', 'countryCode','phoneNo'], 
  },
  'checkouts.getShippingMethods': {
    endpoint: '/api/v2/commerce/checkout/{id}/shipping-methods',
    method: 'GET',
    pathParams: ['id'],
	queryParams: ['countryCode','postcode'],
  },
  'checkouts.updateShippingMethod': {
    endpoint: '/api/v2/commerce/checkout/{id}/shipping-method',
    method: 'PUT',
    pathParams: ['id'],
    queryParams: ['shippingMethodId','countryCode'],
  },
  'checkouts.getPaymentMethods': {
    endpoint: '/api/v2/commerce/checkout/payment-methods',
    method: 'GET',
    queryParams: ['country', 'currency', 'basketId'],
  },
  'checkouts.convertToOrder': {
    endpoint: '/api/v2/commerce/checkout',
    method: 'POST',
    pathParams: ['id'],
    bodyParam: ['placeOrderPayload'], // name of the single top-level object field
  },
'quotes.submitRfq': {
  endpoint: '/api/v2/commerce/b2b/rfq',
  method: 'POST',
  bodyParam: [
    'basketId', 'firstName', 'lastName', 'companyId', 'companyName',
    'poNumber', 'shippingMethodCode', 'shippingMethodName', 
    'comment',  'lines', 'currencyCode',
    'currencySymbol', 'deliveryInstruction'
  ],
  },
  'baskets.saveQuote': {
  endpoint: '/api/v2/commerce/b2b/quote/save',
  method: 'POST',
  bodyParam: [
    'id', 'purchaseOrderNo', 'quoteName', 'email'
  ],
  },
  'companies.create': {
  endpoint: '/api/v2/commerce/b2b/create',
  method: 'POST',
  bodyParam: [
    'businessType','registeredNumber', 
    'address','parentCompanyCode','firstName', 'lastName',
    'email',    'title',    'telephone',    'mobile',    'postCode',    'companyName',
    'companyCode', 'companyUserRole'
    ],
  },
  'companies.getAll': {
    endpoint: '/api/v2/commerce/b2b/companies',
    method: 'GET',
  }

};
