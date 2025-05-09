
import React from 'react';

const EmptyRequestsView: React.FC = () => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium mb-2">
        Nu ai nicio cerere de tutoriat
      </h3>
      <p className="text-muted-foreground">
        Cererile vor apărea aici odată ce studenții solicită tutoriat.
      </p>
    </div>
  );
};

export default EmptyRequestsView;
