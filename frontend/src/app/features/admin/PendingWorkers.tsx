import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { adminService } from '../../services/api';
import { CheckCircle, XCircle, Phone, MapPin } from 'lucide-react';

export default function PendingWorkers() {
  const queryClient = useQueryClient();
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: workers, isLoading } = useQuery({
    queryKey: ['pending-workers'],
    queryFn: adminService.getPendingWorkers,
  });

  const approveMutation = useMutation({
    // Backend route: PATCH /admin/workers/:userId/approve — must pass userId not profile id
    mutationFn: (userId: string) => adminService.approveWorker(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-workers'] });
      toast.success('Worker approved successfully');
    },
    onError: () => {
      toast.error('Failed to approve worker');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      adminService.rejectWorker(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-workers'] });
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedWorker(null);
      toast.success('Worker rejected');
    },
    onError: () => {
      toast.error('Failed to reject worker');
    },
  });

  const handleReject = () => {
    if (!selectedWorker || !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectMutation.mutate({ userId: selectedWorker.userId, reason: rejectReason });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pending Workers</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Review and approve worker registrations</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading workers...</div>
        ) : !workers || workers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-500">No pending workers for verification</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker: any) => (
              <Card key={worker.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{worker.user?.name || worker.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">{worker.skillCategory}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Phone className="w-4 h-4" />
                      <span>{worker.user?.phone || worker.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4" />
                      <span>{worker.city || 'Not specified'}</span>
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      Experience: {worker.experience || 0} years
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      Expected Salary: ₹{worker.expectedSalary || 0}/month
                    </div>
                    {worker.aadhaarNumber && (
                      <div className="text-neutral-600 dark:text-neutral-400">
                        Aadhaar: {worker.aadhaarNumber}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => approveMutation.mutate(worker.userId)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setSelectedWorker(worker);
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Worker</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason for Rejection</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleReject}>
                  Reject Worker
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}