import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Briefcase, ChefHat, Car, HeartPulse, Wrench, Zap, Star, Users, CheckCircle, Shield, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Maid', icon: Briefcase, category: 'MAID' },
  { name: 'Cook', icon: ChefHat, category: 'COOK' },
  { name: 'Driver', icon: Car, category: 'DRIVER' },
  { name: 'Nurse', icon: HeartPulse, category: 'NURSE' },
  { name: 'Plumber', icon: Wrench, category: 'PLUMBER' },
  { name: 'Electrician', icon: Zap, category: 'ELECTRICIAN' },
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
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans">

      {/* NAV */}
      <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="font-black text-xl tracking-widest text-black dark:text-white">INSTAFF</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                onClick={() => navigate('/auth/login')}
              >
                Sign In
              </Button>
              <Button
                className="bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-white text-sm font-semibold h-9 px-5"
                onClick={() => navigate('/auth/register')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-black dark:bg-black text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">

            {/* Left — headline */}
            <div className="space-y-6 max-w-2xl">
              <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase font-medium">India's Most Trusted Workforce Platform</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.0] text-white">
                Verified<br />Workers in<br /><span className="text-neutral-400">Minutes.</span>
              </h1>
              <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-md">
                Find maids, cooks, drivers, nurses, and more — background-checked and ready to serve.
              </p>
            </div>

            {/* Right — search + CTAs */}
            <div className="flex flex-col gap-4 w-full md:w-80">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for services..."
                  className="h-11 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 text-sm focus-visible:ring-white focus-visible:border-white"
                />
                <Button
                  size="icon"
                  className="h-11 w-11 bg-white hover:bg-neutral-200 text-black shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full h-11 bg-white hover:bg-neutral-200 text-black font-semibold text-sm"
                  onClick={() => navigate('/auth/register')}
                >
                  Find Workers
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 border-neutral-700 text-white hover:bg-neutral-800 hover:text-white font-semibold text-sm bg-transparent"
                  onClick={() => navigate('/auth/register')}
                >
                  Become a Worker
                </Button>
              </div>
            </div>
          </div>

          {/* Tagline strip */}
          <div className="mt-16 pt-8 border-t border-neutral-800 flex gap-6 text-neutral-600 text-xs tracking-widest uppercase flex-wrap">
            <span>Verified Workers</span>
            <span>·</span>
            <span>Instant Booking</span>
            <span>·</span>
            <span>Trusted Platform</span>
            <span>·</span>
            <span>Pan India</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <p className="text-3xl md:text-4xl font-black text-black dark:text-white">{stat.value}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-medium mb-2">What We Offer</p>
              <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Popular Services</h2>
            </div>
            <button
              onClick={() => navigate('/auth/register')}
              className="text-sm font-semibold text-black dark:text-white underline underline-offset-4 hover:opacity-70 transition-opacity self-start md:self-auto"
            >
              View all services →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <div
                key={category.category}
                className="group cursor-pointer border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 text-center space-y-3 hover:border-black dark:hover:border-white hover:shadow-md transition-all duration-200 bg-white dark:bg-neutral-950"
                onClick={() => navigate('/auth/register')}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-colors duration-200">
                  <category.icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300 group-hover:text-white dark:group-hover:text-black transition-colors duration-200" />
                </div>
                <p className="font-semibold text-sm text-black dark:text-white">{category.name}</p>
                <Badge variant="secondary" className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-0">
                  Available
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-medium mb-2">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-0 md:gap-0 relative">
            {[
              { step: '01', title: 'Search', desc: 'Browse verified workers by category, location, and availability.' },
              { step: '02', title: 'Book', desc: 'Instant or scheduled bookings with transparent pricing upfront.' },
              { step: '03', title: 'Done', desc: 'Worker arrives, job gets done. Rate and review after service.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-8 border-neutral-200 dark:border-neutral-800 ${idx < 2 ? 'md:border-r' : ''} ${idx > 0 ? 'border-t md:border-t-0' : ''} border`}
              >
                <p className="text-6xl font-black text-neutral-100 dark:text-neutral-800 leading-none mb-4">{item.step}</p>
                <p className="text-xl font-black text-black dark:text-white mb-2">{item.title}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-medium mb-2">Customer Stories</p>
            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-none bg-white dark:bg-neutral-950">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-black text-black dark:fill-white dark:text-white" />
                    ))}
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">"{testimonial.comment}"</p>
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <p className="font-bold text-sm text-black dark:text-white">{testimonial.name}</p>
                    <p className="text-xs text-neutral-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-black dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-white">Ready to get started?</h2>
          <p className="text-neutral-400 text-base max-w-md mx-auto">Join thousands of households already using INSTAFF for reliable home staffing.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              className="h-11 px-8 bg-white hover:bg-neutral-200 text-black font-semibold text-sm"
              onClick={() => navigate('/auth/register')}
            >
              Find Workers
            </Button>
            <Button
              variant="outline"
              className="h-11 px-8 border-neutral-700 text-white hover:bg-neutral-800 hover:text-white bg-transparent font-semibold text-sm"
              onClick={() => navigate('/auth/register')}
            >
              Become a Worker
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-950 dark:bg-black text-white py-10 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xl font-black tracking-widest">INSTAFF</span>
            <p className="text-neutral-500 text-xs">India's Most Trusted Workforce Platform</p>
            <p className="text-neutral-600 text-xs">© 2026 INSTAFF. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}