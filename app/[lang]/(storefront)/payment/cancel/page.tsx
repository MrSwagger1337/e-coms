import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import Link from "next/link"
import { getDictionary } from "@/app/[lang]/dictionaries"

export default async function CancelRoute({ params }: { params: { lang: "en" | "ar" } }) {
  const dict = await getDictionary(params.lang)
  const isRtl = params.lang === "ar"

  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <XCircle className="w-12 h-12 rounded-full bg-red-500/30 text-red-500 p-2" />
          </div>

          <div className={`mt-3 text-center sm:mt-5 w-full ${isRtl ? "rtl" : ""}`}>
            <h3 className="text-lg leading-6 font-medium">{dict.payment.cancel.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{dict.payment.cancel.description}</p>

            <Button asChild className="w-full mt-5 sm:mt-6">
              <Link href={`/${params.lang}`}>{dict.payment.cancel.backToHome}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}

