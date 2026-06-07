import { useQuery } from '@tanstack/react-query';
import WorkerLayout from '../../layouts/WorkerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { bookingService, workerService, profileService } from '../../services/api';
import { Calendar, CheckCircle, Star, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-4 h-4 ${
          s <= Math.round(rating)
            ? 'fill-black dark:fill-white text-black dark:text-white'
            : 'text-neutral-300 dark:text-neutral-600'
        }`}
      />
    ))}
  </div>
);

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);

  const { data: bookings = [] } = useQuery({
    queryKey: ['worker-bookings'],
    queryFn: bookingService.getWorkerBookings,
  });

  const { data: earnings } = useQuery({
    queryKey: ['worker-earnings'],
    queryFn: workerService.getEarnings,
  });

  const { data: existingProfile } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: profileService.getWorkerProfile,
    retry: false,
    throwOnError: false,
  });

  useEffect(() => {
    if (existingProfile) {
      setIsAvailable(existingProfile.isAvailable ?? true);
    }
  }, [existingProfile]);

  const profileComplete = !!(
    existingProfile?.aadhaarNumber &&
    existingProfile?.skillCategory &&
    existingProfile?.experience != null &&
    existingProfile?.expectedSalary != null
  );

  const todaysJobs = bookings.filter((b: any) => {
    const today = new Date().toDateString();
    return new Date(b.createdAt).toDateString() === today;
  }).length;

  const completedJobs = bookings.filter((b: any) => b.status === 'COMPLETED').length;
  const totalEarnings = earnings?.totalEarnings || 0;

  // Use rating from worker profile (kept up to date by backend on each review)
  const rating: number = existingProfile?.rating || 0;
  const totalReviews: number = existingProfile?.totalReviews || 0;

  const handleAvailabilityToggle = async (checked: boolean) => {
    if (!profileComplete) {
      toast.error('Please complete your profile before changing availability.');
      navigate('/worker/profile');
      return;
    }
    try {
      await workerService.updateAvailability(checked);
      setIsAvailable(checked);
      toast.success(checked ? 'You are now online' : 'You are now offline');
    } catch {
      toast.error('Failed to update availability');
    }
  };

  const stats = [
    { title: "Today's Jobs", value: String(todaysJobs), icon: Calendar, color: 'text-blue-600' },
    { title: 'Completed Jobs', value: String(completedJobs), icon: CheckCircle, color: 'text-green-600' },
    {
      title: 'Avg Rating',
      value: rating > 0 ? `${rating.toFixed(1)}/5` : 'No ratings yet',
      icon: Star,
      color: 'text-yellow-600',
    },
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
                  disabled={!profileComplete}
                />
                <Label
                  htmlFor="availability"
                  className={`cursor-pointer ${!profileComplete ? 'text-neutral-400' : ''}`}
                  title={!profileComplete ? 'Complete your profile first' : ''}
                >
                  {isAvailable ? 'Online' : 'Offline'}
                </Label>
              </div>
              {!profileComplete && (
                <p
                  className="text-xs text-orange-500 mt-2 cursor-pointer underline"
                  onClick={() => navigate('/worker/profile')}
                >
                  Complete profile to go online
                </p>
              )}
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
                {stat.title === 'Avg Rating' && rating > 0 && (
                  <div className="mt-1 space-y-0.5">
                    <StarDisplay rating={rating} />
                    <p className="text-xs text-neutral-400">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-center text-neutral-500 py-8">No bookings yet</p>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking: any) => (
                  <div key={booking.id} className="flex justify-between items-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <div className="space-y-0.5">
                      <p className="font-medium">{booking.serviceCategory}</p>
                      <p className="text-sm text-neutral-500">
                        {booking.customerName || 'Customer'} · {booking.city}
                      </p>
                      {/* Show star rating inline if review exists */}
                      {booking.review && (
                        <div className="flex items-center gap-1 pt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= booking.review.rating
                                  ? 'fill-black dark:fill-white text-black dark:text-white'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
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