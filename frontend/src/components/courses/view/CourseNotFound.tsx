
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CourseNotFound: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Cursul nu a fost găsit</h1>
        <p className="mb-4">Ne pare rău, cursul pe care îl cauți nu există.</p>
        <Button asChild>
          <Link to="/courses">Înapoi la cursuri</Link>
        </Button>
      </div>
    </div>
  );
};

export default CourseNotFound;
