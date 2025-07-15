"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [helloMessage, setHelloMessage] = useState<string>("");

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  async function handleSayHello() {
    try {
      const response = await client.queries.sayHello({
        name: "Amplify",
      });
      if (response.data) {
        setHelloMessage(response.data);
      }
    } catch (error) {
      console.error('Error calling sayHello:', error);
      setHelloMessage('Error calling sayHello function');
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <button onClick={handleSayHello}>Say Hello</button>
          {helloMessage && (
            <div style={{ margin: "10px 0", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
              <strong>Hello Message:</strong> {helloMessage}
            </div>
          )}
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}
                onClick={() => deleteTodo(todo.id)}
                style={{ cursor: "pointer", textDecoration: "line-through" }}
              >{todo.content}</li>
            ))}
          </ul>
          <button onClick={signOut}>Sign out</button>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
              Review next steps of this tutorial.
            </a>
          </div>
        </main>
      )}
    </Authenticator>
  );
}
