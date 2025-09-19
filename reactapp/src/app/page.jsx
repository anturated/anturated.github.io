import React from "react";
import Form from "@/components/Form";
import Header from "@/components/Header";
import TodoList from "@/components/TodoList";
import TodoBanner from "@/components/TodoBanner";

function Home() {
  return (
    <div className="wrapper">
      <Header/>
      <TodoBanner todo_/>
    </div>
  )
}
