export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Transaction {
  id: string
  type: 'topup' | 'purchase' | 'refund'
  amount: number
  description: string
  timestamp: Date
  productId?: number
}

export interface WalletState {
  balance: number
  transactions: Transaction[]
}

export interface LoadingState {
  products: boolean
  purchase: boolean
  topup: boolean
}

export interface ErrorState {
  products: string | null
  purchase: string | null
  topup: string | null
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  loading: boolean
}

export interface FilterOptions {
  category: string
  priceRange: {
    min: number
    max: number
  }
  rating: number
}

export interface SearchState {
  query: string
  filters: FilterOptions
  sortBy: 'price' | 'rating' | 'name'
  sortOrder: 'asc' | 'desc'
}
