import {
    IExecuteFunctions,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
    INodeExecutionData
} from 'n8n-workflow';

import * as Customer from './Modules/Customer/Index';
// import * as Order from './Modules/Order';
// import * as Product from './Modules/Product';
// import * as Quote from './Modules/Quote';
// import * as Trigger from './Modules/Trigger';

const MODULES = {
    customer: Customer,
    // order: Order,
    // product: Product,
    // quote: Quote,
    // trigger: Trigger,
};

export class BetterCommerce implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'BetterCommerce',
        name: 'betterCommerce',
        icon: 'file:logo.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with BetterCommerce API',
        defaults: {
            name: 'BetterCommerce',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'betterCommerceApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: Object.keys(MODULES).map(moduleName => ({
                    name: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
                    value: moduleName,
                })),
                default: 'customer',
            },
            ...Object.values(MODULES).flatMap(module => module.description),
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;
        
        const module = MODULES[resource as keyof typeof MODULES];
        if (!module) {
            throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`);
        }
        
        return module.execute.call(this, operation);
    }
}