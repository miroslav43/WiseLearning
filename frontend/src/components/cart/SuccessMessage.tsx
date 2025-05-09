
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const SuccessMessage: React.FC = () => {
  return (
    <div className="text-center py-16 bg-green-50 rounded-lg">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Mulțumim pentru comanda ta!</h2>
      <p className="text-gray-500 mb-6">Vei primi un email de confirmare cu detaliile comenzii tale.</p>
      <Link to="/my-courses">
        <Button>Vezi cursurile mele</Button>
      </Link>
    </div>
  );
};

export default SuccessMessage;
