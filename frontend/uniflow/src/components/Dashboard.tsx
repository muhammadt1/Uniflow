import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/TaskCard"
import { AddTaskDialog } from "@/components/AddTaskDialog"
import { tasksApi, eventsApi, groupsApi, type Task as ApiTask, type Event, type Group } from "@/lib/api"
import type { Task, TaskPriority } from "@/types/task"
import { format, isAfter, isSameDay, startOfToday } from "date-fns"
import { Calendar, Clock, CheckCircle2, Circle, ArrowUpDown } from "lucide-react"

type FilterType = "ALL" | TaskPriority;

// Convert API task to frontend task format
const convertApiTaskToTask = (apiTask: ApiTask, groups: Group[]): Task => {
  const group = apiTask.groupId ? groups.find(g => g.id === apiTask.groupId) : null
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description || undefined,
    deadline: new Date(apiTask.deadline),
    priority: apiTask.priority as TaskPriority,
    completed: apiTask.completed || false,
    groupId: apiTask.groupId || undefined,
    groupName: group?.name,
  }
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL")
  const [eventSortOrder, setEventSortOrder] = useState<"asc" | "desc">("asc")
  const [taskSortBy, setTaskSortBy] = useState<"deadline" | "priority" | "title">("deadline")
  const [taskSortOrder, setTaskSortOrder] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // Fetch tasks, events, and groups on mount
  useEffect(() => {
    loadGroups()
    loadEvents()
    // For now, we'll use userId 1 as default. In a real app, this would come from auth
    setCurrentUserId(1)
  }, [])

  // Reload events when component becomes visible (when user navigates to Dashboard)
  useEffect(() => {
    const handleFocus = () => {
      loadEvents()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const apiTasks = await tasksApi.getAll()
      const convertedTasks = apiTasks.map(apiTask => convertApiTaskToTask(apiTask, groups))
      setTasks(convertedTasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks")
      console.error("Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load tasks after groups are loaded to update group names
    if (groups.length >= 0) { // Always load tasks, even if groups array is empty
      loadTasks()
    }
  }, [groups])

  const loadEvents = async () => {
    try {
      const apiEvents = await eventsApi.getAll()
      const today = startOfToday()
      // Filter to show events from today onwards (including today)
      const upcomingEvents = apiEvents.filter(event => {
        const startTime = new Date(event.startTime)
        const startDate = startOfToday()
        startDate.setHours(0, 0, 0, 0)
        const eventDate = new Date(startTime)
        eventDate.setHours(0, 0, 0, 0)
        // Include events from today onwards
        return eventDate >= startDate
      })
      // Sort by start time based on sort order
      upcomingEvents.sort((a, b) => {
        const timeA = new Date(a.startTime).getTime()
        const timeB = new Date(b.startTime).getTime()
        return eventSortOrder === "asc" ? timeA - timeB : timeB - timeA
      })
      setEvents(upcomingEvents.slice(0, 10)) // Show next 10 events
    } catch (err) {
      console.error("Error loading events:", err)
    }
  }

  useEffect(() => {
    // Reload events when sort order changes
    if (events.length > 0 || eventSortOrder) {
      loadEvents()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSortOrder])

  const loadGroups = async () => {
    try {
      const apiGroups = await groupsApi.getAll()
      setGroups(apiGroups)
    } catch (err) {
      console.error("Error loading groups:", err)
    }
  }

  const filteredTasks = tasks.filter(task =>
    activeFilter === "ALL" ? true : task.priority === activeFilter
  )

  // Sort tasks based on sortBy and sortOrder
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0
    
    if (taskSortBy === "deadline") {
      comparison = a.deadline.getTime() - b.deadline.getTime()
    } else if (taskSortBy === "priority") {
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
      comparison = priorityOrder[b.priority] - priorityOrder[a.priority]
    } else if (taskSortBy === "title") {
      comparison = a.title.localeCompare(b.title)
    }
    
    // Apply sort order
    return taskSortOrder === "asc" ? comparison : -comparison
  })

  const handleDeleteTask = async (id: number) => {
    try {
      await tasksApi.delete(id)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task")
      console.error("Error deleting task:", err)
    }
  }

  const handleToggleComplete = async (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      await tasksApi.update(id, { completed: !task.completed })
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task")
      console.error("Error updating task:", err)
    }
  }

  const handleAddTask = async (taskData: Omit<Task, "id">) => {
    if (!currentUserId) {
      setError("User ID is required. Please ensure you're logged in.")
      return
    }

    try {
      const newTask = await tasksApi.create({
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline.toISOString(),
        priority: taskData.priority,
        userId: currentUserId,
      })
      const convertedTask = convertApiTaskToTask(newTask, groups)
      setTasks([...tasks, convertedTask])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
      console.error("Error creating task:", err)
      throw err
    }
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} to manage
          </p>
        </div>
        <AddTaskDialog onAddTask={handleAddTask} />
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* My Events Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h2 className="text-xl font-semibold">My Events</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEventSortOrder(eventSortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort: {eventSortOrder === "asc" ? "Earliest First" : "Latest First"}</span>
            </Button>
          </div>
        </div>
        {events.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map(event => (
              <div key={event.id} className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {event.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(event.startTime), "MMM d, yyyy 'at' h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                      </span>
                    </div>
                    {event.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {event.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Tasks Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Tasks</h2>
          <div className="flex items-center gap-2">
            <select
              value={taskSortBy}
              onChange={(e) => setTaskSortBy(e.target.value as "deadline" | "priority" | "title")}
              className="rounded-md border border-input bg-transparent px-3 py-1.5 text-sm"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTaskSortOrder(taskSortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>{taskSortOrder === "asc" ? "Asc" : "Desc"}</span>
            </Button>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'secondary' : 'ghost'}
              className={
                filter === 'ALL'
                  ? 'bg-secondary/50'
                  : filter === 'HIGH'
                  ? 'bg-red-100/50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                  : filter === 'MEDIUM'
                  ? 'bg-yellow-100/50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-green-100/50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
              }
              onClick={() => setActiveFilter(filter as FilterType)}
            >
              {filter === 'ALL' ? 'All Tasks' : `${filter} Priority`}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              {activeFilter === 'ALL' ? 'No tasks yet. Add one to get started!' : `No ${activeFilter.toLowerCase()} priority tasks.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
