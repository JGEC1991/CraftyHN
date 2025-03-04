import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Database,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type User } from "@shared/schema";

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/custom-fields", icon: Database, label: "Custom Fields" },
    { href: "/users", icon: Users, label: "Users" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-card border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground">Business App</h1>
        {user && (
          <p className="mt-2 text-sm text-muted-foreground">
            {user.username}
          </p>
        )}
      </div>

      <nav className="px-4 py-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <a
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                location === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </a>
          </Link>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 mt-4"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </nav>
    </div>
  );
}
