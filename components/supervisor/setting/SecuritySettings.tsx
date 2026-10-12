"use client";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupervisorData, supervisorRequest, DataState } from "../useSupervisorData";

export default function SecuritySettings() {
  const api = useSupervisorData<{ security: { two_factor_enabled: boolean } } | null>("settings", null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  if (api.loading || api.error || !api.data) return <DataState loading={api.loading} error={api.error} />;
  return <div className="bg-white border rounded-xl p-6 space-y-6 w-full max-w-2xl text-blue-fantastic">
    <h2 className="font-bold">Security Settings</h2>
    <form className="space-y-3" onSubmit={async e => {
      e.preventDefault();
      if (await api.mutate("PUT", { currentPassword, newPassword }, "security")) { setCurrentPassword(""); setNewPassword(""); }
    }}>
      <label className="block">Current password<Input type="password" autoComplete="current-password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></label>
      <label className="block">New password<Input type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} /></label>
      <Button disabled={api.saving}>Change password</Button>
    </form>
    <label className="flex gap-2"><input type="checkbox" checked={api.data.security.two_factor_enabled} disabled={api.saving} onChange={e => { void api.mutate("PATCH", { section: "security", values: { two_factor_enabled: e.target.checked } }); }} />Two-factor authentication preference</label>
    <p className="text-sm">This mock database stores your preference. Sign-in verification is not configured.</p>
    <Button variant="outline" disabled={api.saving} onClick={async () => { try { await supervisorRequest("security", "DELETE"); window.location.href = "/login"; } catch (e) { toast.error(e instanceof Error ? e.message : "Unable to log out"); } }}>Log out all devices</Button>
  </div>;
}
