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
  lang: "en" | "ar"
}

export function UserDropdown({ email, name, userImage, lang }: iAppProps) {
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
      <DropdownMenuContent className="w-56" align={lang === "ar" ? "start" : "end"} forceMount>
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-xs leading-none text-muted-foreground">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/profile`} className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {lang === "en" ? "My Profile" : "ملفي الشخصي"}
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {lang === "en" ? "Admin Panel" : "لوحة التحكم"}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <LogoutLink>{lang === "en" ? "Log out" : "تسجيل الخروج"}</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
