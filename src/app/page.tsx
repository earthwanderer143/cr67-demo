"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
  createdAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
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
      body: JSON.stringify({ title: newTodo }),
    });

    if (res.ok) {
      setNewTodo("");
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
                  <span className="font-medium">{todo.title}</span>
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