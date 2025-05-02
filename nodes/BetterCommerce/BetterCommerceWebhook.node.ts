import {
    INodeType,
    INodeTypeDescription,
    IWebhookFunctions,
    IWebhookResponseData,
    ILoadOptionsFunctions,
    INodePropertyOptions,
    IHookFunctions,
    IDataObject,
    NodeApiError,
} from 'n8n-workflow';
import { BetterCommerceClient } from './Utils/Client';

export class BetterCommerceWebhook implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'BetterCommerce Webhook',
        name: 'betterCommerceWebhook',
        icon: 'file:betterlogo.svg',
        group: ['trigger'],
        version: 1,
        description: 'Handle BetterCommerce webhook events',
        defaults: {
            name: 'BetterCommerce Webhook',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'betterCommerceApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Event',
                name: 'event',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getWebhookEvents',
                },
                default: '',
                required: true,
                description: 'The event to listen to',
            },
            {
                displayName: 'Register Webhook',
                name: 'registerWebhook',
                type: 'boolean',
                default: true,
                description: 'Whether to register the webhook with BetterCommerce automatically',
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                options: [
                    {
                        displayName: 'Include Metadata',
                        name: 'includeMetadata',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to include additional event metadata in the webhook payload',
                    },
                    {
                        displayName: 'Description',
                        name: 'description',
                        type: 'string',
                        default: '',
                        description: 'Description of the webhook',
                    },
                    {
                        displayName: 'Headers',
                        name: 'headers',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        description: 'Custom headers to send with the webhook',
                        default: {},
                        options: [
                            {
                                name: 'header',
                                displayName: 'Header',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        description: 'Name of the header',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        default: '',
                                        description: 'Value of the header',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

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
                    { name: 'Product Stock Changed', value: 'product.stock.changed' },
                    
                    // Quote events
                    { name: 'Quote Created', value: 'quote.created' },
                    { name: 'Quote Updated', value: 'quote.updated' },
                    { name: 'Quote Deleted', value: 'quote.deleted' },
                    { name: 'Quote Status Changed', value: 'quote.status.changed' },
                ];
            }
        }
    };

    // This method is called when the node is activated (when the workflow is activated)
    async activate(this: IHookFunctions): Promise<boolean> {
        const registerWebhook = this.getNodeParameter('registerWebhook', true) as boolean;
        
        if (registerWebhook) {
            try {
                const credentials = await this.getCredentials('betterCommerceApi');
                const client = new BetterCommerceClient(credentials, this as any, 'webhook');
                
                const webhookUrl = this.getNodeWebhookUrl('default');
                const event = this.getNodeParameter('event') as string;
                const additionalFields = this.getNodeParameter('additionalFields', {}) as IDataObject;
                
                // Process headers if provided
                const headers: Record<string, string> = {};
                if (additionalFields.headers && (additionalFields.headers as IDataObject).header) {
                    const headerItems = (additionalFields.headers as IDataObject).header as IDataObject[];
                    for (const header of headerItems) {
                        headers[header.name as string] = header.value as string;
                    }
                }
                
                // Create webhook configuration
                const webhookConfig: IDataObject = {
                    event,
                    url: webhookUrl,
                };

                if (additionalFields.description) {
                    webhookConfig.description = additionalFields.description as string;
                }

                if (additionalFields.includeMetadata !== undefined) {
                    webhookConfig.includeMetadata = additionalFields.includeMetadata as boolean;
                }

                if (Object.keys(headers).length > 0) {
                    webhookConfig.headers = headers;
                }
                
                // Register the webhook with BetterCommerce
                const response = await client.create<IDataObject>('/webhooks', webhookConfig);
                
                // Store the webhook ID for later deletion
                const webhookData = this.getWorkflowStaticData('node');
                webhookData.webhookId = response.id;
                
                return true;
            } catch (error) {
                throw new NodeApiError(this.getNode(), error);
            }
        }
        
        return true;
    }

    // This method is called when the node is deactivated (when the workflow is deactivated)
    async deactivate(this: IHookFunctions): Promise<boolean> {
        const registerWebhook = this.getNodeParameter('registerWebhook', true) as boolean;
        
        if (registerWebhook) {
            try {
                const webhookData = this.getWorkflowStaticData('node');
                
                if (webhookData.webhookId) {
                    const credentials = await this.getCredentials('betterCommerceApi');
                    const client = new BetterCommerceClient(credentials, this as any, 'webhook');
                    
                    // Delete the webhook from BetterCommerce
                    await client.delete<void>(`/webhooks/${webhookData.webhookId}`);
                    
                    // Clear the stored webhook ID
                    delete webhookData.webhookId;
                }
                
                return true;
            } catch (error) {
                throw new NodeApiError(this.getNode(), error);
            }
        }
        
        return true;
    }

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const bodyData = this.getBodyData();
        
        // You can add additional processing here if needed
        // For example, you might want to extract specific fields based on the event type
        
        return {
            workflowData: [
                this.helpers.returnJsonArray(bodyData),
            ],
        };
    }
}
