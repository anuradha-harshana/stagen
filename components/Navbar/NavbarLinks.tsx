"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { icons } from "@/lib/Icons/icons";
import { NavbarProps } from "@/lib/types/types";
import clsx from "clsx";

type Props = {
  data: NavbarProps[];
};

export function NavbarLinks({ data }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-1 mt-1">
      {data.map((item) => {
        const Icon = icons[item.icon as keyof typeof icons];
        if (!Icon) return null;

        const active = pathname === item.url;

        return (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
                asChild
                isActive={active}
                className={clsx(
                    "transition-all duration-300",
                    "hover:bg-truffle-trouble hover:text-palladian",
                    "data-[active=true]:bg-truffle-trouble",
                    "data-[active=true]:text-palladian",
                    "data-[active=true]:border data-[active=true]:border-white/10"
                )}
                >
                <Link href={item.url}>
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </div>
  );
}