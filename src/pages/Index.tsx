import React, { useState } from 'react';
import { BoatCanvas } from '@/components/BoatCanvas';
import { BoatForm } from '@/components/BoatForm';
import { BoatList } from '@/components/BoatList';
import { CranePanel } from '@/components/CranePanel';
import { Boat, Crane, Obstacle } from '@/types/boat';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { BOATS, CRANES, OBSTACLES } from '@/pages/initData';
const Index = () => {
  const [boats, setBoats] = useState<Boat[]>(BOATS);
  const [selectedBoat, setSelectedBoat] = useState<Boat | undefined>();


  const calculateOptimalPosition = (newBoat: Omit<Boat, 'id' | 'position'>) => {
    if (boats.length === 0) {
      // First boat: 35cm + half width from origin
      return {
        x: 0.35 + newBoat.width / 2,
        y: 20 // Default Y position
      };
    }

    // Find the rightmost boat
    const rightmostBoat = boats.reduce((rightmost, boat) => {
      const boatRightEdge = boat.position.x + boat.width / 2;
      const rightmostEdge = rightmost.position.x + rightmost.width / 2;
      return boatRightEdge > rightmostEdge ? boat : rightmost;
    });

    // Calculate position: previous boat center + 70cm + half new boat width
    const newX = rightmostBoat.position.x + rightmostBoat.width / 2 + 0.7 + newBoat.width / 2;

    return {
      x: newX,
      y: rightmostBoat.position.y // Same Y as previous boat for now
    };
  };

  const handleAddBoat = (boatData: Omit<Boat, 'id' | 'position'>) => {
    const position = calculateOptimalPosition(boatData);
    const newBoat: Boat = {
      ...boatData,
      id: `boat-${Date.now()}`,
      position
    };

    setBoats(prev => [...prev, newBoat]);
    toast.success(`Båt "${boatData.name}" har lagts till!`);
  };

  const handleBoatMove = (boatId: string, x: number, y: number) => {
    setBoats(prev => prev.map(boat => 
      boat.id === boatId 
        ? { ...boat, position: { x, y } }
        : boat
    ));

    // Update selected boat if it's the moved boat
    if (selectedBoat?.id === boatId) {
      setSelectedBoat(prev => prev ? { ...prev, position: { x, y } } : undefined);
    }
  };

  const handleBoatSelect = (boat: Boat) => {
    setSelectedBoat(boat);
  };

  const handleBoatDelete = (boatId: string) => {
    setBoats(prev => prev.filter(boat => boat.id !== boatId));
    if (selectedBoat?.id === boatId) {
      setSelectedBoat(undefined);
    }
    toast.success('Båt borttagen');
  };

  const handleClearSelection = () => {
    setSelectedBoat(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-technical">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-technical">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-maritime rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v-2c2.74 0 5.09-1.26 6-3.08C8.91 14.26 11.26 13 14 13c2.74 0 5.09 1.26 6 3.08C20.91 14.26 23.26 13 26 13v2c-1.39 0-2.78.47-4 1.32-2.44-1.71-5.56-1.71-8 0zM12 12L2 7l1.5-3L12 8l8.5-4L22 7l-10 5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Båtvarv Manager</h1>
              <p className="text-sm text-muted-foreground">Professionell båtplacering för vintervarf</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <BoatForm 
                  onSubmit={handleAddBoat}
                  selectedBoat={selectedBoat}
                  onClear={handleClearSelection}
                />
                
                <Separator />
                
                <BoatList 
                  boats={boats}
                  selectedBoat={selectedBoat}
                  onBoatSelect={handleBoatSelect}
                  onBoatDelete={handleBoatDelete}
                />
                
                <Separator />
                
                <CranePanel 
                  cranes={CRANES}
                  selectedBoat={selectedBoat}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <BoatCanvas
              boats={boats}
              cranes={CRANES}
              obstacles={OBSTACLES}
              onBoatSelect={handleBoatSelect}
              onBoatMove={handleBoatMove}
              selectedBoat={selectedBoat}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
