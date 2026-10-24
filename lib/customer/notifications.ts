import { randomUUID } from "node:crypto";
import {
  read,
  write,
  exclusive,
  ApiError,
  DEFAULT_CUSTOMER_USER_ID,
  DEFAULT_CUSTOMER_TENANT_ID,
} from "./store";

export type NotificationCategory =
  | "Progress Updates"
  | "Invoices & Payments"
  | "Inspections"
  | "Warranty"
  | "System";

export interface CustomerNotification {
  id: string;
  user_id: string;
  tenant_id?: string;
  title: string;
  description: string;
  time: string;
  created_at?: string;
  category: NotificationCategory;
  read: boolean;
  priority?: string | null;
  resolved?: boolean | null;
  reply_text?: string | null;
  source_entity_type?: string | null;
  source_entity_id?: string | null;
}

export interface NotificationItem {
  id: string | number;
  title: string;
  description: string;
  time: string;
  category: NotificationCategory;
  read: boolean;
  created_at?: string;
}

export interface ChannelState {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

function normalizeCategory(category?: string): NotificationCategory {
  if (!category) return "Progress Updates";
  const validCategories: NotificationCategory[] = [
    "Progress Updates",
    "Invoices & Payments",
    "Inspections",
    "Warranty",
    "System",
  ];
  const found = validCategories.find(
    (c) => c.toLowerCase() === category.toLowerCase()
  );
  return found ?? "Progress Updates";
}

function mapToItem(row: CustomerNotification): NotificationItem {
  return {
    id: row.id,
    title: row.title || "Notification",
    description: row.description || "",
    time: row.time || (row.created_at ? new Date(row.created_at).toLocaleDateString() : "Just now"),
    category: normalizeCategory(row.category),
    read: Boolean(row.read),
    created_at: row.created_at,
  };
}

// ── 1. READ (GET NOTIFICATIONS) ──
export async function getCustomerNotifications(
  userId: string = DEFAULT_CUSTOMER_USER_ID
): Promise<NotificationItem[]> {
  const rows = await read("notifications");
  const userNotifications = rows
    .filter((n) => n.user_id === userId)
    .map((n) => mapToItem(n as CustomerNotification));

  return userNotifications;
}

// ── 2. CREATE (POST NOTIFICATION) ──
export async function createCustomerNotification(
  userId: string = DEFAULT_CUSTOMER_USER_ID,
  data: {
    title: string;
    description: string;
    category?: string;
    tenantId?: string;
    time?: string;
  }
): Promise<NotificationItem> {
  return exclusive(async () => {
    const rows = await read("notifications");
    const now = new Date().toISOString();
    const newRecord: CustomerNotification = {
      id: `n-${randomUUID().slice(0, 8)}`,
      user_id: userId,
      tenant_id: data.tenantId || DEFAULT_CUSTOMER_TENANT_ID,
      title: data.title,
      description: data.description,
      time: data.time || "Just now",
      created_at: now,
      category: normalizeCategory(data.category),
      read: false,
      priority: null,
      resolved: null,
      reply_text: null,
      source_entity_type: null,
      source_entity_id: null,
    };

    rows.unshift(newRecord);
    await write("notifications", rows);
    return mapToItem(newRecord);
  });
}

// ── 3. UPDATE (PUT/PATCH NOTIFICATION) ──
export async function updateCustomerNotification(
  userId: string = DEFAULT_CUSTOMER_USER_ID,
  id: string | number,
  updates: Partial<{
    read: boolean;
    title: string;
    description: string;
    category: string;
  }>
): Promise<NotificationItem> {
  return exclusive(async () => {
    const rows = await read("notifications");
    const idStr = String(id);
    const target = rows.find((n) => String(n.id) === idStr && n.user_id === userId);

    if (!target) {
      throw new ApiError(404, `Notification with ID ${id} not found`);
    }

    if (updates.read !== undefined) target.read = updates.read;
    if (updates.title !== undefined) target.title = updates.title;
    if (updates.description !== undefined) target.description = updates.description;
    if (updates.category !== undefined) target.category = normalizeCategory(updates.category);

    await write("notifications", rows);
    return mapToItem(target as CustomerNotification);
  });
}

// ── 4. MARK ALL AS READ ──
export async function markAllNotificationsAsRead(
  userId: string = DEFAULT_CUSTOMER_USER_ID
): Promise<{ success: boolean; updatedCount: number }> {
  return exclusive(async () => {
    const rows = await read("notifications");
    let count = 0;

    for (const item of rows) {
      if (item.user_id === userId && !item.read) {
        item.read = true;
        count++;
      }
    }

    await write("notifications", rows);
    return { success: true, updatedCount: count };
  });
}

// ── 5. DELETE NOTIFICATION ──
export async function deleteCustomerNotification(
  userId: string = DEFAULT_CUSTOMER_USER_ID,
  id: string | number
): Promise<boolean> {
  return exclusive(async () => {
    const rows = await read("notifications");
    const idStr = String(id);
    const initialLength = rows.length;
    const remaining = rows.filter(
      (n) => !(String(n.id) === idStr && n.user_id === userId)
    );

    if (remaining.length === initialLength) {
      throw new ApiError(404, `Notification with ID ${id} not found`);
    }

    await write("notifications", remaining);
    return true;
  });
}

// ── 6. GET CHANNELS ──
export async function getCustomerChannels(
  userId: string = DEFAULT_CUSTOMER_USER_ID
): Promise<ChannelState> {
  const rows = await read("settings");
  const userSetting = rows.find((s) => s.user_id === userId);

  if (userSetting?.channels) {
    return {
      inApp: userSetting.channels.inApp ?? true,
      email: userSetting.channels.email ?? true,
      push: userSetting.channels.push ?? true,
    };
  }

  // Fallback to settings.notifications if available
  if (userSetting?.notifications) {
    return {
      inApp: userSetting.notifications.inApp ?? true,
      email: userSetting.notifications.email ?? true,
      push: userSetting.notifications.push ?? false,
    };
  }

  return {
    inApp: true,
    email: true,
    push: true,
  };
}

// ── 7. UPDATE CHANNELS ──
export async function updateCustomerChannels(
  userId: string = DEFAULT_CUSTOMER_USER_ID,
  channels: Partial<ChannelState>
): Promise<ChannelState> {
  return exclusive(async () => {
    const rows = await read("settings");
    let userSetting = rows.find((s) => s.user_id === userId);

    if (!userSetting) {
      userSetting = {
        user_id: userId,
        general: {},
        notifications: {},
        channels: { inApp: true, email: true, push: true },
        security: { two_factor_enabled: false },
        site_preferences: null,
      };
      rows.push(userSetting);
    }

    const currentChannels = await getCustomerChannels(userId);
    const updatedChannels: ChannelState = {
      ...currentChannels,
      ...channels,
    };

    userSetting.channels = updatedChannels;
    if (userSetting.notifications) {
      if (channels.email !== undefined) userSetting.notifications.email = channels.email;
      if (channels.push !== undefined) userSetting.notifications.push = channels.push;
      if (channels.inApp !== undefined) userSetting.notifications.inApp = channels.inApp;
    }

    await write("settings", rows);
    return updatedChannels;
  });
}
