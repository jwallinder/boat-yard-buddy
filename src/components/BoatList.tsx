import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Boat } from '@/types/boat';
import { Ship, Anchor, Phone, Trash2, MapPin } from 'lucide-react';

interface BoatListProps {
  boats: Boat[];
  selectedBoat?: Boat;
  onBoatSelect: (boat: Boat) => void;
  onBoatDelete: (boatId: string) => void;
}

export const BoatList: React.FC<BoatListProps> = ({ 
  boats, 
  selectedBoat, 
  onBoatSelect, 
  onBoatDelete 
}) => {
  return (
    <Card className="shadow-technical">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Ship className="h-5 w-5" />
          Båtlista ({boats.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {boats.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Anchor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Inga båtar registrerade ännu</p>
              <p className="text-sm">Lägg till din första båt med formuläret ovan</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {boats.map((boat) => (
                <div
                  key={boat.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedBoat?.id === boat.id
                      ? 'border-primary bg-accent/50 shadow-sm'
                      : 'border-border hover:border-primary/50 hover:bg-accent/20'
                  }`}
                  onClick={() => onBoatSelect(boat)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{boat.name}</h4>
                      <Badge 
                        variant="secondary"
                        className={boat.type === 'motorboat' ? 'bg-marina-motorboat/10 text-marina-motorboat' : 'bg-marina-sailboat/10 text-marina-sailboat'}
                      >
                        {boat.type === 'motorboat' ? 'Motorbåt' : 'Segelbåt'}
                      </Badge>
                      {boat.hasMast && (
                        <Badge variant="outline" className="text-xs">
                          Mast
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBoatDelete(boat.id);
                      }}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
                    <div>
                      <span className="font-medium">Mått:</span> {boat.length}m × {boat.width}m
                    </div>
                    <div>
                      <span className="font-medium">Vikt:</span> {boat.weight} ton
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{boat.owner.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        ({boat.position.x.toFixed(1)}m, {boat.position.y.toFixed(1)}m)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};