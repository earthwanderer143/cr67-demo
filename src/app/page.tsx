"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: string | null;
  createdAt: string;
}

type Priority = "LOW" | "MEDIUM" | "HIGH";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo, priority }),
    });

    if (res.ok) {
      setNewTodo("");
      setPriority("MEDIUM");
      fetchTodos();
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getPriorityBadge(priorityValue: Todo["priority"]) {
    if (!priorityValue) return null;

    const className =
      priorityValue === "LOW"
        ? "bg-green-100 text-green-800 border-green-200"
        : priorityValue === "MEDIUM"
        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
        : "bg-red-100 text-red-800 border-red-200";

    return (
      <Badge variant="outline" className={`h-5 px-2 text-xs ${className}`}>
        {priorityValue}
      </Badge>
    );
  }

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>

        <form onSubmit={addTodo} className="flex gap-2 mb-8">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1"
          />

          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as Priority)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">LOW</SelectItem>
              <SelectItem value="MEDIUM">MEDIUM</SelectItem>
              <SelectItem value="HIGH">HIGH</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit">Add</Button>
        </form>

        <div className="mb-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search todos..."
          />
        </div>

        {loading ? (
          <p className="text-center text-zinc-500">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-zinc-500">
            No todos yet. Add one above!
          </p>
        ) : filteredTodos.length === 0 ? (
          <p className="text-center text-zinc-500">No matching todos</p>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <Card key={todo.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium truncate">{todo.title}</span>
                    {getPriorityBadge(todo.priority)}
                  </div>
                  <span className="text-sm text-zinc-400">
                    {formatDate(todo.createdAt)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}