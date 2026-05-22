import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard — World Cup UI",
  description: "Fantasy tournament command deck",
};

export default function DashboardPage() {
  return <Dashboard />;
}
