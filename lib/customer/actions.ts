"use server";

import { getCurrentUser } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import {
    getCustomerProfile,
    updateCustomerProfile,
    updateCustomerPassword
} from "./customerProfile";
import { CustomerProfile } from "../types/types";

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
