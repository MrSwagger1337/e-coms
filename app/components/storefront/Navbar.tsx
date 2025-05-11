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
    <nav className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <img
              src="https://i.ibb.co/Y08jgCb/Logo.png"
              alt="Logo"
              className="h-8 w-auto"
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
                className="relative p-2 hover:bg-accent rounded-full transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5 text-muted-foreground" />
                {total > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
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
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <LoginLink>Sign in</LoginLink>
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button variant="ghost" size="sm" asChild>
                <RegisterLink>Create Account</RegisterLink>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
