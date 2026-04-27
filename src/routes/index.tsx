import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  // Server-side redirect to the static site.html that contains the full
  // single-file experience (login gate, visual novel, memory game, etc.)
  beforeLoad: () => {
    if (typeof window === "undefined") {
      throw redirect({ href: "/site.html" });
    }
  },
  component: Index,
});

function Index() {
  // Client-side fallback (in case beforeLoad didn't redirect)
  useEffect(() => {
    window.location.replace("/site.html");
  }, []);
  return null;
}
