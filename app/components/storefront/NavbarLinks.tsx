"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function NavbarLinks() {
  const location = usePathname();
  const { dictionary, isRtl } = useLanguage();
  const [categories, setCategories] = useState<{ id: string; name: string; title: string; title_ar: string | null }[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => { });
  }, []);

  if (!dictionary) return null;

  const baseLinks = [
    {
      id: "home",
      name: dictionary.navigation.home,
      href: "/",
    },
    {
      id: "all",
      name: dictionary.navigation.allProducts,
      href: "/products/all",
    },
  ];

  const categoryLinks = categories.map((cat) => ({
    id: cat.id,
    name: isRtl && cat.title_ar ? cat.title_ar : cat.title,
    href: `/products/${cat.name}`,
  }));

  const navbarLinks = [...baseLinks, ...categoryLinks];

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
