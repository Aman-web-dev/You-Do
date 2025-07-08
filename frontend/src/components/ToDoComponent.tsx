"use client";

import React, { useEffect, useState } from "react";
import { Plus, Check, X, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/client";

import { MoreVertical, Edit, Trash2, Flag, Tag, User } from "lucide-react";

export default function TodoListPage({ todosData }: { todosData: any[] }) {
  const router = useRouter();
  const [todos, setTodos] = useState(todosData);

  const handleTasksSync = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    try {
      const response = await fetch("http://localhost:8000/tasks/sync_tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id }), // Replace with actual user ID
      });

      if (response.status === 200) {
        router.refresh();
      } else {
        console.error("Task sync failed", await response.json());
      }
    } catch (error) {
      console.error("Error syncing tasks:", error);
    }
  };

  useEffect(() => {
    setTodos(todosData);
  }, [todosData]);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
            <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
          </div>

          <div className="flex flex-row gap-4">
            <Form />
            <Button
              onClick={handleTasksSync}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Sync
            </Button>
          </div>
        </div>

        {/* Todo Cards */}
        <div className="space-y-4">
          {/* {todos.map((todo) => (
            // <Card
            //   key={todo.id}
            //   className={`transition-all duration-200 ${
            //     todo.completed ? "opacity-60" : ""
            //   }`}
            // >
            //   <CardHeader className="pb-3">
            //     <div className="flex items-start justify-between">
            //       <div className="flex items-start gap-3">
            //         <Button
            //           variant="ghost"
            //           size="sm"
            //           onClick={() => toggleTodo(todo.id)}
            //           className={`mt-1 p-1 h-6 w-6 rounded-full ${
            //             todo.completed
            //               ? "bg-green-100 text-green-600 hover:bg-green-200"
            //               : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            //           }`}
            //         >
            //           {todo.completed && <Check className="h-4 w-4" />}
            //         </Button>
            //         <div className="flex-1">
            //           <CardTitle
            //             className={`text-lg ${
            //               todo.completed ? "line-through text-gray-500" : ""
            //             }`}
            //           >
            //             {todo.title}
            //           </CardTitle>
            //           {todo.description && (
            //             <CardDescription className="mt-1">
            //               {todo.description}
            //             </CardDescription>
            //           )}
            //         </div>
            //       </div>
            //       <Button
            //         variant="ghost"
            //         size="sm"
            //         onClick={() => deleteTodo(todo.id)}
            //         className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
            //       >
            //         <X className="h-4 w-4" />
            //       </Button>
            //     </div>
            //   </CardHeader>
            //   <CardContent className="pt-0">
            //     <div className="flex items-center justify-between">
            //       <div className="flex items-center gap-2">
            //         <Badge className={getPriorityColor(todo.priority)}>
            //           {todo.priority}
            //         </Badge>
            //         {todo.deadline && (
            //           <div className="flex items-center gap-1 text-sm text-gray-500">
            //             <Calendar className="h-3 w-3" />
            //             {new Date(todo.deadline).toLocaleString("en-US", {
            //               year: "numeric",
            //               month: "long",
            //               day: "numeric",
            //               hour: "numeric",
            //               minute: "2-digit",
            //               hour12: true,
            //             })}
            //           </div>
            //         )}
            //       </div>
            //       <div className="text-xs text-gray-400">
            //         Created: {todo.created_at}
            //         Updated: {todo.updated_at}
            //       </div>
            //     </div>
            //   </CardContent>
            // </Card>
          ))} */}

          {todos.length > 0 && <TodoCards todoList={todos} />}
        </div>

        {todos.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No todos yet</h3>
                <p>Create your first todo to get started!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

const TodoCards = (todoList: any) => {
  const [showDropdown, setShowDropdown] = useState(null);
  console.log("todo List ", todoList.todoList);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 3:
        return "bg-red-100 text-red-800 border-red-200";
      case 2:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 1:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 3:
        return "High";
      case 2:
        return "Medium";
      case 1:
        return "Low";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "work":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "personal":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "health":
        return "bg-green-100 text-green-800 border-green-200";
      case "education":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const isOverdue = date < now;

    return {
      formatted: date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      isOverdue,
    };
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: todo.status === "completed" ? "pending" : "completed",
            }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    setShowDropdown(null);
  };

  const editTodo = (id) => {
    console.log("Edit todo:", id);
    setShowDropdown(null);
    // Add your edit logic here
  };

  const toggleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  return (
    <div className="space-y-4 p-6  min-h-screen">
      {todoList.todoList.map((todo) => {
        const deadlineInfo = formatDeadline(todo.deadline);
        const isCompleted = todo.status === "completed";

        return (
          <Card
            key={todo.id}
            className={`transition-all duration-200 hover:shadow-md ${
              isCompleted ? "opacity-70" : ""
            } ${
              deadlineInfo.isOverdue && !isCompleted
                ? "border-red-300 bg-red-50"
                : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTodo(todo.id)}
                    className={`mt-1 p-1 h-7 w-7 rounded-full border-2 ${
                      isCompleted
                        ? "bg-green-100 text-green-600 hover:bg-green-200 border-green-300"
                        : "bg-white text-gray-400 hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {isCompleted && <Check className="h-4 w-4" />}
                  </Button>

                  <div className="flex-1">
                    <CardTitle
                      className={`text-lg leading-tight ${
                        isCompleted ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {todo.title}
                    </CardTitle>
                    {todo.description && (
                      <CardDescription className="mt-1 text-sm">
                        {todo.description}
                      </CardDescription>
                    )}
                  </div>
                </div>

                {/* Three-dot menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDropdown(todo.id)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 h-7 w-7"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {showDropdown === todo.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => editTodo(todo.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Badges Section */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={getCategoryColor(todo.category)}>
                  <Tag className="h-3 w-3 mr-1" />
                  {todo.category}
                </Badge>

                <Badge className={getPriorityColor(todo.priority_score)}>
                  <Flag className="h-3 w-3 mr-1" />
                  {getPriorityText(todo.priority_score)}
                </Badge>

                <Badge className={getStatusColor(todo.status)}>
                  <User className="h-3 w-3 mr-1" />
                  {todo.status.replace("_", " ")}
                </Badge>
              </div>

              {/* Deadline Section */}
              {todo.deadline && (
                <div
                  className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${
                    deadlineInfo.isOverdue && !isCompleted
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Due: {deadlineInfo.formatted}
                  </span>
                  {deadlineInfo.isOverdue && !isCompleted && (
                    <Badge className="bg-red-200 text-red-800 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
              )}

              {/* Timestamps */}
              <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>
                  Created: {new Date(todo.created_at).toLocaleDateString()}
                </span>
                <span>
                  Updated: {new Date(todo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(null)}
        />
      )}
    </div>
  );
};

const Form = () => {
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const generateAIresponse = async () => {
    try {
      const resp = await fetch(`${backend_url}/tasks/ai_suggestion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || "",
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        console.error("API error:", errorData);
        throw new Error("Failed to fetch AI suggestion");
      }

      const data = await resp.json();
      console.log("Response", data);
      console.log("Response", data.title, data.description);

      const parsedData = typeof data === "string" ? JSON.parse(data) : data;

      console.log("Parsed", parsedData.title, parsedData.description);

      setFormData({
        title: parsedData.title || "",
        description: parsedData.description || "",
        category: parsedData.category || "WORK",
        priority: parsedData.priority_score || 2,
        deadline: parsedData.deadline ? parsedData.deadline.split("T")[0] : "",
        status: "PENDING",
      });
    } catch (error) {
      console.error("Error generating AI task:", error);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "WORK",
    priority: 2,
    deadline: "",
    status: "PENDING",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    const client = createClient();
    const { data: userData } = await client.auth.getUser();
    const userId = userData?.user?.id;

    const newTodo = {
      user_id: userId,
      title: formData.title,
      description: formData.description,
      category: formData.category || "OTHERS",
      priority_score: formData.priority || 2,
      deadline: formData.deadline
        ? new Date(formData.deadline).toISOString()
        : new Date().toISOString(),
      status: "PENDING",
    };

    console.log(newTodo);

    const { error } = await client.from("tasks_task").insert([newTodo]);
    if (error) console.error(error);

    setFormData({
      title: "",
      description: "",
      category: "OTHERS",
      priority: 2,
      deadline: "",
      status: "",
    });
    setShowForm(false);
    router.refresh();
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Todo
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Create new Todo</DialogTitle>
            <DialogDescription>
              Add a new task to your todo list
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter todo title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter todo description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <Button
                type="button"
                onClick={generateAIresponse}
                variant={"secondary"}
              >
                <Bot />
                Generate Through AI
              </Button>
              <div className="space-y-2">
                <Label htmlFor="deadline">Due Date</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="WORK">Work</option>
                <option value="PERSONAL">Personal</option>
                <option value="OTHERS">Others</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} type="submit">
              Create Todo
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
