import { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

import * as Create from './Create/Action';
// Import other operations as they are developed

export async function execute(this: IExecuteFunctions, operation: string) {
    const actions = {
        create: Create.execute,
        // Add other operations as they are developed
    };

    if (!actions[operation as keyof typeof actions]) {
        throw new Error(`Unsupported operation: ${operation}`);
    }
    
    return actions[operation as keyof typeof actions].call(this);
}

export const description: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['quote'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new quote',
                action: 'Create a quote',
            },
            // Add other operations as they are developed
        ],
        default: 'create',
    },
    ...Create.Description,
];