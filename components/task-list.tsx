"use client"

import type { Task } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No tasks found. Add a new task to get started.</div>
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const isOverdue = (deadline: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDeadline = new Date(deadline)
    return taskDeadline < today
  }

  return (
    <div className="space-y-4" id="task-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 transition-colors ${
            task.completed ? "bg-muted/50" : ""
          }`}
          id={`task-${task.id}`}
        >
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              id={`task-checkbox-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <label
                htmlFor={`task-checkbox-${task.id}`}
                className={`font-medium block ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.title}
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isOverdue(task.deadline) && !task.completed
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  Due: {format(new Date(task.deadline), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 self-end sm:self-center">
            <Button variant="outline" size="icon" onClick={() => onEdit(task)} aria-label={`Edit task: ${task.title}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(task.id)}
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
