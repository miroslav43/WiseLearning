import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowUpDown,
  Coins,
  Package,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import React, { useState } from "react";

// Mock data for points packages
const mockPointsPackages = [
  { id: "1", name: "Starter", points: 100, price: 19.99, active: true },
  { id: "2", name: "Standard", points: 500, price: 49.99, active: true },
  { id: "3", name: "Premium", points: 1000, price: 89.99, active: true },
  { id: "4", name: "Ultimate", points: 2500, price: 199.99, active: false },
];

// Mock data for points transactions
const mockTransactions = [
  {
    id: "1",
    userId: "user123",
    userName: "John Doe",
    type: "purchase",
    amount: 500,
    packageName: "Standard",
    date: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user456",
    userName: "Jane Smith",
    type: "reward",
    amount: 50,
    reason: "Course completion",
    date: "2023-05-14T14:45:00Z",
  },
  {
    id: "3",
    userId: "user789",
    userName: "Alex Johnson",
    type: "purchase",
    amount: 1000,
    packageName: "Premium",
    date: "2023-05-13T09:15:00Z",
  },
  {
    id: "4",
    userId: "user123",
    userName: "John Doe",
    type: "spent",
    amount: -200,
    itemName: "Premium Course Access",
    date: "2023-05-12T16:20:00Z",
  },
  {
    id: "5",
    userId: "user456",
    userName: "Jane Smith",
    type: "spent",
    amount: -100,
    itemName: "Private Tutoring Session",
    date: "2023-05-11T11:10:00Z",
  },
];

const PointsManagement: React.FC = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState(mockPointsPackages);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: "",
    points: 0,
    price: 0,
    active: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Add new package
  const handleAddPackage = () => {
    if (!newPackage.name || newPackage.points <= 0 || newPackage.price < 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    const packageWithId = {
      ...newPackage,
      id: `new-${Date.now()}`,
    };

    setPackages([...packages, packageWithId]);
    setNewPackage({ name: "", points: 0, price: 0, active: true });
    setIsAddingPackage(false);

    toast({
      title: "Package Added",
      description: `${packageWithId.name} package has been added successfully.`,
    });
  };

  // Toggle package status
  const togglePackageStatus = (id: string) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === id ? { ...pkg, active: !pkg.active } : pkg
      )
    );

    const packageItem = packages.find((pkg) => pkg.id === id);
    if (packageItem) {
      toast({
        title: packageItem.active ? "Package Deactivated" : "Package Activated",
        description: `${packageItem.name} package has been ${
          packageItem.active ? "deactivated" : "activated"
        }.`,
      });
    }
  };

  // Delete package
  const deletePackage = (id: string) => {
    const packageToDelete = packages.find((pkg) => pkg.id === id);
    setPackages(packages.filter((pkg) => pkg.id !== id));

    if (packageToDelete) {
      toast({
        title: "Package Deleted",
        description: `${packageToDelete.name} package has been deleted.`,
      });
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    return matchesSearch && transaction.type === filterType;
  });

  return (
    <Tabs defaultValue="packages" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="packages">Points Packages</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
      </TabsList>

      <TabsContent value="packages" className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Points Packages</h3>
          <Button
            onClick={() => setIsAddingPackage(true)}
            className="gap-2 bg-brand-500 hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" />
            Add Package
          </Button>
        </div>

        {isAddingPackage && (
          <Card className="mb-4 border-dashed">
            <CardHeader>
              <CardTitle>Add New Package</CardTitle>
              <CardDescription>
                Create a new points package for users to purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    value={newPackage.name}
                    onChange={(e) =>
                      setNewPackage({ ...newPackage, name: e.target.value })
                    }
                    placeholder="e.g. Basic Package"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={newPackage.points || ""}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          points: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="e.g. 100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (RON)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newPackage.price || ""}
                      onChange={(e) =>
                        setNewPackage({
                          ...newPackage,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="e.g. 19.99"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsAddingPackage(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddPackage}>Save Package</Button>
            </CardFooter>
          </Card>
        )}

        {packages.length === 0 ? (
          <AdminEmptyState
            title="No Points Packages"
            description="There are no points packages defined yet. Add your first package to get started."
            icon={<Package className="h-12 w-12 text-muted-foreground/50" />}
            actionLabel="Add Package"
            onAction={() => setIsAddingPackage(true)}
          />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Price (RON)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{pkg.points}</TableCell>
                    <TableCell>{pkg.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          pkg.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pkg.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePackageStatus(pkg.id)}
                        >
                          {pkg.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePackage(pkg.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="transactions" className="space-y-4 mt-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <h3 className="text-lg font-medium">Points Transactions</h3>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search user..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Transaction Type</SelectLabel>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchases</SelectItem>
                  <SelectItem value="reward">Rewards</SelectItem>
                  <SelectItem value="spent">Spent</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="shrink-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <AdminEmptyState
            title="No Transactions Found"
            description={
              searchTerm || filterType !== "all"
                ? "No transactions match your search criteria."
                : "There are no points transactions recorded yet."
            }
            icon={<Coins className="h-12 w-12 text-muted-foreground/50" />}
            showRefresh={true}
            onRefresh={() => {
              setSearchTerm("");
              setFilterType("all");
            }}
          />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Type
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Points
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {transaction.userName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.userId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === "purchase"
                            ? "bg-blue-100 text-blue-800"
                            : transaction.type === "reward"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={
                        transaction.amount < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {transaction.amount > 0
                        ? `+${transaction.amount}`
                        : transaction.amount}
                    </TableCell>
                    <TableCell>
                      {transaction.type === "purchase" &&
                        transaction.packageName}
                      {transaction.type === "reward" && transaction.reason}
                      {transaction.type === "spent" && transaction.itemName}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString("ro-RO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PointsManagement;
