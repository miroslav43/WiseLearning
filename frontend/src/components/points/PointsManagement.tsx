
import React, { useState } from 'react';
import { usePoints, pointsPackages } from '@/contexts/PointsContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Coins, Gift, Award, Star } from 'lucide-react';

const PointsManagement: React.FC = () => {
  const { points, formatPoints, transactions, achievements, buyPointsPackage } = usePoints();
  const [activeTab, setActiveTab] = useState("overview");
  
  const pendingAchievements = achievements.filter(a => !a.completed);
  const completedAchievements = achievements.filter(a => a.completed);
  
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Punctele mele
        </CardTitle>
        <CardDescription>
          Gestionează-ți punctele, cumpără mai multe sau verifică-ți realizările
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-700 mb-1">Puncte disponibile</p>
              <p className="text-3xl font-bold text-brand-900">{formatPoints(points)}</p>
            </div>
            <Badge variant="brand" className="text-lg py-1.5 px-3">
              <Coins className="mr-1.5 h-4 w-4" />
              Puncte
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Sumar</TabsTrigger>
            <TabsTrigger value="buy">Cumpără</TabsTrigger>
            <TabsTrigger value="achievements">Realizări</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Ultimele tranzacții</h3>
              {transactions.length === 0 ? (
                <p className="text-sm text-gray-500">Nu ai încă nicio tranzacție.</p>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                        </div>
                        <Badge variant={transaction.amount > 0 ? "brand" : "outline"}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} puncte
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="buy" className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-4">Pachete de puncte</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pointsPackages.map((pkg) => (
                  <Card key={pkg.id} className={pkg.discounted ? "border-green-300" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{formatPoints(pkg.points)} puncte</CardTitle>
                          {pkg.discounted && (
                            <Badge variant="brand" className="mt-1">
                              Economisești {formatPoints(pkg.originalPrice - pkg.price)} RON
                            </Badge>
                          )}
                        </div>
                        <Coins className="h-6 w-6 text-brand-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold">{pkg.price} RON</span>
                        {pkg.discounted && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {pkg.originalPrice} RON
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => buyPointsPackage(pkg.id)}
                      >
                        Cumpără acum
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-4">
            {pendingAchievements.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-2">Realizări disponibile</h3>
                <div className="space-y-3">
                  {pendingAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Award className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        +{achievement.pointsRewarded} puncte
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {completedAchievements.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-2">Realizări obținute</h3>
                <div className="space-y-3">
                  {completedAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex justify-between items-center p-3 border rounded-md bg-brand-50">
                      <div className="flex items-center gap-3">
                        <div className="bg-brand-100 p-2 rounded-full">
                          <Star className="h-5 w-5 text-brand-700" />
                        </div>
                        <div>
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-gray-500">
                            {achievement.description} • 
                            {achievement.completedAt && ` Obținut pe ${formatDate(achievement.completedAt)}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="brand">
                        +{achievement.pointsRewarded} puncte
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PointsManagement;
