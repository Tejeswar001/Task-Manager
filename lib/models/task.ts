import clientPromise from "../mongodb"
import { ObjectId } from "mongodb"

export async function createTask(userId: string, task: {
  title: string,
  deadline: string,
  priority: string,
}) {
  const client = await clientPromise
  const db = client.db("smart-todo") // replace with your DB name
  const result = await db.collection("tasks").insertOne({
    userId: new ObjectId(userId),
    title: task.title,
    completed: false,
    deadline: task.deadline,
    priority: task.priority,
    createdAt: new Date().toISOString(),
  })
  return result.insertedId
}

export async function getTasksByUser(userId: string) {
  const client = await clientPromise
  const db = client.db("smart-todo")

  const tasks = await db
    .collection("tasks")
    .find({ userId: new ObjectId(userId) })
    .toArray()

  return tasks.map(task => ({
    id: task._id.toString(),
    title: task.title,
    completed: task.completed,
    deadline: task.deadline,
    priority: task.priority,
    createdAt: task.createdAt,
  }))
}

type Task = {
  id: string
  title: string
  deadline: string
  priority: string
  completed: boolean
}


export async function updateTask(userId: string, task: Task): Promise<boolean> {
  const client = await clientPromise
  const db = client.db("smart-todo")
  const result = await db.collection("tasks").updateOne(
    {
      _id: new ObjectId(task.id),
      userId: new ObjectId(userId), // Convert only if userId was stored as ObjectId
    },
    {
      $set: {
        title: task.title,
        deadline: task.deadline,
        priority: task.priority,
        completed: task.completed,
      },
    }
  )
  return result.modifiedCount === 1
}


export async function deleteTask(userId: string, taskId: string) {
  const client = await clientPromise
  const db = client.db("smart-todo")

  const result = await db.collection("tasks").deleteOne({
    _id: new ObjectId(taskId),
    userId: userId, // or new ObjectId(userId) if you store it that way
  })

  return result.deletedCount === 1
}
