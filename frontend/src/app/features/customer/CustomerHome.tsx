import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { workerService, categoryService } from '../../services/api';
import { Star, MapPin } from 'lucide-react';
import type { Category } from '../../types';

export default function CustomerHome() {
  const navigate = useNavigate();

  // Selected sub-category IDs (multi-select)
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  // Which category accordion is open
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });
  const categories: Category[] = categoriesData ?? [];

  const { data: workersData, isLoading } = useQuery({
    queryKey: ['workers', selectedSubIds, city, availableOnly, verifiedOnly],
    queryFn: () =>
      workerService.getAll({
        ...(selectedSubIds.length > 0 && { subCategoryIds: selectedSubIds.join(',') }),
        ...(city && { city }),
        ...(availableOnly && { isAvailable: true }),
        ...(verifiedOnly  && { isVerified: true }),
      }),
  });

  const workers = Array.isArray(workersData) ? workersData : workersData?.data || [];

  const toggleSub = (id: string) => {
    setSelectedSubIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedSubIds([]);
    setCity('');
    setAvailableOnly(false);
    setVerifiedOnly(false);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Find Workers</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Browse and hire verified professionals</p>
        </div>

        {/* ── Filters ──────────────────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Skill filter */}
            <div>
              <p className="text-sm font-semibold mb-2">Filter by Skill</p>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <button
                      type="button"
                      onClick={() => setOpenCategoryId(openCategoryId === cat.id ? null : cat.id)}
                      className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1 hover:text-black dark:hover:text-white"
                    >
                      {openCategoryId === cat.id ? '▾' : '▸'} {cat.name}
                    </button>
                    {openCategoryId === cat.id && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-4">
                        {cat.subCategories.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => toggleSub(sub.id)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                              selectedSubIds.includes(sub.id)
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-600 hover:border-neutral-500'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedSubIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-xs text-neutral-500 mr-1 self-center">Active:</span>
                  {categories
                    .flatMap((c) => c.subCategories)
                    .filter((s) => selectedSubIds.includes(s.id))
                    .map((s) => (
                      <Badge
                        key={s.id}
                        variant="secondary"
                        className="text-xs cursor-pointer"
                        onClick={() => toggleSub(s.id)}
                      >
                        {s.name} ×
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            {/* City + checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <Input
                placeholder="Filter by city…"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  id="available"
                  checked={availableOnly}
                  onCheckedChange={(c) => setAvailableOnly(c as boolean)}
                />
                <label htmlFor="available" className="text-sm cursor-pointer">Available Only</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="verified"
                  checked={verifiedOnly}
                  onCheckedChange={(c) => setVerifiedOnly(c as boolean)}
                />
                <label htmlFor="verified" className="text-sm cursor-pointer">Verified Only</label>
              </div>
            </div>

            {(selectedSubIds.length > 0 || city || availableOnly || verifiedOnly) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-neutral-500">
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ── Results ───────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="text-center py-12">Loading workers…</div>
        ) : !workers || workers.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">No workers found matching your criteria</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker: any) => {
              const skillNames = worker.skills?.map((s: any) => s.subCategory?.name).filter(Boolean) ?? [];
              return (
                <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {worker.profilePhotoUrl ? (
                          <img src={worker.profilePhotoUrl} alt={worker.user?.name}
                            className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold text-lg">
                            {(worker.user?.name || '?')[0]}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{worker.user?.name || worker.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {skillNames.slice(0, 2).map((name: string) => (
                              <Badge key={name} variant="secondary" className="text-xs">{name}</Badge>
                            ))}
                            {skillNames.length > 2 && (
                              <Badge variant="secondary" className="text-xs">+{skillNames.length - 2}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {worker.isVerified && (
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 flex-shrink-0">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{worker.rating || 0}/5</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <MapPin className="w-4 h-4" />
                        <span>{worker.city || 'Location not set'}</span>
                      </div>
                      <div className="text-neutral-600 dark:text-neutral-400">
                        Experience: {worker.experience} years
                      </div>
                      <div className="font-semibold text-lg">₹{worker.expectedSalary}/month</div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => navigate(`/workers/${worker.id}`)}>
                        View Profile
                      </Button>
                      <Button className="flex-1" onClick={() => navigate('/booking/create', { state: { worker } })}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}