import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/app/actions";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  try {
    await createProduct(null, formData);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
