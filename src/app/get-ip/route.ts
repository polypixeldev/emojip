import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let ip;
  const forwarded = req.headers.get("x-forwarded-for");
  if (
    process.env.NODE_ENV === "development" ||
    forwarded?.split(".").length !== 4
  ) {
    const data = await fetch("https://api.ipify.org?format=json").then((r) =>
      r.json(),
    );
    ip = data.ip;
  } else if (forwarded) {
    ip = forwarded;
  } else {
    ip = "127.0.0.1";
  }

  return NextResponse.json({ ip });
}
