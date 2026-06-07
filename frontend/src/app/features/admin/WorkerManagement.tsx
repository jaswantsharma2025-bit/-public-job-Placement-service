import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { workerService, adminService } from '../../services/api';
import { useState } from 'react';
import { Search, UserX, UserCheck, Star } from 'lucide-react';

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-3.5 h-3.5 ${
          s <= Math.round(rating)
            ? 'fill-black dark:fill-white text-black dark:text-white'
            : 'text-neutral-300 dark:text-neutral-600'
        }`}
      />
    ))}
  </div>
);

export default function WorkerManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: workers, isLoading } = useQuery({
    queryKey: ['all-workers'],
    queryFn: () => workerService.getAll({}),
  });

  const suspendMutation = useMutation({
    mutationFn: (userId: string) => adminService.suspendWorker(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      toast.success('Worker suspended');
    },
    onError: () => toast.error('Failed to suspend worker'),
  });

  const reactivateMutation = useMutation({
    mutationFn: (userId: string) => adminService.reactivateWorker(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      toast.success('Worker reactivated');
    },
    onError: () => toast.error('Failed to reactivate worker'),
  });

  const filteredWorkers = workers?.filter((worker: any) =>
    worker.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.skillCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Worker Management</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage all workers on the platform</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-neutral-500" />
              <Input
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">Loading workers...</div>
        ) : !filteredWorkers || filteredWorkers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-500">No workers found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredWorkers.map((worker: any) => (
              <Card key={worker.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{worker.user?.name || worker.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{worker.skillCategory}</Badge>
                        {worker.isVerified && (
                          <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                            Verified
                          </Badge>
                        )}
                        {worker.isSuspended && (
                          <Badge className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                            Suspended
                          </Badge>
                        )}
                        {worker.isAvailable && !worker.isSuspended && (
                          <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                            Available
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!worker.isSuspended ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => suspendMutation.mutate(worker.userId)}
                          disabled={suspendMutation.isPending}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reactivateMutation.mutate(worker.userId)}
                          disabled={reactivateMutation.isPending}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">Phone</p>
                      <p className="font-medium">{worker.user?.phone || worker.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">Location</p>
                      <p className="font-medium">{worker.city || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">Experience</p>
                      <p className="font-medium">{worker.experience ?? 0} yrs</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">Expected Salary</p>
                      <p className="font-medium">₹{worker.expectedSalary ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">Rating</p>
                      {worker.totalReviews > 0 ? (
                        <div className="space-y-0.5">
                          <StarDisplay rating={worker.rating} />
                          <p className="text-xs text-neutral-400">
                            {worker.rating.toFixed(1)} · {worker.totalReviews} review{worker.totalReviews !== 1 ? 's' : ''}
                          </p>
                        </div>
                      ) : (
                        <p className="font-medium text-neutral-400">No reviews yet</p>
                      )}
                    </div>
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