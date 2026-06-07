import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import WorkerLayout from '../../layouts/WorkerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { bookingService } from '../../services/api';
import { Calendar, MapPin, DollarSign, Star } from 'lucide-react';

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-3.5 h-3.5 ${
          s <= rating
            ? 'fill-black dark:fill-white text-black dark:text-white'
            : 'text-neutral-300 dark:text-neutral-600'
        }`}
      />
    ))}
  </div>
);

export default function WorkerBookings() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['worker-bookings'],
    queryFn: bookingService.getWorkerBookings,
  });

  const acceptBookingMutation = useMutation({
    mutationFn: (id: string) => bookingService.acceptBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bookings'] });
      toast.success('Booking accepted!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to accept booking');
    },
  });

  const rejectBookingMutation = useMutation({
    mutationFn: (id: string) => bookingService.rejectBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bookings'] });
      toast.success('Booking rejected');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject booking');
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

  // Compute aggregate stats from bookings
  const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');
  const reviewedBookings = completedBookings.filter((b: any) => b.review);
  const averageRating =
    reviewedBookings.length > 0
      ? reviewedBookings.reduce((sum: number, b: any) => sum + b.review.rating, 0) / reviewedBookings.length
      : 0;

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your service bookings</p>
        </div>

        {/* Review summary bar */}
        {reviewedBookings.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Your Average Rating</span>
              <div className="flex items-center gap-2 mt-1">
                <StarDisplay rating={Math.round(averageRating)} />
                <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-neutral-500">from {reviewedBookings.length} review{reviewedBookings.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-500">No bookings yet. Make sure you're available to receive bookings!</p>
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
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 font-mono">
                        Booking ID: {booking.id}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Customer: {booking.customerName || 'N/A'}
                      </p>
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

                  {booking.notes && (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      <strong>Notes:</strong> {booking.notes}
                    </div>
                  )}

                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => acceptBookingMutation.mutate(booking.id)} disabled={acceptBookingMutation.isPending}>
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectBookingMutation.mutate(booking.id)} disabled={rejectBookingMutation.isPending}>
                        Reject
                      </Button>
                    </div>
                  )}

                  {booking.status === 'ACCEPTED' && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">Waiting for customer to start service</p>
                  )}

                  {booking.status === 'IN_PROGRESS' && (
                    <p className="text-sm text-purple-600 dark:text-purple-400">Service in progress</p>
                  )}

                  {booking.status === 'COMPLETED' && (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 dark:text-green-400">Service completed successfully</p>
                      {/* Show review received for this booking */}
                      {booking.review ? (
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg space-y-1">
                          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Customer Review</p>
                          <StarDisplay rating={booking.review.rating} />
                          {booking.review.comment && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">"{booking.review.comment}"</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-400">No review yet from customer</p>
                      )}
                    </div>
                  )}

                  {booking.status === 'NO_SHOW' && (
                    <p className="text-sm text-neutral-500">Marked as no-show by customer</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}