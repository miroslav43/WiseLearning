
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { achievementDefinitions } from '@/services/achievementService';
import AchievementForm from '@/components/admin/achievements/AchievementForm';
import AchievementList from '@/components/admin/achievements/AchievementList';
import { Achievement } from '@/types/user';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AchievementsPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  
  // Initialize achievements with the required properties
  const initialAchievements: Achievement[] = achievementDefinitions.map(achievement => ({
    ...achievement,
    completed: false,
    completedAt: undefined,
    progress: 0
  }));
  
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  const handleCreateAchievement = (achievement: Omit<Achievement, 'id' | 'completed' | 'completedAt' | 'progress'>) => {
    const newAchievement = {
      ...achievement,
      id: `custom-${Date.now()}`,
      completed: false,
      completedAt: undefined,
      progress: 0
    };
    
    setAchievements([...achievements, newAchievement]);
    setIsCreating(false);
    toast.success("Achievement created successfully");
  };

  const handleUpdateAchievement = (updatedAchievement: Achievement) => {
    setAchievements(achievements.map(a => 
      a.id === updatedAchievement.id ? updatedAchievement : a
    ));
    setEditingAchievement(null);
    toast.success("Achievement updated successfully");
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
    toast.success("Achievement deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Achievements Management</h1>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Achievement
        </Button>
      </div>

      {(isCreating || editingAchievement) ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingAchievement ? 'Edit Achievement' : 'Create Achievement'}</CardTitle>
            <CardDescription>
              {editingAchievement 
                ? 'Update the details of an existing achievement' 
                : 'Define a new achievement for users to earn'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AchievementForm 
              achievement={editingAchievement}
              onSubmit={editingAchievement ? handleUpdateAchievement : handleCreateAchievement}
              onCancel={() => {
                setIsCreating(false);
                setEditingAchievement(null);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Achievements</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="mastery">Mastery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <AchievementList 
              achievements={achievements} 
              onEdit={setEditingAchievement}
              onDelete={handleDeleteAchievement}
            />
          </TabsContent>
          
          <TabsContent value="learning">
            <AchievementList 
              achievements={achievements.filter(a => a.category === 'learning')} 
              onEdit={setEditingAchievement}
              onDelete={handleDeleteAchievement}
            />
          </TabsContent>
          
          <TabsContent value="community">
            <AchievementList 
              achievements={achievements.filter(a => a.category === 'community')} 
              onEdit={setEditingAchievement}
              onDelete={handleDeleteAchievement}
            />
          </TabsContent>
          
          <TabsContent value="mastery">
            <AchievementList 
              achievements={achievements.filter(a => a.category === 'mastery')} 
              onEdit={setEditingAchievement}
              onDelete={handleDeleteAchievement}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AchievementsPage;
