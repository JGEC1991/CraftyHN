import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CreditCard, TrendingUp } from "lucide-react";
import { type User, type InventoryItem, type Expense } from "@shared/schema";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const { data: inventory } = useQuery<InventoryItem[]>({
    queryKey: [`/api/organizations/${user?.organizationId}/inventory`],
    enabled: !!user,
  });

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: [`/api/organizations/${user?.organizationId}/expenses`],
    enabled: !!user,
  });

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const inventoryCount = inventory?.length || 0;

  const stats = [
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: CreditCard,
      description: "Total expenses tracked",
    },
    {
      title: "Inventory Items",
      value: inventoryCount,
      icon: Package,
      description: "Total items tracked",
    },
    {
      title: "Monthly Change",
      value: "+12%",
      icon: TrendingUp,
      description: "Growth this month",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
