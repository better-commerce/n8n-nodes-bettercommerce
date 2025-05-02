import {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
    NodeApiError,
} from 'n8n-workflow';
import { BetterCommerceClient } from '../../../Utils/Client';
export { Description } from './Description';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('betterCommerceApi');
    const client = new BetterCommerceClient(credentials, this, 'catalog');
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
            // Get additional options
            const options = this.getNodeParameter('options', i, {}) as IDataObject;
            
            // Prepare search parameters
            const searchParams: IDataObject = {};
            
            // Add text search parameters if provided
            if (options.freeText) {
                searchParams.freeText = options.freeText;
            }
            
            // Add brand filter if provided
            if (options.brand) {
                searchParams.brand = options.brand;
            }
            
            // Add category filter if provided
            if (options.category) {
                searchParams.category = options.category;
            }
            
            // Add barcode filter if provided
            if (options.barcode) {
                searchParams.barcode = options.barcode;
            }
            
            // Add pagination parameters if provided
            if (options.currentPage !== undefined) {
                searchParams.currentPage = options.currentPage;
            } else {
                searchParams.currentPage = 1; // Default to first page
            }
            
            if (options.pageSize !== undefined) {
                searchParams.pageSize = options.pageSize;
            } else {
                searchParams.pageSize = 20; // Default page size
            }
            
            // Add sorting parameters if provided
            if (options.sortBy) {
                searchParams.sortBy = options.sortBy;
            }
            
            if (options.sortOrder) {
                searchParams.sortOrder = options.sortOrder;
            }
            
            // Add additional filters if provided
            if (options.additionalFilters) {
                try {
                    const additionalFilters = typeof options.additionalFilters === 'string' 
                        ? JSON.parse(options.additionalFilters as string)
                        : options.additionalFilters;
                    
                    // Merge additional filters with search params
                    Object.assign(searchParams, additionalFilters);
                } catch (error) {
                    throw new Error(`Invalid JSON in additionalFilters: ${error.message}`);
                }
            }
            
            // Execute the advanced search
            const products = await client.post<IDataObject>('/search/advanced', searchParams);
            
            if (products) {
                returnData.push({ json: products });
            } else {
                returnData.push({ json: { error: 'No products found' } });
            }
        } catch (error) {
            if (this.continueOnFail()) {
                returnData.push({ json: { error: error.message } });
                continue;
            }
            throw new NodeApiError(this.getNode(), error);
        }
    }

    return [returnData];
}


