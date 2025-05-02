import { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

import * as Create from './Create/Action';
import * as GetByEmail from './GetByEmail/Action';
// Import other operations as they are developed

export async function execute(this: IExecuteFunctions, operation: string) {
    const actions = {
        create: Create.execute,
        getByEmail: GetByEmail.execute,
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
            {
                name: 'Get By Email',
                value: 'getByEmail',
                description: 'Get quotes by customer email',
                action: 'Get quotes by email',
            },
            // Add other operations as they are developed
        ],
        default: 'create',
    },
    ...Create.Description,
    ...GetByEmail.Description,
];


