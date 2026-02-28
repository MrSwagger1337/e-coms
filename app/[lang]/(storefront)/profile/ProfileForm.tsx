"use client"

import { updateProfile } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormStatus } from "react-dom"
import { useState } from "react"

const UAE_EMIRATES = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
]

function SubmitBtn({ lang }: { lang: string }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending
                ? lang === "ar" ? "جاري الحفظ..." : "Saving..."
                : lang === "ar" ? "حفظ التغييرات" : "Save Changes"
            }
        </Button>
    )
}

interface ProfileFormProps {
    userData: {
        firstName: string
        lastName: string
        email: string
        phone: string
        address: string
        emirate: string
        deliveryAddress: string
        deliveryEmirate: string
    }
    lang: "en" | "ar"
}

export function ProfileForm({ userData, lang }: ProfileFormProps) {
    const isRtl = lang === "ar"
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState("")
    const [sameAsPersonal, setSameAsPersonal] = useState(false)

    async function handleSubmit(formData: FormData) {
        setSaved(false)
        setError("")

        if (sameAsPersonal) {
            formData.set("deliveryAddress", formData.get("address") as string)
            formData.set("deliveryEmirate", formData.get("emirate") as string)
        }

        try {
            const result = await updateProfile(formData)
            if (result && "error" in result && result.error) {
                setError(result.error)
            } else {
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
            }
        } catch (e: any) {
            setError("Something went wrong. Please try again.")
        }
    }

    return (
        <form action={handleSubmit}>
            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>{isRtl ? "المعلومات الشخصية" : "Personal Information"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{isRtl ? "الاسم الأول" : "First Name"}</Label>
                            <Input id="firstName" name="firstName" defaultValue={userData.firstName} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">{isRtl ? "اسم العائلة" : "Last Name"}</Label>
                            <Input id="lastName" name="lastName" defaultValue={userData.lastName} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{isRtl ? "البريد الإلكتروني" : "Email"}</Label>
                        <Input id="email" value={userData.email} disabled className="bg-muted" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">{isRtl ? "رقم الهاتف" : "Phone Number"}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="+971 50 123 4567"
                            defaultValue={userData.phone}
                            dir="ltr"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            {isRtl ? "صيغة الإمارات: 971+ XX XXX XXXX" : "UAE format: +971 XX XXX XXXX"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">{isRtl ? "العنوان" : "Address"}</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder={isRtl ? "فيلا 5، البرشاء 1" : "Villa 5, Al Barsha 1"}
                                defaultValue={userData.address}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emirate">{isRtl ? "الإمارة" : "Emirate"}</Label>
                            <Select name="emirate" defaultValue={userData.emirate || undefined}>
                                <SelectTrigger>
                                    <SelectValue placeholder={isRtl ? "اختر الإمارة" : "Select Emirate"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {UAE_EMIRATES.map((e) => (
                                        <SelectItem key={e} value={e}>{e}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="mt-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{isRtl ? "عنوان التوصيل" : "Delivery Address"}</CardTitle>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={sameAsPersonal}
                                onChange={(e) => setSameAsPersonal(e.target.checked)}
                                className="rounded"
                            />
                            {isRtl ? "نفس العنوان الشخصي" : "Same as personal address"}
                        </label>
                    </div>
                </CardHeader>
                {!sameAsPersonal && (
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="deliveryAddress">{isRtl ? "عنوان التوصيل" : "Delivery Address"}</Label>
                                <Input
                                    id="deliveryAddress"
                                    name="deliveryAddress"
                                    placeholder={isRtl ? "فيلا 5، البرشاء 1" : "Villa 5, Al Barsha 1"}
                                    defaultValue={userData.deliveryAddress}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deliveryEmirate">{isRtl ? "إمارة التوصيل" : "Delivery Emirate"}</Label>
                                <Select name="deliveryEmirate" defaultValue={userData.deliveryEmirate || undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={isRtl ? "اختر الإمارة" : "Select Emirate"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UAE_EMIRATES.map((e) => (
                                            <SelectItem key={e} value={e}>{e}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            <div className="mt-6 flex items-center gap-4">
                <SubmitBtn lang={lang} />
                {saved && (
                    <p className="text-sm text-green-600 font-medium">
                        {isRtl ? "✓ تم حفظ التغييرات" : "✓ Changes saved successfully"}
                    </p>
                )}
                {error && (
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                )}
            </div>
        </form>
    )
}
