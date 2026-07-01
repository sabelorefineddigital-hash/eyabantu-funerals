import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  redirect("/login");
}