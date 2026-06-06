import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { workerService } from '../../services/api';
import { Briefcase, ChefHat, Car, HeartPulse, Wrench, Zap, Star, MapPin } from 'lucide-react';
import type { SkillCategory } from '../../types';

const categories = [
  { name: 'Maid', icon: Briefcase, category: 'MAID' as SkillCategory },
  { name: 'Cook', icon: ChefHat, category: 'COOK' as SkillCategory },
  { name: 'Driver', icon: Car, category: 'DRIVER' as SkillCategory },
  { name: 'Nurse', icon: HeartPulse, category: 'NURSE' as SkillCategory },
  { name: 'Plumber', icon: Wrench, category: 'PLUMBER' as SkillCategory },
  { name: 'Electrician', icon: Zap, category: 'ELECTRICIAN' as SkillCategory },
];

export default function CustomerHome() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | ''>('');
  const [city, setCity] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers', selectedCategory, city, availableOnly, verifiedOnly],
    queryFn: () => workerService.getAll({
      ...(selectedCategory && { skillCategory: selectedCategory }),
      ...(city && { city }),
      ...(availableOnly && { isAvailable: true }),
      ...(verifiedOnly && { isVerified: true }),
    }),
  });

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Find Workers</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Browse and hire verified professionals</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card
              key={category.category}
              className={`cursor-pointer hover:shadow-lg transition-all ${
                selectedCategory === category.category ? 'ring-2 ring-blue-600' : ''
              }`}
              onClick={() => setSelectedCategory(category.category)}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium text-sm">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as SkillCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.category} value={cat.category}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <div className="flex items-center gap-2">
                <Checkbox
                  id="available"
                  checked={availableOnly}
                  onCheckedChange={(checked) => setAvailableOnly(checked as boolean)}
                />
                <label htmlFor="available" className="text-sm cursor-pointer">Available Only</label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="verified"
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                />
                <label htmlFor="verified" className="text-sm cursor-pointer">Verified Only</label>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">Loading workers...</div>
        ) : !workers || workers.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">No workers found matching your criteria</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker: any) => (
              <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{worker.user?.name || worker.name}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{worker.skillCategory}</p>
                    </div>
                    {worker.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{worker.rating || 0}/5</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4" />
                      <span>{worker.city}</span>
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      Experience: {worker.experience} years
                    </div>
                    <div className="font-semibold text-lg">
                      ₹{worker.expectedSalary}/month
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/workers/${worker.id}`)}
                    >
                      View Profile
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => navigate('/booking/create', { state: { worker } })}
                    >
                      Book Now
                    </Button>
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
