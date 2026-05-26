import type { Metadata } from "next";
import { Login } from "@/components/login/Login";

export const metadata: Metadata = {
  title: "Login — World Cup UI",
  description: "Sign in to your World Cup Challenge account",
};

export default function Home() {
  return <Login />;
}
