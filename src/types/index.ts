export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  brand: string;
  status: boolean;
  categoryId: number;
  categoryName: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AddressResponse {
  id: number;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  salePrice: number;
  quantity: number;
  subTotal: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemResponse[];
  totalItems: number;
  totalAmount: number;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItemResponse[];
  shippingAddress: AddressResponse;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export interface ReviewResponse {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CouponResponse {
  id: number;
  code: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface InventoryResponse {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  availableQuantity: number;
  reservedQuantity: number;
}

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface WishlistResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  salePrice: number;
}

export interface ReportResponse {
  reportType: string;
  data: Record<string, unknown>;
  generatedAt: string;
}

export interface ProductImageResponse {
  id: number;
  imageUrl: string;
}
