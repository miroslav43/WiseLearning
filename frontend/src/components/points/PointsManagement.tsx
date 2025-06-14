import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePoints } from "@/contexts/PointsContext";
import * as pointsService from "@/services/pointsService";
import { PointsPackage } from "@/services/pointsService";
import { Award, Coins, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const PointsManagement: React.FC = () => {
  const {
    points,
    formatPoints,
    transactions,
    achievements,
    buyPointsPackage,
    isLoading,
    refreshPoints,
    refreshTransactions,
  } = usePoints();

  const [activeTab, setActiveTab] = useState("overview");
  const [pointsPackages, setPointsPackages] = useState<PointsPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  useEffect(() => {
    // Fetch points packages from API
    const fetchPointsPackages = async () => {
      try {
        setPackagesLoading(true);
        const response = await pointsService.getPointsPackages();
        // Only show active packages to users
        setPointsPackages(response.data.filter((pkg) => pkg.active));
      } catch (error) {
        console.error("Error fetching points packages:", error);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPointsPackages();
  }, []);

  const pendingAchievements = achievements.filter((a) => !a.completed);
  const completedAchievements = achievements.filter((a) => a.completed);

  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBuyPackage = async (packageId: string) => {
    await buyPointsPackage(packageId);
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500 mb-4" />
      <p className="text-gray-500">Se încarcă...</p>
    </div>
  );

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
        {isLoading ? (
          renderLoadingState()
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-700 mb-1">
                    Puncte disponibile
                  </p>
                  <p className="text-3xl font-bold text-brand-900">
                    {formatPoints(points)}
                  </p>
                </div>
                <Badge variant="brand" className="text-lg py-1.5 px-3">
                  <Coins className="mr-1.5 h-4 w-4" />
                  Puncte
                </Badge>
              </div>
            </div>

            <Tabs
              defaultValue="overview"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="overview">Sumar</TabsTrigger>
                <TabsTrigger value="buy">Cumpără</TabsTrigger>
                <TabsTrigger value="achievements">Realizări</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    Ultimele tranzacții
                  </h3>
                  {transactions.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Nu ai încă nicio tranzacție.
                    </p>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {transactions.slice(0, 10).map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex justify-between items-center p-3 border rounded-md"
                          >
                            <div>
                              <p className="font-medium">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                            <Badge
                              variant={
                                transaction.amount > 0 ? "brand" : "outline"
                              }
                            >
                              {transaction.amount > 0 ? "+" : ""}
                              {transaction.amount} puncte
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {transactions.length > 0 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refreshTransactions()}
                      >
                        Reîmprospătează
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="buy" className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-4">
                    Pachete de puncte
                  </h3>
                  {packagesLoading ? (
                    renderLoadingState()
                  ) : pointsPackages.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-10">
                      Nu există pachete de puncte disponibile momentan.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pointsPackages.map((pkg) => (
                        <Card
                          key={pkg.id}
                          className={`transition-all hover:border-brand-300 ${
                            pkg.id === "2" ? "border-brand-300 shadow-md" : ""
                          }`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{pkg.name}</CardTitle>
                                {pkg.description && (
                                  <CardDescription className="mt-1">
                                    {pkg.description}
                                  </CardDescription>
                                )}
                              </div>
                              {pkg.id === "2" && (
                                <Badge variant="success" className="ml-2">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Coins className="h-6 w-6 text-brand-500 mr-2" />
                                <span className="text-2xl font-bold">
                                  {formatPoints(pkg.points)}
                                </span>
                                <span className="ml-1 text-gray-500">
                                  puncte
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-semibold">
                                  €{pkg.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className="w-full"
                              onClick={() => handleBuyPackage(pkg.id)}
                            >
                              Cumpără acum
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    Realizări disponibile
                  </h3>
                  {pendingAchievements.length === 0 ? (
                    <p className="text-sm text-gray-500 mb-6">
                      Ai completat toate realizările disponibile.
                    </p>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {pendingAchievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex justify-between items-center p-3 border rounded-md"
                        >
                          <div className="flex items-center">
                            <Award className="h-8 w-8 text-brand-400 mr-3" />
                            <div>
                              <p className="font-medium">{achievement.title}</p>
                              <p className="text-sm text-gray-500">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            +{achievement.pointsReward} puncte
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  <h3 className="font-medium text-lg mb-2">
                    Realizări completate
                  </h3>
                  {completedAchievements.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Nu ai încă nicio realizare completată.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {completedAchievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex justify-between items-center p-3 border border-green-200 bg-green-50 rounded-md"
                        >
                          <div className="flex items-center">
                            <Award className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                              <p className="font-medium">{achievement.title}</p>
                              <p className="text-sm text-gray-600">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                          <Badge variant="success">
                            +{achievement.pointsReward} puncte
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsManagement;
