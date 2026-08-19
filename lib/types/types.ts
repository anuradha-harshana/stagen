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
    password: string;
    role: string;
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