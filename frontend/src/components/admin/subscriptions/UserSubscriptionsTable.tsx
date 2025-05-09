
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, Search, Edit, Check, X } from 'lucide-react';
import { mockUserSubscriptions, mockUserBundles, mockSubscriptionPlans, mockCourseBundles } from '@/data/mockSubscriptionData';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  UserSubscription, 
  UserBundle, 
  SubscriptionPlan, 
  CourseBundle 
} from '@/types/subscription';

const UserSubscriptionsTable: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>(mockUserSubscriptions);
  const [bundles, setBundles] = useState<UserBundle[]>(mockUserBundles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Find subscription plan by id
  const getSubscriptionPlan = (planId: string): SubscriptionPlan | undefined => {
    return mockSubscriptionPlans.find(plan => plan.id === planId);
  };

  // Find course bundle by id
  const getCourseBundle = (bundleId: string): CourseBundle | undefined => {
    return mockCourseBundles.find(bundle => bundle.id === bundleId);
  };

  // Filter subscriptions based on search term
  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.planId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter bundles based on search term
  const filteredBundles = bundles.filter(bundle => 
    bundle.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bundle.bundleId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewSubscriptionDetails = (subscription: UserSubscription) => {
    setSelectedSubscription(subscription);
    setIsDialogOpen(true);
  };

  const toggleAutoRenew = (subscriptionId: string, currentValue: boolean) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === subscriptionId ? { ...sub, autoRenew: !currentValue } : sub
    ));
    toast.success(`Auto-renew ${currentValue ? 'disabled' : 'enabled'} successfully`);
  };

  const cancelSubscription = (subscriptionId: string) => {
    if (confirm("Are you sure you want to cancel this subscription? This action cannot be undone.")) {
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId ? { ...sub, isActive: false } : sub
      ));
      toast.success("Subscription cancelled successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by user ID or plan ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">User Subscriptions</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Auto-Renew</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => {
                const plan = getSubscriptionPlan(sub.planId);
                return (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.userId}</TableCell>
                    <TableCell>{plan?.name || sub.planId}</TableCell>
                    <TableCell>{format(sub.startDate, 'PP')}</TableCell>
                    <TableCell>{format(sub.endDate, 'PP')}</TableCell>
                    <TableCell>
                      {sub.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X className="mr-1 h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={sub.autoRenew}
                        onCheckedChange={() => toggleAutoRenew(sub.id, sub.autoRenew)}
                        disabled={!sub.isActive}
                      />
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => viewSubscriptionDetails(sub)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {sub.isActive && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => cancelSubscription(sub.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredSubscriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No subscriptions matching your search' : 'No active subscriptions found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">User Course Packages</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBundles.map((bundle) => {
                const packageInfo = getCourseBundle(bundle.bundleId);
                return (
                  <TableRow key={bundle.id}>
                    <TableCell className="font-medium">{bundle.userId}</TableCell>
                    <TableCell>{packageInfo?.name || bundle.bundleId}</TableCell>
                    <TableCell>{format(bundle.purchaseDate, 'PP')}</TableCell>
                    <TableCell>{packageInfo?.price || 'N/A'} RON</TableCell>
                  </TableRow>
                );
              })}
              {filteredBundles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No packages matching your search' : 'No purchased packages found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedSubscription && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected subscription
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Subscription ID</Label>
                  <div className="font-medium">{selectedSubscription.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">User ID</Label>
                  <div className="font-medium">{selectedSubscription.userId}</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Subscription Plan</Label>
                <div className="font-medium">
                  {getSubscriptionPlan(selectedSubscription.planId)?.name || selectedSubscription.planId}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Start Date</Label>
                  <div>{format(selectedSubscription.startDate, 'PPP')}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">End Date</Label>
                  <div>{format(selectedSubscription.endDate, 'PPP')}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Status</Label>
                  <div className={`${selectedSubscription.isActive ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {selectedSubscription.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Auto-Renew</Label>
                  <div className="font-medium">{selectedSubscription.autoRenew ? 'Enabled' : 'Disabled'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Payment Method</Label>
                  <div className="capitalize">{selectedSubscription.paymentMethod}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Last Payment</Label>
                  <div>{format(selectedSubscription.lastPaymentDate, 'PPP')}</div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex space-x-2">
              {selectedSubscription.isActive && (
                <Button 
                  variant="outline" 
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => {
                    cancelSubscription(selectedSubscription.id);
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel Subscription
                </Button>
              )}
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default UserSubscriptionsTable;
