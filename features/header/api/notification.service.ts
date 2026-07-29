import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  INotification,
  INotificationsResponse,
} from "@/core/types/user.types";

type NotificationsApiResponse =
  | INotificationsResponse
  | INotification[]
  | { data: INotification[] };

function isWrappedList(
  response: NotificationsApiResponse,
): response is { data: INotification[] } {
  return (
    typeof response === "object" &&
    response !== null &&
    !Array.isArray(response) &&
    "data" in response &&
    Array.isArray(response.data)
  );
}

function isNotificationsResponse(
  response: NotificationsApiResponse,
): response is INotificationsResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    !Array.isArray(response) &&
    "notifications" in response
  );
}

function normalizeNotifications(
  response: NotificationsApiResponse,
): INotificationsResponse {
  if (Array.isArray(response)) {
    return {
      notifications: response,
      totalCount: response.length,
      unreadCount: response.filter((item) => !item.is_read).length,
    };
  }

  if (isWrappedList(response)) {
    return {
      notifications: response.data,
      totalCount: response.data.length,
      unreadCount: response.data.filter((item) => !item.is_read).length,
    };
  }

  if (isNotificationsResponse(response)) {
    const notifications = response.notifications ?? [];
    return {
      notifications,
      totalCount: response.totalCount ?? notifications.length,
      unreadCount: response.unreadCount ?? 0,
    };
  }

  return {
    notifications: [],
    totalCount: 0,
    unreadCount: 0,
  };
}

export const notificationService = {
  async list() {
    const response = await clientRequest<NotificationsApiResponse>({
      url: ENDPOINTS.notification.list,
      method: "GET",
    });

    return normalizeNotifications(response);
  },
};
