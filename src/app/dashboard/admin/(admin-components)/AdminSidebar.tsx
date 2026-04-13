"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Users as UsersIcon,
  BarChart3,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { UserType } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar } from "../(_components)/Avatar";

interface AdminSidebarProps {
  user: UserType;
}

const adminNavItems = [
  {
    href: "/dashboard/admin",
    label: "Overview",
    icon: BarChart3,
  },
  {
    href: "/dashboard/admin/users",
    label: "Users",
    icon: UsersIcon,
  },
  {
    href: "/dashboard/admin/posts",
    label: "Posts",
    icon: BarChart3,
  },
  {
    href: "/dashboard/admin/messages",
    label: "Messages",
    icon: Mail,
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 z-40">
        {/* <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate flex-1">
          DEVPOSTS
        </h1> */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:bg-gray-200 dark:active:bg-gray-700"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-gray-900 dark:text-white" />
          ) : (
            <Menu className="w-5 h-5 text-gray-900 dark:text-white" />
          )}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 md:hidden bg-black/50 z-20 top-16"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed md:relative h-screen md:h-auto mt-16 md:mt-0 md:max-h-screen z-30 md:z-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/dashboard/admin"
            onClick={() => setIsOpen(false)}
            className="text-lg font-bold tracking-tight text-gray-900 dark:text-white"
          >
            DEVPOSTS<span className="text-blue-500">.</span>ADMIN
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center gap-3 min-w-0">
            {
              //@ts-ignore
              <Avatar name={user?.name} email={user?.email} size="md" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                Admin
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
