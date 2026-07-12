export interface Category {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  active: boolean;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  images: string; // JSON array string
  categoryId: string;
  brand?: string;
  mrp: number;
  price: number;
  discount: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  name: string;
  mobile: string;
  address: string;
  pincode: string;
  landmark?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  totalRevenue: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  bgColor: string;
  link?: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
