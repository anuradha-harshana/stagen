"use client";

import React, { useEffect, useState } from "react";
import { 
  UserRoundPen, 
  Search, 
  UserPlus, 
  Building2, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  UserCheck,
  UserX,
  Pencil,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { OrganizationUser } from "@/lib/company/organizationUsers"; 
import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";

export default function CompanyUsersPage() {

const [users, setUsers] = useState<OrganizationUser[]>([]);
const [isLoading, setIsLoading] = useState(true);

const loadUsers = async () => {
  try {
    const res = await fetch("/api/company/users");
    if (!res.ok) throw new Error("Failed to load users");
    const data = await res.json();
    setUsers(data.users);
  } catch (err) {
    showNotification("Error loading users");
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  loadUsers();
}, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;

    const bgColors = ["bg-burning-flame", "bg-blue-fantastic", "bg-truffle-trouble"];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const payload = {
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      phone: inviteForm.phone.trim() || "+61 400 000 000",
      role: inviteForm.role,
      status: "Pending" as const,
      assignedProjectsCount: inviteForm.assignedProjects.trim() ? 1 : 0,
      assignedProjects: inviteForm.assignedProjects.trim() ? [inviteForm.assignedProjects.trim()] : ["Unassigned"],
      avatarBg: randomBg,
    };

  const res = await fetch("/api/company/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const { user } = await res.json();
    setUsers((prev) => [user, ...prev]);
    setIsInviteOpen(false);
    setInviteForm({ name: "", email: "", phone: "", role: "Site Supervisor", assignedProjects: "" });
    showNotification(`User invitation sent to ${user.email}`);
  }
};


  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Site Supervisor" as OrganizationUser["role"],
    assignedProjects: ""
  });

  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "Site Supervisor" as OrganizationUser["role"],
    assignedProjects: ""
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openEditModal = (user: OrganizationUser) => {
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      assignedProjects: user.assignedProjects.join(", ")
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) return;

    const projectList = editForm.assignedProjects
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const updates: Partial<OrganizationUser> = {
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim() || "+61 400 000 000",
      role: editForm.role,
      assignedProjects: projectList.length > 0 ? projectList : ["Unassigned"],
      assignedProjectsCount: projectList.length
    };

    try {
      const res = await fetch("/api/company/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editForm.id, updates })
      });

      if (!res.ok) throw new Error("Failed to update user");

      const { user: updated } = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setSelectedUser((prev) => (prev && prev.id === updated.id ? updated : prev));
      setIsEditOpen(false);
      showNotification(`User details for '${updated.name}' updated successfully.`);
    } catch (err) {
      showNotification("Failed to update user details.");
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query) ||
      u.phone.toLowerCase().includes(query) ||
      u.assignedProjects.some((p) => p.toLowerCase().includes(query));
    
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = async (user: OrganizationUser) => {
    const newStatus: OrganizationUser["status"] = user.status === "Suspended" ? "Active" : "Suspended";

    const res = await fetch("/api/company/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, updates: { status: newStatus } }),
    });

    if (res.ok) {
      const { user: updated } = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setSelectedUser(updated);
      showNotification(
        newStatus === "Suspended"
          ? `User account '${user.name}' has been suspended.`
          : `User account '${user.name}' has been reactivated.`
      );
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to permanently remove this suspended user?")) return;
    try {
      const res = await fetch(`/api/company/users?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setSelectedUser((prev) => (prev?.id === id ? null : prev));
        showNotification("Suspended user account permanently deleted.");
      } else {
        showNotification("Failed to delete user account.");
      }
    } catch (err) {
      showNotification("Failed to delete user account.");
    }
  };


  const totalAssignedSites = users.reduce((acc, u) => acc + (u.assignedProjectsCount || 0), 0);

  return (
    <div className={PAGE_SHELL_CLASS}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-blue-fantastic text-palladian px-4 py-3 rounded-xl shadow-lg border border-burning-flame/30 flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-burning-flame" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        icon={<UserRoundPen className="h-5 w-5 text-burning-flame" />}
        title="Organization Directory & User Management"
        subtitle="Manage site supervisors, executive management accounts, and trade contractor permissions"
        rightContent={
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold h-9 rounded-xl shadow-sm"
          >
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Invite New User
          </Button>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center shrink-0">
              <UserRoundPen className="h-5 w-5 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Total Active Users</p>
              <h3 className="text-xl font-bold text-blue-fantastic mt-0.5">{users.length} Users</h3>
              <p className="text-[10px] text-blue-fantastic/50">Across company & field sites</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-truffle-trouble/15 border border-truffle-trouble/20 flex items-center justify-center shrink-0">
              <Briefcase className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Site Supervisors</p>
              <h3 className="text-xl font-bold text-blue-fantastic mt-0.5">
                {users.filter((u) => u.role === "Site Supervisor").length} Supervisors
              </h3>
              <p className="text-[10px] text-blue-fantastic/50">Managing live build timelines</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Pending Invites</p>
              <h3 className="text-xl font-bold text-blue-fantastic mt-0.5">
                {users.filter((u) => u.status === "Pending").length} Pending
              </h3>
              <p className="text-[10px] text-blue-fantastic/50">Awaiting account registration</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Active Build Coverage</p>
              <h3 className="text-xl font-bold text-blue-fantastic mt-0.5">{totalAssignedSites} Projects</h3>
              <p className="text-[10px] text-blue-fantastic/50">100% supervisor assigned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main User Directory Table */}
      <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
        <CardHeader className="pb-4 border-b border-blue-fantastic/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-blue-fantastic">
              User Directory & Role Assignments
            </CardTitle>
            <CardDescription className="text-xs text-blue-fantastic/60 mt-0.5">
              Filter personnel by role, search details, or adjust supervisor project coverage
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-fantastic/40 pointer-events-none" />
              <Input
                placeholder="Search user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-8 text-xs font-sans w-52 focus-visible:ring-truffle-trouble"
              />
            </div>

            <div className="flex gap-1 bg-blue-fantastic/8 p-0.5 rounded-xl border border-blue-fantastic/10 overflow-x-auto">
              {["All", "Executive Management", "Site Supervisor", "Trade Contractor"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                    roleFilter === role
                      ? "bg-blue-fantastic text-palladian shadow-sm"
                      : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter users by account status"
              className="bg-white border border-blue-fantastic/15 text-blue-fantastic text-xs rounded-xl h-8 px-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-truffle-trouble"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-fantastic/5 border-b border-blue-fantastic/10 text-blue-fantastic/70 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User Info</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Assigned Projects</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-fantastic/10">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-blue-fantastic/50">
                      <Clock className="h-7 w-7 mx-auto mb-2 text-blue-fantastic/40 animate-spin" />
                      <p className="font-semibold text-sm text-blue-fantastic/80">Loading organization users...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-blue-fantastic/50">
                      <UserRoundPen className="h-8 w-8 mx-auto mb-2 text-blue-fantastic/30" />
                      <p className="font-semibold text-sm text-blue-fantastic/80">No matching users found</p>
                      <p className="text-xs text-blue-fantastic/50 mt-1">Try adjusting your search keywords or role filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-fantastic/3 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full ${user.avatarBg} flex items-center justify-center text-palladian font-bold text-xs shrink-0 shadow-sm`}>
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-blue-fantastic text-xs">{user.name}</p>
                            <p className="text-[11px] text-blue-fantastic/60 font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] bg-blue-fantastic/5 border-blue-fantastic/15 text-blue-fantastic font-bold">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-blue-fantastic/80 font-medium">
                        {user.phone}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-blue-fantastic font-mono">{user.assignedProjectsCount} sites</span>
                          <span className="text-[10px] text-blue-fantastic/50 truncate max-w-[130px]">
                            ({user.assignedProjects.slice(0, 2).join(", ")})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={`text-[10px] px-2 py-0.5 border font-bold ${
                            user.status === "Active"
                              ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30"
                              : user.status === "Pending"
                              ? "bg-burning-flame/20 text-truffle-trouble border-burning-flame/40"
                              : "bg-red-100 text-red-700 border-red-300"
                          }`}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-blue-fantastic/60 font-medium">
                        {user.lastActive}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(user)}
                            title="Edit User Details"
                            className="h-7 w-7 p-0 text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/10 rounded-lg"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          {user.status === "Suspended" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete Suspended User"
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedUser(user)}
                            className="h-7 text-xs text-truffle-trouble hover:bg-truffle-trouble/10 font-semibold"
                          >
                            Inspect User
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Inspector Modal */}
      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        {selectedUser && (
          <DialogContent className="max-w-xl bg-white text-blue-fantastic font-sans border border-blue-fantastic/20">
            <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full ${selectedUser.avatarBg} flex items-center justify-center text-palladian font-bold text-sm shrink-0 shadow-sm`}>
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-blue-fantastic">
                    {selectedUser.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-blue-fantastic/60 font-semibold mt-0.5">
                    {selectedUser.role} • {selectedUser.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="grid grid-cols-2 gap-3 text-xs bg-blue-fantastic/5 p-3 rounded-xl border border-blue-fantastic/10">
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">Phone Number</span>
                  <span className="text-blue-fantastic font-bold">{selectedUser.phone}</span>
                </div>
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">Account Status</span>
                  <span className={`font-bold ${selectedUser.status === "Active" ? "text-truffle-trouble" : selectedUser.status === "Pending" ? "text-amber-600" : "text-red-600"}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">Assigned Capacity</span>
                  <span className="text-blue-fantastic font-bold">{selectedUser.assignedProjectsCount} Active Projects</span>
                </div>
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">Last Login Activity</span>
                  <span className="text-blue-fantastic font-bold">{selectedUser.lastActive}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-blue-fantastic/80 uppercase tracking-wider mb-2">
                  Assigned Project Sites
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedUser.assignedProjects.map((proj, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-blue-fantastic/15 rounded-lg text-xs font-semibold text-blue-fantastic flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-truffle-trouble" />
                        {proj}
                      </span>
                      <Badge variant="outline" className="text-[9px] border-blue-fantastic/20 text-blue-fantastic/70">
                        Active Assignment
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 border-t border-blue-fantastic/10 pt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedUser.status === "Suspended" ? "outline" : "destructive"}
                  size="sm"
                  onClick={() => handleToggleStatus(selectedUser)}
                  className="text-xs font-semibold h-8"
                >
                  {selectedUser.status === "Suspended" ? (
                    <>
                      <UserCheck className="mr-1.5 h-3.5 w-3.5 text-truffle-trouble" />
                      Reactivate Account
                    </>
                  ) : (
                    <>
                      <UserX className="mr-1.5 h-3.5 w-3.5" />
                      Suspend Account
                    </>
                  )}
                </Button>

                {selectedUser.status === "Suspended" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    className="text-xs font-semibold h-8 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete User
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(selectedUser)}
                  className="text-xs font-semibold h-8 border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5"
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5 text-blue-fantastic" />
                  Edit Details
                </Button>
                <Button
                  onClick={() => setSelectedUser(null)}
                  className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold h-8"
                >
                  Close Inspector
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md bg-white text-blue-fantastic font-sans border border-blue-fantastic/20">
          <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
            <DialogTitle className="text-lg font-bold text-blue-fantastic flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-truffle-trouble" />
              Invite New User Account
            </DialogTitle>
            <DialogDescription className="text-xs text-blue-fantastic/60">
              Send an email invitation link to join Stagen Build Progress OS
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInviteSubmit} className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Full Name</label>
              <Input
                required
                placeholder="e.g. John Doe"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                className="bg-white border-blue-fantastic/20 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Email Address</label>
              <Input
                required
                type="email"
                placeholder="john@stagenhomes.com.au"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className="bg-white border-blue-fantastic/20 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Phone Number</label>
              <Input
                placeholder="+61 400 000 000"
                value={inviteForm.phone}
                onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                className="bg-white border-blue-fantastic/20 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Role Type</label>
              <select
                value={inviteForm.role}
                onChange={(e: any) => setInviteForm({ ...inviteForm, role: e.target.value })}
                className="w-full bg-white border border-blue-fantastic/20 text-xs font-bold rounded-md h-9 px-3 text-blue-fantastic focus:outline-none"
              >
                <option value="Site Supervisor">Site Supervisor</option>
                <option value="Executive Management">Executive Management</option>
                <option value="Trade Contractor">Trade Contractor</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Initial Project Assignment</label>
              <Input
                placeholder="e.g. Lot 42 Greenvale"
                value={inviteForm.assignedProjects}
                onChange={(e) => setInviteForm({ ...inviteForm, assignedProjects: e.target.value })}
                className="bg-white border-blue-fantastic/20 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
                className="text-xs font-semibold border-blue-fantastic/20 text-blue-fantastic"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold"
              >
                Send Invitation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Details Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md bg-white text-blue-fantastic font-sans border border-blue-fantastic/20">
          <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
            <DialogTitle className="text-lg font-bold text-blue-fantastic flex items-center gap-2">
              <Pencil className="h-5 w-5 text-truffle-trouble" />
              Edit User Details
            </DialogTitle>
            <DialogDescription className="text-xs text-blue-fantastic/60">
              Update organization directory information and role assignments
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Full Name</label>
              <Input
                required
                placeholder="e.g. John Doe"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-white border-blue-fantastic/20 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Email Address</label>
              <Input
                required
                type="email"
                placeholder="john@stagenhomes.com.au"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="bg-white border-blue-fantastic/20 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Phone Number</label>
              <Input
                placeholder="+61 400 000 000"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="bg-white border-blue-fantastic/20 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Role Type</label>
              <select
                value={editForm.role}
                onChange={(e: any) => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full bg-white border border-blue-fantastic/20 text-xs font-bold rounded-md h-9 px-3 text-blue-fantastic focus:outline-none"
              >
                <option value="Site Supervisor">Site Supervisor</option>
                <option value="Executive Management">Executive Management</option>
                <option value="Trade Contractor">Trade Contractor</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">Assigned Projects (comma separated)</label>
              <Input
                placeholder="e.g. Lot 42 Greenvale, Lot 88 Tarneit"
                value={editForm.assignedProjects}
                onChange={(e) => setEditForm({ ...editForm, assignedProjects: e.target.value })}
                className="bg-white border-blue-fantastic/20 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="text-xs font-semibold border-blue-fantastic/20 text-blue-fantastic"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
