import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { NavbarProps } from "@/lib/types/types"
import {NavbarLinks} from "@/components/navbar/NavbarLinks"
import { LogoutButton } from "../auth/LogoutButton"


type props = {
  role: string
}

export async function Navbar({ role }: props) {
  let data: NavbarProps[] = []

  try {
    const res = await fetch(`/api/navbar?role=${encodeURIComponent(role)}`, {
      cache: "no-store",
    })

    if (res.ok) {
      data = await res.json()
    } else {
      const body = await res.text()
      console.error("Navbar API request failed", res.status, body)
    }
  } catch (error) {
    console.error("Navbar fetch failed", error)
  }

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
      className="border-r-2 border-truffle-trouble bg-blue-fantastic text-white font-cream"
    >
      <SidebarHeader>
        <div className="flex items-center gap-3 mx-3 mt-5 mb-4 group-data-[collapsible=icon]:mx-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
          <Image
            src="/images/logo.png"
            alt="Logo"
            height={28}
            width={28}
            className="bg-oatmeal border-2 border-white/10 rounded-full shrink-0 object-cover"
          />
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="font-bebas-neue text-3xl leading-none text-palladian truncate">
              Stagen
            </span>
            <span className="text-[11px] uppercase tracking-widest text-oatmeal/70 truncate">
              Build Progress OS
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] uppercase tracking-widest text-oatmeal/50 group-data-[collapsible=icon]:hidden">
            Menu
          </SidebarGroupLabel>
          <NavbarLinks data={data} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 mx-2 mb-3 rounded-lg bg-abyssal/60 border-[0.5px] border-white/10 px-3 py-2.5 group-data-[collapsible=icon]:mx-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-transparent">
          <div className="h-8 w-8 shrink-0 rounded-full bg-burning-flame flex items-center justify-center text-blue-fantastic text-xs font-semibold uppercase">
            {role.slice(0, 2)}
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-xs text-palladian font-medium capitalize truncate">
              {role.replace("-", " ")}
            </span>
            <span className="text-[11px] text-oatmeal/60 truncate">Active session</span>
          </div>
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}