import { NextRequest, NextResponse } from "next/server"
import { createTask, getTasksByUser, updateTask, deleteTask } from "@/lib/models/task"
import { getUserIdFromRequest } from "@/lib/utils/jwt"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, deadline, priority } = await req.json()
  if (!title || !deadline || !priority) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    const insertedId = await createTask(userId, { title, deadline, priority })
    return NextResponse.json({ success: true, taskId: insertedId })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const tasks = await getTasksByUser(userId)
    return NextResponse.json({ tasks })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, title, deadline, priority, completed } = await req.json()
  if (!id || !title || !deadline || !priority || completed === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    const updated = await updateTask(userId, {
      id,
      title,
      deadline,
      priority,
      completed,
    })
    return NextResponse.json({ success: updated })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    const { id } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: "Task ID required" }, { status: 400 })

    const client = await clientPromise
    const db = client.db("smart-todo")

    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId), // ensure both _id and userId match
    })

    return NextResponse.json({ success: result.deletedCount === 1 })
  } catch (err) {
    console.error("DELETE error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}