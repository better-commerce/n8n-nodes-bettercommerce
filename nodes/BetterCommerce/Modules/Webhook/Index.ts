import * as Create from './Create/Action';
import * as Delete from './Delete/Action';
import * as Get from './Get/Action';
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export const description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['webhook'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new webhook',
                action: 'Create a webhook',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an existing webhook',
                action: 'Update a webhook',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get webhook(s)',
                action: 'Get webhook',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a webhook',
                action: 'Delete a webhook',
            },
        ],
        default: 'create',
    },
    ...Create.Description,
    ...Delete.Description,
    ...Get.Description,
];

export async function execute(
    this: IExecuteFunctions, 
    operation: string,
    items?: INodeExecutionData[]
): Promise<INodeExecutionData[][]> {
    if (operation === 'create') {
        return await Create.execute.call(this);
    }
    if (operation === 'delete') {
        return await Delete.execute.call(this);
    }
    if (operation === 'get') {
        return await Get.execute.call(this);
    }
    
    throw new Error(`Unsupported operation: ${operation}`);
}
