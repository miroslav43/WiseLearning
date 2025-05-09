
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, Shield, Mail, Lock, Key } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Setări inaccesibile</h1>
          <p>Te rugăm să te autentifici pentru a-ți accesa setările.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Setări cont</h1>
      
      <Tabs defaultValue="account" className="space-y-8">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="account">Cont</TabsTrigger>
          <TabsTrigger value="notifications">Notificări</TabsTrigger>
          <TabsTrigger value="security">Securitate</TabsTrigger>
          <TabsTrigger value="privacy">Confidențialitate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Setări cont</CardTitle>
              <CardDescription>Modifică setările contului tău</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Nume utilizator</label>
                <Input id="username" defaultValue={user.name.toLowerCase().replace(' ', '.')} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">Limbă</label>
                <select id="language" className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="ro">Română</option>
                  <option value="en">Engleză</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="timezone" className="text-sm font-medium">Fus orar</label>
                <select id="timezone" className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="europe/bucharest">Europe/Bucharest (GMT+2)</option>
                  <option value="europe/london">Europe/London (GMT+0)</option>
                </select>
              </div>
              
              <div className="pt-4">
                <Button>Salvează modificările</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificări</CardTitle>
              <CardDescription>Configurează preferințele de notificare</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="email_notifications">Notificări pe email</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Primește actualizări despre cursuri și teme prin email</p>
                </div>
                <Switch id="email_notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="browser_notifications">Notificări în browser</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Primește notificări în browser când ești pe platformă</p>
                </div>
                <Switch id="browser_notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="marketing_emails">Emailuri de marketing</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Primește oferte și actualizări despre cursuri noi</p>
                </div>
                <Switch id="marketing_emails" />
              </div>
              
              <div className="pt-4">
                <Button>Salvează preferințele</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Securitate</CardTitle>
              <CardDescription>Gestionează-ți parola și securitatea contului</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Schimbă parola
                </h3>
                <div className="space-y-2">
                  <label htmlFor="current_password" className="text-sm font-medium">Parola actuală</label>
                  <Input id="current_password" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new_password" className="text-sm font-medium">Parola nouă</label>
                  <Input id="new_password" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm_password" className="text-sm font-medium">Confirmă parola nouă</label>
                  <Input id="confirm_password" type="password" />
                </div>
                <Button>Actualizează parola</Button>
              </div>
              
              <div className="pt-4 space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  Autentificare în doi pași
                </h3>
                <p className="text-sm text-muted-foreground">
                  Adaugă un nivel suplimentar de securitate contului tău prin activarea autentificării în doi pași.
                </p>
                <Button variant="outline">Configurează autentificarea în doi pași</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Confidențialitate</CardTitle>
              <CardDescription>Gestionează setările de confidențialitate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="profile_visibility">Vizibilitate profil</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Permite altor utilizatori să îți vadă profilul</p>
                </div>
                <Switch id="profile_visibility" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="data_collection">Colectare date de utilizare</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Permite platformei să colecteze date anonime despre utilizare pentru îmbunătățire</p>
                </div>
                <Switch id="data_collection" defaultChecked />
              </div>
              
              <div className="pt-4">
                <Button variant="destructive">Șterge contul</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
