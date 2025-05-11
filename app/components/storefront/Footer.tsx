"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function Footer() {
  const { isRtl } = useLanguage();

  return (
    <footer className="w-full border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={cn(
            "flex flex-col gap-4",
            isRtl ? "text-right" : "text-left"
          )}
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Bulgarian Rose</h3>
            <p className="text-sm text-muted-foreground">
              {isRtl
                ? "أجود منتجات التجميل والعطور البلغارية"
                : "Premium Bulgarian Cosmetics & Perfumes"}
            </p>
          </div>

          <Separator className="my-4" />

          <p className="text-sm text-muted-foreground">
            &copy; 2024 Bulgarian Rose.{" "}
            {isRtl ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
