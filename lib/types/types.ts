import { IconName } from "../Icons/icons";

export interface NavbarProps {
    id: string;
    name: string;
    url: string;
    icon: IconName;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password?: string;
    status?: "Active" | "Pending" | "Suspended";
    role: string;
    companyId?: string;
}

export interface CompanyUser {
    user: User;
    companyId: string;
}

export interface StageTemplateChecklistItem {
    id: string;
    label: string;
}

export interface StageTemplate {
    id: string;
    name: string;
    description?: string;
    weight: number;
    checklist: StageTemplateChecklistItem[];
}

export interface Userdetails {
    username: string;
}

export interface Login {
    user: User;
}

export interface Register {
    user: User;
    role: string;
}

export interface Session {
    id: string;
    userId: string;
    createdAt: string;
    expiresAt: string;
}

export interface Company {
    companyUser: User;
    tenant_id: string;
}

export interface Trade {
    tradeUser: User;
}

export interface Customer {
    customerUser: User;
}

export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
    revokeSessions: boolean;
}

export interface CustomerProfile {
    userId: string;              // Links to User.id in users.json
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    homeAddress: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    preferredLanguage: string;
    timeZone: string;
    accountCreatedAt: string;
    passwordUpdatedAt?: string;
    linkedAccounts?: {
        provider: string;
        connected: boolean;
        email?: string;
    }[];
    updatedAt?: string;
}

export interface CustomerGeneralSettings {
    language: string;
    timeZone: string;
    dateFormat: string;
    currency: string;
    measurement: string;
}

export interface CustomerNotificationSettings {
    projectUpdates: boolean;
    invoiceReminders: boolean;
    aiNotifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

export interface CustomerSecuritySettings {
    twoFactorEnabled: boolean;
}

export interface CustomerPrivacySettings {
    profileVisibility: string;
    dataSharing: boolean;
}

export interface CustomerBillingSettings {
    plan: string;
    billingEmail: string;
    paymentMethod: string;
    billingCycle: string;
}

export interface CustomerSettings {
    userId: string;
    general: CustomerGeneralSettings;
    notifications: CustomerNotificationSettings;
    security: CustomerSecuritySettings;
    privacy: CustomerPrivacySettings;
    billing: CustomerBillingSettings;
    updatedAt?: string;
}