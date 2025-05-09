
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check } from 'lucide-react';
import { UserSubscription } from '@/types/subscription';
import { mockSubscriptionPlans } from '@/data/mockSubscriptionData';

interface SubscriptionCardProps {
  subscription: UserSubscription;
  onManage: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onManage }) => {
  const plan = mockSubscriptionPlans.find(p => p.id === subscription.planId);
  
  if (!plan) return null;
  
  // Calculate remaining days
  const today = new Date();
  const endDate = new Date(subscription.endDate);
  const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="border-brand-100 bg-gradient-to-br from-white to-brand-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2">
              Activ
            </Badge>
            <CardTitle>{plan.name}</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{plan.price} RON</p>
            <p className="text-sm text-muted-foreground">
              /{plan.period === 'monthly' ? 'lună' : 'an'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium text-green-600">Activ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Zile rămase:</span>
            <span className="font-medium">{remainingDays} zile</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reînnoire automată:</span>
            <span className="font-medium flex items-center">
              <div className={`mr-1.5 h-3.5 w-3.5 rounded-full ${subscription.autoRenew ? 'bg-green-500' : 'bg-red-500'}`}>
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              {subscription.autoRenew ? 'Da' : 'Nu'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Metoda de plată:</span>
            <span className="font-medium flex items-center">
              <CreditCard className="h-3.5 w-3.5 mr-1.5" />
              Card ••••4242
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full" variant="outline" onClick={onManage}>
          Gestionează abonamentul
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
