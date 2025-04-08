import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function getUserIdFromRequest(req: Request): Promise<string | null> {
  try {
    const cookieStore = await cookies() // ✅ Fix: await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return null

    const decoded = verify(token, JWT_SECRET) as { id: string }
    return decoded.id
  } catch (err) {
    console.error("JWT error:", err)
    return null
  }
}
