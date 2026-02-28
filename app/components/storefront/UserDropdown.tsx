"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { useLanguage } from "@/app/context/LanguageContext"
import Link from "next/link"
import { Settings, User } from "lucide-react"

const adminEmails = [
  "eweeda12@gmail.com",
  "eweeda172@gmail.com",
  "ecomsrose@gmail.com",
  "elsaady.eweeda@gmail.com",
  "loveahlysc@gmail.com",
]

interface iAppProps {
  email: string
  name: string
  userImage: string
}

export function UserDropdown({ email, name, userImage }: iAppProps) {
  const { isRtl } = useLanguage()
  const isAdmin = adminEmails.includes(email.toLowerCase())

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userImage} alt="User Image" />
            <AvatarFallback>{name.slice(0, 3)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={isRtl ? "start" : "end"} forceMount>
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-xs leading-none text-muted-foreground">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {isRtl ? "ملفي الشخصي" : "My Profile"}
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {isRtl ? "لوحة التحكم" : "Admin Panel"}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <LogoutLink>{isRtl ? "تسجيل الخروج" : "Log out"}</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
