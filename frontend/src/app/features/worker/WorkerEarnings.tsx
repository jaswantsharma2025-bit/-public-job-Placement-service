import { useQuery } from '@tanstack/react-query';
import WorkerLayout from '../../layouts/WorkerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { walletService, bookingService } from '../../services/api';
import { DollarSign, TrendingUp, Calendar, Wallet, CheckCircle, Clock } from 'lucide-react';

export default function WorkerEarnings() {
  const { data: wallet, isLoading } = useQuery({
    queryKey: ['worker-wallet'],
    queryFn: walletService.getMyWallet,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['worker-bookings'],
    queryFn: bookingService.getWorkerBookings,
  });

  const completedBookings = (bookings as any[]).filter((b) => b.status === 'COMPLETED');

  const thisMonthEarnings = (wallet?.transactions ?? [])
    .filter((t: any) => {
      const d = new Date(t.createdAt);
      const now = new Date();
      return t.type === 'CREDIT' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Earnings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Track your wallet and income</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading…</div>
        ) : (
          <>
            {/* ── Wallet summary ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Available Balance</CardTitle>
                  <Wallet className="w-5 h-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    ₹{(wallet?.pendingBalance ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Pending settlement by admin</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Lifetime Earnings</CardTitle>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹{(wallet?.lifetimeEarnings ?? 0).toFixed(2)}</p>
                  <p className="text-xs text-neutral-500 mt-1">Total ever received</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Settled</CardTitle>
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹{(wallet?.settledBalance ?? 0).toFixed(2)}</p>
                  <p className="text-xs text-neutral-500 mt-1">Paid out by admin</p>
                </CardContent>
              </Card>
            </div>

            {/* ── Quick stats ────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">This Month</CardTitle>
                  <Calendar className="w-5 h-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹{thisMonthEarnings.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Completed Jobs</CardTitle>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{completedBookings.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* ── Transaction history ────────────────────────────────────── */}
            <Card>
              <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
              <CardContent>
                {!wallet?.transactions || wallet.transactions.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">No transactions yet</p>
                ) : (
                  <div className="space-y-3">
                    {wallet.transactions.map((tx: any) => (
                      <div key={tx.id} className="flex justify-between items-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === 'CREDIT'
                              ? 'bg-green-100 dark:bg-green-900/20'
                              : 'bg-red-100 dark:bg-red-900/20'
                          }`}>
                            {tx.type === 'CREDIT'
                              ? <TrendingUp className="w-4 h-4 text-green-600" />
                              : <CheckCircle className="w-4 h-4 text-blue-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tx.description}</p>
                            <p className="text-xs text-neutral-500">
                              {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-blue-600'}`}>
                            {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {tx.type === 'CREDIT' ? 'Earned' : 'Settled'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── Settlement history ─────────────────────────────────────── */}
            {wallet?.settlements && wallet.settlements.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Settlement History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {wallet.settlements.map((s: any) => (
                      <div key={s.id} className="flex justify-between items-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Settled by admin</p>
                            {s.note && <p className="text-xs text-neutral-500">{s.note}</p>}
                            <p className="text-xs text-neutral-500">
                              {new Date(s.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-blue-600">₹{s.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </WorkerLayout>
  );
}