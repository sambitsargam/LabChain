# On-Chain Lab Notebook

A decentralized application for managing scientific research notebooks on the Sui blockchain. This project allows researchers to create, edit, and fork lab notebooks while maintaining an immutable version history of their research data.

## Features

- Create new lab notebooks with markdown content
- Edit and version control research data
- Fork existing notebooks for collaborative research
- Immutable version history stored on Sui blockchain
- Off-chain storage using Walrus for efficient data management
- Wallet integration with Sui Wallet

## Tech Stack

- **Frontend**: React + TypeScript
- **Blockchain**: Sui Move
- **Storage**: Walrus HTTP PUT API
- **Wallet**: @suiet/wallet-kit
- **Blockchain SDK**: @mysten/sui.js

## Project Structure

```
/packages
  /lab_notebook          # Sui Move package
    /sources
      lab_notebook.move  # Smart contract
    Move.toml           # Move package manifest
/src                    # Frontend React application
  /components          # React components
  /hooks               # Custom React hooks
  /utils               # Utility functions
  App.tsx             # Main application component
```

## Prerequisites

- Node.js 16+
- Sui CLI
- Sui Wallet Browser Extension

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Create .env file
cp .env.example .env

# Add your configuration
VITE_SUI_RPC=https://fullnode.testnet.sui.io:443
VITE_PACKAGE_ID=<your-published-package-id>
```

3. Start the development server:
```bash
npm run dev
```

## Smart Contract Deployment

1. Build the Move package:
```bash
cd packages/lab_notebook
sui move build
```

2. Deploy to Sui testnet:
```bash
sui client publish --gas-budget 10000000
```

3. Update the `VITE_PACKAGE_ID` in your `.env` file with the published package ID.

## Usage

1. Connect your Sui wallet using the "Connect Wallet" button
2. Create a new notebook using the "New Notebook" button
3. Edit your notebook content using markdown
4. Save changes to create new versions
5. Fork notebooks to create your own copy
6. View version history and restore previous versions

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details