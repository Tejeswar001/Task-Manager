"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, Priority } from "@/lib/types"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (task: Task | Omit<Task, "id" | "createdAt">) => void
  task?: Task | null
  mode: "add" | "edit"
}

export function AddTaskDialog({ open, onOpenChange, onSubmit, task = null, mode }: AddTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [titleError, setTitleError] = useState("")

  // Reset form when dialog opens/closes or task changes
  useEffect(() => {
    if (open && task) {
      setTitle(task.title)
      setDeadline(task.deadline)
      setPriority(task.priority as Priority)
      setTitleError("")
    } else if (open && !task) {
      // Set default values for new task
      setTitle("")
      // Set default deadline to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setDeadline(tomorrow.toISOString().split("T")[0])
      setPriority("medium")
      setTitleError("")
    }
  }, [open, task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!title.trim()) {
      setTitleError("Title is required")
      return
    }

    if (mode === "edit" && task) {
      onSubmit({
        ...task,
        title,
        deadline,
        priority,
      })
    } else {
      onSubmit({
        title,
        deadline,
        priority,
        completed: false,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="task-form">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (e.target.value.trim()) setTitleError("")
                }}
                placeholder="Enter task title"
                className={titleError ? "border-red-500" : ""}
              />
              {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === "add" ? "Add Task" : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
