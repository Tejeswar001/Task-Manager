import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  const data = await req.json()
  const client = await clientPromise
  const db = client.db("smart-todo")

  const result = await db.collection("tasks").insertOne(data)
  return NextResponse.json({ message: "Task added", insertedId: result.insertedId })
}
