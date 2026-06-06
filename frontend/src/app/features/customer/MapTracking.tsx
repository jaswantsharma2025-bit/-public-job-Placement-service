import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MapPin } from 'lucide-react';

export default function MapTracking() {
  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live Tracking</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Track your service provider in real-time</p>
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-neutral-50 to-purple-50 dark:from-blue-950/20 dark:via-neutral-900 dark:to-purple-950/20">
            <div className="text-center space-y-4 p-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Live Tracking</h2>
                <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                Real-time GPS tracking of your service provider will be available soon. You'll be able to see their exact location and estimated arrival time.
              </p>
            </div>
          </div>
          <CardContent className="min-h-[500px]" />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold">Uber-Style Tracking</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Track workers like you track your Uber</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold">ETA Updates</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Real-time estimated arrival time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold">Route Visualization</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">See the exact route being taken</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}
