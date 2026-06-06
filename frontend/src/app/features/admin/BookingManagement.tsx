import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { adminService } from '../../services/api';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

export default function BookingManagement() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: adminService.getAllBookings,
  });

  const forceCompleteMutation = useMutation({
    mutationFn: (id: string) => adminService.forceCompleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking marked as completed');
    },
    onError: () => {
      toast.error('Failed to complete booking');
    },
  });

  const forceCancelMutation = useMutation({
    mutationFn: (id: string) => adminService.forceCancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking cancelled');
    },
    onError: () => {
      toast.error('Failed to cancel booking');
    },
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      ACCEPTED: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      IN_PROGRESS: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      COMPLETED: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      CANCELLED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
      REJECTED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
      NO_SHOW: 'bg-neutral-100 dark:bg-neutral-900/20 text-neutral-700 dark:text-neutral-300',
    };
    return <Badge className={colors[status] || ''}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Oversee and manage all bookings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading bookings...</div>
        ) : !bookings || bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-500">No bookings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{booking.serviceCategory}</CardTitle>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        <p>Customer: {booking.customer?.name || 'N/A'}</p>
                        <p>Worker: {booking.worker?.user?.name || booking.worker?.name || 'N/A'}</p>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neutral-500" />
                      <span>{booking.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-neutral-500" />
                      <span>₹{booking.servicePrice}</span>
                    </div>
                  </div>

                  {booking.address && (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      <strong>Address:</strong> {booking.address}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => forceCompleteMutation.mutate(booking.id)}
                        >
                          Force Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => forceCancelMutation.mutate(booking.id)}
                        >
                          Force Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
