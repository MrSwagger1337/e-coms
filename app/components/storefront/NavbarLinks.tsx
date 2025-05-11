"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { Button } from "@/components/ui/button";

export function NavbarLinks() {
  const location = usePathname();
  const { dictionary, isRtl } = useLanguage();

  if (!dictionary) return null;

  const navbarLinks = [
    {
      id: 0,
      name: dictionary.navigation.home,
      href: "/",
    },
    {
      id: 1,
      name: dictionary.navigation.allProducts,
      href: "/products/all",
    },
    {
      id: 2,
      name: dictionary.navigation.cosmetics,
      href: "/products/cosmetics",
    },
    {
      id: 3,
      name: dictionary.navigation.perfume,
      href: "/products/perfume",
    },
    {
      id: 4,
      name: dictionary.navigation.beauty,
      href: "/products/beauty",
    },
  ];

  return (
    <div
      className={cn(
        "hidden md:flex items-center gap-1",
        isRtl ? "mr-8" : "ml-8"
      )}
    >
      {navbarLinks.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          asChild
          className={cn("h-9 px-3", location === item.href && "bg-accent")}
        >
          <Link href={item.href}>{item.name}</Link>
        </Button>
      ))}
    </div>
  );
}
