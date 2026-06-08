import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { bookingService, reviewService } from '../../services/api';
import { Calendar, MapPin, DollarSign, Star } from 'lucide-react';

export default function MyBookingsPage() {
  const queryClient = useQueryClient();
  const [replacementReason, setReplacementReason] = useState<Record<string, string>>({});
  const [reviewOpen, setReviewOpen] = useState<Record<string, boolean>>({});
  const [reviewRating, setReviewRating] = useState<Record<string, number>>({});
  const [reviewComment, setReviewComment] = useState<Record<string, string>>({});

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['customer-bookings'],
    queryFn: bookingService.getMyBookings,
  });

  const startServiceMutation = useMutation({
    mutationFn: (id: string) => bookingService.startService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Service started!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start service');
    },
  });

  const completeServiceMutation = useMutation({
    mutationFn: (id: string) => bookingService.completeService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Service completed!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete service');
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Booking cancelled');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const requestReplacementMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingService.requestReplacement(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Replacement requested');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to request replacement');
    },
  });

  const markNoShowMutation = useMutation({
    mutationFn: (id: string) => bookingService.markNoShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Marked as no-show');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark no-show');
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: ({ bookingId, rating, comment }: { bookingId: string; rating: number; comment?: string }) =>
      reviewService.create({ bookingId, rating, comment }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Review submitted!');
      setReviewOpen((prev) => ({ ...prev, [variables.bookingId]: false }));
      setReviewRating((prev) => ({ ...prev, [variables.bookingId]: 0 }));
      setReviewComment((prev) => ({ ...prev, [variables.bookingId]: '' }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });

  const handleRequestReplacement = (id: string) => {
    const reason = replacementReason[id]?.trim();
    if (!reason) {
      toast.error('Please enter a reason for replacement');
      return;
    }
    requestReplacementMutation.mutate({ id, reason });
  };

  const handleSubmitReview = (bookingId: string) => {
    const rating = reviewRating[bookingId];
    if (!rating || rating < 1) {
      toast.error('Please select a star rating');
      return;
    }
    submitReviewMutation.mutate({ bookingId, rating, comment: reviewComment[bookingId] });
  };

  const StarDisplay = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
    const cls = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`${cls} ${
              s <= rating
                ? 'fill-black dark:fill-white text-black dark:text-white'
                : 'text-neutral-300 dark:text-neutral-600'
            }`}
          />
        ))}
      </div>
    );
  };

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
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your service bookings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-500">No bookings yet. Find workers to get started!</p>
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
                        Worker: {booking.workerName || 'N/A'}
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

                  <div className="flex flex-wrap gap-2 pt-2">
                    {booking.status === 'PENDING' && (
                      <p className="text-sm text-neutral-500 w-full">Waiting for worker response...</p>
                    )}

                    {booking.status === 'ACCEPTED' && (
                      <>
                        <Button size="sm" onClick={() => startServiceMutation.mutate(booking.id)} disabled={startServiceMutation.isPending}>
                          Start Service
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => markNoShowMutation.mutate(booking.id)} disabled={markNoShowMutation.isPending}>
                          Mark No-Show
                        </Button>
                        <div className="flex gap-2 w-full items-center">
                          <input
                            className="flex-1 border rounded px-2 py-1 text-sm"
                            placeholder="Reason for replacement..."
                            value={replacementReason[booking.id] || ''}
                            onChange={(e) => setReplacementReason((prev) => ({ ...prev, [booking.id]: e.target.value }))}
                          />
                          <Button size="sm" variant="outline" onClick={() => handleRequestReplacement(booking.id)} disabled={requestReplacementMutation.isPending}>
                            Request Replacement
                          </Button>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => cancelBookingMutation.mutate(booking.id)} disabled={cancelBookingMutation.isPending}>
                          Cancel
                        </Button>
                      </>
                    )}

                    {booking.status === 'IN_PROGRESS' && (
                      <Button size="sm" onClick={() => completeServiceMutation.mutate(booking.id)} disabled={completeServiceMutation.isPending}>
                        Complete Service
                      </Button>
                    )}

                    {booking.status === 'COMPLETED' && (
                      <div className="w-full space-y-3">
                        {/* Already reviewed — show submitted review */}
                        {booking.review ? (
                          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg space-y-1">
                            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Your Review</p>
                            <StarDisplay rating={booking.review.rating} size="md" />
                            {booking.review.comment && (
                              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">"{booking.review.comment}"</p>
                            )}
                          </div>
                        ) : reviewOpen[booking.id] ? (
                          /* Review form */
                          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-3 bg-neutral-50 dark:bg-neutral-800">
                            <p className="text-sm font-semibold">Rate your experience with {booking.workerName}</p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating((prev) => ({ ...prev, [booking.id]: star }))}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-8 h-8 transition-colors ${
                                      star <= (reviewRating[booking.id] || 0)
                                        ? 'fill-black dark:fill-white text-black dark:text-white'
                                        : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-400'
                                    }`}
                                  />
                                </button>
                              ))}
                              {reviewRating[booking.id] > 0 && (
                                <span className="ml-2 text-sm text-neutral-500 self-center">
                                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating[booking.id]]}
                                </span>
                              )}
                            </div>
                            <Textarea
                              placeholder="Share your experience (optional)..."
                              rows={3}
                              value={reviewComment[booking.id] || ''}
                              onChange={(e) => setReviewComment((prev) => ({ ...prev, [booking.id]: e.target.value }))}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSubmitReview(booking.id)} disabled={submitReviewMutation.isPending}>
                                {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setReviewOpen((prev) => ({ ...prev, [booking.id]: false }))}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* Leave review button */
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReviewOpen((prev) => ({ ...prev, [booking.id]: true }))}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Leave Review
                          </Button>
                        )}
                      </div>
                    )}

                    {booking.status === 'NO_SHOW' && (
                      <div className="flex gap-2 w-full items-center">
                        <input
                          className="flex-1 border rounded px-2 py-1 text-sm"
                          placeholder="Reason for replacement..."
                          value={replacementReason[booking.id] || ''}
                          onChange={(e) => setReplacementReason((prev) => ({ ...prev, [booking.id]: e.target.value }))}
                        />
                        <Button size="sm" variant="outline" onClick={() => handleRequestReplacement(booking.id)} disabled={requestReplacementMutation.isPending}>
                          Request Replacement
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}