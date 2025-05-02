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
    const client = new BetterCommerceClient(credentials, this, 'order');
    const customerClient = new BetterCommerceClient(credentials, this, 'customer');
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
            const customerEmail = this.getNodeParameter('customerEmail', i) as string;
            let userId = '00000000-0000-0000-0000-000000000000'; // Default empty GUID
            
            // Step 1: Check if customer exists, create if not
            try {
                // Try to get customer by email
                const customerResponse = await customerClient.post<IDataObject>(`/${customerEmail}/exists`, {});
                if (customerResponse.result && typeof customerResponse.result === 'object') {
                    userId = (customerResponse.result as IDataObject).userId as string || userId;
                    console.log(`Customer exists with userId: ${userId}`);
                }
            } catch (error) {
                // If customer doesn't exist, create a new one
                const shippingAddressCollection = this.getNodeParameter('shippingAddress', i) as IDataObject;
                const shippingAddress = (shippingAddressCollection.addressFields as IDataObject) || {};
                
                const createResponse = await customerClient.create<IDataObject>('/create', {
                    email: customerEmail,
                    firstName: shippingAddress.firstName || '',
                    lastName: shippingAddress.lastName || '',
                    telephone: shippingAddress.phoneNumber || '',
                    postCode: shippingAddress.postCode || '',
                });
                
                if (createResponse.result && typeof createResponse.result === 'object') {
                    userId = (createResponse.result as IDataObject).userId as string || userId;
                    console.log(`Created new customer with userId: ${userId}`);
                }
            }
            
            // Step 2: Add first product to basket with empty GUID (creates a new basket)
            const productsCollection = this.getNodeParameter('products', i) as IDataObject;
            const products = productsCollection.productValues as IDataObject[];
            
            if (!products || products.length === 0) {
                throw new Error('At least one product is required');
            }
            
            // Add first product with empty GUID to create a new basket
            const firstProduct = products[0];
            const basketResponse = await client.update<IDataObject>(
                `/basket/00000000-0000-0000-0000-000000000000/items/add`,
                {
                    stockCode: firstProduct.stockCode,
                    qty: firstProduct.quantity,
                    customerEmail: customerEmail,
                }
            );
            
            // Extract basketId from response
            let basketId: string | undefined;
            if (basketResponse.result && typeof basketResponse.result === 'object') {
                console.log(`Basket response: ${JSON.stringify(basketResponse.result)}`);
                basketId = (basketResponse.result as IDataObject).id as string;
            }
            
            if (!basketId) {
                throw new Error('Failed to get basket ID from response');
            }
            
            // Step 3: Add remaining products to basket
            for (let j = 1; j < products.length; j++) {
                const product = products[j];
                await client.update<IDataObject>(
                    `/basket/${basketId}/items/add`,
                    {
                        stockCode: product.stockCode,
                        qty: product.quantity,
                    }
                );
            }
            
            // Step 4: Associate user with basket
            // Using the userId from customer response or default to empty GUID if not found
            const userParams: IDataObject = { userId };
            await client.update<IDataObject>(
                `/basket/${basketId}/user`,
                {},
                userParams
            );
            
            // Step 5: Update basket with shipping/billing address
            const shippingAddressCollection = this.getNodeParameter('shippingAddress', i) as IDataObject;
            const shippingAddressFields = (shippingAddressCollection.addressFields as IDataObject) || {};

            const useSameAddressForBilling = this.getNodeParameter('useSameAddressForBilling', i) as boolean;
            let billingAddressFields: IDataObject;

            if (useSameAddressForBilling) {
                billingAddressFields = shippingAddressFields;
            } else {
                const billingAddressCollection = this.getNodeParameter('billingAddress', i) as IDataObject;
                billingAddressFields = (billingAddressCollection.addressFields as IDataObject) || {};
            }

            // Map our address fields to the API's expected format
            const shippingAddress: IDataObject = {
                firstName: shippingAddressFields.firstName,
                lastName: shippingAddressFields.lastName,
                address1: shippingAddressFields.addressLine1,
                address2: shippingAddressFields.addressLine2 || '',
                // address3: '', // We don't have this field
                city: shippingAddressFields.city,
                state: shippingAddressFields.county,
                country: shippingAddressFields.country,
                countryCode: shippingAddressFields.country, // We don't have this field
                postCode: shippingAddressFields.postCode,
                phoneNo: shippingAddressFields.phoneNumber || '',
                // mobileNo: '', // We don't have this field
                // title: '', // We don't have this field
                // label: '', // We don't have this field
                // isConsentSelected: true, // We don't have this field
                // companyName: '', // We don't have this field
            };

            const billingAddress: IDataObject = {
                firstName: billingAddressFields.firstName,
                lastName: billingAddressFields.lastName,
                address1: billingAddressFields.addressLine1,
                address2: billingAddressFields.addressLine2 || '',
                // address3: '', // We don't have this field
                city: billingAddressFields.city,
                state: billingAddressFields.county,
                country: billingAddressFields.country,
                countryCode: billingAddressFields.country, // We don't have this field
                postCode: billingAddressFields.postCode,
                phoneNo: billingAddressFields.phoneNumber || '',
                // mobileNo: '', // We don't have this field
                // title: '', // We don't have this field
                // label: '', // We don't have this field
                // isConsentSelected: true, // We don't have this field
                // companyName: '', // We don't have this field
            };

            await client.update<IDataObject>(
                `/checkout/${basketId}/address`,
                {
                    shippingAddress,
                    billingAddress,
                }
            );
            
            // Step 6: Convert basket to order
            const paymentType = this.getNodeParameter('paymentType', i) as string;
            
            const convertPayload: IDataObject = {
                basketId,
                customerId: userId,
                shippingAddress,
                billingAddress,
                selectedPayment: {
                    systemName: paymentType,
                    // displayName: '', // We don't have this field
                    // slug: '', // We don't have this field
                    isOnsite: true,
                    enabled: true,
                    isBillingAddressRequired: true,
                    // displayOrder: 0, // We don't have this field
                    // iconCssClass: '', // We don't have this field
                    // description: '', // We don't have this field
                    enableImmediateCapture: true,
                    // forSubscription: true, // We don't have this field
                    // inputType: 10, // We don't have this field
                    // notificationUrl: '', // We don't have this field
                    // message: '', // We don't have this field
                }
            };
            
            const orderResponse = await client.create<IDataObject>(
                `/checkout/${basketId}/convert`,
                convertPayload
            );
            
            returnData.push({ json: orderResponse });
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







