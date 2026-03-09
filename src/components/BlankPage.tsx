import React from 'react';
import { FileText } from 'lucide-react';

interface BlankPageProps {
  title: string;
  description?: string;
}

const BlankPage: React.FC<BlankPageProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
      {description && <p className="text-muted-foreground text-sm mb-6">{description}</p>}
      <div className="bg-card rounded-xl material-shadow-1 border border-border p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">No Data Available</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          This section is under development. Content will appear here once configured.
        </p>
      </div>
    </div>
  );
};

export default BlankPage;
