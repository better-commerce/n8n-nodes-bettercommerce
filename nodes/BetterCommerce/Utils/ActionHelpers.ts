import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
} from 'n8n-workflow';
import { BetterCommerceClient } from './Client';

// Create a client for a specific module
export function createClient(
    executeFunctions: IExecuteFunctions,
    module: string
): Promise<BetterCommerceClient> {
    return executeFunctions.getCredentials('betterCommerceApi')
        .then(credentials => new BetterCommerceClient(credentials, executeFunctions, module));
}

// Standard error handling for operations
export function handleOperationError(
    error: Error,
    executeFunctions: IExecuteFunctions
): INodeExecutionData[][] {
    if (executeFunctions.continueOnFail()) {
        return [[{ json: { error: error.message } }]];
    }
    throw error;
}

// Generic execute function for simple CRUD operations
export async function executeStandardOperation<T>(
    executeFunctions: IExecuteFunctions,
    module: string,
    operation: (client: BetterCommerceClient, i: number) => Promise<T>
): Promise<INodeExecutionData[][]> {
    const client = await createClient(executeFunctions, module);
    const items = executeFunctions.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
            const result = await operation(client, i);
            returnData.push({ json: result as unknown as IDataObject });
        } catch (error) {
            if (executeFunctions.continueOnFail()) {
                returnData.push({ json: { error: error.message } });
                continue;
            }
            throw error;
        }
    }

    return [returnData];
}

// Helper for module execute functions
export function createModuleExecute(actions: Record<string, Function>) {
    return function(this: IExecuteFunctions, operation: string) {
        if (!actions[operation]) {
            throw new Error(`Unsupported operation: ${operation}`);
        }
        return actions[operation].call(this);
    };
}