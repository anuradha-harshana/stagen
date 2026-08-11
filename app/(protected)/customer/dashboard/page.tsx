import Link from "next/link";
import { Home, Calendar, ArrowRight, Camera, Bell, RefreshCw } from "lucide-react";
import { requireAuth } from "@/lib/auth/auth";
import { mockDashboardData } from "@/lib/dashboard/data";

import DashboardHeader from "@/components/customer/Dashboard/DashboardHeader";
import StatCard from "@/components/customer/Dashboard/StatCard";
import StageTracker from "@/components/customer/Dashboard/StageTracker";
import UpdateItem from "@/components/customer/Dashboard/UpdateItem";
import NotificationItem from "@/components/customer/Dashboard/NotificationItem";
import PhotoCard from "@/components/customer/Dashboard/PhotoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function page() {
  const user = await requireAuth();
  const data = mockDashboardData;

  // Check if there is an urgent notification to trigger the header ping
  const hasUrgent = data.notifications.some((n) => n.type === "urgent");

  return (
    <div className="min-h-full w-full bg-oatmeal px-5 py-6 md:px-8 md:py-8 space-y-6 pb-12">
      {/* Header Greeting Section */}
      <DashboardHeader username={user.username} email={user.email} role={user.role} percentage={data.overallProgress.percentage} />

      {/* Top 3 Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Overall Progress */}
        <StatCard
          title="Overall Progress"
          value={`${data.overallProgress.percentage}%`}
          badgeText={data.overallProgress.label}
          badgeColorClass="bg-emerald-50 text-emerald-700 border-emerald-200"
          progress={data.overallProgress.percentage}
          bottomLabel="Stage"
          bottomValue={data.overallProgress.stage}
          bottomLabel2="Est. Completion"
          bottomValue2={data.overallProgress.estimatedCompletion}
        />

        {/* Card 2: Next Milestone */}
        <StatCard
          title="Next Milestone"
          value={data.nextMilestone.name}
          subtext={`In ${data.nextMilestone.daysRemaining} days`}
          icon={<Home className="h-6 w-6 text-truffle-trouble" />}
          iconBgClass="bg-truffle-trouble/10 text-truffle-trouble shadow-sm"
          bottomLabel="Estimated completion"
          bottomValue={data.nextMilestone.estimatedCompletion}
        />

        {/* Card 3: Days to Completion */}
        <StatCard
          title="Days to Completion"
          value={data.daysToCompletion.daysRemaining}
          subtext="days remaining"
          icon={<Calendar className="h-6 w-6 text-emerald-600" />}
          iconBgClass="bg-emerald-50 text-emerald-600 shadow-sm"
          bottomLabel="Started on"
          bottomValue={data.daysToCompletion.startedOn}
        />
      </div>

      {/* Construction Stages Tracker Timeline */}
      <StageTracker stages={data.stages} />

      {/* Bottom Main Content Section: Left: Updates & Notifications, Right: Site Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Recent Updates & Notifications */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">

          {/* Recent Updates Card */}
          <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-blue-fantastic/[0.03] pb-4 pt-5 px-6 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-burning-flame/10 flex items-center justify-center">
                  <RefreshCw className="h-4.5 w-4.5 text-burning-flame animate-spin-slow" />
                </div>
                <CardTitle className="text-blue-fantastic text-base font-extrabold font-cream">
                  Recent Updates
                </CardTitle>
              </div>
              <Link
                href="/customer/timeline"
                className="text-xs font-bold text-truffle-trouble hover:text-truffle-trouble/80 flex items-center gap-1 transition-colors group"
              >
                <span>View all updates</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {data.recentUpdates.map((update) => (
                <UpdateItem key={update.id} update={update} />
              ))}
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-blue-fantastic/[0.03] pb-4 pt-5 px-6 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
                  <Bell className="h-4.5 w-4.5 text-truffle-trouble" />
                </div>
                <CardTitle className="text-blue-fantastic text-base font-extrabold font-cream">
                  Notifications
                </CardTitle>
              </div>
              <Link
                href="/customer/notifications"
                className="text-xs font-bold text-truffle-trouble hover:text-truffle-trouble/80 flex items-center gap-1 transition-colors group"
              >
                <span>View all notifications</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {data.notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Site Photos (Latest) */}
        <Card className="lg:col-span-5 bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden w-full self-stretch flex flex-col">
          <CardHeader className="border-b border-blue-fantastic/[0.03] pb-4 pt-5 px-6 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Camera className="h-4.5 w-4.5 text-emerald-600" />
              </div>
              <CardTitle className="text-blue-fantastic text-base font-extrabold font-cream">
                Site Photos (Latest)
              </CardTitle>
            </div>
            <Link
              href="/customer/documents"
              className="text-xs font-bold text-truffle-trouble hover:text-truffle-trouble/80 flex items-center gap-1 transition-colors group"
            >
              <span>View all photos</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4.5 my-auto">
              {data.sitePhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
