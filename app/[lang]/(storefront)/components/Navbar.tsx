import Link from "next/link"
import { NavbarLinks } from "./NavbarLinks"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { ShoppingBagIcon } from "lucide-react"
import { UserDropdown } from "./UserDropdown"
import { Button } from "@/components/ui/button"
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { redis } from "@/app/lib/redis"
import type { Cart } from "@/app/lib/interfaces"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { LanguageSwitcher } from "@/app/[lang]/components/LanguageSwitcher"

export async function Navbar({ lang }: { lang: "en" | "ar" }) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const dict = await getDictionary(lang)

  const cart: Cart | null = await redis.get(`cart-${user?.id}`)

  const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  const isRtl = lang === "ar"

  return (
    <nav
      className={`w-full mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between border-lg rounded-xl shadow-xl shadow-[#c5c5c5] border-red-500 ${isRtl ? "flex-row-reverse" : ""}`}
    >
      <div className={`flex items-center ${isRtl ? "flex-row-reverse" : ""}`}>
        <Link href={`/${lang}`}>
          <img src="https://i.ibb.co/Y08jgCb/Logo.png" width="60%" />
        </Link>
        <NavbarLinks lang={lang} />
      </div>

      <div className={`flex items-center ${isRtl ? "flex-row-reverse" : ""}`}>
        <LanguageSwitcher currentLang={lang} />

        {user ? (
          <>
            <Link href={`/${lang}/bag`} className={`group p-2 flex items-center ${isRtl ? "mr-0 ml-2" : "mr-2"}`}>
              <ShoppingBagIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
              <span
                className={`${isRtl ? "mr-2" : "ml-2"} text-sm font-medium text-gray-700 group-hover:text-gray-800`}
              >
                {total}
              </span>
            </Link>

            <UserDropdown
              email={user.email as string}
              name={user.given_name as string}
              userImage={user.picture ?? `https://i.pravatar.cc/300`}
              lang={lang}
            />
          </>
        ) : (
          <div
            className={`hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-2 ${isRtl ? "md:space-x-reverse" : ""}`}
          >
            <Button variant="ghost" asChild>
              <LoginLink>{lang === "en" ? "Sign in" : "تسجيل الدخول"}</LoginLink>
            </Button>
            <span className="h-6 w-px bg-gray-200"></span>
            <Button variant="ghost" asChild>
              <RegisterLink>{lang === "en" ? "Create Account" : "إنشاء حساب"}</RegisterLink>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}

