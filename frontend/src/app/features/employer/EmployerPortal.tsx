import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router';
import { Building2, Users, Calendar, Wallet, FileText, TrendingUp } from 'lucide-react';

const features = [
  { icon: Users, title: 'Bulk Hiring', description: 'Hire multiple workers at once' },
  { icon: Calendar, title: 'Attendance Management', description: 'Track worker attendance digitally' },
  { icon: Wallet, title: 'Payroll System', description: 'Automated salary processing' },
  { icon: FileText, title: 'Compliance Management', description: 'Stay compliant with labor laws' },
  { icon: TrendingUp, title: 'Performance Analytics', description: 'Track workforce productivity' },
  { icon: Building2, title: 'Multi-Site Management', description: 'Manage workers across locations' },
];

export default function EmployerPortal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-neutral-950 dark:to-purple-950/20">
      <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 font-bold text-xl">INSTAFF</div>
            <Button variant="ghost" onClick={() => navigate('/auth/login')}>
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 mb-16">
          <div className="inline-block">
            <div className="w-32 h-32 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-6">
              <Building2 className="w-16 h-16 text-blue-600" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">Employer Portal</h1>
            <Badge variant="secondary" className="text-lg px-6 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
              Coming Soon in Phase 2
            </Badge>
          </div>

          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A comprehensive workforce management solution for businesses to hire, manage, and scale their workforce efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <Card key={feature.title} className="relative overflow-hidden">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in Employer Features?</h2>
            <p className="text-xl mb-6 opacity-90">
              We're building powerful tools for businesses. Get early access and special pricing.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-neutral-100">
              Join Waitlist
            </Button>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            Looking to hire individual workers? <button onClick={() => navigate('/auth/register')} className="text-blue-600 hover:underline font-medium">Sign up as a Customer</button>
          </p>
        </div>
      </div>
    </div>
  );
}
