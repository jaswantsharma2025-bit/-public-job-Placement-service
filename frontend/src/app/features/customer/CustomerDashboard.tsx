import { useQuery } from '@tanstack/react-query';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { bookingService } from '../../services/api';
import { Calendar, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function CustomerDashboard() {
  const { data } = useQuery({
  queryKey: ['customer-bookings'],
  queryFn: bookingService.getMyBookings,
});

const bookings = Array.isArray(data)
  ? data
  : data?.data || [];

  const totalBookings = bookings?.length || 0;
  const activeBookings = bookings?.filter((b: any) => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS')?.length || 0;
  const completedServices = bookings?.filter((b: any) => b.status === 'COMPLETED')?.length || 0;
  const pendingPayments = bookings?.filter((b: any) => b.paymentStatus === 'PENDING')?.length || 0;

  const stats = [
    { title: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'text-blue-600' },
    { title: 'Active Bookings', value: activeBookings, icon: Clock, color: 'text-orange-600' },
    { title: 'Completed Services', value: completedServices, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Pending Payments', value: pendingPayments, icon: DollarSign, color: 'text-red-600' },
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Welcome back! Here's your overview.</p>
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
              <p className="text-center text-neutral-500 py-8">No bookings yet. Find workers to get started!</p>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking: any) => (
                  <div key={booking.id} className="flex justify-between items-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.serviceCategory}</p>
                      <p className="text-sm text-neutral-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
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
    </CustomerLayout>
  );
}
