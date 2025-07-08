"use client";

import React, { useEffect, useState } from "react";
import { Plus, Check, X, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function TodoListPage({ todosData }: { todosData: any[] }) {
  const [todos, setTodos] = useState(todosData);

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                /* Add sync logic here */
              }}
            >
              <Clock className="h-4 w-4" />
              Sync
            </Button>
          </div>
        </div>

        {/* Todo Cards */}
        <div className="space-y-4">
          {todos.map((todo) => (
            <Card
              key={todo.id}
              className={`transition-all duration-200 ${
                todo.completed ? "opacity-60" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTodo(todo.id)}
                      className={`mt-1 p-1 h-6 w-6 rounded-full ${
                        todo.completed
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {todo.completed && <Check className="h-4 w-4" />}
                    </Button>
                    <div className="flex-1">
                      <CardTitle
                        className={`text-lg ${
                          todo.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.title}
                      </CardTitle>
                      {todo.description && (
                        <CardDescription className="mt-1">
                          {todo.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(todo.priority)}>
                      {todo.priority}
                    </Badge>
                    {todo.dueDate && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {todo.dueDate}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Created: {todo.createdAt}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

const Form = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "WORK",
    priority: 2,
    dueDate: "",
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
      deadline: formData.dueDate
        ? new Date(formData.dueDate).toISOString()
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
      dueDate: "",
      status: "",
    });
    setShowForm(false);
    router.refresh();
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Todo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new Todo</DialogTitle>
            <DialogDescription>
               Add a new task to your todo list
            </DialogDescription>
          </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                    />
                  </div>
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
            <Button onSubmit={handleSubmit} type="submit">Create Todo</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
