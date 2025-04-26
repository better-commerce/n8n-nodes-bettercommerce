# BetterCommerce n8n Nodes

Official [n8n](https://n8n.io/) integration for BetterCommerce APIs.

## Features

- Full CRUD operations for BetterCommerce APIs
- OAuth2 Client Credentials authentication
- Dynamic base URL support per resource
- Easy credential configuration in n8n

## Installation

```bash
pnpm add n8n-nodes-bettercommerce
# or
npm install n8n-nodes-bettercommerce
```

## Usage

In n8n, go to **Settings → Community Nodes → Install**.

Enter the repository URL:

```text
https://github.com/better-commerce/n8n-nodes-bettercommerce
```

Create credentials using your BetterCommerce `clientId`, `clientSecret`, and `authUrl`.

Use BetterCommerce nodes inside your workflows.

## Authentication

This package uses **OAuth2 Client Credentials** flow.

You will need:

- **Auth URL** (e.g., `https://auth.bettercommerce.io/connect/token`)
- **Client ID**
- **Client Secret**

The access token is automatically fetched and refreshed when making API calls.

## Supported Resources

| Resource  | Operations                        |
|-----------|-----------------------------------|
| Products  | Get All, Get by ID, Create, Update, Delete |
| Orders    | Get All, Get by ID                 |
| Customers | Get All, Get by ID                 |
| Companies | Get All, Get by ID                 |
| Quotes    | Get All, Get by ID                 |
| RFQs      | Get All, Get by ID                 |
| Users     | Get All, Get by ID                 |

## Development

```bash
git clone https://github.com/better-commerce/n8n-nodes-bettercommerce.git
cd n8n-nodes-bettercommerce
pnpm install
pnpm build
```

To run n8n locally and load the custom node, make sure the built files are available in your `.n8n/custom` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

