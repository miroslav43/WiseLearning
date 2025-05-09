
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, BookOpen, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileAchievements from '@/components/achievements/ProfileAchievements';
import ProfileCertificates from '@/components/certificates/ProfileCertificates';
import PointsDisplay from '@/components/points/PointsDisplay';
import SubscriptionCard from '@/components/user/SubscriptionCard';
import UserBundleCard from '@/components/user/UserBundleCard';
import { mockUserSubscriptions, mockUserBundles } from '@/data/mockSubscriptionData';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cont inaccesibil</h1>
          <p>Te rugăm să te autentifici pentru a-ți accesa profilul.</p>
        </div>
      </div>
    );
  }

  // Format the createdAt date safely
  const formatDate = (dateValue: string | Date) => {
    if (!dateValue) return 'N/A';
    
    try {
      // If it's already a Date object, use it directly
      if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString();
      }
      // Otherwise convert the string to a Date object
      return new Date(dateValue).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data necunoscută';
    }
  };

  // Get subscriptions and bundles for this user
  const userSubscriptions = mockUserSubscriptions.filter(sub => sub.userId === user.id && sub.isActive);
  const userBundles = mockUserBundles.filter(bundle => bundle.userId === user.id);

  const handleManageSubscription = () => {
    toast({
      title: "Funcționalitate demonstrativă",
      description: "Într-o aplicație reală, ai fi redirecționat către pagina de management a abonamentului.",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Profilul meu</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl bg-brand-500 text-white">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.role === 'student' ? 'Elev/Student' : user.role === 'teacher' ? 'Profesor' : 'Administrator'}</CardDescription>
              <div className="mt-2 flex justify-center">
                <PointsDisplay />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 opacity-70" />
                  <span>Membru din {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 opacity-70" />
                  <span>{user.email}</span>
                </div>
                {user.role === 'student' && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 opacity-70" />
                    <span>{(user as any).enrolledCourses?.length || 0} cursuri înscrise</span>
                  </div>
                )}
                {user.role === 'teacher' && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 opacity-70" />
                    <span>{(user as any).courses?.length || 0} cursuri create</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Editează profilul</Button>
            </CardFooter>
          </Card>
          
          {/* Subscriptions section for students */}
          {user.role === 'student' && userSubscriptions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Abonamentul meu</h2>
              <SubscriptionCard 
                subscription={userSubscriptions[0]} 
                onManage={handleManageSubscription}
              />
              
              {userBundles.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Pachetele mele</h2>
                  <div className="space-y-4">
                    {userBundles.map(bundle => (
                      <UserBundleCard key={bundle.id} userBundle={bundle} />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <Link to="/subscriptions">
                  <Button variant="default" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Gestionează abonamente și pachete
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          {user.role === 'student' && (
            <div className="mt-6 space-y-6">
              <ProfileAchievements />
              <ProfileCertificates />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informații personale</CardTitle>
              <CardDescription>Modifică detaliile profilului tău</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nume complet</label>
                <Input id="name" defaultValue={user.name} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" defaultValue={user.email} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">Biografie</label>
                <Textarea id="bio" defaultValue={user.bio || ''} className="min-h-32" placeholder="Spune-ne câteva cuvinte despre tine..." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Anulează</Button>
              <Button>Salvează modificările</Button>
            </CardFooter>
          </Card>

          {/* Student-specific additional settings */}
          {user.role === 'student' && (
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferințe de studiu</CardTitle>
                  <CardDescription>Personalizează experiența ta de învățare</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Study preferences form content */}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Anulează</Button>
                  <Button>Salvează preferințele</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
