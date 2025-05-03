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
    LoggerProxy,
} from 'n8n-workflow';
import { BetterCommerceClient } from './Utils/Client';

// Single log when module is loaded
LoggerProxy.info('BetterCommerce Webhook: Module loaded');

export class BetterCommerceWebhook implements INodeType {
    constructor() {
        LoggerProxy.info('BetterCommerce Webhook: Constructor called');
    }
    
    description: INodeTypeDescription = {
        displayName: 'BetterCommerce Trigger',
        name: 'betterCommerceTrigger',
        icon: 'file:betterlogo.svg',
        group: ['trigger'],
        version: 1,
        description: 'Handle BetterCommerce webhook events',
        defaults: {
            name: 'BetterCommerce Trigger',
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
                isActive: true,
                restartWebhook: true,
                activationMode: 'always',
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
                default: 'order.created',
                required: true,
                description: 'The event to listen to',
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                options: [
                    {
                        displayName: 'Description',
                        name: 'description',
                        type: 'string',
                        default: '',
                        description: 'Description for the webhook',
                    },
                    {
                        displayName: 'Include Metadata',
                        name: 'includeMetadata',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to include metadata in the webhook payload',
                    },
                    {
                        displayName: 'Headers',
                        name: 'headers',
                        placeholder: 'Add Header',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
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
                    { name: 'Product Stock Changed', value: 'product.stock.changed' },
                    
                    // Quote events
                    { name: 'Quote Created', value: 'quote.created' },
                    { name: 'Quote Updated', value: 'quote.updated' },
                    { name: 'Quote Deleted', value: 'quote.deleted' },
                    { name: 'Quote Status Changed', value: 'quote.status.changed' },
                ];
            },
        },
    };

    // This method is called when the node is activated (when the workflow is activated)
    async activate(this: IHookFunctions): Promise<boolean> {
        LoggerProxy.info('BetterCommerce Webhook: ACTIVATE method called');
        
        try {
            const staticData = this.getWorkflowStaticData('node');
            const credentials = await this.getCredentials('betterCommerceApi');
            const client = new BetterCommerceClient(credentials, this as any, 'webhook');
            
            // Ensure webhookUrl is a string
            const webhookUrl = this.getNodeWebhookUrl('default');
            if (!webhookUrl) {
                throw new Error('Failed to get webhook URL');
            }
            
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
            
            // Split the event into entity type and event type
            const eventParts = event.split('.');
            const entityType = eventParts[0];
            const eventType = eventParts.slice(1).join('.');
            
            // Create webhook configuration
            const webhookPayload: IDataObject = {
                name: additionalFields.description as string || `n8n Webhook for ${event}`,
                entityType: entityType,
                eventType: eventType,
                webhookEntityTypes: 0,
                webhookEventTypes: 1,
                method: 0,
                destination: webhookUrl,
                isActive: true,
                targetType: 1,
                customHeaders: Object.keys(headers).length > 0 
                    ? Object.entries(headers).map(([key, value]) => ({ key, value })) 
                    : []
            };
            
            // Add additional fields if provided
            if (additionalFields.includeMetadata !== undefined) {
                webhookPayload.includeMetadata = additionalFields.includeMetadata as boolean;
            }
            
            // Register the webhook with BetterCommerce
            const response = await client.create<IDataObject>('/webhook', webhookPayload);
            
            // Store the webhook ID for later deletion
            staticData.webhookId = response.id || response.recordId;
            LoggerProxy.info('BetterCommerce Webhook: Webhook registered successfully');
            
            return true;
        } catch (error) {
            LoggerProxy.error('BetterCommerce Webhook: Error in activate method', { error });
            throw new NodeApiError(this.getNode(), error);
        }
    }

    // This method is called when the node is deactivated (when the workflow is deactivated)
    async deactivate(this: IHookFunctions): Promise<boolean> {
        LoggerProxy.info('BetterCommerce Webhook: DEACTIVATE method called');
        
        try {
            const webhookData = this.getWorkflowStaticData('node');
            
            if (webhookData.webhookId) {
                const credentials = await this.getCredentials('betterCommerceApi');
                const client = new BetterCommerceClient(credentials, this as any, 'webhook');
                
                // Delete the webhook from BetterCommerce
                await client.delete<void>(`/webhook/${webhookData.webhookId}`);
                LoggerProxy.info('BetterCommerce Webhook: Webhook deleted successfully');
                
                // Clear the stored webhook ID
                delete webhookData.webhookId;
            } else {
                LoggerProxy.warn('BetterCommerce Webhook: No webhook ID found in static data');
            }
            
            return true;
        } catch (error) {
            LoggerProxy.error('BetterCommerce Webhook: Error in deactivate method', { error });
            throw new NodeApiError(this.getNode(), error);
        }
    }

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        LoggerProxy.info('BetterCommerce Webhook: WEBHOOK method called');
        
        try {
            const bodyData = this.getBodyData() as IDataObject;
            const eventType = this.getNodeParameter('event') as string;
            
            // Optional: Add any data transformation specific to the event type
            let processedData: IDataObject = bodyData;
            
            // Example of event-specific processing
            if (eventType === 'order.created' && bodyData.order) {
                // Extract just the order data
                processedData = bodyData.order as IDataObject;
            }
            
            return {
                workflowData: [
                    this.helpers.returnJsonArray(processedData),
                ],
            };
        } catch (error) {
            LoggerProxy.error('BetterCommerce Webhook: Error in webhook method', { error });
            throw new NodeApiError(this.getNode(), error);
        }
    }
}
