import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  TrendingUp,
  RotateCcw,
  UserPlus,
  DollarSign,
  ArrowRight,
  Filter,
  MessageSquare,
  Sparkles,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { api } from "@/lib/api";
import { formatMoney, CUSTOMER_SEGMENTS, formatDate } from "@/lib/staff";

export const Route = createFileRoute("/admin/crm")({
  component: AdminCrmDashboardPage,
});

function AdminCrmDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "crm", "stats"],
    queryFn: () => api.admin.crmStats(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="CRM Dashboard"
          description="Loading customer relationship intelligence…"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="CRM Dashboard"
          description="Customer relationships & lifetime analytics"
        />
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-destructive">
            Failed to load CRM dashboard metrics. Please verify the backend is running.
          </p>
        </div>
      </div>
    );
  }

  const { metrics, segments, topCustomers, recentSignups, recentNotes } = data;
  const totalCount = Math.max(metrics.totalCustomers, 1);

  const segmentList = CUSTOMER_SEGMENTS.map((seg) => {
    const count = segments[seg.value] ?? 0;
    const pct = Math.round((count / totalCount) * 100);
    return {
      ...seg,
      count,
      pct,
    };
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="CRM Dashboard"
        description="Customer relationship analytics, lifetime values, and retention cohorts"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/segments">
                <Filter className="mr-1.5 h-4 w-4" /> Segments
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/admin/customers">
                <Users className="mr-1.5 h-4 w-4" /> All Customers
              </Link>
            </Button>
          </div>
        }
      />

      {/* 6 Core Executive KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-accent">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">Total Customers</span>
            <Users className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-bold">{metrics.totalCustomers.toLocaleString()}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Registered buyers</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-accent">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">Active Buyers</span>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold">{metrics.activeCustomers.toLocaleString()}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Ordered in last 90 days</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-accent">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">Total LTV</span>
            <DollarSign className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-bold">{formatMoney(metrics.totalLtv)}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Cumulative spend</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-accent">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">Avg Customer LTV</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{formatMoney(metrics.averageLtv)}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Spend per customer</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-accent">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">Repeat Rate</span>
            <RotateCcw className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">{metrics.repeatCustomerRate}%</div>
          <p className="text-[11px] text-muted-foreground mt-1">Customers with 2+ orders</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-accent">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs uppercase font-semibold">New (30 Days)</span>
            <UserPlus className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold">{metrics.newCustomersThisMonth.toLocaleString()}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Recent acquisitions</p>
        </div>
      </div>

      {/* Main Grid: Segments & Leaderboard (Left) + Activity & Notes (Right) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Segment Breakdown */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" /> Customer Cohorts & Segments
                </h2>
                <p className="text-xs text-muted-foreground">
                  Automated customer clustering based on purchase frequency, lifetime value, and
                  inactivity.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link to="/admin/segments">
                  View in Segments <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 pt-2">
              {segmentList.map((seg) => (
                <Link
                  key={seg.value}
                  to="/admin/segments"
                  search={{ segment: seg.value }}
                  className="group rounded-xl border border-border/80 bg-background/60 p-4 transition hover:border-accent hover:shadow-sm block"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {seg.label}
                    </span>
                    <span className="font-mono text-muted-foreground">{seg.pct}%</span>
                  </div>
                  <div className="text-xl font-bold">{seg.count.toLocaleString()}</div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${Math.max(seg.pct, 4)}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* High-Value VIP Customers Leaderboard */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" /> High-Value Customer Leaderboard
                </h2>
                <p className="text-xs text-muted-foreground">
                  Top customers ranked by cumulative lifetime spending.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="text-xs">
                <Link to="/admin/customers">View All Directory</Link>
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Orders</th>
                    <th className="p-3">Total Spend</th>
                    <th className="p-3">Segments</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted-foreground text-xs">
                        No customer spending recorded yet.
                      </td>
                    </tr>
                  ) : (
                    topCustomers.map((c, idx) => (
                      <tr key={c.id} className="border-b border-border/40 hover:bg-muted/30">
                        <td className="p-3 font-mono text-xs text-muted-foreground">#{idx + 1}</td>
                        <td className="p-3">
                          <Link
                            to="/admin/customers/$id"
                            params={{ id: c.id }}
                            className="font-medium text-foreground hover:text-accent hover:underline block truncate max-w-[180px]"
                          >
                            {c.name}
                          </Link>
                          <span className="text-[11px] text-muted-foreground truncate block max-w-[180px]">
                            {c.email}
                          </span>
                        </td>
                        <td className="p-3 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3 text-muted-foreground" />{" "}
                            {c.totalOrders}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-accent">
                          {formatMoney(c.totalSpending)}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {c.segments.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                            <Link to="/admin/customers/$id" params={{ id: c.id }}>
                              Profile
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          {/* Recent Registrations */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <UserPlus className="h-4 w-4 text-accent" /> Recent Signups
              </h3>
              <span className="text-xs text-muted-foreground">Latest 5</span>
            </div>

            <div className="divide-y divide-border/60">
              {recentSignups.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No recent customer signups.
                </p>
              ) : (
                recentSignups.map((c) => (
                  <div
                    key={c.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div className="truncate mr-2">
                      <Link
                        to="/admin/customers/$id"
                        params={{ id: c.id }}
                        className="font-medium text-xs text-foreground hover:text-accent truncate block"
                      >
                        {c.name}
                      </Link>
                      <p className="text-[11px] text-muted-foreground truncate">{c.email}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(c.registration)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Internal Notes & Timeline */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-accent" /> Staff Interaction Notes
              </h3>
              <span className="text-xs text-muted-foreground">Latest</span>
            </div>

            <div className="space-y-3">
              {recentNotes.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No customer notes logged yet.
                </p>
              ) : (
                recentNotes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-lg border border-border/80 bg-background/50 p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {n.author?.name || "Staff"}
                      </span>
                      <span>{formatDate(n.createdAt)}</span>
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{n.body}</p>
                    {n.customer && (
                      <div className="pt-1 text-[11px] border-t border-border/40">
                        <span className="text-muted-foreground">Customer: </span>
                        <Link
                          to="/admin/customers/$id"
                          params={{ id: n.customer.id }}
                          className="font-medium text-accent hover:underline"
                        >
                          {n.customer.name}
                        </Link>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Quick CRM Navigation Card */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-sm">Quick CRM Tools</h3>
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs">
                <Link to="/admin/customers">
                  <Users className="mr-2 h-3.5 w-3.5 text-accent" /> Customer Directory & Search
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs">
                <Link to="/admin/segments">
                  <Filter className="mr-2 h-3.5 w-3.5 text-accent" /> Customer Cohorts & Segments
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
