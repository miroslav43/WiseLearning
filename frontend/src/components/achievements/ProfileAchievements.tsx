import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getMyAchievements } from "@/services/achievementService";
import { Achievement } from "@/types/user";
import { Loader2, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AchievementBadge from "./AchievementBadge";

const ProfileAchievements: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const userAchievements = await getMyAchievements();
        setAchievements(userAchievements);
      } catch (err) {
        console.error("Error fetching achievements:", err);
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

  if (!user) {
    return null;
  }

  const completedAchievements = achievements.filter((a) => a.completed);
  const inProgressAchievements = achievements
    .filter((a) => !a.completed && (a.progress ?? 0) > 0)
    .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Realizări
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-brand-500" />
            <span className="text-sm text-muted-foreground">
              Se încarcă realizările...
            </span>
          </div>
        ) : (
          <>
            {completedAchievements.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Realizări deblocate</h3>
                <div className="flex flex-wrap gap-2">
                  {completedAchievements.slice(0, 5).map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      size="sm"
                    />
                  ))}
                  {completedAchievements.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                      +{completedAchievements.length - 5}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Nu ai deblocat încă nicio realizare.
              </div>
            )}

            {inProgressAchievements.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">În progres</h3>
                <div className="space-y-3">
                  {inProgressAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{achievement.name}</span>
                        <span className="text-muted-foreground">
                          {achievement.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-brand-600 h-1.5 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Button asChild variant="outline" className="w-full mt-2">
          <Link to="/my-achievements">Vezi toate realizările</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileAchievements;
