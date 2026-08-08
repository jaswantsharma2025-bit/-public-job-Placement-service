import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { adminService } from '../../services/api';
import { Wallet, Search, CheckCircle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminWallets() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm]       = useState('');
  const [settleTarget, setSettleTarget]   = useState<any>(null);
  const [settleNote, setSettleNote]       = useState('');
  const [expandedId, setExpandedId]       = useState<string | null>(null);

  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ['admin-wallets'],
    queryFn: adminService.getAllWallets,
  });

  const settleMutation = useMutation({
    mutationFn: ({ workerProfileId, note }: { workerProfileId: string; note: string }) =>
      adminService.settleWallet(workerProfileId, note || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-wallets'] });
      toast.success('Wallet settled successfully');
      setSettleTarget(null);
      setSettleNote('');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to settle'),
  });

  const filtered = (wallets as any[]).filter((w) => {
    const name = w.workerProfile?.user?.name?.toLowerCase() ?? '';
    return name.includes(searchTerm.toLowerCase());
  });

  const totalPending = (wallets as any[]).reduce((sum, w) => sum + (w.pendingBalance ?? 0), 0);
  const totalSettled = (wallets as any[]).reduce((sum, w) => sum + (w.settledBalance ?? 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Worker Wallets</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">View balances and settle worker payments</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Total Pending Payouts</CardTitle>
              <Wallet className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">₹{totalPending.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Ever Settled</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{totalSettled.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-neutral-500" />
              <Input
                placeholder="Search by worker name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">Loading wallets…</div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-500">No wallets found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((wallet: any) => {
              const worker     = wallet.workerProfile;
              const isExpanded = expandedId === wallet.id;

              return (
                <Card key={wallet.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{worker?.user?.name ?? 'Unknown Worker'}</CardTitle>
                        <p className="text-sm text-neutral-500 mt-0.5">{worker?.user?.phone}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {worker?.skills?.slice(0, 3).map((s: any) => (
                            <Badge key={s.subCategoryId} variant="secondary" className="text-xs">
                              {s.subCategory?.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setExpandedId(isExpanded ? null : wallet.id)}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          disabled={wallet.pendingBalance <= 0}
                          onClick={() => { setSettleTarget(wallet); setSettleNote(''); }}
                        >
                          Settle ₹{wallet.pendingBalance.toFixed(2)}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-500">Pending Balance</p>
                        <p className={`font-bold text-lg ${wallet.pendingBalance > 0 ? 'text-orange-600' : 'text-neutral-400'}`}>
                          ₹{wallet.pendingBalance.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Lifetime Earned</p>
                        <p className="font-bold text-lg">₹{wallet.lifetimeEarnings.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Total Settled</p>
                        <p className="font-bold text-lg text-green-600">₹{wallet.settledBalance.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Recent settlements */}
                    {isExpanded && wallet.settlements?.length > 0 && (
                      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Recent Settlements</p>
                        {wallet.settlements.map((s: any) => (
                          <div key={s.id} className="flex justify-between items-center text-sm py-1.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                            <div>
                              <p className="text-neutral-600 dark:text-neutral-400">
                                {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                              {s.note && <p className="text-xs text-neutral-400">{s.note}</p>}
                            </div>
                            <p className="font-semibold text-green-600">₹{s.amount.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Settle dialog ─────────────────────────────────────────────────── */}
      <Dialog open={!!settleTarget} onOpenChange={(open) => { if (!open) { setSettleTarget(null); setSettleNote(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settle Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
              <p className="text-sm text-neutral-500">Amount to settle</p>
              <p className="text-4xl font-bold">₹{settleTarget?.pendingBalance?.toFixed(2)}</p>
              <p className="text-sm text-neutral-500 mt-1">for {settleTarget?.workerProfile?.user?.name}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="settleNote">Settlement Note (optional)</Label>
              <Input
                id="settleNote"
                placeholder="e.g. Bank transfer on 15 Jan"
                value={settleNote}
                onChange={(e) => setSettleNote(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setSettleTarget(null); setSettleNote(''); }}>
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => settleMutation.mutate({ workerProfileId: settleTarget.workerProfileId, note: settleNote })}
                disabled={settleMutation.isPending}
              >
                <CheckCircle className="w-4 h-4" />
                {settleMutation.isPending ? 'Settling…' : 'Confirm Settlement'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}