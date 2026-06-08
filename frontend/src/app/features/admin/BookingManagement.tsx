import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { adminService } from '../../services/api';
import { Calendar, MapPin, DollarSign, RefreshCw, User, Phone } from 'lucide-react';

export default function BookingManagement() {
  const queryClient = useQueryClient();

  // Reassign state
  const [reassignBookingId, setReassignBookingId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: adminService.getAllBookings,
  });

  const forceCompleteMutation = useMutation({
    mutationFn: (id: string) => adminService.forceCompleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking marked as completed');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete booking');
    },
  });

  const forceCancelMutation = useMutation({
    mutationFn: (id: string) => adminService.forceCancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking cancelled');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const reassignMutation = useMutation({
    mutationFn: ({ bookingId, workerId }: { bookingId: string; workerId: string }) =>
      adminService.assignReplacement(bookingId, workerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Worker reassigned successfully');
      setReassignBookingId(null);
      setCandidates([]);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reassign worker');
    },
  });

  const handleOpenReassign = async (bookingId: string) => {
    setReassignBookingId(bookingId);
    setCandidates([]);
    setCandidatesLoading(true);
    try {
      const data = await adminService.getReplacementCandidates(bookingId);
      setCandidates(data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load replacement candidates');
    } finally {
      setCandidatesLoading(false);
    }
  };

  const handleCloseReassign = () => {
    setReassignBookingId(null);
    setCandidates([]);
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
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Oversee and manage all bookings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading bookings...</div>
        ) : bookings.length === 0 ? (
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
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 font-mono">
                        Booking ID: {booking.id}
                      </p>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        <p>Customer: {booking.customerName || 'N/A'}</p>
                        <p>Worker: {booking.workerName || 'N/A'}</p>
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

                  {/* Show replacement request info if flagged */}
                  {booking.replacementRequested && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                        Replacement Requested
                      </p>
                      {booking.replacementReason && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-0.5">
                          Reason: {booking.replacementReason}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => forceCompleteMutation.mutate(booking.id)}
                          disabled={forceCompleteMutation.isPending}
                        >
                          Force Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => forceCancelMutation.mutate(booking.id)}
                          disabled={forceCancelMutation.isPending}
                        >
                          Force Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenReassign(booking.id)}
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          Reassign Worker
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

      {/* Reassign Worker Dialog */}
      <Dialog open={!!reassignBookingId} onOpenChange={(open) => { if (!open) handleCloseReassign(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reassign Worker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Select a verified, available worker in the same city and skill category. The booking will be reset to PENDING for the new worker to accept.
            </p>

            {candidatesLoading ? (
              <div className="text-center py-8 text-sm text-neutral-500">
                Loading available workers...
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-500">No available replacement workers found in this city and category.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {candidates.map((worker: any) => (
                  <div
                    key={worker.id}
                    className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-black dark:hover:border-white transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="font-semibold text-sm">{worker.user?.name || 'N/A'}</span>
                        <Badge variant="secondary" className="text-xs">{worker.skillCategory}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Phone className="w-3 h-3" />
                        <span>{worker.user?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex gap-3 text-xs text-neutral-500">
                        <span>{worker.city || 'N/A'}</span>
                        <span>·</span>
                        <span>{worker.experience ?? 0} yrs exp</span>
                        <span>·</span>
                        <span>₹{worker.expectedSalary ?? 0}/mo</span>
                        {worker.rating > 0 && (
                          <>
                            <span>·</span>
                            <span>★ {worker.rating.toFixed(1)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        reassignMutation.mutate({
                          bookingId: reassignBookingId!,
                          workerId: worker.userId,
                        })
                      }
                      disabled={reassignMutation.isPending}
                    >
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={handleCloseReassign}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}