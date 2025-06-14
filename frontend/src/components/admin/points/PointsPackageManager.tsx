import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  PointsPackage,
  adminCreatePointsPackage,
  adminDeletePointsPackage,
  adminGetAllPointsPackages,
  adminTogglePointsPackageStatus,
  adminUpdatePointsPackage,
} from "@/services/pointsService";
import { CheckCircle, Edit, Loader2, Trash2, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const PointsPackageManager: React.FC = () => {
  const [packages, setPackages] = useState<PointsPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentPackage, setCurrentPackage] = useState<Partial<PointsPackage>>({
    id: "",
    name: "",
    description: "",
    points: 0,
    price: 0,
    active: true,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await adminGetAllPointsPackages();
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching points packages:", error);
      toast.error("Failed to load points packages");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: PointsPackage) => {
    setCurrentPackage(pkg);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeletePointsPackage(id);
      setPackages(packages.filter((p) => p.id !== id));
      toast.success("Package deleted successfully");
    } catch (error) {
      console.error("Error deleting points package:", error);
      toast.error("Failed to delete points package");
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const response = await adminTogglePointsPackageStatus(id);

      setPackages(packages.map((pkg) => (pkg.id === id ? response.data : pkg)));

      toast.success(
        `Package ${
          response.data.active ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      console.error("Error toggling points package status:", error);
      toast.error("Failed to update package status");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setCurrentPackage({
      ...currentPackage,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : ["number", "range"].includes(type)
          ? parseFloat(value)
          : value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentPackage({
      ...currentPackage,
      active: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (currentPackage.id) {
        // Update existing package
        const { id, ...packageData } = currentPackage;
        const response = await adminUpdatePointsPackage(id, packageData);

        setPackages(
          packages.map((p) => (p.id === currentPackage.id ? response.data : p))
        );

        toast.success("Package updated successfully");
      } else {
        // Add new package
        const packageData = {
          name: currentPackage.name || "",
          description: currentPackage.description,
          points: currentPackage.points || 0,
          price: currentPackage.price || 0,
          active:
            currentPackage.active !== undefined ? currentPackage.active : true,
        };

        const response = await adminCreatePointsPackage(packageData);

        setPackages([...packages, response.data]);
        toast.success("Package created successfully");
      }

      // Reset form
      setCurrentPackage({
        id: "",
        name: "",
        description: "",
        points: 0,
        price: 0,
        active: true,
      });
    } catch (error) {
      console.error("Error saving points package:", error);
      toast.error("Failed to save points package");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Price (€)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading packages...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No points packages found. Create your first package below.
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {pkg.description || "-"}
                  </TableCell>
                  <TableCell>{pkg.points.toLocaleString()}</TableCell>
                  <TableCell>€{pkg.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {pkg.active ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={
                          pkg.active ? "text-green-700" : "text-red-700"
                        }
                      >
                        {pkg.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(pkg.id)}
                    >
                      {pkg.active ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border">
        <h3 className="text-lg font-medium mb-4">
          {currentPackage.id ? "Edit Package" : "Add New Package"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                name="name"
                value={currentPackage.name || ""}
                onChange={handleChange}
                placeholder="e.g., Starter Package"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points Amount</Label>
              <Input
                id="points"
                name="points"
                type="number"
                value={currentPackage.points || ""}
                onChange={handleChange}
                placeholder="e.g., 100"
                min={1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (€)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={currentPackage.price || ""}
                onChange={handleChange}
                placeholder="e.g., 10.00"
                min={0}
                step={0.01}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={currentPackage.description || ""}
                onChange={handleChange}
                placeholder="Describe the benefits of this package..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="active"
                checked={currentPackage.active || false}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCurrentPackage({
                  id: "",
                  name: "",
                  description: "",
                  points: 0,
                  price: 0,
                  active: true,
                });
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {currentPackage.id ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{currentPackage.id ? "Update" : "Add"} Package</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PointsPackageManager;
