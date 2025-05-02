import {
    IExecuteFunctions,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
    INodeExecutionData
} from 'n8n-workflow';

import * as Customer from './Modules/Customer/Index';
import * as Order from './Modules/Order/Index';
import * as Product from './Modules/Product/Index';
import * as Quote from './Modules/Quote/Index';
import * as Trigger from './Modules/Trigger/Index';

const MODULES = {
    customer: Customer,
    order: Order,
    product: Product,
    quote: Quote,
    trigger: Trigger,
};

export class BetterCommerce implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'BetterCommerce',
        name: 'betterCommerce',
        icon: 'file:betterCommerce.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume BetterCommerce API',
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
                options: [
                    {
                        name: 'Customer',
                        value: 'customer',
                    },
                    {
                        name: 'Order',
                        value: 'order',
                    },
                    {
                        name: 'Product',
                        value: 'product',
                    },
                    {
                        name: 'Quote',
                        value: 'quote',
                    },
                    {
                        name: 'Trigger',
                        value: 'trigger',
                    },
                ],
                default: 'customer',
            },
            ...Customer.description,
            ...Order.description,
            ...Product.description,
            ...Quote.description,
            ...Trigger.description,
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



