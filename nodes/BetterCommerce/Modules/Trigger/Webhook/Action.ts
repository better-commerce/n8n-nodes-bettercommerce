import { 
    ITriggerFunctions,
    ITriggerResponse,
    IDataObject,
    IExecuteFunctions
} from 'n8n-workflow';
import { BetterCommerceClient } from '../../../Utils/Client';

interface ITriggerContext extends ITriggerFunctions {
    getNodeWebhookUrl(name: string): string;
    getWorkflowStaticData(type: string): IDataObject;
}
export interface IWebhookConfig {
    event: string;
    url: string;
    includeMetadata?: boolean;
}

export interface IWebhookResponse {
    id: string;
    event: string;
    url: string;
    createdAt: string;
}

declare module 'n8n-workflow' {
    interface ITriggerResponse {
        webhookId?: string;
        webhookUrl?: string;
    }
}

export async function execute(this: ITriggerContext): Promise<ITriggerResponse> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const event = this.getNodeParameter('event', 0) as string;
    const includeMetadata = this.getNodeParameter('includeMetadata', 0, {}) as boolean;
    
    const client = new BetterCommerceClient(
        credentials, 
        this as unknown as IExecuteFunctions,
        'trigger'
    );

    const webhookData = this.getWorkflowStaticData('node');
    const webhookUrl = this.getNodeWebhookUrl('default');

    // Clean up previous webhook if exists
    if (webhookData.webhookId) {
        await client.deleteWebhook(webhookData.webhookId as string);
    }

    // Register new webhook
    const response = await client.createWebhook({
        event,
        url: webhookUrl,
        includeMetadata,
    });

    // Store webhook ID for cleanup
    webhookData.webhookId = response.id;

    // Proper ITriggerResponse structure
    return {
        webhookId: response.id,
        webhookUrl,
    };
}