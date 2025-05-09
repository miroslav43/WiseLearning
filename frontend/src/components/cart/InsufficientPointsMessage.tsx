
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Coins, ArrowLeft } from 'lucide-react';

interface InsufficientPointsMessageProps {
  totalPointsPrice: number;
  userPoints: number;
  onGoBack: () => void;
  formatPoints: (points: number) => string;
}

const InsufficientPointsMessage: React.FC<InsufficientPointsMessageProps> = ({
  totalPointsPrice,
  userPoints,
  onGoBack,
  formatPoints
}) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 mt-1" />
        <div>
          <h2 className="text-lg font-semibold mb-2 text-amber-800">Nu ai suficiente puncte</h2>
          <p className="text-amber-700 mb-4">
            Ai nevoie de {formatPoints(totalPointsPrice)} puncte pentru a cumpăra aceste cursuri, dar ai doar {formatPoints(userPoints)} puncte.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/my-points">
              <Button variant="default">
                <Coins className="mr-2 h-4 w-4" />
                Cumpără mai multe puncte
              </Button>
            </Link>
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la coș
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientPointsMessage;
