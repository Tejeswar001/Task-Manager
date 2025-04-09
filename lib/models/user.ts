import type { ObjectId } from "mongodb"
import { hash, compare } from "bcryptjs"
import clientPromise from "../mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
}

export async function createUser(userData: Omit<User, "_id" | "createdAt">): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db("smart-todo")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: userData.email })
    if (existingUser) {
      return null
    }

    // Hash the password
    const hashedPassword = await hash(userData.password, 10)

    // Create new user
    const newUser = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)
    return { ...newUser, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db("smart-todo")

    return (await db.collection("users").findOne({ email })) as User | null
  } catch (error) {
    console.error("Error finding user:", error)
    return null
  }
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await findUserByEmail(email)
    if (!user) return null

    const isValid = await compare(password, user.password)
    if (!isValid) return null

    return user
  } catch (error) {
    console.error("Error validating user:", error)
    return null
  }
}
