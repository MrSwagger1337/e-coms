import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ShoppingBagIcon } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { redis } from "@/app/lib/redis";
import type { Cart } from "@/app/lib/interfaces";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const cart: Cart | null = await redis.get(`cart-${user?.id}`);

  const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <img
                src="https://i.ibb.co/Y08jgCb/Logo.png"
                alt="Logo"
                className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
            <NavbarLinks />
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {user ? (
              <>
                <Link
                  href="/bag"
                  className="relative p-3 hover:bg-accent/80 rounded-full transition-all duration-200 hover:shadow-md group"
                >
                  <ShoppingBagIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  {total > 0 && (
                    <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium shadow-lg animate-pulse">
                      {total}
                    </span>
                  )}
                </Link>

                <UserDropdown
                  email={user.email as string}
                  name={user.given_name as string}
                  userImage={user.picture ?? `https://i.pravatar.cc/300`}
                />
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" size="sm" className="hover:bg-accent/80 transition-all duration-200" asChild>
                  <LoginLink>Sign in</LoginLink>
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button variant="default" size="sm" className="shadow-md hover:shadow-lg transition-all duration-200" asChild>
                  <RegisterLink>Create Account</RegisterLink>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
