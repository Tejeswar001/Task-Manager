"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Moon, Sun, Filter, X, Github, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { TaskList } from "@/components/task-list"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { TaskSidebar } from "@/components/task-sidebar"
import type { Task } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const { user, signOut, loading } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load tasks from localStorage on initial render
  useEffect(() => {
    if (!user) return // Don't load tasks if not authenticated

    const savedTasks = localStorage.getItem(`tasks-${user.id}`)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Sample tasks for demo
      const demoTasks: Task[] = [
        {
          id: "1",
          title: "Complete project proposal",
          completed: false,
          deadline: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days from now
          priority: "high",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Schedule team meeting",
          completed: true,
          deadline: new Date().toISOString().split("T")[0],
          priority: "medium",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Research new technologies",
          completed: false,
          deadline: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0], // 5 days from now
          priority: "low",
          createdAt: new Date().toISOString(),
        },
      ]
      setTasks(demoTasks)
      if (user) {
        localStorage.setItem(`tasks-${user.id}`, JSON.stringify(demoTasks))
      }
    }
  }, [user])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks-${user.id}`, JSON.stringify(tasks))
    }
  }, [tasks, user])

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTasks([...tasks, newTask])
    setIsAddTaskOpen(false)
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    if (filter === "high") return task.priority === "high"
    return true
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Smart To-Do List</h1>
          <p className="mb-6">Please sign in to access your tasks.</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Filter />}
      </Button>

      {/* Sidebar */}
      <TaskSidebar
        filter={filter}
        setFilter={setFilter}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 md:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Smart To-Do List</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button variant="outline" size="icon" asChild>
                <a
                  href="https://github.com/yourusername/smart-todo-list"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source code on GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{user.name}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={() => setIsAddTaskOpen(true)}>
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          <Card className="mb-6 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Tasks</h2>
                <span className="text-sm text-muted-foreground">
                  {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">Filter:</span>
                <select
                  className="text-sm bg-background border rounded p-1"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  id="task-filter"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
            <Separator className="my-4" />
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={toggleTaskCompletion}
              onEdit={setEditingTask}
              onDelete={deleteTask}
            />
          </Card>
        </div>
      </div>

      {/* Add/Edit Task Dialog */}
      <AddTaskDialog
        open={isAddTaskOpen || !!editingTask}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddTaskOpen(false)
            setEditingTask(null)
          }
        }}
        onSubmit={editingTask ? updateTask : addTask}
        task={editingTask}
        mode={editingTask ? "edit" : "add"}
      />
    </div>
  )
}
