import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await createUser({ name, email, password })

    if (!user) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ message: "User created successfully", user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
