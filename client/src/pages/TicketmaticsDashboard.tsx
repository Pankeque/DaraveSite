import { motion } from "framer-motion";
import { Ticket, Users, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

export default function TicketmaticsDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ["ticketmatics-stats", "demo-server-1"],
    queryFn: async () => {
      const res = await fetch("/api/ticketmatics/stats/demo-server-1");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="bg-zinc-900/40 border-zinc-800 p-8 text-center">
          <CardTitle className="mb-4">Authentication Required</CardTitle>
          <CardDescription className="mb-6">
            Please log in to access the Ticketmatics Dashboard
          </CardDescription>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-black px-6 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </button>
        </Card>
      </div>
    );
  }

  const dashboardStats = [
    { 
      label: "Total Tickets", 
      value: stats?.totalTickets || 0, 
      icon: Ticket, 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "Open Tickets", 
      value: stats?.openTickets || 0, 
      icon: AlertCircle, 
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    { 
      label: "Pending", 
      value: stats?.pendingTickets || 0, 
      icon: Clock, 
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    { 
      label: "Closed", 
      value: stats?.closedTickets || 0, 
      icon: CheckCircle, 
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Ticketmatics Dashboard</h1>
              <p className="text-xs text-zinc-500">Manage your support tickets</p>
            </div>
          </div>
          <a
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Dashboard Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {dashboardStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <span className="text-3xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Tickets */}
          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>Latest support tickets from your server</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-zinc-500">Loading tickets...</div>
              ) : stats?.recentTickets?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentTickets.map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          ticket.status === 'open' ? 'bg-yellow-500' :
                          ticket.status === 'pending' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`} />
                        <div>
                          <p className="font-semibold">{ticket.category}</p>
                          <p className="text-sm text-zinc-500">by {ticket.userName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-500' :
                          ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-500' :
                          ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className="text-sm text-zinc-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">No tickets found</div>
              )}
            </CardContent>
          </Card>

          {/* Add Bot CTA */}
          <div className="mt-12 text-center">
            <Card className="bg-zinc-900/40 border-zinc-800 p-8">
              <CardTitle className="mb-4">Add Ticketmatics to Your Server</CardTitle>
              <CardDescription className="mb-6">
                Start managing support tickets efficiently with our powerful bot
              </CardDescription>
              <a
                href="https://discord.com/oauth2/authorize?client_id=1467926916119007520"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-black px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                Add to Discord
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
