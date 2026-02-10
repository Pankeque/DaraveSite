import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Activity, Eye, PieChart } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Visucord() {
  const { user } = useAuth();

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track member growth, message activity, voice channel usage, and more with detailed charts.",
    },
    {
      icon: Users,
      title: "Member Insights",
      description: "Understand your community better with member demographics and activity patterns.",
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Monitor server growth trends and identify what's working for your community.",
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Get live updates on server activity and member engagement metrics.",
    },
    {
      icon: Eye,
      title: "Custom Dashboards",
      description: "Create personalized dashboards with the metrics that matter most to you.",
    },
    {
      icon: PieChart,
      title: "Detailed Reports",
      description: "Generate comprehensive reports to share with your team or community.",
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
              <h1 className="text-xl font-bold">Visucord</h1>
              <p className="text-xs text-zinc-500">Discord Statistics Bot</p>
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

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Visualize Your Community
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              Gain deep insights into your Discord server with Visucord - 
              the most comprehensive statistics and analytics bot.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://discord.com/oauth2/authorize?client_id=1467926916119007520"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-black px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                Add to Discord
              </a>
              {user && (
                <a
                  href="/visucord/dashboard"
                  className="border border-zinc-700 text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-900 transition-colors"
                >
                  Open Dashboard
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Comprehensive Features</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Everything you need to understand and grow your Discord community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/60 hover:border-primary/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">See It In Action</h3>
            <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
              Check out our interactive demo to see how Visucord can transform your server analytics.
            </p>
            <div className="aspect-video bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-zinc-500">Interactive Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Start Tracking Today</h3>
          <p className="text-xl text-zinc-400 mb-8">
            Join thousands of Discord servers using Visucord to understand their communities better.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://discord.com/oauth2/authorize?client_id=1467926916119007520"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors inline-block"
            >
              Add to Discord Now
            </a>
            {user && (
              <a
                href="/visucord/dashboard"
                className="border border-zinc-700 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-zinc-900 transition-colors inline-block"
              >
                Open Dashboard
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
