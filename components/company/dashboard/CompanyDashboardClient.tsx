"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  UserPlus,
  FolderPlus,
  CreditCard,
  Shield,
  Activity,
  LogIn,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Building2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Data matching Figma UI exact values
const INITIAL_ACTIVITIES = [
  {
    id: "act-1",
    user: "STAGEN Constructions",
    action: "Create",
    actionType: "create",
    project: "Project PRO-230",
    timestamp: "2026-06-25 03:21",
    ip: "192.168.1.10",
  },
  {
    id: "act-2",
    user: "Alex Johnson",
    action: "Update",
    actionType: "update",
    project: "Project PRO-231",
    timestamp: "2026-06-24 22:21",
    ip: "192.168.1.11",
  },
  {
    id: "act-3",
    user: "Mia Wong",
    action: "Delete",
    actionType: "delete",
    project: "Project PRO-232",
    timestamp: "2026-06-24 17:21",
    ip: "192.168.1.12",
  },
  {
    id: "act-4",
    user: "Tom Smith",
    action: "Login",
    actionType: "login",
    project: "Project PRO-233",
    timestamp: "2026-06-24 12:21",
    ip: "192.168.1.13",
  },
];

const INITIAL_PROJECTS_OVERVIEW = [
  {
    id: "PRO-233",
    name: "Riverside Estate Lot 4",
    stage: "Frame",
    progress: 22,
    nextMilestone: "Roof Trusses",
    dueDate: "01/12/2026",
    status: "On Track",
  },
  {
    id: "PRO-234",
    name: "Oakwood Townhouses",
    stage: "Slab",
    progress: 10,
    nextMilestone: "Pour Slab",
    dueDate: "15/02/2027",
    status: "On Track",
  },
  {
    id: "PRO-235",
    name: "Sunset Views 12",
    stage: "Fixing",
    progress: 65,
    nextMilestone: "Plastering",
    dueDate: "30/09/2026",
    status: "On Track",
  },
  {
    id: "PRO-236",
    name: "Valley Road Duplex",
    stage: "Lockup",
    progress: 86,
    nextMilestone: "External Doors",
    dueDate: "15/07/2026",
    status: "On Track",
  },
];

const RECENT_LOGINS = [
  {
    id: "usr-1",
    name: "STAGEN Constructions",
    role: "Admin",
    status: "Active Today",
    avatar: "ST",
    avatarBg: "bg-[#2c3b4d] text-white",
  },
  {
    id: "usr-2",
    name: "Alex Johnson",
    role: "Supervisor",
    status: "Active Today",
    avatar: "AJ",
    avatarBg: "bg-[#ffb162] text-[#2c3b4d]",
  },
  {
    id: "usr-3",
    name: "Mia Wong",
    role: "Management",
    status: "Active Today",
    avatar: "MW",
    avatarBg: "bg-[#a35139] text-white",
  },
];

export default function CompanyDashboardClient() {
  const router = useRouter();

  // State management
  const [projects, setProjects] = useState(INITIAL_PROJECTS_OVERVIEW);
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<typeof INITIAL_ACTIVITIES[0] | null>(null);

  // Quick Action Dialogs
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Supervisor" });
  // New Project Form State
  const [newProject, setNewProject] = useState({ id: `PRO-${Math.floor(100 + Math.random() * 900)}`, name: "", stage: "Site Cut", nextMilestone: "Soil Testing", dueDate: "30/12/2026" });

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Project PRO-230 created", time: "2 hours ago", unread: true },
    { id: 2, title: "Alex Johnson logged in", time: "3 hours ago", unread: false },
    { id: 3, title: "Audit log threshold normal", time: "1 day ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill out all required fields.");
      return;
    }
    toast.success(`User ${newUser.name} invited successfully as ${newUser.role}!`);
    setIsAddUserOpen(false);
    setNewUser({ name: "", email: "", role: "Supervisor" });
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) {
      toast.error("Please enter a project name.");
      return;
    }

    const createdProject = {
      id: newProject.id,
      name: newProject.name,
      stage: newProject.stage,
      progress: 5,
      nextMilestone: newProject.nextMilestone,
      dueDate: newProject.dueDate,
      status: "On Track" as const,
    };

    setProjects(prev => [createdProject, ...prev]);
    toast.success(`Project ${newProject.id} - ${newProject.name} created successfully!`);
    setIsCreateProjectOpen(false);
    setNewProject({ id: `PRO-${Math.floor(100 + Math.random() * 900)}`, name: "", stage: "Site Cut", nextMilestone: "Soil Testing", dueDate: "30/12/2026" });
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.stage.toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 font-sans text-[#2c3b4d]">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-[#2c3b4d] tracking-tight">
            Welcome back, STAGEN,
          </h1>
          <p className="text-sm text-[#2c3b4d]/70 mt-0.5">
            here&apos;s what&apos;s happening on your sites today
          </p>
        </div>

        {/* Header Actions (Notifications & User Avatar) */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Notification Bell Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full bg-white border border-[#2c3b4d]/15 shadow-xs hover:bg-[#2c3b4d]/5 h-9 w-9 text-[#2c3b4d]"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffb162] text-[10px] font-bold text-[#2c3b4d]">
                    {unreadCount}
                  </span>
                )}
                {unreadCount === 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-[#2c3b4d]">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllNotificationsRead}
                    className="text-[11px] text-[#a35139] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="py-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-2 p-2.5 rounded-xl text-xs transition-colors ${
                      n.unread ? "bg-amber-50/60 font-medium" : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-[#a35139] mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[#2c3b4d] text-xs">{n.title}</p>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-center justify-center text-xs text-[#2c3b4d] font-medium cursor-pointer"
                onClick={() => router.push("/company/notifications")}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 w-9 rounded-full bg-[#2c3b4d] text-white text-xs font-semibold flex items-center justify-center border-2 border-white shadow-xs hover:opacity-90 transition-opacity">
                ST
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl">
              <DropdownMenuLabel className="font-normal text-xs text-gray-500">
                Logged in as <strong className="text-[#2c3b4d]">STAGEN Admin</strong>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/company/profile")} className="cursor-pointer">
                <Building2 className="mr-2 h-4 w-4" /> Company Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/company/settings")} className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("Logout triggered")} className="text-red-600 cursor-pointer">
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ================= METRICS ROW (3 Cards) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Metric 1: Active Projects */}
        <Card className="bg-white rounded-3xl p-6 shadow-xs border border-white/60 hover:shadow-md transition-shadow">
          <CardContent className="p-0 flex flex-col justify-between h-full">
            <span className="text-4xl sm:text-5xl font-bold font-heading text-[#2c3b4d] tracking-tight">
              8
            </span>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[#2c3b4d]/70">
                Active Projects
              </span>
              <Badge variant="outline" className="bg-[#eee9df] text-[#2c3b4d] border-none text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                100% On Track
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Total Users */}
        <Card className="bg-white rounded-3xl p-6 shadow-xs border border-white/60 hover:shadow-md transition-shadow">
          <CardContent className="p-0 flex flex-col justify-between h-full">
            <span className="text-4xl sm:text-5xl font-bold font-heading text-[#2c3b4d] tracking-tight">
              8
            </span>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[#2c3b4d]/70">
                Total Users
              </span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                6 Active • 1 Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Subscription Status */}
        <Card className="bg-white rounded-3xl p-6 shadow-xs border border-white/60 hover:shadow-md transition-shadow">
          <CardContent className="p-0 flex flex-col justify-between h-full">
            <span className="text-3xl sm:text-4xl font-bold font-heading text-[#16a34a] tracking-tight">
              Active
            </span>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[#2c3b4d]/70">
                Subscription Status
              </span>
              <Badge variant="outline" className="bg-[#ffb162]/20 text-[#a35139] border-none text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                Enterprise
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================= MIDDLE ROW (Recent Activity & Quick Actions) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Recent Activity (lg:col-span-7) */}
        <Card className="lg:col-span-7 bg-white rounded-3xl shadow-xs border border-white/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-heading font-semibold text-[#2c3b4d]">
                Recent Activity
              </h2>
              <Link
                href="/company/audit-logs"
                className="text-xs text-[#2563eb] hover:text-[#1d4ed8] font-medium flex items-center gap-0.5 hover:underline transition-all"
              >
                view audit logs <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* List of Activities */}
            <div className="space-y-4">
              {INITIAL_ACTIVITIES.map((act) => (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivity(act)}
                  className="flex items-start gap-3 p-2 rounded-2xl hover:bg-gray-50/80 transition-colors cursor-pointer group"
                >
                  {/* Icon */}
                  <div className="mt-0.5 p-2 rounded-xl bg-gray-100 group-hover:bg-[#2c3b4d]/10 text-[#2c3b4d] shrink-0 transition-colors">
                    <Activity className="h-4 w-4 stroke-[1.75]" />
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-800 leading-snug">
                      <span className="font-semibold text-[#2c3b4d]">{act.user}</span>{" "}
                      performed{" "}
                      <span
                        className={`font-semibold ${
                          act.actionType === "create"
                            ? "text-[#16a34a]"
                            : act.actionType === "update"
                            ? "text-[#4f46e5]"
                            : act.actionType === "delete"
                            ? "text-[#dc2626]"
                            : "text-[#2563eb]"
                        }`}
                      >
                        {act.action}
                      </span>{" "}
                      on{" "}
                      <span className="font-semibold text-gray-900">{act.project}</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {act.timestamp} • {act.ip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right: Quick Actions (lg:col-span-5) */}
        <Card className="lg:col-span-5 bg-white rounded-3xl shadow-xs border border-white/60 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-heading font-semibold text-[#2c3b4d] mb-5">
              Quick Actions
            </h2>

            {/* 2x2 Grid of Actions */}
            <div className="grid grid-cols-2 gap-4">
              {/* Action 1: Add User */}
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl border border-gray-200/80 bg-white hover:bg-[#2c3b4d]/5 hover:border-[#2c3b4d]/30 transition-all text-[#2c3b4d] shadow-xs group"
              >
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-[#2c3b4d] group-hover:text-white transition-colors">
                  <UserPlus className="h-5 w-5 stroke-[1.75]" />
                </div>
                <span className="text-xs font-semibold text-[#2c3b4d]">Add User</span>
              </button>

              {/* Action 2: Create Project */}
              <button
                onClick={() => setIsCreateProjectOpen(true)}
                className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl border border-gray-200/80 bg-white hover:bg-[#2c3b4d]/5 hover:border-[#2c3b4d]/30 transition-all text-[#2c3b4d] shadow-xs group"
              >
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-[#2c3b4d] group-hover:text-white transition-colors">
                  <FolderPlus className="h-5 w-5 stroke-[1.75]" />
                </div>
                <span className="text-xs font-semibold text-[#2c3b4d]">Create Project</span>
              </button>

              {/* Action 3: View Billing */}
              <button
                onClick={() => router.push("/company/billing")}
                className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl border border-gray-200/80 bg-white hover:bg-[#2c3b4d]/5 hover:border-[#2c3b4d]/30 transition-all text-[#2c3b4d] shadow-xs group"
              >
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-[#2c3b4d] group-hover:text-white transition-colors">
                  <CreditCard className="h-5 w-5 stroke-[1.75]" />
                </div>
                <span className="text-xs font-semibold text-[#2c3b4d]">View Billing</span>
              </button>

              {/* Action 4: Manage Roles */}
              <button
                onClick={() => router.push("/company/users")}
                className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl border border-gray-200/80 bg-white hover:bg-[#2c3b4d]/5 hover:border-[#2c3b4d]/30 transition-all text-[#2c3b4d] shadow-xs group"
              >
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-[#2c3b4d] group-hover:text-white transition-colors">
                  <Shield className="h-5 w-5 stroke-[1.75]" />
                </div>
                <span className="text-xs font-semibold text-[#2c3b4d]">Manage Roles</span>
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* ================= PROJECTS OVERVIEW SECTION ================= */}
      <Card className="bg-white rounded-3xl shadow-xs border border-white/60 p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-heading font-semibold text-[#2c3b4d]">
              Projects Overview
            </h2>
            <Badge variant="outline" className="bg-[#eee9df] text-[#2c3b4d] border-none text-[11px] font-medium">
              {filteredProjects.length} Projects
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* Search filter for projects */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl bg-gray-50 border-gray-200 focus:bg-white"
              />
              {projectSearch && (
                <button
                  onClick={() => setProjectSearch("")}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <Link
              href="/company/projects"
              className="text-xs text-[#2563eb] hover:text-[#1d4ed8] font-medium flex items-center gap-0.5 hover:underline whitespace-nowrap"
            >
              view all projects <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <Table>
            <TableHeader className="bg-[#4b6a8a] text-white">
              <TableRow className="hover:bg-[#4b6a8a] border-none">
                <TableHead className="text-white font-semibold text-xs py-3.5">Project ID</TableHead>
                <TableHead className="text-white font-semibold text-xs py-3.5">Project Name</TableHead>
                <TableHead className="text-white font-semibold text-xs py-3.5">Stage</TableHead>
                <TableHead className="text-white font-semibold text-xs py-3.5">Progress</TableHead>
                <TableHead className="text-white font-semibold text-xs py-3.5">Next Milestone</TableHead>
                <TableHead className="text-white font-semibold text-xs py-3.5">Due Date</TableHead>
                <TableHead className="text-white font-semibold text-xs py-3.5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-gray-500">
                    No matching projects found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((p) => (
                  <TableRow
                    key={p.id}
                    className="hover:bg-gray-50/80 transition-colors border-b border-gray-100 cursor-pointer"
                    onClick={() => router.push("/company/projects")}
                  >
                    <TableCell className="font-semibold text-xs text-[#2c3b4d] py-4">
                      {p.id}
                    </TableCell>
                    <TableCell className="font-medium text-xs text-gray-800 py-4">
                      {p.name}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 py-4">
                      <Badge variant="outline" className="bg-[#eee9df]/60 text-[#2c3b4d] border-gray-200 text-[11px]">
                        {p.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-800 py-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <Progress value={p.progress} className="h-1.5 bg-gray-100 flex-1" />
                        <span className="text-[11px] font-semibold text-[#2c3b4d] shrink-0">
                          {p.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 py-4">
                      {p.nextMilestone}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 py-4">
                      {p.dueDate}
                    </TableCell>
                    <TableCell className="text-xs py-4 font-semibold text-[#16a34a]">
                      {p.status}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* ================= USER ACTIVITY SUMMARY SECTION ================= */}
      <Card className="bg-white rounded-3xl shadow-xs border border-white/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-heading font-semibold text-[#2c3b4d]">
            User Activity Summary
          </h2>
          <Link
            href="/company/users"
            className="text-xs text-[#2563eb] hover:text-[#1d4ed8] font-medium flex items-center gap-0.5 hover:underline"
          >
            view all users <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Recent Logins (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-3">
              <LogIn className="h-4 w-4 text-[#2c3b4d]" />
              <span>Recent Logins</span>
            </div>

            <div className="space-y-3">
              {RECENT_LOGINS.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <AvatarFallback className={`${user.avatarBg} text-xs font-semibold`}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xs font-semibold text-[#2c3b4d]">
                        {user.name}
                      </h4>
                      <p className="text-[11px] text-gray-500">{user.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200/80 shadow-2xs">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span>{user.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Health Status (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-gray-50/70 rounded-2xl border border-gray-100 p-5 flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-gray-700 mb-4">
              Health Status
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-gray-600 font-medium">Inactive Users</span>
                <span className="font-bold text-[#dc2626] text-sm">1</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-gray-600 font-medium">Pending Invites</span>
                <span className="font-bold text-[#d97706] text-sm">1</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-gray-600 font-medium">Total Tenants</span>
                <span className="font-bold text-[#2c3b4d] text-sm">1</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                All services operational
              </span>
              <button
                onClick={() => toast.info("System health diagnostic: 100% pass")}
                className="text-[#2563eb] hover:underline"
              >
                Diagnostics
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* ================= MODALS & DIALOGS ================= */}

      {/* 1. Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-[#2c3b4d]">Add New User</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Invite a supervisor, manager, or trade user to your company portal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUserSubmit} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#2c3b4d] block mb-1.5">Full Name *</label>
              <Input
                placeholder="e.g. Robert Vance"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2c3b4d] block mb-1.5">Email Address *</label>
              <Input
                type="email"
                placeholder="robert@stagen.com.au"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2c3b4d] block mb-1.5">Assigned Role</label>
              <Select
                value={newUser.role}
                onValueChange={(val) => setNewUser(prev => ({ ...prev, role: val }))}
              >
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Admin">Company Admin</SelectItem>
                  <SelectItem value="Supervisor">Site Supervisor</SelectItem>
                  <SelectItem value="Management">Executive Management</SelectItem>
                  <SelectItem value="Trade">Trade Contractor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2c3b4d] text-white hover:bg-[#2c3b4d]/90 rounded-xl text-xs">
                Send Invite
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Create Project Dialog */}
      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-[#2c3b4d]">Create New Project</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Initialize a new build site in the STAGEN portal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProjectSubmit} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#2c3b4d] block mb-1.5">Project ID</label>
              <Input
                value={newProject.id}
                onChange={(e) => setNewProject(prev => ({ ...prev, id: e.target.value }))}
                className="rounded-xl text-xs bg-gray-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2c3b4d] block mb-1.5">Project Name *</label>
              <Input
                placeholder="e.g. Marina View Apartments"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#2c3b4d] block mb-1.5">Initial Stage</label>
                <Select
                  value={newProject.stage}
                  onValueChange={(val) => setNewProject(prev => ({ ...prev, stage: val }))}
                >
                  <SelectTrigger className="rounded-xl text-xs">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Site Cut">Site Cut</SelectItem>
                    <SelectItem value="Slab">Slab</SelectItem>
                    <SelectItem value="Frame">Frame</SelectItem>
                    <SelectItem value="Lockup">Lockup</SelectItem>
                    <SelectItem value="Fixing">Fixing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2c3b4d] block mb-1.5">Target Handover</label>
                <Input
                  placeholder="30/12/2026"
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateProjectOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2c3b4d] text-white hover:bg-[#2c3b4d]/90 rounded-xl text-xs">
                Create Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Activity Detail Dialog */}
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-[#2c3b4d]">Activity Audit Detail</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              System log record ID: {selectedActivity?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-gray-50 rounded-2xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">User:</span>
                  <span className="font-semibold text-[#2c3b4d]">{selectedActivity.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Action:</span>
                  <span className="font-semibold text-[#16a34a]">{selectedActivity.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Resource:</span>
                  <span className="font-semibold text-gray-800">{selectedActivity.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="text-gray-700">{selectedActivity.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IP Address:</span>
                  <span className="font-mono text-gray-700">{selectedActivity.ip}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => {
                setSelectedActivity(null);
                router.push("/company/audit-logs");
              }}
              className="bg-[#2c3b4d] text-[#eee9df] hover:bg-[#2c3b4d]/90 rounded-xl text-xs"
            >
              Go to Audit Logs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
