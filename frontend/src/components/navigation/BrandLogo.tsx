
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const BrandLogo: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link to="/" className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/617d4124-b37b-428e-a7f0-de0947bfea5a.png" 
          alt="WiseLearning Logo" 
          className="h-10 w-auto"
        />
        {!isMobile && (
          <span className="sr-only">WiseLearning</span>
        )}
      </Link>
    </div>
  );
};

export default BrandLogo;
