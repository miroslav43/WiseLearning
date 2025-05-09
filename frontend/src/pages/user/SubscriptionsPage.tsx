import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, CheckCircle, CreditCard, Info, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan, CourseBundle } from '@/types/subscription';
import { mockSubscriptionPlans, mockCourseBundles, mockUserSubscriptions, mockUserBundles } from '@/data/mockSubscriptionData';
import { useAuth } from '@/contexts/AuthContext';

const SubscriptionsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<CourseBundle | null>(null);

  // Find active user subscription if any
  const activeSubscription = mockUserSubscriptions.find(
    sub => sub.userId === user?.id && sub.isActive
  );

  // Find user bundles if any
  const userBundles = mockUserBundles.filter(bundle => bundle.userId === user?.id);

  // Filter plans by period
  const filteredPlans = mockSubscriptionPlans.filter(plan => plan.period === selectedPeriod);

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setSelectedBundle(null);
    setOpenDialog(true);
  };

  const handleBundlePurchase = (bundle: CourseBundle) => {
    setSelectedBundle(bundle);
    setSelectedPlan(null);
    setOpenDialog(true);
  };

  const handlePurchaseConfirm = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOpenDialog(false);
      
      toast({
        title: "Achiziție cu succes!",
        description: selectedPlan 
          ? `Ai achiziționat abonamentul ${selectedPlan.name}`
          : `Ai achiziționat pachetul ${selectedBundle?.name}`,
        variant: "default",
      });

      // In a real app, you would update the user's subscription/bundles here
    }, 1500);
  };

  const handleCancelSubscription = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Abonament anulat",
        description: "Abonamentul tău a fost anulat cu succes. Vei avea acces până la sfârșitul perioadei plătite.",
        variant: "default",
      });

      // In a real app, you would update the user's subscription here
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Abonamente și pachete</h1>
      <p className="text-gray-500 mb-8">Alege planul care ți se potrivește pentru a accesa cursurile noastre</p>
      
      <Tabs defaultValue="subscriptions" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="subscriptions">Abonamente</TabsTrigger>
          <TabsTrigger value="bundles">Pachete de cursuri</TabsTrigger>
          <TabsTrigger value="my-plans">Planurile mele</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions">
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <RadioGroup 
                value={selectedPeriod} 
                onValueChange={(value) => setSelectedPeriod(value as 'monthly' | 'annual')}
                className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg"
              >
                <div className={`flex items-center space-x-2 px-4 py-2 rounded ${selectedPeriod === 'monthly' ? 'bg-white shadow' : ''}`}>
                  <RadioGroupItem 
                    value="monthly" 
                    id="monthly" 
                    className="sr-only" 
                  />
                  <Label htmlFor="monthly" className="cursor-pointer">Lunar</Label>
                </div>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded ${selectedPeriod === 'annual' ? 'bg-white shadow' : ''}`}>
                  <RadioGroupItem 
                    value="annual" 
                    id="annual" 
                    className="sr-only" 
                  />
                  <Label htmlFor="annual" className="cursor-pointer">Anual (Economisești 15%)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPlans.map((plan) => {
                const isActivePlan = activeSubscription?.planId === plan.id;
                
                return (
                  <Card key={plan.id} className={`relative overflow-hidden ${plan.isPopular ? 'border-brand-500 shadow-lg' : ''}`}>
                    {plan.isPopular && (
                      <div className="absolute top-0 right-0 bg-brand-500 text-white px-4 py-1 text-sm font-medium">
                        Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">{plan.price} RON</span>
                        <span className="text-muted-foreground">/{plan.period === 'monthly' ? 'lună' : 'an'}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {plan.featuredBenefit && (
                        <div className="bg-brand-50 border border-brand-100 rounded-md p-3 mb-4">
                          <p className="text-brand-800 font-medium flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2 text-brand-500" />
                            {plan.featuredBenefit}
                          </p>
                        </div>
                      )}
                      <ul className="space-y-2">
                        {plan.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-brand-500 mr-2 mt-0.5 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      {isActivePlan ? (
                        <Button disabled className="w-full">Abonament activ</Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => handleSubscribe(plan)}
                        >
                          Abonează-te acum
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="bundles">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockCourseBundles.map((bundle) => {
              const isOwned = userBundles.some(ub => ub.bundleId === bundle.id);
              
              return (
                <Card key={bundle.id} className="overflow-hidden">
                  {bundle.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={bundle.imageUrl} 
                        alt={bundle.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{bundle.name}</CardTitle>
                        <CardDescription>{bundle.description}</CardDescription>
                      </div>
                      <Badge variant="destructive" className="shrink-0">-{bundle.discount}%</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{bundle.price} RON</span>
                        <span className="text-muted-foreground line-through">{bundle.originalPrice} RON</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Acces permanent</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {bundle.featuredBenefit && (
                      <div className="bg-brand-50 border border-brand-100 rounded-md p-3 mb-4">
                        <p className="text-brand-800 font-medium flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-brand-500" />
                          {bundle.featuredBenefit}
                        </p>
                      </div>
                    )}
                    <p className="text-sm font-medium mb-2">Acest pachet include:</p>
                    <ul className="space-y-2">
                      {bundle.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-brand-500 mr-2 mt-0.5 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {isOwned ? (
                      <Button disabled className="w-full">Deja achiziționat</Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => handleBundlePurchase(bundle)}
                      >
                        Cumpără acum
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="my-plans">
          <div className="space-y-8">
            {/* Active subscription section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Abonamente active</h2>
              {activeSubscription ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {mockSubscriptionPlans.find(p => p.id === activeSubscription.planId)?.name || 'Abonament'}
                        </CardTitle>
                        <CardDescription>
                          {mockSubscriptionPlans.find(p => p.id === activeSubscription.planId)?.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Activ
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Data începerii</p>
                          <p className="font-medium">{activeSubscription.startDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Data expirării</p>
                          <p className="font-medium">{activeSubscription.endDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Metoda de plată</p>
                        <p className="font-medium flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Card ••••4242
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`mr-3 h-5 w-5 rounded-full ${activeSubscription.autoRenew ? 'bg-green-500' : 'bg-red-500'}`}>
                          <Check className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {activeSubscription.autoRenew ? 'Reînnoire automată activată' : 'Reînnoire automată dezactivată'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activeSubscription.autoRenew 
                              ? `Se va reînnoi automat pe ${activeSubscription.endDate.toLocaleDateString()}`
                              : `Abonamentul va expira pe ${activeSubscription.endDate.toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Schimbă planul</Button>
                    <Button variant="destructive" onClick={handleCancelSubscription}>
                      {isLoading ? 'Se procesează...' : 'Anulează abonamentul'}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle>Nu ai niciun abonament activ</CardTitle>
                    <CardDescription>
                      Abonamentele îți oferă acces la toate cursurile și funcționalitățile platformei
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={() => {
                      const element = document.querySelector('[data-value="subscriptions"]') as HTMLElement;
                      if (element) element.click();
                    }}>
                      Vezi abonamente
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
            
            {/* Purchased bundles section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Pachete achiziționate</h2>
              {userBundles.length > 0 ? (
                <div className="space-y-4">
                  {userBundles.map(userBundle => {
                    const bundle = mockCourseBundles.find(b => b.id === userBundle.bundleId);
                    if (!bundle) return null;
                    
                    return (
                      <Card key={userBundle.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{bundle.name}</CardTitle>
                              <CardDescription>{bundle.description}</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">
                              Acces permanent
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Data achiziției</p>
                              <p className="font-medium">{userBundle.purchaseDate.toLocaleDateString()}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-2">Cursuri incluse:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {bundle.courses.map((courseId, index) => (
                                  <Link 
                                    key={index} 
                                    to={`/courses/${courseId}`}
                                    className="flex items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                                  >
                                    <Package className="h-4 w-4 mr-2 text-brand-500" />
                                    <span className="text-sm">Curs {index + 1}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline">
                            Accesează cursurile
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle>Nu ai niciun pachet achiziționat</CardTitle>
                    <CardDescription>
                      Pachetele îți oferă acces permanent la grupuri de cursuri la un preț redus
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={() => {
                      const element = document.querySelector('[data-value="bundles"]') as HTMLElement;
                      if (element) element.click();
                    }}>
                      Vezi pachete
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? 'Confirmare abonament' : 'Confirmare achiziție pachet'}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan 
                ? 'Ești pe cale să achiziționezi un abonament. Verifică detaliile de mai jos.'
                : 'Ești pe cale să achiziționezi un pachet de cursuri. Verifică detaliile de mai jos.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{selectedPlan?.name || selectedBundle?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan?.description || selectedBundle?.description}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {selectedPlan?.price || selectedBundle?.price} RON
                </p>
                {selectedPlan ? (
                  <p className="text-sm text-muted-foreground">
                    /{selectedPlan.period === 'monthly' ? 'lună' : 'an'}
                  </p>
                ) : selectedBundle && (
                  <p className="text-sm text-muted-foreground line-through">
                    {selectedBundle.originalPrice} RON
                  </p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-sm flex items-start">
              <Info className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Informații importante</p>
                {selectedPlan ? (
                  <p className="text-yellow-700">
                    {selectedPlan.period === 'monthly' 
                      ? 'Abonamentul se va reînnoi automat lunar, până la anulare.'
                      : 'Abonamentul se va reînnoi automat anual, până la anulare.'
                    }
                  </p>
                ) : (
                  <p className="text-yellow-700">
                    Pachetul oferă acces permanent la cursurile incluse.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Anulează</Button>
            <Button onClick={handlePurchaseConfirm} disabled={isLoading}>
              {isLoading ? 'Se procesează...' : 'Confirmă achiziția'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsPage;
