import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Boat } from '@/types/boat';
import { Anchor, Plus, Save } from 'lucide-react';

const boatSchema = z.object({
  name: z.string().min(1, 'Båtnamn krävs'),
  length: z.number().min(1, 'Längd måste vara större än 0'),
  width: z.number().min(1, 'Bredd måste vara större än 0'),
  type: z.enum(['motorboat', 'sailboat']),
  weight: z.number().min(0.1, 'Vikt måste vara större än 0'),
  hasMast: z.boolean(),
  ownerName: z.string().min(1, 'Ägarens namn krävs'),
  ownerPhone: z.string().min(1, 'Telefonnummer krävs'),
});

type BoatFormData = z.infer<typeof boatSchema>;

interface BoatFormProps {
  onSubmit: (boat: Omit<Boat, 'id' | 'position'>) => void;
  selectedBoat?: Boat;
  onClear?: () => void;
}

export const BoatForm: React.FC<BoatFormProps> = ({ onSubmit, selectedBoat, onClear }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<BoatFormData>({
    resolver: zodResolver(boatSchema),
    defaultValues: selectedBoat ? {
      name: selectedBoat.name,
      length: selectedBoat.length,
      width: selectedBoat.width,
      type: selectedBoat.type,
      weight: selectedBoat.weight,
      hasMast: selectedBoat.hasMast,
      ownerName: selectedBoat.owner.name,
      ownerPhone: selectedBoat.owner.phone,
    } : {
      type: 'motorboat',
      hasMast: false,
    }
  });

  const watchedType = watch('type');
  const watchedHasMast = watch('hasMast');

  const onFormSubmit = (data: BoatFormData) => {
    const boat: Omit<Boat, 'id' | 'position'> = {
      name: data.name,
      length: data.length,
      width: data.width,
      type: data.type,
      weight: data.weight,
      hasMast: data.hasMast,
      owner: {
        name: data.ownerName,
        phone: data.ownerPhone,
      },
    };
    
    onSubmit(boat);
    reset();
  };

  const handleClear = () => {
    reset();
    onClear?.();
  };

  React.useEffect(() => {
    if (selectedBoat) {
      setValue('name', selectedBoat.name);
      setValue('length', selectedBoat.length);
      setValue('width', selectedBoat.width);
      setValue('type', selectedBoat.type);
      setValue('weight', selectedBoat.weight);
      setValue('hasMast', selectedBoat.hasMast);
      setValue('ownerName', selectedBoat.owner.name);
      setValue('ownerPhone', selectedBoat.owner.phone);
    }
  }, [selectedBoat, setValue]);

  return (
    <Card className="shadow-technical">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Anchor className="h-5 w-5" />
          {selectedBoat ? 'Redigera båt' : 'Lägg till båt'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Boat Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Båtnamn</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="t.ex. Sjöstjärnan"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Längd (m)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                {...register('length', { valueAsNumber: true })}
                placeholder="8.5"
                className={errors.length ? 'border-destructive' : ''}
              />
              {errors.length && (
                <p className="text-sm text-destructive">{errors.length.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Bredd (m)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                {...register('width', { valueAsNumber: true })}
                placeholder="2.8"
                className={errors.width ? 'border-destructive' : ''}
              />
              {errors.width && (
                <p className="text-sm text-destructive">{errors.width.message}</p>
              )}
            </div>
          </div>

          {/* Type and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Båttyp</Label>
              <Select
                value={watchedType}
                onValueChange={(value: 'motorboat' | 'sailboat') => setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motorboat">Motorbåt</SelectItem>
                  <SelectItem value="sailboat">Segelbåt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Vikt (ton)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                {...register('weight', { valueAsNumber: true })}
                placeholder="2.5"
                className={errors.weight ? 'border-destructive' : ''}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">{errors.weight.message}</p>
              )}
            </div>
          </div>

          {/* Mast Switch */}
          <div className="flex items-center justify-between">
            <Label htmlFor="mast">Mast på</Label>
            <Switch
              id="mast"
              checked={watchedHasMast}
              onCheckedChange={(checked) => setValue('hasMast', checked)}
            />
          </div>

          {/* Owner Information */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-primary">Ägaruppgifter</h4>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Namn</Label>
              <Input
                id="ownerName"
                {...register('ownerName')}
                placeholder="Anna Andersson"
                className={errors.ownerName ? 'border-destructive' : ''}
              />
              {errors.ownerName && (
                <p className="text-sm text-destructive">{errors.ownerName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Telefon</Label>
              <Input
                id="ownerPhone"
                {...register('ownerPhone')}
                placeholder="070-123 45 67"
                className={errors.ownerPhone ? 'border-destructive' : ''}
              />
              {errors.ownerPhone && (
                <p className="text-sm text-destructive">{errors.ownerPhone.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-maritime hover:bg-primary-hover"
            >
              <Save className="w-4 h-4 mr-2" />
              {selectedBoat ? 'Uppdatera' : 'Lägg till'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
            >
              Rensa
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};