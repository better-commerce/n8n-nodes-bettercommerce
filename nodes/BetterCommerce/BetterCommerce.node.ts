import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    INodeProperties,
    IHookFunctions,
    IWebhookFunctions,
    IWebhookResponseData,
    ILoadOptionsFunctions,
    INodePropertyOptions,
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
                    // Keep the webhook resource for other webhook operations like listing or deleting
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
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'bettercommerce',
                isActive: true,
                restartWebhook: true,
                activationMode: 'always',
            },
        ],
    };

    // Methods to load options dynamically
    methods = {
        loadOptions: {
            async getWebhookEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                return [
                    // Customer events
                    { name: 'Customer Created', value: 'customer.created' },
                    { name: 'Customer Updated', value: 'customer.updated' },
                    { name: 'Customer Deleted', value: 'customer.deleted' },
                    
                    // Order events
                    { name: 'Order Created', value: 'order.created' },
                    { name: 'Order Updated', value: 'order.updated' },
                    { name: 'Order Deleted', value: 'order.deleted' },
                    { name: 'Order Status Changed', value: 'order.status.changed' },
                    
                    // Product events
                    { name: 'Product Created', value: 'product.created' },
                    { name: 'Product Updated', value: 'product.updated' },
                    { name: 'Product Deleted', value: 'product.deleted' },
                ]
            },
        },
    };

    // This method is called when the workflow is activated
    async activate(this: IHookFunctions): Promise<boolean> {
        // Get the webhook URL
        console.log('BETTERCOMMERCE WEBHOOK ACTIVATE CALLED');
        const webhookUrl = this.getNodeWebhookUrl('default');
        console.log('Webhook URL:', webhookUrl);
        
        // Store the webhook URL in static data for reference
        const staticData = this.getWorkflowStaticData('node');
        staticData.webhookUrl = webhookUrl;
        staticData.activatedAt = new Date().toISOString();
        
        return true;
    }

    // This method is called when the workflow is deactivated
    async deactivate(this: IHookFunctions): Promise<boolean> {
        console.log('BETTERCOMMERCE WEBHOOK DEACTIVATE CALLED');
        return true;
    }

    // This method is called when a webhook request is received
    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        console.log('BETTERCOMMERCE WEBHOOK RECEIVED REQUEST');
        // Get the selected event
        const event = this.getNodeParameter('event') as string;
        // Get the request body
        const bodyData = this.getBodyData();
        console.log('Received data:', JSON.stringify(bodyData));
        
        return {
            workflowData: [
                this.helpers.returnJsonArray({ 
                    success: true, 
                    message: 'BetterCommerce webhook received',
                    event: event,
                    data: bodyData 
                }),
            ],
        };
    }

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


