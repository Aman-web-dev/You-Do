"use client";
import { useRouter } from 'next/navigation';

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  X,
  Edit3,
  Check,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/utils/client";
const TodoApp = () => {
  const router= useRouter()
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Complete project proposal",
      description: "Finish the Q4 project proposal and submit to management",
      dueDate: "2025-07-08",
      completionTime: "14:30",
      status: "pending",
      createdAt: "2025-07-05",
    },
    {
      id: 2,
      title: "Review code changes",
      description: "Review the pull requests from the development team",
      dueDate: "2025-07-07",
      completionTime: "10:00",
      status: "in-progress",
      createdAt: "2025-07-04",
    },
    {
      id: 3,
      title: "Team meeting preparation",
      description: "Prepare agenda and materials for weekly team meeting",
      dueDate: "2025-07-09",
      completionTime: "09:00",
      status: "completed",
      createdAt: "2025-07-03",
    },
    {
      id: 4,
      title: "Client presentation",
      description: "Present the new feature updates to the client",
      dueDate: "2025-07-10",
      completionTime: "15:00",
      status: "pending",
      createdAt: "2025-07-06",
    },
    {
      id: 5,
      title: "Database optimization",
      description: "Optimize database queries for better performance",
      dueDate: "2025-07-06",
      completionTime: "16:00",
      status: "in-progress",
      createdAt: "2025-07-02",
    },
    {
      id: 6,
      title: "Write documentation",
      description: "Create user documentation for the new API endpoints",
      dueDate: "2025-07-12",
      completionTime: "11:00",
      status: "pending",
      createdAt: "2025-07-01",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
    completionTime: "",
    status: "pending",
  });

  const sortedTodos = [...todos].sort((a, b) => {
    const dateA = new Date(a.dueDate + "T" + a.completionTime);
    const dateB = new Date(b.dueDate + "T" + b.completionTime);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleSignout = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    console.log("data", data);
    if (data.user) {
      await supabase.auth.signOut();
      router.refresh()
    }
  };

  const handleCreateTodo = (e) => {
    e.preventDefault();
    if (newTodo.title.trim() && newTodo.dueDate && newTodo.completionTime) {
      const todo = {
        id: Date.now(),
        ...newTodo,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTodos([...todos, todo]);
      setNewTodo({
        title: "",
        description: "",
        dueDate: "",
        completionTime: "",
        status: "pending",
      });
      setShowForm(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate, completionTime, status) => {
    if (status === "completed") return false;
    const now = new Date();
    const due = new Date(dueDate + "T" + completionTime);
    return due < now;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <button onClick={handleSignout}>Sign out</button>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Todo Manager</h1>
            <p className="text-blue-100">
              Organize your tasks and stay productive
            </p>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Todo
                </button>
                <div className="text-sm text-gray-600">
                  {todos.length} tasks total
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">Date: Earliest First</option>
                  <option value="desc">Date: Latest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="p-6">
            <div className="space-y-4">
              {sortedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                    isOverdue(todo.dueDate, todo.completionTime, todo.status)
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {todo.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                            todo.status
                          )}`}
                        >
                          {getStatusIcon(todo.status)}
                          {todo.status.replace("-", " ")}
                        </span>
                        {isOverdue(
                          todo.dueDate,
                          todo.completionTime,
                          todo.status
                        ) && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            Overdue
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3">{todo.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(todo.dueDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {todo.completionTime}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <select
                        value={todo.status}
                        onChange={(e) =>
                          handleStatusChange(todo.id, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popup Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Create New Todo
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateTodo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newTodo.title}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, title: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter todo title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTodo.description}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, description: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                      placeholder="Enter description (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newTodo.dueDate}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, dueDate: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Completion Time *
                    </label>
                    <input
                      type="time"
                      value={newTodo.completionTime}
                      onChange={(e) =>
                        setNewTodo({
                          ...newTodo,
                          completionTime: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newTodo.status}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, status: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Create Todo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
