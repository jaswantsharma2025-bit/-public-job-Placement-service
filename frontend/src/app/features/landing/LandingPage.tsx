import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Briefcase, ChefHat, Car, HeartPulse, Wrench, Zap, Star, Users, CheckCircle, Shield } from 'lucide-react';

const categories = [
  { name: 'Maid', icon: Briefcase, category: 'MAID', color: 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300' },
  { name: 'Cook', icon: ChefHat, category: 'COOK', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' },
  { name: 'Driver', icon: Car, category: 'DRIVER', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
  { name: 'Nurse', icon: HeartPulse, category: 'NURSE', color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' },
  { name: 'Plumber', icon: Wrench, category: 'PLUMBER', color: 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300' },
  { name: 'Electrician', icon: Zap, category: 'ELECTRICIAN', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' },
];

const stats = [
  { label: 'Verified Workers', value: '10,000+', icon: Users },
  { label: 'Services Completed', value: '50,000+', icon: CheckCircle },
  { label: 'Average Rating', value: '4.8/5', icon: Star },
  { label: 'Background Verified', value: '100%', icon: Shield },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Customer', comment: 'Found a reliable cook within minutes. Highly recommend!', rating: 5 },
  { name: 'Raj Kumar', role: 'Customer', comment: 'Professional service. The driver was punctual and courteous.', rating: 5 },
  { name: 'Anjali Singh', role: 'Customer', comment: 'Best platform for finding household help. Very convenient!', rating: 5 },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <nav className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 font-bold text-xl">INSTAFF</div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate('/auth/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-neutral-950 dark:to-purple-950/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Verified Workers in <span className="text-blue-600">Minutes</span>
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              India's most trusted on-demand workforce platform. Find maids, cooks, drivers, nurses, and more.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input placeholder="Search for services..." className="h-12" />
              <Button size="lg" className="h-12 px-8">Search</Button>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate('/auth/register')}>
                Find Workers
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth/register')}>
                Become a Worker
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.category}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/auth/register')}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${category.color}`}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <p className="font-medium">{category.name}</p>
                  <Badge variant="secondary" className="text-xs">Available</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <stat.icon className="w-10 h-10 mx-auto text-blue-600" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300">{testimonial.comment}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-neutral-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-2xl font-bold mb-4">INSTAFF</p>
            <p className="text-neutral-400">India's Most Trusted Workforce Platform</p>
            <p className="text-neutral-500 mt-4">© 2026 INSTAFF. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
