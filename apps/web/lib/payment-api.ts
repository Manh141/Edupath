import { apiRequest } from "./api-client";
import type {
  Cart,
  CartItem,
  CartItemCourse,
  Coupon,
  Order,
  OrderItem,
  OrderListResponse,
  SimulatePaymentResponse,
  Transaction,
} from "@/types/payment";

export { ApiError } from "./api-client";

type ApiCartItem = Partial<CartItem> & {
  courseId: string;
  price?: number;
  originalPrice?: number;
  unitPrice?: number;
  currency?: string;
  courseTitle?: string;
  courseThumbnailUrl?: string | null;
  instructorName?: string;
  course?: Partial<CartItemCourse>;
};

type ApiCart = Partial<Cart> & {
  id?: string;
  userId?: string;
  currency?: string;
  couponCode?: string | null;
  subtotal?: number;
  discount?: number;
  couponDiscount?: number;
  total?: number;
  items?: ApiCartItem[];
};

type ApiOrderItem = Partial<OrderItem> & {
  courseId: string;
  price?: number;
  unitPrice?: number;
  finalPrice?: number;
  currency?: string;
  courseTitle?: string;
  courseThumbnailUrl?: string | null;
  instructorName?: string;
  course?: Partial<CartItemCourse>;
};

type ApiTransaction = Transaction & {
  providerPaymentUrl?: string | null;
};

type ApiOrder = Partial<Order> & {
  id: string;
  subtotal?: number;
  discount?: number;
  total?: number;
  subtotalAmount?: number;
  discountAmount?: number;
  totalAmount?: number;
  currency?: string;
  provider?: string;
  items?: ApiOrderItem[];
  transactions?: ApiTransaction[];
};

function normalizeCartCourse(
  courseId: string,
  item: {
    courseTitle?: string;
    courseThumbnailUrl?: string | null;
    instructorName?: string;
    course?: Partial<CartItemCourse>;
  },
): CartItemCourse {
  return {
    id: item.course?.id ?? courseId,
    slug: item.course?.slug ?? "",
    title: item.course?.title ?? item.courseTitle ?? "Untitled course",
    thumbnailUrl:
      item.course?.thumbnailUrl ?? item.courseThumbnailUrl ?? null,
    instructorName:
      item.course?.instructorName ?? item.instructorName ?? undefined,
    level: item.course?.level,
    totalLectures: item.course?.totalLectures,
    totalDuration: item.course?.totalDuration,
  };
}

function normalizeCartItem(item: ApiCartItem): CartItem {
  return {
    courseId: item.courseId,
    price: item.price ?? item.unitPrice ?? 0,
    originalPrice: item.originalPrice ?? item.unitPrice ?? item.price ?? 0,
    course: normalizeCartCourse(item.courseId, item),
  };
}

function normalizeCart(cart: ApiCart): Cart {
  const items = (cart.items ?? []).map(normalizeCartItem);
  const subtotal =
    cart.subtotal ?? items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const discount = cart.discount ?? cart.couponDiscount ?? 0;

  return {
    ...cart,
    items,
    subtotal,
    discount,
    couponDiscount: discount,
    total: cart.total ?? Math.max(0, subtotal - discount),
    couponCode: cart.couponCode ?? null,
  };
}

function normalizeOrderItem(item: ApiOrderItem): OrderItem {
  return {
    ...item,
    price: item.price ?? item.finalPrice ?? item.unitPrice ?? 0,
    unitPrice: item.unitPrice ?? item.price ?? item.finalPrice ?? 0,
    finalPrice: item.finalPrice ?? item.price ?? item.unitPrice ?? 0,
    course: normalizeCartCourse(item.courseId, item),
  };
}

function normalizeOrder(order: ApiOrder): Order {
  const transactions = order.transactions ?? [];
  const latestTransaction = transactions[0];
  const items = (order.items ?? []).map(normalizeOrderItem);

  return {
    ...order,
    items,
    subtotal: order.subtotal ?? order.subtotalAmount ?? 0,
    discount: order.discount ?? order.discountAmount ?? 0,
    total:
      order.total ??
      order.totalAmount ??
      (order.subtotalAmount ?? 0) - (order.discountAmount ?? 0),
    provider: order.provider ?? latestTransaction?.provider,
  } as Order;
}

function normalizeOrderListResponse(response: OrderListResponse): OrderListResponse {
  const items = (response.items ?? response.data ?? []).map((order) =>
    normalizeOrder(order as ApiOrder),
  );

  return {
    ...response,
    items,
    data: items,
    total: response.total ?? response.meta?.total ?? items.length,
    page: response.page ?? response.meta?.page,
    limit: response.limit ?? response.meta?.limit,
  };
}

export const cartApi = {
  getMyCart(accessToken: string) {
    return apiRequest<ApiCart>("/api/carts/me", { accessToken }).then(normalizeCart);
  },

  addItem(courseId: string, accessToken: string) {
    return apiRequest<ApiCart>("/api/carts/me/items", {
      method: "POST",
      body: { courseId },
      accessToken,
    }).then(normalizeCart);
  },

  removeItem(courseId: string, accessToken: string) {
    return apiRequest<ApiCart>(`/api/carts/me/items/${courseId}`, {
      method: "DELETE",
      accessToken,
    }).then(normalizeCart);
  },

  applyCoupon(code: string, accessToken: string) {
    return apiRequest<ApiCart>("/api/carts/me/coupon", {
      method: "PATCH",
      body: { code },
      accessToken,
    }).then(normalizeCart);
  },

  clearCoupon(accessToken: string) {
    return apiRequest<ApiCart>("/api/carts/me/coupon", {
      method: "DELETE",
      accessToken,
    }).then(normalizeCart);
  },
};

export const orderApi = {
  checkout(
    dto: { provider: string; courseId?: string; idempotencyKey?: string },
    accessToken: string,
  ) {
    return apiRequest<ApiOrder>("/api/orders/me/checkout", {
      method: "POST",
      body: dto,
      accessToken,
    }).then(normalizeOrder);
  },

  listMyOrders(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      sortBy?: string;
    } = {},
    accessToken: string,
  ) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.status) query.set("status", params.status);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    const qs = query.toString();
    return apiRequest<OrderListResponse>(
      `/api/orders/me${qs ? `?${qs}` : ""}`,
      { accessToken },
    ).then(normalizeOrderListResponse);
  },

  getOrder(orderId: string, accessToken: string) {
    return apiRequest<ApiOrder>(`/api/orders/${orderId}`, { accessToken }).then(
      normalizeOrder,
    );
  },
};

export const paymentApi = {
  getTransaction(transactionId: string, accessToken: string) {
    return apiRequest<Transaction>(
      `/api/payments/transactions/${transactionId}`,
      { accessToken },
    );
  },

  simulateTransaction(
    transactionId: string,
    body: {
      status: "success" | "failed" | "cancelled";
      providerRef?: string;
      failureReason?: string;
    },
    accessToken: string,
  ) {
    return apiRequest<SimulatePaymentResponse>(
      `/api/payments/transactions/${transactionId}/simulate`,
      {
        method: "POST",
        body,
        accessToken,
      },
    );
  },
};

export const couponApi = {
  getCoupon(code: string) {
    return apiRequest<Coupon>(`/api/coupons/${code}`);
  },
};
