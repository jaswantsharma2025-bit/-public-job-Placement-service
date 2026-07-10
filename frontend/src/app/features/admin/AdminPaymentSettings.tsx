import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { adminService } from '../../services/api';
import { QrCode, Save, CheckCircle } from 'lucide-react';

export default function AdminPaymentSettings() {
  const queryClient = useQueryClient();
  const [upiId,      setUpiId]      = useState('');
  const [upiName,    setUpiName]    = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');

  const { data: paymentInfo, isLoading } = useQuery({
    queryKey: ['admin-payment-info'],
    queryFn: adminService.getPaymentInfo,
  });

  useEffect(() => {
    if (paymentInfo) {
      setUpiId(paymentInfo.upiId     ?? '');
      setUpiName(paymentInfo.upiName ?? '');
      setQrImageUrl(paymentInfo.qrImageUrl ?? '');
    }
  }, [paymentInfo]);

  const saveMutation = useMutation({
    mutationFn: () =>
      adminService.updatePaymentInfo({ upiId, upiName, qrImageUrl: qrImageUrl || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payment-info'] });
      toast.success('Payment info saved successfully');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to save'),
  });

  const handleSave = () => {
    if (!upiId.trim() || !upiName.trim()) {
      toast.error('UPI ID and Name are required');
      return;
    }
    saveMutation.mutate();
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Settings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Set the UPI details shown to workers after service completion
          </p>
        </div>

        {/* Preview */}
        {paymentInfo && (
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-200">Payment info is active</p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Workers see this after completing a booking
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>UPI Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-center py-8 text-neutral-500">Loading…</p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="upiId">
                    UPI ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="upiId"
                    placeholder="e.g. instantstaff@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upiName">
                    Display Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="upiName"
                    placeholder="e.g. Instant Staff Pvt Ltd"
                    value={upiName}
                    onChange={(e) => setUpiName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qrImageUrl">QR Code Image URL (optional)</Label>
                  <Input
                    id="qrImageUrl"
                    placeholder="https://… (paste a publicly hosted QR image URL)"
                    value={qrImageUrl}
                    onChange={(e) => setQrImageUrl(e.target.value)}
                  />
                  <p className="text-xs text-neutral-500">
                    Upload your QR image to any image host (e.g. Cloudinary, ImgBB) and paste the URL here.
                  </p>
                </div>

                {/* QR preview */}
                {qrImageUrl && (
                  <div className="space-y-2">
                    <Label>QR Preview</Label>
                    <div className="flex justify-center p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <img
                        src={qrImageUrl}
                        alt="QR Preview"
                        className="w-40 h-40 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}

                <Button className="w-full gap-2" onClick={handleSave} disabled={saveMutation.isPending}>
                  <Save className="w-4 h-4" />
                  {saveMutation.isPending ? 'Saving…' : 'Save Payment Info'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* What workers see */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <QrCode className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">How it works</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  When a service is completed, the worker taps "Show Payment QR" and this QR / UPI ID is displayed.
                  The customer scans and pays. The worker then taps "Payment Received" to credit their wallet.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}