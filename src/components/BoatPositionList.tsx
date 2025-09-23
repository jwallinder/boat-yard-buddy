import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Boat } from '@/types/boat';
import { List, MapPin } from 'lucide-react';

interface BoatPositionListProps {
  boats: Boat[];
}

export const BoatPositionList: React.FC<BoatPositionListProps> = ({ boats }) => {
  // Sort boats by X position (left to right)
  const sortedBoats = [...boats].sort((a, b) => a.position.x - b.position.x);

  return (
    <Card className="shadow-technical">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="boat-positions">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2 text-primary">
              <List className="h-5 w-5" />
              Båtpositioner ({boats.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6">
              {boats.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Inga båtar registrerade ännu</p>
                  <p className="text-sm">Lägg till båtar för att se positioner</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground mb-4">
                    Sorterat efter X-position (vänster till höger)
                  </div>
                  {sortedBoats.map((boat, index) => (
                    <div
                      key={boat.id}
                      className="p-3 rounded-lg border border-border bg-card hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
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
                        <div className="text-right">
                          <div className="text-sm font-mono text-primary">
                            X: {boat.position.x.toFixed(1)}m
                          </div>
                          <div className="text-xs text-muted-foreground">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
                        <div>
                          <span className="font-medium">Ägare:</span> {boat.owner.name}
                        </div>
                        <div>
                          <span className="font-medium">Telefon:</span> {boat.owner.phone}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>
                            Position: ({boat.position.x.toFixed(1)}m, {boat.position.y.toFixed(1)}m)
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {boat.length}m × {boat.width}m
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
