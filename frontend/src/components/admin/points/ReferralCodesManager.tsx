import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as pointsService from "@/services/pointsService";
import { Copy, Edit, Loader2, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface ReferralCode {
  id: string;
  code: string;
  pointsReward: number;
  maxUses: number | null;
  usageCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const ReferralCodesManager: React.FC = () => {
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCode, setSelectedCode] = useState<ReferralCode | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    pointsReward: 50,
    maxUses: null as number | null,
    active: true,
    expiresAt: null as string | null,
  });

  useEffect(() => {
    fetchReferralCodes();
  }, []);

  const fetchReferralCodes = async () => {
    try {
      setIsLoading(true);
      // This endpoint would need to be implemented in the backend
      const response = await pointsService.adminGetAllReferralCodes();
      setReferralCodes(response.data);
    } catch (error) {
      console.error("Error fetching referral codes:", error);
      toast.error("Failed to load referral codes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value) : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      active: checked,
    });
  };

  const resetForm = () => {
    setFormData({
      code: "",
      pointsReward: 50,
      maxUses: null,
      active: true,
      expiresAt: null,
    });
    setSelectedCode(null);
  };

  const openEditForm = (code: ReferralCode) => {
    setSelectedCode(code);
    setFormData({
      code: code.code,
      pointsReward: code.pointsReward,
      maxUses: code.maxUses,
      active: code.active,
      expiresAt: code.expiresAt,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedCode) {
        // Update existing code
        await pointsService.adminUpdateReferralCode(selectedCode.id, formData);
        toast.success("Referral code updated successfully");
      } else {
        // Create new code
        await pointsService.adminCreateReferralCode(formData);
        toast.success("Referral code created successfully");
      }

      // Refresh the list
      fetchReferralCodes();
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving referral code:", error);
      toast.error(
        selectedCode
          ? "Failed to update referral code"
          : "Failed to create referral code"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this referral code?")) {
      try {
        await pointsService.adminDeleteReferralCode(id);
        toast.success("Referral code deleted successfully");
        fetchReferralCodes();
      } catch (error) {
        console.error("Error deleting referral code:", error);
        toast.error("Failed to delete referral code");
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await pointsService.adminToggleReferralCodeStatus(id);
      toast.success(
        `Referral code ${
          currentStatus ? "deactivated" : "activated"
        } successfully`
      );
      fetchReferralCodes();
    } catch (error) {
      console.error("Error toggling referral code status:", error);
      toast.error("Failed to update referral code status");
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Referral Codes</CardTitle>
            <CardDescription>
              Manage referral codes for your points system
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Referral Code
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableCaption>List of available referral codes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Points Reward</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Max Uses</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referralCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No referral codes found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                referralCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {code.code}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(code.code)}
                          className="ml-2 h-6 w-6"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{code.pointsReward}</TableCell>
                    <TableCell>{code.usageCount}</TableCell>
                    <TableCell>{code.maxUses || "Unlimited"}</TableCell>
                    <TableCell>{formatDate(code.expiresAt)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={code.active}
                        onCheckedChange={() =>
                          handleToggleStatus(code.id, code.active)
                        }
                        className="data-[state=checked]:bg-green-500"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditForm(code)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteCode(code.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCode ? "Edit Referral Code" : "Create Referral Code"}
              </DialogTitle>
              <DialogDescription>
                {selectedCode
                  ? "Update the details of this referral code"
                  : "Create a new referral code for users"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                    placeholder="WELCOME25"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pointsReward" className="text-right">
                    Points Reward
                  </Label>
                  <Input
                    id="pointsReward"
                    name="pointsReward"
                    type="number"
                    min="1"
                    value={formData.pointsReward}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxUses" className="text-right">
                    Max Uses
                  </Label>
                  <Input
                    id="maxUses"
                    name="maxUses"
                    type="number"
                    min="1"
                    value={formData.maxUses === null ? "" : formData.maxUses}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Unlimited if blank"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiresAt" className="text-right">
                    Expires At
                  </Label>
                  <Input
                    id="expiresAt"
                    name="expiresAt"
                    type="date"
                    value={formData.expiresAt || ""}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Never expires if blank"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Active
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={handleSwitchChange}
                    />
                    <span className="ml-2">
                      {formData.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : selectedCode ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ReferralCodesManager;
