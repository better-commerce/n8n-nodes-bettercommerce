import {
    INodeType,
    INodeTypeDescription,
    IHookFunctions,
    IWebhookFunctions,
    IWebhookResponseData,
    ILoadOptionsFunctions,
    INodePropertyOptions,
    IDataObject,
    IExecuteFunctions,
    INodeExecutionData,
} from 'n8n-workflow';
import { BetterCommerceClient } from './Utils/Client';

export class BetterCommerceWebhook implements INodeType {
    private static activations: number = 0;
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
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'n8n-webhook',
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
                description: 'The event to listen to',
            },
            {
                displayName: 'Activate Webhook',
                name: 'activate',
                type: 'boolean',
                default: false,
                description: 'Manually call activate() when executing',
            },
        ],
    };

    // Methods to load options dynamically
    methods = {
        loadOptions: {
            async getWebhookEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                
                console.log('getWebhookEvents called');

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
                ];
            },
        },
    };

    // This method is called when the workflow is activated
    async activate(this: IHookFunctions): Promise<boolean> {
        // Get the webhook URL
        const webhookUrl = this.getNodeWebhookUrl('default');
        console.log('Webhook URL:', webhookUrl);

        try{
            const staticData = this.getWorkflowStaticData('node');
            const credentials = await this.getCredentials('betterCommerceApi');
            const client = new BetterCommerceClient(credentials, this as any, 'webhook');
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
                        
        } catch (error) {
            console.error('Error in activate method', error);
            throw error;
        }
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
            console.log('BETTERCOMMERCE WEBHOOK EXECUTE CALLED');
            const activate = this.getNodeParameter('activate', 0, false) as boolean;

            if (activate) {
                console.log('BETTERCOMMERCE WEBHOOK: Force activation triggered');
                
                // Simulate activation
                BetterCommerceWebhook.activations++;
                
                // Store data for consistency
                const nodeWebhookData = this.getWorkflowStaticData('node');
               // nodeWebhookData.webhookUrl = 'FORCED_ACTIVATION';
                nodeWebhookData.activatedAt = new Date().toISOString();
                nodeWebhookData.activationCount = BetterCommerceWebhook.activations;
                
                // Try to get webhook URL even in execute
                try {
                    const webhookUrl = (this as any).getNodeWebhookUrl?.('default');
                    if (webhookUrl) {
                        nodeWebhookData.webhookUrl = webhookUrl;
                    }
                } catch (e) {
                    // Silently fail
                }
                
                return [[{
                    json: {
                        message: 'FORCED ACTIVATION SUCCESS',
                        timestamp: new Date().toISOString(),
                        activationCount: BetterCommerceWebhook.activations
                    }
                }]];
            }
            return [[]];
        }
}
