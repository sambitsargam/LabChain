# LabChain: On-Chain Lab Notebook

A decentralized application for managing scientific research notebooks on the Sui blockchain. LabChain enables researchers to create, version, and collaborate on lab notebooks while maintaining an immutable record of their research data.


## 🔬 Key Features

- **Immutable Research Records**: Every change is recorded on the Sui blockchain, ensuring research integrity
- **Version Control**: Full history of all modifications with the ability to view and restore previous versions
- **Collaborative Research**: Fork notebooks to build upon existing research while maintaining attribution
- **Markdown Support**: Write and format research notes using familiar markdown syntax
- **Secure Authentication**: Integration with Sui Wallet for secure access and ownership
- **Efficient Storage**: Hybrid storage solution using blockchain for versioning and off-chain storage for content

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS for modern, responsive design
- **Blockchain**: Sui Move smart contracts
- **Authentication**: Sui Wallet (@suiet/wallet-kit)
- **Storage**: Hybrid on-chain/off-chain architecture
- **Version Control**: Custom diff implementation for efficient updates

## 📋 Prerequisites

- Node.js 16.x or later
- Sui Wallet browser extension
- Git (optional, for development)

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/labchain.git
   cd labchain
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Create .env file
   cp .env.example .env

   # Add your configuration
   VITE_SUI_RPC=https://fullnode.testnet.sui.io:443
   VITE_PACKAGE_ID=<your-published-package-id>
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📝 Usage Guide

### Creating a Notebook
1. Connect your Sui wallet using the "Connect Wallet" button
2. Click "New Notebook" to create a research notebook
3. Enter title, description, and initial content
4. Submit to create your notebook on the blockchain

### Managing Versions
- Each save creates a new version on the blockchain
- View complete version history in the notebook view
- Compare changes between versions
- Restore previous versions if needed

### Collaboration
- Fork existing notebooks to create your own copy
- All version history is preserved in forks
- Original attribution is maintained through blockchain records

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🏗️ Project Structure

```
/packages
  /lab_notebook          # Sui Move smart contracts
    /sources
      lab_notebook.move  # Core contract logic
    Move.toml           # Move package manifest
/src
  /components          # React components
    /common           # Shared components
    /notebooks        # Notebook-specific components
  /hooks              # Custom React hooks
  /utils              # Utility functions
  /pages             # Page components
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔐 Security

- All notebook operations require wallet authentication
- Smart contract includes comprehensive access controls
- Version history is immutable once recorded
- Off-chain storage uses secure content addressing

## 🌟 Acknowledgments

- Built on Sui blockchain for scalable, secure smart contracts
- Uses React and Vite for modern web development
- Inspired by the need for transparent, verifiable research records

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers directly.

---

Built with ❤️ for the scientific community
