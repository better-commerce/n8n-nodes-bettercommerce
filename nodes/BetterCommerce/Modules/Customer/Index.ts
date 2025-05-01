import { INodeProperties,IExecuteFunctions } from 'n8n-workflow';

import * as Create from './Create/Index';
import * as GetByEmail from './GetByEmail/Index';
//import * as Get from './Get';
// import * as GetAll from './GetAll';
// import * as Update from './Update';
// import * as Delete from './Delete';

export const description: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['customer'],
            },
        },
        options: [
            { name: 'Create', value: 'create' },
            { name: 'Get', value: 'get' },
            { name: 'Get By Email', value: 'getByEmail' },
            { name: 'Get All', value: 'getAll' },
            { name: 'Update', value: 'update' },
            { name: 'Delete', value: 'delete' },
        ],
        default: 'get',
    },
    ...Create.Description,
    ...GetByEmail.Description,
    //...Get.description,
    // ...GetAll.Description,
    // ...Update.description,
    // ...Delete.description,
];

export async function execute(this: IExecuteFunctions, operation: string) {
    const actions = {
        create: Create.execute,
        getByEmail: GetByEmail.execute
        // get: Get.execute,
        //getAll: GetAll.execute,
        // update: Update.execute,
        // delete: Delete.execute,
    };
    console.log(`in execute ${operation}`)
    if (!actions[operation as keyof typeof actions]) {
        throw new Error(`Unsupported operation: ${operation}`);
    }
    
    return actions[operation as keyof typeof actions].call(this);
}