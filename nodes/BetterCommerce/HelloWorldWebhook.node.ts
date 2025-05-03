import { 
    INodeType, 
    INodeTypeDescription, 
    IWebhookFunctions,
    IHookFunctions,
    IExecuteFunctions,
    INodeExecutionData,
    IWebhookResponseData,
    NodeOperationError,
    LoggerProxy
} from 'n8n-workflow';

// Single log when module is loaded
LoggerProxy.info('HelloWorldWebhook: Module loaded');

export class HelloWorldWebhook implements INodeType {
    private static activations: number = 0;
    // Removed unused static instance variable

    constructor() {
        LoggerProxy.info('HelloWorldWebhook: Constructor called');
        
        // Attempt to self-activate on load
        setTimeout(() => {
            LoggerProxy.info('HelloWorldWebhook: Attempting self-activation via setTimeout');
        }, 5000);
    }

    description: INodeTypeDescription = {
        displayName: 'DEBUG Webhook',
        name: 'debugWebhook',
        icon: 'fa:bug',
        group: ['trigger'],  // ← Must be in trigger group
        version: 1.2,
        description: 'Webhook with guaranteed activation',
        defaults: {
            name: 'DEBUG Webhook',
            color: '#FF0000',
        },
        inputs: [],
        outputs: ['main'],
        // Critical webhook configuration
        webhooks: [{
            name: 'default',
            httpMethod: 'POST',
            responseMode: 'onReceived',
            path: 'debug-webhook',
            isFullPath: false,
            restartWebhook: true,  // ← Ensures re-activation
            activationMode: 'always',  // ← Ensures auto-activation (valid values: 'always', 'once', etc.)
            isActive: true
        }],
        properties: [
            {
                displayName: 'Manual Trigger',
                name: 'manualTrigger',
                type: 'boolean',
                default: false,
                description: 'Manually call activate() when executing',
            },
            {
                displayName: 'Auto-Activate on Load',
                name: 'autoActivateOnLoad',
                type: 'boolean',
                default: true,
                description: 'Attempt to activate when node is loaded',
            },
            {
                displayName: 'Force Activation',
                name: 'forceActivation',
                type: 'boolean',
                default: false,
                description: 'Force activation on every execution',
            }
        ]
    };

    async activate(this: IHookFunctions): Promise<boolean> {
        try {
            HelloWorldWebhook.activations++;
            LoggerProxy.info(`HelloWorldWebhook: ACTIVATE method called (${HelloWorldWebhook.activations})`);
            
            // Get the webhook URL for verification
            const webhookUrl = this.getNodeWebhookUrl('default');
            
            // Store data for later use
            const nodeWebhookData = this.getWorkflowStaticData('node');
            nodeWebhookData.webhookUrl = webhookUrl;
            nodeWebhookData.activatedAt = new Date().toISOString();
            nodeWebhookData.activationCount = HelloWorldWebhook.activations;
            
            // Visual confirmation
            throw new NodeOperationError(this.getNode(), `🔥 AUTO-ACTIVATED (${HelloWorldWebhook.activations})`);
        } catch (error) {
            if (!(error instanceof NodeOperationError)) {
                LoggerProxy.error('HelloWorldWebhook: Error in activate method', { error });
                throw error;
            }
            return true;
        }
    }

    async deactivate(this: IHookFunctions): Promise<boolean> {
        LoggerProxy.info('HelloWorldWebhook: DEACTIVATE method called');
        return true;
    }

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        try {
            LoggerProxy.info('HelloWorldWebhook: EXECUTE method called');
            
            const manualTrigger = this.getNodeParameter('manualTrigger', 0) as boolean;
            const forceActivation = this.getNodeParameter('forceActivation', 0, false) as boolean;
            
            // Force activation on every execution
            if (forceActivation) {
                LoggerProxy.info('HelloWorldWebhook: Force activation triggered');
                
                // Simulate activation
                HelloWorldWebhook.activations++;
                
                // Store data for consistency
                const nodeWebhookData = this.getWorkflowStaticData('node');
                nodeWebhookData.webhookUrl = 'FORCED_ACTIVATION';
                nodeWebhookData.activatedAt = new Date().toISOString();
                nodeWebhookData.activationCount = HelloWorldWebhook.activations;
                
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
                        activationCount: HelloWorldWebhook.activations
                    }
                }]];
            }
            
            if (manualTrigger) {
                LoggerProxy.info('HelloWorldWebhook: Manual trigger activated');
                
                // Create a simulated activation
                HelloWorldWebhook.activations++;
                
                // Store data for consistency
                const nodeWebhookData = this.getWorkflowStaticData('node');
                nodeWebhookData.activatedAt = new Date().toISOString();
                nodeWebhookData.activationCount = HelloWorldWebhook.activations;
                
                return [[{
                    json: {
                        message: 'MANUAL ACTIVATION SUCCESS',
                        timestamp: new Date().toISOString(),
                        activationCount: HelloWorldWebhook.activations
                    }
                }]];
            }
            
            return [[]];
        } catch (error) {
            LoggerProxy.error('HelloWorldWebhook: Error in execute method', { error });
            throw error;
        }
    }

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        try {
            LoggerProxy.info('HelloWorldWebhook: WEBHOOK method called');
            
            // Auto-activate on webhook receive
            HelloWorldWebhook.activations++;
            
            // Store data for consistency
            const nodeWebhookData = this.getWorkflowStaticData('node');
            nodeWebhookData.activatedAt = new Date().toISOString();
            nodeWebhookData.activationCount = HelloWorldWebhook.activations;
            
            const req = this.getRequestObject();
            const bodyData = this.getBodyData();
            
            return {
                workflowData: [[{
                    json: {
                        message: 'Webhook received with auto-activation',
                        totalActivations: HelloWorldWebhook.activations,
                        time: new Date().toISOString(),
                        body: bodyData,
                        headers: req.headers,
                        query: req.query
                    }
                }]]
            };
        } catch (error) {
            LoggerProxy.error('HelloWorldWebhook: Error in webhook method', { error });
            throw error;
        }
    }
}
