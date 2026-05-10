export interface CartItemCourse {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl?: string | null;
  instructorName?: string;
  level?: string;
  totalLectures?: number;
  totalDuration?: number;
}

export interface CartItem {
  courseId: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  courseTitle?: string;
  courseThumbnailUrl?: string | null;
  instructorName?: string;
  course?: CartItemCourse;
}

export interface Cart {
  id?: string;
  userId?: string;
  currency?: string;
  items: CartItem[];
  subtotal?: number;
  discount?: number;
  total?: number;
  couponCode?: string | null;
  couponDiscount?: number;
}

export interface OrderItem {
  courseId: string;
  price?: number;
  currency?: string;
  courseTitle?: string;
  unitPrice?: number;
  finalPrice?: number;
  instructorName?: string;
  courseThumbnailUrl?: string | null;
  course?: CartItemCourse;
}

export interface Order {
  id: string;
  userId?: string;
  currency?: string;
  items: OrderItem[];
  transactions?: Transaction[];
  subtotal?: number;
  discount?: number;
  total?: number;
  totalAmount?: number;
  subtotalAmount?: number;
  discountAmount?: number;
  status?: string;
  provider?: string;
  idempotencyKey?: string;
  paidAt?: string | null;
  cancelledAt?: string | null;
  failedAt?: string | null;
  refundedAt?: string | null;
  failureReason?: string | null;
  sourceCartId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderListResponse {
  items?: Order[];
  data?: Order[];
  total?: number;
  page?: number;
  limit?: number;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface Transaction {
  id: string;
  orderId: string;
  status?: string;
  provider?: string;
  amount?: number;
  currency?: string;
  providerPaymentUrl?: string | null;
  providerRef?: string | null;
  paidAt?: string | null;
  createdAt?: string;
}

export interface SimulatePaymentResponse {
  acknowledged: boolean;
  simulated: boolean;
  status: "success" | "failed" | "cancelled";
  orderId: string;
  order?: Order;
  transaction?: Transaction;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isActive?: boolean;
  expiresAt?: string | null;
  minOrderValue?: number;
  maxUsage?: number;
}

export type PaymentMethod = "vnpay" | "stripe" | "momo" | "paypal" | "free";
