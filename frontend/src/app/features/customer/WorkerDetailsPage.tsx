import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { workerService, reviewService } from '../../services/api';
import { Star, MapPin, Phone, CheckCircle } from 'lucide-react';

export default function WorkerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: worker, isLoading } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => workerService.getById(id!),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['worker-reviews', id],
    queryFn: () => reviewService.getWorkerReviews(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="text-center py-12">Loading worker details...</div>
      </CustomerLayout>
    );
  }

  if (!worker) {
    return (
      <CustomerLayout>
        <div className="text-center py-12 text-neutral-500">Worker not found</div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>

        <Card>
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div className="space-y-4 flex-1">
                <div>
                  <h1 className="text-3xl font-bold">{worker.user?.name || worker.name}</h1>
                  <p className="text-xl text-neutral-600 dark:text-neutral-400">{worker.skillCategory}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {worker.isVerified && (
                    <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {worker.experience} years experience
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Rating</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{worker.rating || 0}/5</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span className="font-semibold">{worker.city}, {worker.state}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">{worker.user?.phone || worker.phone}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Expected Salary</p>
                    <span className="font-semibold text-lg">₹{worker.expectedSalary}/month</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full mt-6"
                  onClick={() => navigate('/booking/create', { state: { worker } })}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {!reviews || reviews.length === 0 ? (
              <p className="text-center text-neutral-500 py-6">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-neutral-200 dark:border-neutral-800 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">{review.comment}</p>
                    <p className="text-sm text-neutral-500 mt-2">- {review.customer?.name}</p>
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
