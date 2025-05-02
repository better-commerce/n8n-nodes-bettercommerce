import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import { BetterCommerceClient } from './Utils/Client';

export class RegisterWebhook implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'BetterCommerce: Register Webhook',
        name: 'betterCommerceRegisterWebhook',
        icon: 'file:betterCommerce.svg',
        group: ['transform'],
        version: 1,
        description: 'Register webhooks with BetterCommerce',
        defaults: {
            name: 'Register Webhook',
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
                displayName: 'Event',
                name: 'event',
                type: 'options',
                options: [
                    { name: 'Customer Created', value: 'customer.created' },
                    { name: 'Order Created', value: 'order.created' },
                    { name: 'Product Updated', value: 'product.updated' },
                ],
                default: 'customer.created',
                required: true,
            },
            {
                displayName: 'Webhook URL',
                name: 'webhookUrl',
                type: 'string',
                required: true,
                default: '',
                description: 'The URL BetterCommerce should call',
            },
            {
                displayName: 'Include Metadata',
                name: 'includeMetadata',
                type: 'boolean',
                default: false,
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const credentials = await this.getCredentials('betterCommerceApi');
        const client = new BetterCommerceClient(credentials, this, 'webhook');

        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const response = await client.registerWebhook({
                    event: this.getNodeParameter('event', i) as string,
                    callbackUrl: this.getNodeParameter('webhookUrl', i) as string,
                    includeMetadata: this.getNodeParameter('includeMetadata', i, false) as boolean,
                });

                returnData.push({
                    json: response,
                });
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}