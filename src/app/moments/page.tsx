import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Moments",
};

export default function MomentsPage() {
  redirect("/login");
}