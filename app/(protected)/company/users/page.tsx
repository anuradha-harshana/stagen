"use client";

import { Search, Plus, MoreHorizontalIcon } from "lucide-react";

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
    <div className="min-h-screen p-8">
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>

          <p className="text-sm text-gray-600">
            Manage users, roles, and project assignments.
          </p>
        </div>

        <Button className="px-6.5 py-5 text-base bg-orange-400 hover:bg-orange-500">
          <Plus size={20} />
          Add User
        </Button>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl p-6">
        {/* FILTER AREA */}

        <div className="flex justify-between mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />

            <Input
              placeholder="Search users by name or email..."
              className="pl-10"
            />
          </div>

          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>

                <SelectItem value="admin">Admin</SelectItem>

                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">Active</SelectItem>

                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TABLE */}

        <Table>
          <TableHeader className="bg-[#e8dfd1]">
            <TableRow>
              <TableHead>User</TableHead>

              <TableHead>Role</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Date Joined</TableHead>

              <TableHead>Last Active</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                {/* USER */}

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium">{user.name}</p>

                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>

                {/* ROLE */}

                <TableCell>
                  <Badge variant="outline" className="bg-[#eee8dc]">
                    {user.role}
                  </Badge>
                </TableCell>

                {/* STATUS */}

                <TableCell>
                  <Badge
                    className={
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>

                <TableCell>{user.joined}</TableCell>

                <TableCell>{user.active}</TableCell>

                {/* ACTION */}

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>

                      <DropdownMenuItem className="text-red-500">
                        Deactive User
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
  );
}