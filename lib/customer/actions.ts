"use server";

import { getCurrentUser } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import {
    getCustomerProfile,
    updateCustomerProfile,
    updateCustomerPassword
} from "./customerProfile";
import {
    getCustomerSettings,
    updateCustomerSettings
} from "./customerSettings";
import { CustomerProfile, CustomerSettings } from "../types/types";

// 1. Fetch current customer profile
export async function fetchCustomerProfileAction(): Promise<CustomerProfile | null> {
    const user = await getCurrentUser();
    if (!user) return null;
    return await getCustomerProfile(user.id);
}

// 2. Save customer profile updates
export async function saveCustomerProfileAction(
    data: Partial<CustomerProfile>
): Promise<{ success: boolean; error?: string; profile?: CustomerProfile }> {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const updated = await updateCustomerProfile(user.id, data);
        revalidatePath("/customer/profile");
        return { success: true, profile: updated };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// 3. Change password action
export async function changePasswordAction(
    currentPass: string,
    newPass: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        if (user.password !== currentPass) {
            return { success: false, error: "Incorrect current password." };
        }

        await updateCustomerPassword(user.id, newPass);
        revalidatePath("/customer/profile");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// 4. Fetch current customer settings
export async function fetchCustomerSettingsAction(): Promise<CustomerSettings | null> {
    const user = await getCurrentUser();
    if (!user) return null;
    return await getCustomerSettings(user.id);
}

// 5. Save customer settings updates
export async function saveCustomerSettingsAction(
    data: Partial<CustomerSettings>
): Promise<{ success: boolean; error?: string; settings?: CustomerSettings }> {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const updated = await updateCustomerSettings(user.id, data);
        revalidatePath("/customer/settings");
        revalidatePath("/customer/profile");
        return { success: true, settings: updated };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// 6. Export customer data bundle (profile + settings)
export async function exportCustomerDataAction(): Promise<{
    success: boolean;
    data?: { profile: CustomerProfile | null; settings: CustomerSettings | null };
    error?: string;
}> {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const profile = await getCustomerProfile(user.id);
        const settings = await getCustomerSettings(user.id);
        return { success: true, data: { profile, settings } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

