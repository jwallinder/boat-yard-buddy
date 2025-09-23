import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Boat, Crane } from '@/types/boat';
import { Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { cranesSortedByDistance, cranesList } from '@/lib/crane';

interface CranePanelProps {
  cranes: Crane[];
  selectedBoat?: Boat;
}

export const CranePanel: React.FC<CranePanelProps> = ({ cranes, selectedBoat }) => {


  const sortedCranes = selectedBoat 
    ? cranesSortedByDistance(cranes, selectedBoat)
    : cranesList(cranes)
console.log("sortedCranes", sortedCranes);
  return (
    <Card className="shadow-technical">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Wrench className="h-5 w-5" />
          Krananalys
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedBoat ? (
          <div className="text-center text-muted-foreground py-6">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Välj en båt för krananalys</p>
          </div>
        ) : (
          <>
            <div className="bg-accent/20 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Vald båt: {selectedBoat.name}</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Vikt: {selectedBoat.weight} ton</p>
                <p>Position: ({selectedBoat.position.x.toFixed(1)}m, {selectedBoat.position.y.toFixed(1)}m)</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Kranar (sorterat efter avstånd):</h4>
              {sortedCranes.map(({ crane, canLift, actualDistance, maxDistance }) => (
                <div
                  key={crane.id}
                  className={`p-3 rounded-lg border ${
                    canLift
                      ? 'border-marina-success bg-marina-success/5'
                      : 'border-destructive bg-destructive/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium">{crane.name}</h5>
                      <Badge
                        variant={canLift ? "default" : "destructive"}
                        className={canLift ? 'bg-marina-success text-white' : ''}
                      >
                        {canLift ? (
                          <><CheckCircle className="h-3 w-3 mr-1" />Kan lyfta</>
                        ) : (
                          <><AlertTriangle className="h-3 w-3 mr-1" />Kan ej lyfta</>
                        )}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avstånd:</span>
                      <span className="font-mono">{actualDistance?.toFixed(1)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max räckvidd ({selectedBoat.weight}t):</span>
                      <span className="font-mono">{maxDistance}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kranposition:</span>
                      <span className="font-mono">
                        ({crane.position.x}m, {crane.position.y}m)
                      </span>
                    </div>
                  </div>
                  
                  {!canLift && (
                    <div className="mt-2 text-xs text-destructive">
                      Båten är {(actualDistance! - maxDistance).toFixed(1)}m utanför räckvidd
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};