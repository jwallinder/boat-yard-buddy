import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Boat } from '@/types/boat';
import { List, MapPin, Download } from 'lucide-react';

interface BoatPositionListProps {
  boats: Boat[];
}

export const BoatPositionList: React.FC<BoatPositionListProps> = ({ boats }) => {
  // Sort boats by X position (left to right)
  const sortedBoats = [...boats].sort((a, b) => a.position.x - b.position.x);

  const exportToCSV = () => {
    // CSV headers
    const headers = [
      'Båtnamn',
      'X-position (m)',
      'Y-position (m)',
      'Längd (m)',
      'Bredd (m)',
      'Vikt (ton)',
      'Båttyp',
      'Mast',
      'Ägare',
      'Telefon'
    ];

    // CSV data rows
    const csvData = sortedBoats.map(boat => [
      boat.name,
      boat.position.x.toFixed(1),
      boat.position.y.toFixed(1),
      boat.length.toFixed(1),
      boat.width.toFixed(1),
      boat.weight.toFixed(1),
      boat.type === 'motorboat' ? 'Motorbåt' : 'Segelbåt',
      boat.hasMast ? 'Ja' : 'Nej',
      boat.owner.name,
      boat.owner.phone
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `båtpositioner_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="shadow-technical">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="boat-positions">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-primary">
                <List className="h-5 w-5" />
                Båtpositioner ({boats.length})
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  exportToCSV();
                }}
                className="shadow-elevated"
                disabled={boats.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportera CSV
              </Button>
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
