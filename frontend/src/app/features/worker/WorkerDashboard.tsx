import { useQuery } from '@tanstack/react-query';
import WorkerLayout from '../../layouts/WorkerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { bookingService, workerService } from '../../services/api';
import { Calendar, CheckCircle, Star, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function WorkerDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);

  const { data: bookings } = useQuery({
    queryKey: ['worker-bookings'],
    queryFn: bookingService.getWorkerBookings,
  });

  const { data: earnings } = useQuery({
    queryKey: ['worker-earnings'],
    queryFn: workerService.getEarnings,
  });

  const todaysJobs = bookings?.filter((b: any) => {
    const today = new Date().toDateString();
    return new Date(b.createdAt).toDateString() === today;
  })?.length || 0;

  const completedJobs = bookings?.filter((b: any) => b.status === 'COMPLETED')?.length || 0;
  const totalEarnings = earnings?.totalEarnings || 0;

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      await workerService.updateAvailability(checked);
      setIsAvailable(checked);
      toast.success(checked ? 'You are now online' : 'You are now offline');
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const stats = [
    { title: "Today's Jobs", value: todaysJobs, icon: Calendar, color: 'text-blue-600' },
    { title: 'Completed Jobs', value: completedJobs, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Rating', value: '4.8/5', icon: Star, color: 'text-yellow-600' },
    { title: 'Earnings', value: `₹${totalEarnings}`, icon: DollarSign, color: 'text-purple-600' },
  ];

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Welcome back! Here's your overview.</p>
          </div>
          <Card className="w-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="availability"
                  checked={isAvailable}
                  onCheckedChange={handleAvailabilityToggle}
                />
                <Label htmlFor="availability" className="cursor-pointer">
                  {isAvailable ? 'Online' : 'Offline'}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {!bookings || bookings.length === 0 ? (
              <p className="text-center text-neutral-500 py-8">No bookings yet</p>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking: any) => (
                  <div key={booking.id} className="flex justify-between items-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.serviceCategory}</p>
                      <p className="text-sm text-neutral-500">
                        {booking.customer?.name} • {booking.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        booking.status === 'COMPLETED' ? 'text-green-600' :
                        booking.status === 'IN_PROGRESS' ? 'text-blue-600' :
                        booking.status === 'PENDING' ? 'text-orange-600' : 'text-neutral-600'
                      }`}>
                        {booking.status}
                      </p>
                      <p className="text-sm text-neutral-500">₹{booking.servicePrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WorkerLayout>
  );
}
