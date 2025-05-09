
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

const ReferralSettingsForm: React.FC = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    referrerReward: 100,
    referredReward: 50,
    minimumPurchase: 10,
    maxReferrals: 10,
    expirationDays: 30,
  });

  const handleChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Referral settings saved successfully');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Referral Program</Label>
            <p className="text-sm text-muted-foreground">
              Turn the referral program on or off platform-wide
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => handleChange('enabled', checked)}
          />
        </div>

        <Separator />

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="referrer-reward">Referrer Reward (Points)</Label>
            <Input
              id="referrer-reward"
              type="number"
              min={0}
              value={settings.referrerReward}
              onChange={(e) => handleChange('referrerReward', parseInt(e.target.value))}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Points awarded to users who refer someone
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referred-reward">New User Reward (Points)</Label>
            <Input
              id="referred-reward"
              type="number"
              min={0}
              value={settings.referredReward}
              onChange={(e) => handleChange('referredReward', parseInt(e.target.value))}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Points awarded to new users who sign up with a referral code
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-purchase">Minimum Purchase Amount (€)</Label>
            <Input
              id="min-purchase"
              type="number"
              min={0}
              step={0.01}
              value={settings.minimumPurchase}
              onChange={(e) => handleChange('minimumPurchase', parseFloat(e.target.value))}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Minimum purchase amount required to qualify for referral rewards
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-referrals">Maximum Referrals</Label>
            <Input
              id="max-referrals"
              type="number"
              min={0}
              value={settings.maxReferrals}
              onChange={(e) => handleChange('maxReferrals', parseInt(e.target.value))}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of referrals per user (0 for unlimited)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration">Referral Link Expiration (Days)</Label>
            <Input
              id="expiration"
              type="number"
              min={0}
              value={settings.expirationDays}
              onChange={(e) => handleChange('expirationDays', parseInt(e.target.value))}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Days until referral links expire (0 for never)
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Referral Code Preview</CardTitle>
            <CardDescription>Example of how referral URLs will look</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="bg-muted p-2 rounded block overflow-x-auto">
              https://wiselearning.com/register?ref=STUDENT123
            </code>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Settings</Button>
        </div>
      </div>
    </form>
  );
};

export default ReferralSettingsForm;
