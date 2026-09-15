import {
    getApplicationStatsRequest,
    getRecentApplicationsRequest,
} from '@/api/application';
import { getUpcomingFollowUpsRequest } from '@/api/followUp';
import DashboardApplicationCard from '@/components/Dashboard/DashboardApplicationCard';
import DashboardFollowUpCard from '@/components/Dashboard/DashboardFollowUpCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { Application, ApplicationStats } from '@/types/application';
import { FollowUp } from '@/types/followUp';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { user } = useAuth();
    const [applicationStats, setApplicationStats] =
        useState<ApplicationStats | null>(null);
    const [recentApplications, setRecentApplications] = useState<Application[]>(
        []
    );
    const [upcomingDeadlines, setUpcomingDeadlines] = useState<FollowUp[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const activeApplications =
        (applicationStats?.stats.SCREENING ?? 0) +
        (applicationStats?.stats.APPLIED ?? 0) +
        (applicationStats?.stats.INTERVIEW ?? 0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsResponse, recentResponse, deadlinesResponse] =
                    await Promise.all([
                        getApplicationStatsRequest(),
                        getRecentApplicationsRequest(),
                        getUpcomingFollowUpsRequest(),
                    ]);

                setApplicationStats(statsResponse);
                setRecentApplications(recentResponse.recentApplications);
                setUpcomingDeadlines(deadlinesResponse.upcomingFollowUps);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-8">
                {/* welcome + heading */}
                <div>
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="mt-4 h-8 w-32" />
                </div>

                {/* application overview */}
                <section>
                    <Skeleton className="h-6 w-44" />

                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card p-5 shadow-sm"
                            >
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="mt-2 h-9 w-12" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* upcoming + recent */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* upcoming deadlines */}
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-8 w-16" />
                        </div>

                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-border bg-card p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-5 w-32" />
                                                <Skeleton className="h-5 w-20 rounded-full" />
                                            </div>

                                            <Skeleton className="mt-2 h-4 w-48" />
                                        </div>

                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* recent applications */}
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-8 w-16" />
                        </div>

                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-border bg-card p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <Skeleton className="h-5 w-36" />
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </div>

                                    <Skeleton className="mt-2 h-4 w-44" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <p className="text-sm text-muted-foreground">
                    Welcome back, {user?.name || 'User'}
                </p>

                <h1 className="my-4 text-2xl font-extrabold">Dashboard</h1>
            </motion.div>
            <div className="flex flex-col gap-8">
                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                >
                    {/* applications stats */}
                    <h2 className="text-lg font-semibold">
                        Application Overview
                    </h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
                        <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Applications
                            </p>
                            <p className="text-3xl font-bold tracking-tight">
                                {applicationStats?.total ?? 0}
                            </p>
                        </div>
                        <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                            <p className="text-sm font-medium text-muted-foreground">
                                Active
                            </p>
                            <p className="text-3xl font-bold tracking-tight">
                                {activeApplications ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                            <p className="text-sm font-medium text-muted-foreground">
                                Interviews
                            </p>
                            <p className="text-3xl font-bold tracking-tight">
                                {applicationStats?.stats.INTERVIEW ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                            <p className="text-sm font-medium text-muted-foreground">
                                Offers
                            </p>
                            <p className="text-3xl font-bold tracking-tight">
                                {applicationStats?.stats.OFFER ?? 0}
                            </p>
                        </div>
                    </div>
                </motion.section>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                    className="grid gap-6 lg:grid-cols-2"
                >
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold">
                                Upcoming Deadlines
                            </h2>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/followUps')}
                            >
                                View all
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {upcomingDeadlines.length === 0 ? (
                                <div className="rounded-lg p-8 text-center">
                                    <p className="font-medium">
                                        No upcoming deadlines
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        You're all caught up!
                                    </p>
                                </div>
                            ) : (
                                upcomingDeadlines.map((followUp) => (
                                    <DashboardFollowUpCard
                                        key={followUp.id}
                                        followUp={followUp}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold">
                                Recent Applications
                            </h2>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/applications')}
                            >
                                View all
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {recentApplications.length === 0 ? (
                                <div className="rounded-lg p-8 text-center">
                                    <p className="font-medium">
                                        No applications yet
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Add your first application to start
                                        tracking your job search.
                                    </p>
                                </div>
                            ) : (
                                recentApplications.map((recentApplication) => (
                                    <DashboardApplicationCard
                                        key={recentApplication.id}
                                        application={recentApplication}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                </motion.div>
            </div>
        </>
    );
}

export default Home;
