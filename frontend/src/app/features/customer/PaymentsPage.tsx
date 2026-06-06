import { useState } from 'react';
import { toast } from 'sonner';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CreditCard, Smartphone, Wallet, Banknote } from 'lucide-react';

const paymentMethods = [
  { name: 'Cash On Delivery', icon: Banknote, description: 'Pay with cash when service is completed' },
  { name: 'UPI Payment', icon: Smartphone, description: 'Pay using any UPI app', comingSoon: true },
  { name: 'Credit/Debit Card', icon: CreditCard, description: 'Pay securely with your card', comingSoon: true },
  { name: 'Wallet', icon: Wallet, description: 'Use your INSTAFF wallet balance', comingSoon: true },
];

export default function PaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handlePayment = (method: string, comingSoon?: boolean) => {
    if (comingSoon) {
      toast.info('Online payments launching soon!');
      return;
    }
    setSelectedMethod(method);
    toast.success(`${method} selected`);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Choose your payment method</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => (
            <Card
              key={method.name}
              className={`cursor-pointer hover:shadow-lg transition-all ${
                selectedMethod === method.name ? 'ring-2 ring-blue-600' : ''
              }`}
              onClick={() => handlePayment(method.name, method.comingSoon)}
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <method.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  {method.comingSoon && (
                    <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{method.name}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">{method.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold">Payment Information</h2>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <p>• Currently, only Cash On Delivery is available</p>
              <p>• Online payment methods will be available soon</p>
              <p>• All payments are secure and encrypted</p>
              <p>• You will receive a receipt for every payment</p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Coming Soon</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            We're working on integrating UPI, Credit/Debit Cards, and Wallet payments. Stay tuned for the launch!
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
