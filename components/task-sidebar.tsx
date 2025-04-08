"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Circle, ClipboardList, AlertTriangle, X } from "lucide-react"

interface TaskSidebarProps {
  filter: string
  setFilter: (filter: string) => void
  isOpen: boolean
  onClose: () => void
}

export function TaskSidebar({ filter, setFilter, isOpen, onClose }: TaskSidebarProps) {
  const filters = [
    { id: "all", label: "All Tasks", icon: ClipboardList },
    { id: "pending", label: "Pending", icon: Circle },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
    { id: "high", label: "High Priority", icon: AlertTriangle },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-card border-r`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">Filters</h2>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Separator />
        <nav className="p-4">
          <ul className="space-y-2">
            {filters.map((item) => (
              <li key={item.id}>
                <Button
                  variant={filter === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setFilter(item.id)
                    onClose()
                  }}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
