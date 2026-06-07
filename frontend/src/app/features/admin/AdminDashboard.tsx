import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { adminService } from '../../services/api';
import { Users, CheckCircle, Calendar, DollarSign, TrendingUp, UserCheck } from 'lucide-react';

const quickActions = [
  { label: 'View Analytics', path: '/admin/analytics', icon: TrendingUp },
  { label: 'Pending Workers', path: '/admin/workers/pending', icon: UserCheck },
  { label: 'Manage Bookings', path: '/admin/bookings', icon: Calendar },
  { label: 'View Complaints', path: '/admin/complaints', icon: CheckCircle },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminService.getAnalytics,
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Total Customers
              </CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics?.totalCustomers ?? '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Total Workers
              </CardTitle>
              <Users className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics?.totalWorkers ?? '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Total Bookings
              </CardTitle>
              <Calendar className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics?.totalBookings ?? '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {analytics ? `₹${analytics.totalRevenue}` : '₹-'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.path}
                  variant="outline"
                  className="h-auto py-6 flex-col gap-2"
                  onClick={() => navigate(action.path)}
                >
                  <action.icon className="w-8 h-8" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-neutral-500 py-8">No recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Worker Verification Rate</span>
                <span className="font-semibold">
                  {analytics?.totalWorkers
                    ? `${Math.round((analytics.verifiedWorkers / analytics.totalWorkers) * 100)}%`
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Booking Success Rate</span>
                <span className="font-semibold">
                  {analytics?.totalBookings
                    ? `${Math.round((analytics.completedBookings / analytics.totalBookings) * 100)}%`
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="font-semibold">-</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}