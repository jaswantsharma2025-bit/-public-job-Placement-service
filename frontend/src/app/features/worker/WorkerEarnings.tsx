import { useQuery } from '@tanstack/react-query';
import WorkerLayout from '../../layouts/WorkerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { workerService, bookingService } from '../../services/api';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function WorkerEarnings() {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ['worker-earnings'],
    queryFn: workerService.getEarnings,
  });

  const { data: bookings } = useQuery({
    queryKey: ['worker-bookings'],
    queryFn: bookingService.getWorkerBookings,
  });

  const completedBookings = bookings?.filter((b: any) => b.status === 'COMPLETED') || [];
  const thisMonthEarnings = completedBookings
    .filter((b: any) => {
      const bookingDate = new Date(b.createdAt);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum: number, b: any) => sum + (b.servicePrice || 0), 0);

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Earnings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Track your income and performance</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading earnings...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Total Bookings
                  </CardTitle>
                  <Calendar className="w-5 h-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{earnings?.totalBookings || 0}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Total Earnings
                  </CardTitle>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹{earnings?.totalEarnings || 0}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    This Month
                  </CardTitle>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹{thisMonthEarnings}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {completedBookings.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">No completed bookings yet</p>
                ) : (
                  <div className="space-y-4">
                    {completedBookings.map((booking: any) => (
                      <div key={booking.id} className="flex justify-between items-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <div>
                          <p className="font-medium">{booking.serviceCategory}</p>
                          <p className="text-sm text-neutral-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">₹{booking.servicePrice}</p>
                          <p className="text-xs text-neutral-500">Completed</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Earnings Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400">Average per booking</p>
                    <p className="text-2xl font-bold">
                      ₹{completedBookings.length > 0
                        ? Math.round((earnings?.totalEarnings || 0) / completedBookings.length)
                        : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400">Completed this month</p>
                    <p className="text-2xl font-bold">
                      {completedBookings.filter((b: any) => {
                        const bookingDate = new Date(b.createdAt);
                        const now = new Date();
                        return bookingDate.getMonth() === now.getMonth();
                      }).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </WorkerLayout>
  );
}
