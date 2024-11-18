"use client";

import {
  ArrowRight,
  Lock,
  Zap,
  Cloud,
  Rocket,
  Cpu,
  Users,
  Gauge,
  Shield,
  Workflow,
} from "lucide-react";
import { Icons } from "@/components/icons";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const { data: session, status } = useSession();

  const scrollToPricing = () => {
    document
      .getElementById("pricing-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to handle free plan selection
  const handleFreePlan = async () => {
    if (!session) {
      // If not logged in, trigger sign in
      signIn("google");
    } else {
      // If logged in, set as current plan
      try {
        // Add API call here to set free plan
        toast({
          title: "Plan Updated",
          description: "You're now on the Free plan",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update plan. Please try again.",
        });
      }
    }
  };

  // Function to handle pro plan selection
  const handleProPlan = async () => {
    if (!session) {
      signIn("google");
    } else {
      // Add your payment/subscription logic here
      try {
        // Add API call to handle subscription
        toast({
          title: "Subscribing to Pro",
          description: "Processing your subscription...",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process subscription. Please try again.",
        });
      }
    }
  };

  return (
    <main className="min-h-screen transition-colors duration-500">
      {/* Hero Section - Adjusted height to account for navbar */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 relative">
            {/* Decorative background blur */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent/80 rounded-full text-accent-foreground transition-colors">
              <Lock className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Secure Cloud Storage</span>
            </div>

            <h1 className="text-6xl font-extrabold leading-tight relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 animate-gradient">
                Store, Share, &
              </span>
              <br />
              <span className="text-foreground">Secure Your Files</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl relative">
              Experience enterprise-grade security with consumer-friendly
              pricing. Store your files with confidence using our encrypted
              cloud storage solution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 relative">
              <button
                onClick={() => signIn("google")}
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={scrollToPricing}
                className="px-8 py-4 border-2 border-muted bg-background text-foreground rounded-lg hover:border-primary hover:text-primary transition-colors duration-300"
              >
                View Pricing
              </button>
            </div>

            <div className="pt-8 border-t border-border relative">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700 animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    10+ Happy Users
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Join our growing community
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Abstract Data Flow */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-full filter blur-[100px]" />

            <svg
              viewBox="0 0 800 600"
              className="w-full h-full max-w-[700px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Gradient Definitions */}
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient
                  id="gradient2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>

              {/* Main Circle */}
              <circle
                cx="400"
                cy="300"
                r="180"
                className="stroke-blue-500/20"
                strokeWidth="40"
                strokeDasharray="8 8"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 400 300"
                  to="360 400 300"
                  dur="60s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Intersecting Circles */}
              <g className="animate-pulse">
                <circle
                  cx="400"
                  cy="300"
                  r="150"
                  className="stroke-purple-500/20"
                  strokeWidth="30"
                  strokeDasharray="6 6"
                />
                <circle
                  cx="400"
                  cy="300"
                  r="120"
                  className="stroke-cyan-500/20"
                  strokeWidth="20"
                  strokeDasharray="4 4"
                />
              </g>

              {/* Floating Data Elements */}
              {[
                {
                  angle: 0,
                  type: "IMAGE",
                  icon: "🖼",
                  gradient: "url(#gradient1)",
                },
                {
                  angle: 72,
                  type: "CODE",
                  icon: "</>",
                  gradient: "url(#gradient2)",
                },
                {
                  angle: 144,
                  type: "VIDEO",
                  icon: "▶",
                  gradient: "url(#gradient1)",
                },
                {
                  angle: 216,
                  type: "AUDIO",
                  icon: "♫",
                  gradient: "url(#gradient2)",
                },
                {
                  angle: 288,
                  type: "DATA",
                  icon: "◈",
                  gradient: "url(#gradient1)",
                },
              ].map((item, index) => {
                const radius = 180;
                const x = 400 + radius * Math.cos((item.angle * Math.PI) / 180);
                const y = 300 + radius * Math.sin((item.angle * Math.PI) / 180);

                return (
                  <g
                    key={index}
                    className="animate-float"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Connection Line */}
                    <path
                      d={`M400,300 L${x},${y}`}
                      stroke={item.gradient}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    >
                      <animate
                        attributeName="strokeDashoffset"
                        values="8;0"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Data Node */}
                    <g transform={`translate(${x},${y})`}>
                      <circle
                        r="30"
                        fill={item.gradient}
                        className="opacity-10"
                      />
                      <circle
                        r="25"
                        className="stroke-white/50 fill-transparent"
                        strokeWidth="1"
                      />
                      <text
                        className="fill-white text-sm font-bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {item.icon}
                      </text>
                      <text
                        y="45"
                        className="fill-white/70 text-xs"
                        textAnchor="middle"
                      >
                        {item.type}
                      </text>
                    </g>

                    {/* Flowing Particles */}
                    {[...Array(3)].map((_, i) => (
                      <circle key={i} r="2" fill={item.gradient}>
                        <animateMotion
                          path={`M${x},${y} L400,300`}
                          dur={`${1 + i * 0.5}s`}
                          repeatCount="indefinite"
                          begin={`-${i * 0.3}s`}
                        />
                      </circle>
                    ))}
                  </g>
                );
              })}

              {/* Central Hub */}
              <g className="animate-pulse">
                <circle
                  cx="400"
                  cy="300"
                  r="40"
                  className="fill-blue-500/10 stroke-blue-500"
                  strokeWidth="2"
                />
                <circle
                  cx="400"
                  cy="300"
                  r="20"
                  fill="url(#gradient1)"
                  className="opacity-80"
                />
              </g>

              {/* Rotating Inner Elements */}
              <g>
                {[...Array(12)].map((_, i) => (
                  <line
                    key={i}
                    x1="400"
                    y1="270"
                    x2="400"
                    y2="250"
                    className="stroke-white/30"
                    strokeWidth="2"
                    strokeLinecap="round"
                    transform={`rotate(${i * 30} 400 300)`}
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`${i * 30} 400 300`}
                      to={`${i * 30 + 360} 400 300`}
                      dur="10s"
                      repeatCount="indefinite"
                    />
                  </line>
                ))}
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing-section"
        className="py-24 bg-gradient-to-b from-background to-muted/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Simple Pricing</span>
            </div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start for free, upgrade when you need. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="relative group h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-cyan-500/20 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
              <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
                      Starter
                    </h3>
                    <p className="text-muted-foreground">
                      Perfect for personal projects
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold text-foreground">
                      $0
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <ul className="space-y-5 mb-8">
                  {[
                    {
                      icon: Cloud,
                      title: "50GB Cloud Storage",
                      desc: "Secure space for your files",
                    },
                    {
                      icon: Rocket,
                      title: "3 Active Projects",
                      desc: "Run multiple apps simultaneously",
                    },
                    {
                      icon: Lock,
                      title: "Developer API",
                      desc: "Full API access included",
                    },
                    {
                      icon: Users,
                      title: "Collaborative Workspace",
                      desc: "Work with your core team",
                    },
                    {
                      icon: Shield,
                      title: "Basic Security",
                      desc: "Essential protection included",
                    },
                    {
                      icon: Gauge,
                      title: "Community Support",
                      desc: "Access to help community",
                    },
                  ].map((feature) => (
                    <li key={feature.title} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {feature.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {feature.desc}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleFreePlan}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:opacity-90 transition-opacity duration-300"
                  disabled={!!session}
                >
                  {!session ? "Get Started Free" : "Current Plan"}
                </button>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-cyan-500/20 to-blue-500/30 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
              <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
                <div className="absolute -top-5 right-8">
                  <span className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 mb-2">
                      Pro
                    </h3>
                    <p className="text-muted-foreground">
                      For growing businesses
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold text-foreground">
                      $2
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <ul className="space-y-5 mb-8">
                  {[
                    {
                      icon: Cloud,
                      title: "100GB Enhanced Storage",
                      desc: "Expanded secure cloud space",
                    },
                    {
                      icon: Rocket,
                      title: "Unlimited Projects",
                      desc: "No restrictions on active apps",
                    },
                    {
                      icon: Users,
                      title: "Unlimited Team Members",
                      desc: "Grow your team without limits",
                    },
                    {
                      icon: Shield,
                      title: "Advanced Security",
                      desc: "Enhanced protection & encryption",
                    },
                    {
                      icon: Gauge,
                      title: "Priority Support",
                      desc: "24/7 dedicated assistance",
                    },
                    {
                      icon: Workflow,
                      title: "Advanced Workflows",
                      desc: "Custom automation tools",
                    },
                  ].map((feature) => (
                    <li key={feature.title} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {feature.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {feature.desc}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleProPlan}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:opacity-90 transition-opacity duration-300"
                >
                  {!session
                    ? "Subscribe ($2/month)"
                    : "Upgrade to Pro ($2/month)"}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-card/80 backdrop-blur-sm border border-border">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-muted-foreground">
                  30-day money-back guarantee
                </span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                <span className="text-muted-foreground">
                  No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                    FilesDrive
                  </span>
                  <span className="text-xs text-muted-foreground -mt-1">
                    Cloud Storage
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure cloud storage solution for all your files. Store, manage,
                and share with confidence.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/yourusername/yourrepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icons.gitHub className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Product</h3>
              <ul className="space-y-2">
                {[
                  { name: "Features", href: "#" },
                  { name: "Security", href: "#" },
                  { name: "Pricing", onClick: scrollToPricing },
                  { name: "Documentation", href: "#" },
                ].map((item) => (
                  <li key={item.name}>
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Company</h3>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FilesDrive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
