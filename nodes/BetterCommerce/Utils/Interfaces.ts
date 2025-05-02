
export interface IWebhookConfig {
    event: string;         // Format: "entityType.eventType" (e.g., "order.created")
    url: string;           // Maps to destination
    description?: string;  // Maps to name
    isActive?: boolean;    // Maps directly
    headers?: Record<string, string>; // Will be transformed to customHeaders array
    includeMetadata?: boolean; // Not directly mapped in this version
}
