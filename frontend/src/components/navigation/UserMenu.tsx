
import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, Settings, LogOut, User, BookOpen, Gauge, Users, Heart, Coins, Trophy, Award, CreditCard, Calendar, MessageCircle, Bookmark } from 'lucide-react';
import PointsDisplay from '../points/PointsDisplay';

export default function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return (
      <div className="flex gap-2">
        <Link to="/login">
          <Button variant="outline">Conectare</Button>
        </Link>
        <Link to="/register">
          <Button>Înregistrare</Button>
        </Link>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-4">
      <PointsDisplay variant="compact" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {user.role === 'student' && (
            <>
              <Link to="/dashboard/student">
                <DropdownMenuItem>
                  <Gauge className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/my-courses">
                <DropdownMenuItem>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Cursurile mele</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/my-saved-courses">
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>Cursuri salvate</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/subscriptions">
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Abonamente și pachete</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/my-points">
                <DropdownMenuItem>
                  <Coins className="mr-2 h-4 w-4" />
                  <span>Punctele mele</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/my-achievements">
                <DropdownMenuItem>
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Realizările mele</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/my-certificates">
                <DropdownMenuItem>
                  <Award className="mr-2 h-4 w-4" />
                  <span>Certificatele mele</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/my-tutoring">
                <DropdownMenuItem>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Meditațiile mele</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/messaging">
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Mesaje</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/calendar">
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Calendar</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
          
          {user.role === 'teacher' && (
            <>
              <Link to="/dashboard/teacher">
                <DropdownMenuItem>
                  <Gauge className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/teacher/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profilul meu de profesor</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/my-courses/manage">
                <DropdownMenuItem>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Cursurile mele</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/my-students">
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Studenții mei</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/my-tutoring/manage">
                <DropdownMenuItem>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Meditațiile mele</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/messaging">
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Mesaje</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/calendar">
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Calendar</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
          
          {user.role === 'admin' && (
            <>
              <Link to="/admin">
                <DropdownMenuItem>
                  <Gauge className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/messaging">
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Mesaje</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/calendar">
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Calendar</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
          
          <DropdownMenuSeparator />
          
          <Link to="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profilul meu</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Setări</span>
            </DropdownMenuItem>
          </Link>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Deconectare</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
