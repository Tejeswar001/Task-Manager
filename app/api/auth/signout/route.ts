import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the auth cookie
    cookies().set({
      name: "auth-token",
      value: "",
      expires: new Date(0),
      path: "/",
    })

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Signout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
