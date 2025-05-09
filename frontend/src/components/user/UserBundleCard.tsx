
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { UserBundle } from '@/types/subscription';
import { mockCourseBundles } from '@/data/mockSubscriptionData';

interface UserBundleCardProps {
  userBundle: UserBundle;
}

const UserBundleCard: React.FC<UserBundleCardProps> = ({ userBundle }) => {
  const bundle = mockCourseBundles.find(b => b.id === userBundle.bundleId);
  
  if (!bundle) return null;
  
  return (
    <Card className="overflow-hidden">
      {bundle.imageUrl && (
        <div className="h-24 overflow-hidden">
          <img 
            src={bundle.imageUrl} 
            alt={bundle.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200 mb-2">
              Acces permanent
            </Badge>
            <CardTitle className="text-lg">{bundle.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data achiziției:</span>
            <span className="font-medium">{userBundle.purchaseDate.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cursuri incluse:</span>
            <span className="font-medium">{bundle.courses.length}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={`/courses?bundle=${bundle.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Accesează cursurile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default UserBundleCard;
