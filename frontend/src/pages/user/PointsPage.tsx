
import React from 'react';
import PointsManagement from '@/components/points/PointsManagement';
import { usePoints } from '@/contexts/PointsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Coins, Gift, Award, Star } from 'lucide-react';

const PointsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Punctele mele</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PointsManagement />
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Cum să obții puncte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Cumpără puncte</h3>
                <p className="text-sm text-gray-500">Cumpără pachete de puncte pentru a le utiliza la achiziționarea cursurilor.</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg flex items-center">
                  <Gift className="h-4 w-4 mr-2" />
                  Program de recomandare
                </h3>
                <p className="text-sm text-gray-500 mb-2">Invită-ți prietenii să se alăture și veți primi amândoi puncte bonus.</p>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  <p className="font-medium">Codul tău de referral:</p>
                  <div className="flex items-center mt-1">
                    <code className="bg-gray-100 p-1 rounded">STUDENT123</code>
                    <button className="ml-2 text-brand-600 text-xs">Copiază</button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Realizări
                </h3>
                <p className="text-sm text-gray-500">Completează diverse activități pentru a obține realizări și a câștiga puncte bonus.</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-500">
                  <li className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-brand-500" />
                    Completează prima lecție
                  </li>
                  <li className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-brand-500" />
                    Vizitează 5 cursuri diferite
                  </li>
                  <li className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-brand-500" />
                    Obține 100% la 3 teste
                  </li>
                  <li className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-brand-500" />
                    Conectează-te 7 zile consecutiv
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PointsPage;
