import { INodeProperties } from 'n8n-workflow';

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'product',
	options: [
		{ name: 'Product', value: 'product' },
		{ name: 'Order', value: 'order' },
		{ name: 'Customer', value: 'customer' },
		{ name: 'Company', value: 'company' },
		{ name: 'Quote', value: 'quote' },
		{ name: 'RFQ', value: 'rfq' },
		{ name: 'User', value: 'user' },
	],
};

export const operationOptions: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'getAll',
	options: [
		{ name: 'Get All', value: 'getAll' },
		{ name: 'Get by ID', value: 'getById' },
		{ name: 'Create', value: 'create' },
		{ name: 'Update', value: 'update' },
		{ name: 'Delete', value: 'delete' },
	],
};

export const idField: INodeProperties = {
	displayName: 'ID',
	name: 'id',
	type: 'string',
	default: '',
	displayOptions: {
		show: {
			operation: ['getById', 'update', 'delete'],
		},
	},
};

export const dataField: INodeProperties = {
	displayName: 'Data',
	name: 'data',
	type: 'json',
	default: '',
	displayOptions: {
		show: {
			operation: ['create', 'update'],
		},
	},
};
