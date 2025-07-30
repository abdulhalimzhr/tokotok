# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

# 🛒 TokoTo - Modern E-Commerce Platform

A full-featured e-commerce application built with **Nuxt 4**, **Vue 3**, and **TypeScript**. TokoTo provides a seamless shopping experience with wallet functionality, real-time cart management, and modern UI design.

![Nuxt 4](https://img.shields.io/badge/Nuxt-4.0.1-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue.js-3.5.17-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## ✨ Features

### 🛍️ **E-Commerce Core**
- **Product Catalog** with category filtering and search
- **Shopping Cart** with real-time updates
- **Product Details** with image gallery and reviews
- **Checkout Process** with order management
- **Inventory Management** with stock tracking

### 💳 **Digital Wallet System**
- **Wallet Balance** management and top-up
- **Transaction History** with detailed records
- **Purchase Tracking** with order receipts
- **Spending Analytics** and insights
- **LocalStorage Persistence** for offline access

### 🔐 **Authentication & Security**
- **User Authentication** with login/register
- **Protected Routes** and middleware
- **Session Management** with persistent storage
- **Toast Notifications** for user feedback

### 🎨 **Modern UI/UX**
- **Dark/Light Mode** toggle with system preference
- **Responsive Design** for all device sizes
- **Loading Skeletons** and smooth transitions
- **Custom Modal System** for better UX
- **Heroicons Integration** for consistent iconography

### ⚡ **Performance & Development**
- **Server-Side Rendering** with Nuxt 4
- **Type Safety** with full TypeScript coverage
- **State Management** with Pinia stores
- **Component Auto-imports** for better DX
- **Hot Module Replacement** for fast development

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm**, **pnpm**, **yarn**, or **bun**

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd tokoto

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun run dev
```

### Production Build

Build the application for production:

```bash
npm run build
# or
pnpm build
# or
yarn build
# or
bun run build
```

Preview production build:

```bash
npm run preview
# or
pnpm preview
# or
yarn preview
# or
bun run preview
```

## 📁 Project Structure

```
tokoto/
├── app/
│   ├── components/          # Vue components
│   │   ├── AppHeader.vue    # Main navigation
│   │   ├── AppFooter.vue    # Footer component
│   │   ├── ProductCard.vue  # Product display
│   │   ├── ShoppingCart.vue # Cart functionality
│   │   ├── Modal.vue        # Custom modal system
│   │   └── ...
│   ├── pages/               # Application routes
│   │   ├── index.vue        # Home page
│   │   ├── checkout.vue     # Checkout process
│   │   ├── wallet.vue       # Wallet management
│   │   ├── login.vue        # Authentication
│   │   └── product/
│   │       └── [id].vue     # Product details
│   ├── stores/              # Pinia state stores
│   │   ├── auth.ts          # Authentication store
│   │   ├── cart.ts          # Shopping cart store
│   │   ├── products.ts      # Product catalog store
│   │   └── wallet.ts        # Wallet management store
│   ├── layouts/             # Page layouts
│   │   └── default.vue      # Main layout
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Global type definitions
│   └── assets/              # Static assets
│       └── css/
│           └── main.css     # Global styles
├── public/                  # Public assets
├── server/                  # Server-side code
└── nuxt.config.ts          # Nuxt configuration
```

## 🛠️ Tech Stack

### **Frontend Framework**
- **[Nuxt 4](https://nuxt.com/)** - The Intuitive Vue Framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript Framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type Safety

### **Styling & UI**
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS Framework
- **[Heroicons](https://heroicons.com/)** - Beautiful hand-crafted SVG icons
- **[Nuxt UI](https://ui.nuxt.com/)** - UI Library for Nuxt

### **State Management**
- **[Pinia](https://pinia.vuejs.org/)** - The Vue Store that you will enjoy using

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[PostCSS](https://postcss.org/)** - CSS transformation tool

### **Notifications**
- **[Vue3 Toastify](https://vue3-toastify.js-bridge.com/)** - Toast notifications

## 🎮 Usage Guide

### **Shopping Experience**
1. **Browse Products** - View products with filtering and search
2. **Add to Cart** - Add items with quantity selection
3. **Checkout** - Complete purchase using wallet balance
4. **Track Orders** - View purchase history in wallet

### **Wallet Management**
1. **Top Up Balance** - Add funds to your digital wallet
2. **View Transactions** - Track all wallet activity
3. **Purchase Items** - Pay using wallet balance
4. **Analytics** - Monitor spending patterns

### **Authentication**
1. **Register Account** - Create new user account
2. **Login** - Access your personal dashboard
3. **Protected Access** - Secure checkout and wallet features

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the root directory:

```env
# API Configuration
NUXT_API_BASE_URL=https://fakestoreapi.com

# App Configuration
NUXT_APP_NAME=TokoTo
NUXT_APP_DESCRIPTION=Modern E-Commerce Platform
```

### **Customization**
- **Colors**: Edit `tailwind.config.js` for theme customization
- **Layouts**: Modify `app/layouts/` for different page structures
- **Components**: Extend `app/components/` for new functionality

## 🚀 Deployment

### **Static Site Generation**
```bash
npm run generate
```

### **Server-Side Rendering**
```bash
npm run build
npm run preview
```

### **Platform Deployment**
- **Vercel**: Auto-deploy with Git integration
- **Netlify**: JAMstack deployment
- **Cloudflare Pages**: Edge deployment
- **AWS/GCP/Azure**: Custom server deployment

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[FakeStore API](https://fakestoreapi.com/)** - Product data provider
- **[Nuxt Team](https://nuxt.com/)** - Amazing framework
- **[Vue.js Team](https://vuejs.org/)** - Reactive framework
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS

---

<div align="center">
  <p>Built with ❤️ using Nuxt 4 and Vue 3</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
