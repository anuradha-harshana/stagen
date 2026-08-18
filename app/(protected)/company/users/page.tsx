"use client";

import { Search, Plus, MoreHorizontalIcon, Users } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";

const users = [
  {
    name: "STAGEN Constructions",
    email: "admin@stagen.com",
    role: "Admin",
    status: "Active",
    joined: "2025-01-15",
    active: "2026-06-24",
  },
  {
    name: "Alex Johnson",
    email: "alex@stagen.com",
    role: "Supervisor",
    status: "Active",
    joined: "2025-02-20",
    active: "2026-06-23",
  },
  {
    name: "Mia Wong",
    email: "mia@stagen.com",
    role: "Management",
    status: "Active",
    joined: "2025-03-10",
    active: "2026-06-22",
  },
  {
    name: "Tom Smith",
    email: "tom@trade.com",
    role: "Trade",
    status: "Active",
    joined: "2025-05-05",
    active: "2026-06-20",
  },
  {
    name: "David Lee",
    email: "david@stagen.com",
    role: "Supervisor",
    status: "Invited",
    joined: "2026-06-01",
    active: "-",
  },
];

export default function UserPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <PageHeader
        icon={<Users className="h-5 w-5 text-burning-flame" />}
        title="User Management"
        subtitle="Manage users, roles, and project assignments."
        rightContent={
          <Button className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold h-10 rounded-xl shadow-sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add User
          </Button>
        }
      />

      <div className="bg-palladian border border-blue-fantastic/15 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
          <div className="relative w-full lg:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-fantastic/40 h-4 w-4"
            />
            <Input
              placeholder="Search users by name or email..."
              className="pl-9 bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-10 text-xs"
            />
          </div>

          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="w-40 border-blue-fantastic/15 text-blue-fantastic h-10 text-xs">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40 border-blue-fantastic/15 text-blue-fantastic h-10 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-blue-fantastic/10">
          <Table>
            <TableHeader className="bg-blue-fantastic/5 border-b border-blue-fantastic/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-blue-fantastic/70 font-bold text-[10px] uppercase tracking-wider">
                  User
                </TableHead>
                <TableHead className="text-blue-fantastic/70 font-bold text-[10px] uppercase tracking-wider">
                  Role
                </TableHead>
                <TableHead className="text-blue-fantastic/70 font-bold text-[10px] uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-blue-fantastic/70 font-bold text-[10px] uppercase tracking-wider">
                  Date Joined
                </TableHead>
                <TableHead className="text-blue-fantastic/70 font-bold text-[10px] uppercase tracking-wider">
                  Last Active
                </TableHead>
                <TableHead className="text-right text-blue-fantastic/70 font-bold text-[10px] uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-blue-fantastic/10">
              {users.map((user, index) => (
                <TableRow key={index} className="hover:bg-blue-fantastic/3">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-blue-fantastic/10">
                        <AvatarFallback className="bg-blue-fantastic/10 text-blue-fantastic text-xs font-bold">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm text-blue-fantastic">{user.name}</p>
                        <p className="text-xs text-blue-fantastic/60">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-fantastic/5 border-blue-fantastic/15 text-blue-fantastic text-[10px]"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        user.status === "Active"
                          ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 text-[10px]"
                          : "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 text-[10px]"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-blue-fantastic/80">{user.joined}</TableCell>
                  <TableCell className="text-xs text-blue-fantastic/80">{user.active}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-fantastic hover:bg-blue-fantastic/10"
                        >
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="text-truffle-trouble">
                          Deactivate User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
