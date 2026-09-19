export type NotificationType =
  | "success"
  | "warning"
  | "info"
  | "error";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
};

export type NotificationResponse = {
  items: Notification[];
  unreadCount: number;
};

export type NotificationFilters = {
  unreadOnly?: boolean;
  limit?: number;
};