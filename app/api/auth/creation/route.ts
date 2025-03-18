import prisma from "@/app/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { NextResponse } from "next/server"
import { unstable_noStore as noStore } from "next/cache"
import { locales, defaultLocale } from "@/middleware"

export async function GET(request: Request) {
  noStore()
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong...")
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
        profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      },
    })
  }

  // Determine the user's preferred locale from their browser settings
  const acceptLanguage = request.headers.get("accept-language") || ""
  const userLocale = acceptLanguage.split(",")[0].split("-")[0]
  const locale = locales.includes(userLocale as any) ? userLocale : defaultLocale

  return NextResponse.redirect(
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${locale}`
      : `https://shoe-marshal.vercel.app/${locale}`,
  )
}

