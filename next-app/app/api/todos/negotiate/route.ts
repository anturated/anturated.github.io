import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch(
    `${process.env.AZURE_SIGNALR_ENDPOINT}/api/v1/hubs/todos/generateToken`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ms-signalr-key": process.env.AZURE_SIGNALR_KEY!,
      },
      // body: JSON.stringify({
      //   userId: "user1", // or pull from auth
      // }),
    }
  );

  if (!res.ok) {
    console.error("ERROR ON NEGOTIATE");
    console.error(await res.text());
    console.error(res.statusText);
    return NextResponse.json({ error: "Failed to negotiate" }, { status: 500 });
  }

  const negotiatePayload = await res.json();
  return NextResponse.json(negotiatePayload);
}
