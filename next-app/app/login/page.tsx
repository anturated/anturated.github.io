"use client"

import Header from "@/components/Header";
import { FormEvent, useContext } from "react";

export default function Login() {
  const inputStyle = "rounded bg-surface-container p-2"
  const buttonStyle = "bg-primary text-surface p-1 min-w-30 rounded-2xl flex items-center justify-center"

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const action = submitter.value;

    console.log(action);

    if (action == "login") {
      try {
        const response = await fetch('/api/login', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
        }

        const token = localStorage.getItem("token");

        fetch('/api/user', {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          }
        })
          .then(res => res.json())
          .then(data => {
            console.log(`NAME: ${data.Name}`);
          });
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const response = await fetch('/api/register', {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            name: email,
            password: password
          })
        });
        if (response.ok) {
          console.log("registered successfully")
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col flex-1 items-center justify-center gap-6">
        <span className="font-bold text-2xl">Login / Register</span>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit} >
          <input
            className={inputStyle}
            type="text"
            name="email"
            id="email"
            placeholder="Login"
          />
          <input
            className={inputStyle}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <div className="flex justify-around">
            <button className={buttonStyle} type="submit" name="action" value="login">
              <span>Login</span>
            </button>
            <button className={buttonStyle} type="submit" name="action" value="register">
              <span>Register</span>
            </button>
          </div>
        </form>
        <span className="text-error text-center m-6 absolute ">error text</span>
      </div>
    </div>
  )
}
