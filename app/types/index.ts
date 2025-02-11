export type TaskStatus = "FINISHED" | "PENDING" | "FAILED"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  _id: string
  title: string
  description: string
  isfinised: TaskStatus
  priority?: TaskPriority
}

export interface CreateTaskDTO {
  userName: string
  title: string
  description: string
}

export interface UpdateTaskDTO {
  id: string
  title: string
  description: string
  isDone: boolean
}

export interface DeleteTaskDTO {
  id: string
}

