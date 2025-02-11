"use client";

import { useEffect, useState } from "react";
import { icons, Plus, Search } from "lucide-react";
import type {
  CreateTaskDTO,
  TaskStatus,
  UpdateTaskDTO,
  DeleteTaskDTO,
  Task,
} from "./types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Icons } from "@/components/ui/icons";

const api = axios.create({
  baseURL: "/api",
});

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [name, setName] = useState("");
  const userName = localStorage.getItem("name");

  const loadTasks = async () => {
    try {
      setLoading(true);
      try {
        const response = await api.post(`/task/read`, {
          userName: userName,
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error reading tasks:", error);
        return [];
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [userName]);

  const handleCreateTask = async () => {
    try {
      const response = (
        await api.post("/task/create", {
          userName,
          title: newTask.title,
          description: newTask.description,
        })
      ).data as Task;
      setIsCreateDialogOpen(false);

      setNewTask({ title: "", description: "" });
      loadTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (id: string, isDone: boolean) => {
    try {
      const task = tasks.find((t) => t._id === id);
      if (!task) return;
      await api.post("/task/update", {
        id,
        title: task.title,
        description: task.description,
        isDone,
      });
      loadTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.post("/task/delete", { id });
      loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "FINISHED":
        return "bg-green-500";
      case "FAILED":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        const matchesFilter =
          task.title.toLowerCase().includes(filter.toLowerCase()) ||
          task.description.toLowerCase().includes(filter.toLowerCase());
        const matchesStatus =
          statusFilter === "ALL" || task.isfinised === statusFilter;
        return matchesFilter && matchesStatus;
      })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {userName === null ? (
        <>
          <div className="max-w-md mx-auto mt-10">
            <form
              onSubmit={() => {
                setLoading(true);
                axios.post("api/user/create", {
                  userName: name,
                });
                localStorage.setItem("name", name);
                setLoading(false);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                log in
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back! {userName}
                </h1>
                
            
              <p className="text-muted-foreground">
                Here's a list of your tasks for this month!
              </p>
            </div>
            <div className="flex flex-col gap-2">
            <Button
                  variant="outline"
                  onClick={()=> {window.location.href = "https://github.com/9cloudy/task-manager"}}
                >
                  Github
                  {<icons.Github/>}
                </Button>
                <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to your list
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
            
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter tasks..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as TaskStatus | "ALL")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FINISHED">Finished</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(task.isfinised)}
                      >
                        {task.isfinised.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        className="mr-2"
                        onClick={() =>
                          handleUpdateTask(
                            task._id,
                            task.isfinised !== "FINISHED"
                          )
                        }
                      >
                        {task.isfinised === "FINISHED" ? "Unmark" : "Complete"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={githubSignIn}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          Github
        </Button>
 */
