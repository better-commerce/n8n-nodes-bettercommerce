import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    INodeProperties,
} from 'n8n-workflow';

import * as Customer from './Modules/Customer/Index';
import * as Product from './Modules/Product/Index';
import * as Order from './Modules/Order/Index';
import * as Quote from './Modules/Quote/Index';
import * as Webhook from './Modules/Webhook/Index';
import * as Trigger from './Modules/Trigger/Index';

export class BetterCommerce implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'BetterCommerce',
        name: 'betterCommerce',
        icon: 'file:betterlogo.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Work with BetterCommerce data',
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
                        name: 'Webhook',
                        value: 'webhook',
                    },
                    {
                        name: 'Trigger',
                        value: 'trigger',
                    },
                ],
                default: 'customer',
            },
            ...(Customer.description as INodeProperties[]),
            ...(Product.description as INodeProperties[]),
            ...(Order.description as INodeProperties[]),
            ...(Quote.description as INodeProperties[]),
            ...(Webhook.description as INodeProperties[]),
            ...(Trigger.description as INodeProperties[]),
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // We'll keep this but use it in the module execution
        const items = this.getInputData();
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;
        let returnData: INodeExecutionData[][] = [[]];

        // Map resources to their respective modules
        const MODULES = {
            'customer': Customer,
            'product': Product,
            'order': Order,
            'quote': Quote,
            'webhook': Webhook,
            'trigger': Trigger,
        };

        if (resource === 'trigger' && operation === 'webhook') {
            // Special case for trigger webhook
            returnData = await Trigger.execute.call(this);
        } else {
            // For all other resources, use the module's execute function
            const module = MODULES[resource as keyof typeof MODULES];
            if (module) {
                // Pass items to the module execute function
                returnData = await module.execute.call(this, operation, items);
            } else {
                throw new Error(`Unsupported resource: ${resource}`);
            }
        }

        return returnData;
    }
}
