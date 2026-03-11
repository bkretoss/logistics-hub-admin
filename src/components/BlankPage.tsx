import React from "react";
import { Store, ArrowRight } from "lucide-react";

interface BlankPageProps {
  title: string;
  description?: string;
}

const BlankPage: React.FC<BlankPageProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-1">{title}</h1>
      {description && <p className="text-muted-foreground text-sm mb-6">{description}</p>}
      <div className="bg-card rounded-xl material-shadow-1 border border-border p-16 flex flex-col items-center justify-center text-center min-h-[500px]">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Store className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Coming Soon</h2>
        <p className="text-muted-foreground text-base max-w-md mb-8">
          The <span className="font-semibold">{title}</span> module is currently under development. We're working hard
          to bring you this feature.
        </p>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Request Feature
          </button>
          <button className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            Notify Me
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlankPage;
