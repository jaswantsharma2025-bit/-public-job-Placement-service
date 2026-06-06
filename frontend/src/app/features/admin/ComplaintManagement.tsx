import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { complaintService } from '../../services/api';

export default function ComplaintManagement() {
  const queryClient = useQueryClient();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['admin-complaints'],
    queryFn: complaintService.getAll,
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      complaintService.resolve(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
      setShowResolveDialog(false);
      setAdminNotes('');
      setSelectedComplaint(null);
      toast.success('Complaint resolved');
    },
    onError: () => {
      toast.error('Failed to resolve complaint');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      complaintService.reject(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
      setShowRejectDialog(false);
      setAdminNotes('');
      setSelectedComplaint(null);
      toast.success('Complaint rejected');
    },
    onError: () => {
      toast.error('Failed to reject complaint');
    },
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      RESOLVED: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      REJECTED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    };
    return <Badge className={colors[status] || ''}>{status}</Badge>;
  };

  const handleResolve = () => {
    if (!selectedComplaint) return;
    resolveMutation.mutate({ id: selectedComplaint.id, notes: adminNotes });
  };

  const handleReject = () => {
    if (!selectedComplaint) return;
    rejectMutation.mutate({ id: selectedComplaint.id, notes: adminNotes });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Complaint Management</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Review and resolve customer complaints</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading complaints...</div>
        ) : !complaints || complaints.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-500">No complaints found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint: any) => (
              <Card key={complaint.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{complaint.reason}</CardTitle>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        <p>From: {complaint.customer?.name || 'N/A'}</p>
                        <p>Against: {complaint.againstUser?.name || 'N/A'}</p>
                        <p>Date: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {getStatusBadge(complaint.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Description:</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{complaint.description}</p>
                  </div>

                  {complaint.adminNotes && (
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm font-medium mb-1">Admin Notes:</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{complaint.adminNotes}</p>
                    </div>
                  )}

                  {complaint.status === 'OPEN' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowResolveDialog(true);
                        }}
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowRejectDialog(true);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resolve Complaint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Admin Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about the resolution..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowResolveDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleResolve}>
                  Resolve Complaint
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Complaint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reject-notes">Admin Notes (Optional)</Label>
                <Textarea
                  id="reject-notes"
                  placeholder="Add any notes about the rejection..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleReject}>
                  Reject Complaint
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
