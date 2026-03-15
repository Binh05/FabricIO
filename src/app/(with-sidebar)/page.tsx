"use client";

import { useTools } from "@/hooks/useTools";
import { useEffect } from "react";

export default function HomePage() {
  const { fetchAllTool } = useTools();

  const fetchTools = async () => {
    await fetchAllTool();
  };

  useEffect(() => {
    fetchTools();
  }, []);

  return <div>Home page</div>;
}
