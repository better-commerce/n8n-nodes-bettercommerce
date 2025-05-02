import { INodeProperties, IExecuteFunctions, jsonStringify } from 'n8n-workflow';

import * as Create from './Create/Action';
import * as Get from './Get/Action';
import * as GetAll from './GetAll/Action';
// import * as GetByEmail from './GetByEmail/Action';
// import * as Update from './Update/Action';
// import * as Delete from './Delete/Action';

export const description: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['product'],
            },
        },
        options: [
            { name: 'Create', value: 'create' },
            { name: 'Get By Id', value: 'get' },
            { name: 'Get By StockCode', value: 'getByStock' },
            { name: 'Get All', value: 'getAll' },
            { name: 'Update', value: 'update' },
            { name: 'Delete', value: 'delete' },
        ],
        default: 'get',
    },
    ...Create.Description,
    ...Get.Description,
    ...GetAll.Description,
    //...GetByEmail.Description,
    //...Update.Description,
    //...Delete.Description,
];

export async function execute(this: IExecuteFunctions, operation: string) {
    const actions = {
        create: Create.execute,
        get: Get.execute,
        getAll: GetAll.execute,
        //getByEmail: GetByEmail.execute,
        //update: Update.execute,
        //delete: Delete.execute,
    };
    console.log(`in execute ${operation}`)

    console.log(`in execute ${jsonStringify(actions)}`)
    if (!actions[operation as keyof typeof actions]) {
        throw new Error(`Unsupported operation: ${operation}`);
    }
    
    return actions[operation as keyof typeof actions].call(this);
}
