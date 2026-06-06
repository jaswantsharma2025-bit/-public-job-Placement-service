import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import WorkerLayout from '../../layouts/WorkerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { workerService } from '../../services/api';
import { MapPin, Navigation } from 'lucide-react';

interface LocationForm {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

export default function WorkerLocation() {
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LocationForm>();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', position.coords.latitude);
        setValue('longitude', position.coords.longitude);
        toast.success('Location retrieved successfully!');
        setGettingLocation(false);
      },
      (error) => {
        toast.error('Failed to get location: ' + error.message);
        setGettingLocation(false);
      }
    );
  };

  const onSubmit = async (data: LocationForm) => {
    try {
      setLoading(true);
      await workerService.updateLocation(data);
      toast.success('Location updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Update Location</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Keep your location updated for better job matches</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-8 text-center">
              <MapPin className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Update your location to appear in local searches
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
            >
              <Navigation className="w-4 h-4 mr-2" />
              {gettingLocation ? 'Getting location...' : 'Use Current Location'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 28.6139"
                    {...register('latitude', { required: 'Latitude is required', valueAsNumber: true })}
                  />
                  {errors.latitude && <p className="text-sm text-red-500">{errors.latitude.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 77.2090"
                    {...register('longitude', { required: 'Longitude is required', valueAsNumber: true })}
                  />
                  {errors.longitude && <p className="text-sm text-red-500">{errors.longitude.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="Enter state"
                    {...register('state', { required: 'State is required' })}
                  />
                  {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Location'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Why update location?</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Appear in local searches by customers</li>
              <li>• Get matched with nearby jobs</li>
              <li>• Increase your booking chances</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </WorkerLayout>
  );
}
