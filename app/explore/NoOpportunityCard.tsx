// components/NoOpportunitiesCard.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Search, Filter, Plus } from 'lucide-react';
import { toast } from "react-toastify";

const NoOpportunitiesCard: React.FC = () => {
  const router = useRouter();

  const handleCreateInitiative = () => {
    toast(
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-vollie-blue">Coming Soon!</h3>
        <p className="text-sm text-muted-foreground">
          Users cannot create opportunities... Yet! Check back soon for new features to democratize volunteering!
        </p>
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-card border border-border shadow-lg !text-foreground !bg-background"
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-card border border-border rounded-lg shadow-md">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="text-vollie-blue/80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
            />
          </svg>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-vollie-blue">No Opportunities Available</h2>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            We couldn't find any opportunities matching your current filters. Try adjusting your search criteria or check back later for new opportunities.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
          >
            <Search className="h-4 w-4" />
            Clear Search
          </Button>
          <Button 
            variant="outline"
            onClick={handleCreateInitiative}
            className="flex items-center gap-2 border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
          >
            <Plus className="h-4 w-4" />
            Suggest an Initiative
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center w-full">
          <div className="p-6 rounded-lg bg-vollie-blue/5 border border-vollie-blue/20 hover:border-vollie-blue/30 transition-colors">
            <h3 className="font-semibold text-vollie-blue mb-2">Adjust Filters</h3>
            <p className="text-sm text-muted-foreground">Try changing your search filters to see more opportunities</p>
          </div>
          <div className="p-6 rounded-lg bg-vollie-blue/5 border border-vollie-blue/20 hover:border-vollie-blue/30 transition-colors">
            <h3 className="font-semibold text-vollie-blue mb-2">Expand Location</h3>
            <p className="text-sm text-muted-foreground">Consider increasing your search radius to find more opportunities</p>
          </div>
          <div className="p-6 rounded-lg bg-vollie-blue/5 border border-vollie-blue/20 hover:border-vollie-blue/30 transition-colors">
            <h3 className="font-semibold text-vollie-blue mb-2">Check Back Later</h3>
            <p className="text-sm text-muted-foreground">New volunteer opportunities are added regularly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoOpportunitiesCard;
