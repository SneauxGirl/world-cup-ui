import type { Metadata } from "next";
import { RosterPage } from "@/components/dashboard/RosterPage";

export const metadata: Metadata = {
  title: "My Roster — World Cup UI",
  description: "Build and manage your fantasy squad",
};

export default function RosterRoutePage() {
  return <RosterPage />;
}
