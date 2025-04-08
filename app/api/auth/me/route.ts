import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { findUserByEmail } from "@/lib/models/user"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      const decoded = verify(token, JWT_SECRET) as { email: string }
      const user = await findUserByEmail(decoded.email)

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Don't return the password
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({ user: userWithoutPassword })
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
