import { useQuery } from '@tanstack/react-query';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { adminService } from '../../services/api';
import { Users, UserCheck, Calendar, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminService.getAnalytics,
  });

  const stats = [
    { title: 'Total Customers', value: analytics?.totalCustomers || 0, icon: Users, color: 'text-blue-600' },
    { title: 'Total Workers', value: analytics?.totalWorkers || 0, icon: Users, color: 'text-green-600' },
    { title: 'Verified Workers', value: analytics?.verifiedWorkers || 0, icon: UserCheck, color: 'text-purple-600' },
    { title: 'Total Bookings', value: analytics?.totalBookings || 0, icon: Calendar, color: 'text-orange-600' },
    { title: 'Completed Bookings', value: analytics?.completedBookings || 0, icon: CheckCircle, color: 'text-teal-600' },
    { title: 'Total Revenue', value: `₹${analytics?.totalRevenue || 0}`, icon: DollarSign, color: 'text-pink-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Platform performance metrics</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading analytics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <CardTitle>Growth Metrics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Worker Verification Rate</span>
                    <span className="font-semibold">
                      {analytics?.totalWorkers ? Math.round((analytics.verifiedWorkers / analytics.totalWorkers) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Booking Completion Rate</span>
                    <span className="font-semibold">
                      {analytics?.totalBookings ? Math.round((analytics.completedBookings / analytics.totalBookings) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Revenue per Booking</span>
                    <span className="font-semibold">
                      ₹{analytics?.totalBookings ? Math.round((analytics.totalRevenue || 0) / analytics.totalBookings) : 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Active Users</p>
                    <p className="text-2xl font-bold">
                      {(analytics?.totalCustomers || 0) + (analytics?.totalWorkers || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Pending Verifications</p>
                    <p className="text-2xl font-bold">
                      {(analytics?.totalWorkers || 0) - (analytics?.verifiedWorkers || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Ongoing Bookings</p>
                    <p className="text-2xl font-bold">
                      {(analytics?.totalBookings || 0) - (analytics?.completedBookings || 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
