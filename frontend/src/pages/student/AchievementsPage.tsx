import AchievementList from "@/components/achievements/AchievementList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePoints } from "@/contexts/PointsContext";
import { getMyAchievements } from "@/services/achievementService";
import { Achievement } from "@/types/user";
import { Award, BookOpen, Loader2, Star, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const { completeAchievement } = usePoints();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const userAchievements = await getMyAchievements();
        setAchievements(userAchievements);
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError(
          "Nu am putut încărca realizările. Te rugăm să încerci din nou."
        );

        // Fallback to user data if available
        if (user.achievements) {
          setAchievements(user.achievements);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  if (!user || user.role !== "student") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Realizări</h1>
          <p>
            Trebuie să fii autentificat ca student pentru a accesa realizările.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Realizările mele</h1>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mr-2" />
          <span>Se încarcă realizările...</span>
        </div>
      </div>
    );
  }

  if (error && achievements.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Realizările mele</h1>
        <div className="text-center py-12">
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  const completedCount = achievements.filter((a) => a.completed).length;
  const totalPoints = achievements
    .filter((a) => a.completed)
    .reduce((sum, a) => sum + a.pointsRewarded, 0);

  // Group achievements by category
  const learningAchievements = achievements.filter(
    (a) => a.category === "learning"
  );
  const masteryAchievements = achievements.filter(
    (a) => a.category === "mastery"
  );
  const communityAchievements = achievements.filter(
    (a) => a.category === "community"
  );

  // Calculate completion rate by category
  const getCompletionRate = (items: Achievement[]) => {
    if (!items.length) return 0;
    return Math.round(
      (items.filter((a) => a.completed).length / items.length) * 100
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Realizările mele</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total realizări
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {completedCount}/{achievements.length}
              </div>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Puncte câștigate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalPoints}</div>
              <Award className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Învățare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {getCompletionRate(learningAchievements)}%
                </div>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-brand-600 h-1.5 rounded-full"
                  style={{
                    width: `${getCompletionRate(learningAchievements)}%`,
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comunitate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {getCompletionRate(communityAchievements)}%
                </div>
                <Star className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-brand-600 h-1.5 rounded-full"
                  style={{
                    width: `${getCompletionRate(communityAchievements)}%`,
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-10">
        <AchievementList
          achievements={achievements}
          title="Toate realizările"
          description="Explorează toate realizările disponibile și progresul tău"
        />
      </div>
    </div>
  );
};

export default AchievementsPage;
