import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "./sidebar";
import { useToast } from "@/hooks/use-toast";
import { type User } from "@shared/schema";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, navigate] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (!location.startsWith("/login") && !location.startsWith("/signup")) {
      navigate("/login");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (!user && !location.startsWith("/login") && !location.startsWith("/signup")) {
    return null;
  }

  if (location.startsWith("/login") || location.startsWith("/signup")) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
