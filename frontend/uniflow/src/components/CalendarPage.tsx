import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Clock, FileText, Users } from "lucide-react"
import { eventsApi, tasksApi, groupsApi, usersApi, type Event, type Task, type Group, type User } from "@/lib/api"
import { format, isSameDay, startOfDay, endOfDay, isWithinInterval } from "date-fns"
import { DayButton, getDefaultClassNames } from "react-day-picker"
import { cn } from "@/lib/utils"
import * as React from "react"

// Generate color based on group ID (if event has a group, otherwise use event ID as fallback)
const getEventColor = (event: Event): string => {
  const colors = [
    "#3b82f6",   // blue-500
    "#f97316",   // orange-500
    "#22c55e",   // green-500
    "#a855f7",   // purple-500
    "#ec4899",   // pink-500
    "#ef4444",   // red-500
    "#eab308",   // yellow-500
    "#0ea5e9",   // sky-500
    "#8b5cf6",   // violet-500
    "#14b8a6",   // teal-500
  ]
  // Use groupId if available, otherwise fall back to eventId
  const idToUse = event.groupId || event.id
  return colors[idToUse % colors.length]
}

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [eventFormData, setEventFormData] = useState({
    title: "",
    startDateTime: "",
    endDateTime: "",
    notes: "",
    userId: 1,
    groupIds: [] as number[],
  })
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    userId: 1,
  })
  const [groupFormData, setGroupFormData] = useState({
    name: "",
    userIds: [] as number[],
  })
  const [events, setEvents] = useState<Event[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
    loadTasks()
    loadGroups()
    loadUsers()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      // Set default times: 9:00 AM for start, 10:00 AM for end
      const defaultStartTime = `${dateStr}T09:00`
      const defaultEndTime = `${dateStr}T10:00`
      setEventFormData(prev => ({
        ...prev,
        startDateTime: prev.startDateTime || defaultStartTime,
        endDateTime: prev.endDateTime || defaultEndTime,
      }))
      setTaskFormData(prev => ({
        ...prev,
        deadline: `${dateStr}T12:00`,
      }))
    }
  }, [selectedDate])

  const loadEvents = async () => {
    try {
      const data = await eventsApi.getAll()
      console.log("Loaded events:", data)
      setEvents(data)
    } catch (err) {
      console.error("Error loading events:", err)
      setError(err instanceof Error ? err.message : "Failed to load events")
    }
  }

  const loadTasks = async () => {
    try {
      const data = await tasksApi.getAll()
      console.log("Loaded tasks:", data)
      setTasks(data)
    } catch (err) {
      console.error("Error loading tasks:", err)
      setError(err instanceof Error ? err.message : "Failed to load tasks")
    }
  }

  const loadGroups = async () => {
    try {
      const data = await groupsApi.getAll()
      console.log("Loaded groups:", data)
      setGroups(data)
    } catch (err) {
      console.error("Error loading groups:", err)
      setError(err instanceof Error ? err.message : "Failed to load groups")
    }
  }

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll()
      console.log("Loaded users:", data)
      setUsers(data)
    } catch (err) {
      console.error("Error loading users:", err)
      setError(err instanceof Error ? err.message : "Failed to load users")
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventFormData.title || !eventFormData.startDateTime || !eventFormData.endDateTime) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      setError(null)

      await eventsApi.create({
        title: eventFormData.title,
        notes: eventFormData.notes || undefined,
        startTime: new Date(eventFormData.startDateTime).toISOString(),
        endTime: new Date(eventFormData.endDateTime).toISOString(),
        userId: eventFormData.userId,
        groupId: eventFormData.groupIds.length > 0 ? eventFormData.groupIds[0] : null,
      })

      // Reset form
      const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
      setEventFormData({
        title: "",
        startDateTime: `${dateStr}T09:00`,
        endDateTime: `${dateStr}T10:00`,
        notes: "",
        userId: 1,
        groupIds: [],
      })
      setIsEventDialogOpen(false)
      loadEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event")
      console.error("Error creating event:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskFormData.title || !taskFormData.deadline) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      setError(null)

      await tasksApi.create({
        title: taskFormData.title,
        description: taskFormData.description,
        deadline: new Date(taskFormData.deadline).toISOString(),
        priority: taskFormData.priority,
        userId: taskFormData.userId,
      })

      // Reset form
      setTaskFormData({
        title: "",
        description: "",
        deadline: selectedDate ? `${format(selectedDate, "yyyy-MM-dd")}T12:00` : "",
        priority: "MEDIUM",
        userId: 1,
      })
      setIsTaskDialogOpen(false)
      loadTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
      console.error("Error creating task:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupFormData.name) {
      setError("Please enter a group name")
      return
    }

    try {
      setLoading(true)
      setError(null)

      await groupsApi.create({
        name: groupFormData.name,
        userIds: [],
      })

      // Reset form
      setGroupFormData({
        name: "",
        userIds: [],
      })
      setIsGroupDialogOpen(false)
      loadGroups()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group")
      console.error("Error creating group:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleEventGroup = (groupId: number) => {
    setEventFormData(prev => ({
      ...prev,
      groupIds: prev.groupIds.includes(groupId)
        ? prev.groupIds.filter(id => id !== groupId)
        : [...prev.groupIds, groupId],
    }))
  }

  const toggleGroupUser = (userId: number) => {
    setGroupFormData(prev => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter(id => id !== userId)
        : [...prev.userIds, userId],
    }))
  }

  // Get events/tasks for a specific date (checking for overlap, not just start date)
  const getDateEvents = (date: Date | undefined) => {
    if (!date) return []
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)
    
    return events.filter(event => {
      const eventStart = new Date(event.startTime)
      const eventEnd = new Date(event.endTime)
      
      // Check if event overlaps with the selected day (same logic as getEventsForDate)
      return (
        isWithinInterval(eventStart, { start: dayStart, end: dayEnd }) ||
        isWithinInterval(eventEnd, { start: dayStart, end: dayEnd }) ||
        (eventStart <= dayStart && eventEnd >= dayEnd)
      )
    })
  }

  const getDateTasks = (date: Date | undefined) => {
    if (!date) return []
    const normalizedDate = startOfDay(date)
    return tasks.filter(task => {
      const deadline = new Date(task.deadline)
      const normalizedDeadline = startOfDay(deadline)
      // Compare dates using isSameDay which handles timezone issues
      return isSameDay(normalizedDeadline, normalizedDate)
    })
  }

  // Get events for a specific date (for calendar bars)
  const getEventsForDate = (date: Date): Event[] => {
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)
    
    return events.filter(event => {
      const eventStart = new Date(event.startTime)
      const eventEnd = new Date(event.endTime)
      
      // Check if event overlaps with the day
      return (
        isWithinInterval(eventStart, { start: dayStart, end: dayEnd }) ||
        isWithinInterval(eventEnd, { start: dayStart, end: dayEnd }) ||
        (eventStart <= dayStart && eventEnd >= dayEnd)
      )
    })
  }

  // Get dates with events/tasks for calendar modifiers
  const datesWithEvents = events.map(event => new Date(event.startTime))
  const datesWithTasks = tasks.map(task => new Date(task.deadline))

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="w-full flex flex-col">
        {/* Header with buttons */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsGroupDialogOpen(true)} variant="outline" size="sm">
              Create Group
            </Button>
            <Button onClick={() => setIsEventDialogOpen(true)} size="sm">
              Create Event
            </Button>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(true)} size="sm">
              Create Task
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Calendar and Events side by side */}
        <div className="flex gap-6 items-start">
          {/* Calendar - takes remaining space */}
          <div className="flex-1 flex justify-center min-w-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="[--cell-size:--spacing(16)] sm:[--cell-size:--spacing(18)] md:[--cell-size:--spacing(20)]"
              buttonVariant="ghost"
              modifiers={{
                hasEvents: (date) => datesWithEvents.some(d => isSameDay(d, date)),
                hasTasks: (date) => datesWithTasks.some(d => isSameDay(d, date)),
              }}
              modifiersClassNames={{
                hasEvents: "has-events",
                hasTasks: "has-tasks",
              }}
              components={{
                DayButton: ({ day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) => {
                  const dayEvents = getEventsForDate(day.date)
                  const defaultClassNames = getDefaultClassNames()
                  const ref = React.useRef<HTMLButtonElement>(null)
                  
                  React.useEffect(() => {
                    if (modifiers.focused) ref.current?.focus()
                  }, [modifiers.focused])
                  
                  return (
                    <Button
                      ref={ref}
                      variant="ghost"
                      size="icon"
                      data-day={day.date.toLocaleDateString()}
                      data-selected-single={
                        modifiers.selected &&
                        !modifiers.range_start &&
                        !modifiers.range_end &&
                        !modifiers.range_middle
                      }
                      data-range-start={modifiers.range_start}
                      data-range-end={modifiers.range_end}
                      data-range-middle={modifiers.range_middle}
                      className={cn(
                        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-base [&>span]:font-semibold [&>span]:opacity-70 relative pb-2",
                        modifiers.hasEvents && "has-events",
                        modifiers.hasTasks && "has-tasks",
                        defaultClassNames.day
                      )}
                      {...props}
                    >
                      <span className="z-10 relative">{format(day.date, "d")}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 px-1.5 pb-1.5 pointer-events-none z-0 max-h-[50%] overflow-hidden">
                          {dayEvents.slice(0, 3).map((event: Event, index: number) => (
                            <div
                              key={event.id}
                              className="h-1.5 w-full rounded-sm shadow-sm"
                              style={{ backgroundColor: getEventColor(event) }}
                              title={event.title}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="h-1.5 w-full rounded-sm bg-muted-foreground/50 shadow-sm" title={`+${dayEvents.length - 3} more`} />
                          )}
                        </div>
                      )}
                    </Button>
                  )
                },
              }}
            />
          </div>

          {/* Events/Tasks for selected date - vertical column on the right */}
          <div className="w-80 flex-shrink-0 flex flex-col border-l pl-6">
            {selectedDate ? (
              <div className="space-y-4 flex-1 overflow-y-auto">
                {getDateEvents(selectedDate).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Events on {format(selectedDate, "MMM d, yyyy")}</h3>
                    <div className="space-y-2">
                      {getDateEvents(selectedDate).map(event => (
                        <div key={event.id} className="rounded-lg border p-4 hover:shadow-md transition-shadow">
                          <p className="font-medium mb-1">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                          </p>
                          {event.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{event.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {getDateTasks(selectedDate).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tasks due on {format(selectedDate, "MMM d, yyyy")}</h3>
                    <div className="space-y-2">
                      {getDateTasks(selectedDate).map(task => (
                        <div key={task.id} className="rounded-lg border p-4 hover:shadow-md transition-shadow">
                          <p className="font-medium mb-1">{task.title}</p>
                          <p className="text-sm text-muted-foreground">Priority: {task.priority}</p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {getDateEvents(selectedDate).length === 0 && getDateTasks(selectedDate).length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No events or tasks for this date</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>Select a date to view events and tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateEvent} className="space-y-4">
            {/* Title */}
            <div>
              <Input
                placeholder="Add title and time"
                value={eventFormData.title}
                onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-medium border-b-2 border-primary rounded-none px-0"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Start Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={eventFormData.startDateTime}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, startDateTime: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">End Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={eventFormData.endDateTime}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, endDateTime: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Groups Selection */}
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div className="flex-1">
                <Label className="text-sm mb-2 block">Groups</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                  {groups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No groups available. Create a group first.</p>
                  ) : (
                    groups.map(group => (
                      <label key={group.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={eventFormData.groupIds.includes(group.id)}
                          onChange={() => toggleEventGroup(group.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{group.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
              <div className="flex-1">
                <Label className="text-sm">Notes</Label>
                <textarea
                  placeholder="Add notes"
                  value={eventFormData.notes}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[80px] mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEventDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateTask} className="space-y-4">
            {/* Title */}
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Add task title"
                value={taskFormData.title}
                onChange={(e) => setTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <textarea
                placeholder="Add task description"
                value={taskFormData.description}
                onChange={(e) => setTaskFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[80px]"
              />
            </div>

            {/* Deadline and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Deadline</Label>
                <Input
                  type="datetime-local"
                  value={taskFormData.deadline}
                  onChange={(e) => setTaskFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Priority</Label>
                <select
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData(prev => ({ ...prev, priority: e.target.value as "LOW" | "MEDIUM" | "HIGH" }))}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTaskDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Group Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateGroup} className="space-y-4">
            {/* Group Name */}
            <div>
              <Label>Group Name</Label>
              <Input
                placeholder="Enter group name"
                value={groupFormData.name}
                onChange={(e) => setGroupFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGroupDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
