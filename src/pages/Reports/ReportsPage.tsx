import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react'
import { useReportsData } from '../../hooks/useReportsData'
import StatCard from '../../components/Dashboard/StatCard'
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/chartColors'

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-5">
      <h2 className="font-semibold text-ink mb-4">{title}</h2>
      {children}
    </div>
  )
}

export default function ReportsPage() {
  const { loading, totalTickets, statusBreakdown, priorityBreakdown, agentWorkload, dailyTrend, avgResolutionDays } =
    useReportsData()

  if (loading) return <p className="text-ink-muted">Loading reports...</p>

  const statusData = statusBreakdown.filter((s) => s.count > 0)
  const priorityData = priorityBreakdown.filter((p) => p.count > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink mb-1">Reports</h1>
        <p className="text-ink-muted">Ticket analytics and team performance overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Tickets" value={totalTickets} icon={BarChart3} />
        <StatCard
          label="Resolution Rate"
          value={
            totalTickets > 0
              ? Math.round(
                  ((statusBreakdown.find((s) => s.status === 'Resolved')?.count ?? 0) +
                    (statusBreakdown.find((s) => s.status === 'Closed')?.count ?? 0)) /
                    totalTickets *
                    100
                )
              : 0
          }
          icon={TrendingUp}
          tone="success"
        />
        <StatCard label="Active Agents" value={agentWorkload.length} icon={Users} />
        <StatCard label="Avg. Resolution (days)" value={avgResolutionDays} icon={Clock} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Tickets by Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
               data={statusData}
               dataKey="count"
               nameKey="status"
               cx="50%"
               cy="50%"
               outerRadius={90}
               label={(entry: any) => `${entry.status}: ${entry.count}`}
            >
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tickets by Priority">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry) => (
                  <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ticket Volume Over Time">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="created" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Agent Workload">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agentWorkload}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="agentName" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="assigned" fill="#8b5cf6" name="Assigned" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}