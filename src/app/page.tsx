"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Priority = "LOW" | "MEDIUM" | "HIGH";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority?: string | null;
  createdAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("MEDIUM");
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
      body: JSON.stringify({ title: newTodo, priority: newPriority }),
    });

    if (res.ok) {
      setNewTodo("");
      setNewPriority("MEDIUM");
      fetchTodos();
    }
  }

  async function deleteTodo(id: string) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) =>
        todo.title.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [todos, search]
  );

  function getPriorityBadge(priority?: string | null) {
    if (!priority) return null;

    const p = priority.toUpperCase();
    if (p !== "LOW" && p !== "MEDIUM" && p !== "HIGH") return null;

    const className =
      p === "LOW"
        ? "bg-green-100 text-green-800 border-green-200"
        : p === "MEDIUM"
        ? "bg-yellow-100 text-yellow-900 border-yellow-200"
        : "bg-red-100 text-red-800 border-red-200";

    return (
      <Badge variant="outline" className={`h-5 px-2 text-xs ${className}`}>
        {p}
      </Badge>
    );
  }

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
            value={newPriority}
            onValueChange={(v) => setNewPriority(v as Priority)}
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
                <CardContent className="flex items-center justify-between gap-3 py-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-medium truncate">{todo.title}</span>
                    {getPriorityBadge(todo.priority)}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-zinc-400">
                      {formatDate(todo.createdAt)}
                    </span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      aria-label="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}