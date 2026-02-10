import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Activity, Eye, PieChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

export default function VisucordDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ["visucord-stats", "demo-server-1"],
    queryFn: async () => {
      const res = await fetch("/api/visucord/stats/demo-server-1");
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
            Please log in to access the Visucord Dashboard
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
      label: "Total Members", 
      value: stats?.currentStats?.memberCount || 0, 
      icon: Users, 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "Messages", 
      value: stats?.currentStats?.messageCount || 0, 
      icon: Activity, 
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      label: "Voice Minutes", 
      value: Math.round((stats?.currentStats?.voiceMinutes || 0) / 60), 
      icon: TrendingUp, 
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      label: "Active Users", 
      value: stats?.currentStats?.activeUsers || 0, 
      icon: Eye, 
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/portfolio-visucord.png" 
              alt="Visucord Logo" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-xl font-bold">Visucord Dashboard</h1>
              <p className="text-xs text-zinc-500">Analytics and Statistics</p>
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

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Server Growth */}
            <Card className="bg-zinc-900/40 border-zinc-800">
              <CardHeader>
                <CardTitle>Server Growth</CardTitle>
                <CardDescription>Member growth over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-zinc-500">Loading data...</div>
                ) : stats?.historicalStats?.length > 0 ? (
                  <div className="h-64 bg-zinc-950 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-primary" />
                    <p className="ml-4 text-zinc-500">Growth chart visualization</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500">No data available</div>
                )}
              </CardContent>
            </Card>

            {/* Top Channels */}
            <Card className="bg-zinc-900/40 border-zinc-800">
              <CardHeader>
                <CardTitle>Top Channels</CardTitle>
                <CardDescription>Most active channels by messages</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-zinc-500">Loading data...</div>
                ) : stats?.topChannels?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.topChannels.map((channel: any, index: number) => (
                      <div
                        key={channel.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full bg-primary" style={{ opacity: 1 - (index * 0.2) }} />
                          <div>
                            <p className="font-semibold">#{channel.channelName}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {channel.messageCount} messages
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500">No channel data</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Add Bot CTA */}
          <div className="text-center">
            <Card className="bg-zinc-900/40 border-zinc-800 p-8">
              <CardTitle className="mb-4">Add Visucord to Your Server</CardTitle>
              <CardDescription className="mb-6">
                Get comprehensive analytics and insights for your Discord community
              </CardDescription>
              <a
                href="https://discord.com/oauth2/authorize?client_id=1408807066465865778"
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
