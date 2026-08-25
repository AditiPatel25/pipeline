import { useAuth } from '@/context/AuthContext';
import {
    getApplicationStatsRequest,
    getRecentApplicationsRequest,
} from '@/api/application';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useEffect, useState } from 'react';
import { ApplicationStats, Application } from '@/types/application';
import DashboardApplicationCard from '@/components/DashboardApplicationCard';
import { FollowUp } from '@/types/followUp';
import { Button } from '@/components/ui/button';
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
                const [statsResponse, recentResponse] = await Promise.all([
                    getApplicationStatsRequest(),
                    getRecentApplicationsRequest(),
                ]);

                setApplicationStats(statsResponse);
                setRecentApplications(recentResponse.recentApplications);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <>
            <p className="text-sm text-muted-foreground">
                Welcome back, {user?.name || 'User'}
            </p>

            <h1 className="text-2xl font-extrabold my-4">Dashboard</h1>
            <div className="flex flex-col gap-8">
                <section>
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
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold">
                                Upcoming Deadlines
                            </h2>

                            <Button variant="ghost" size="sm">
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
                                    // FollowUpCard
                                    <div></div>
                                ))
                            )}
                        </div>
                    </section>
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold">
                                Recent Applications
                            </h2>

                            <Button variant="ghost" size="sm" onClick={() => navigate('/applications')}>
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
                </div>
            </div>
        </>
    );
}

export default Home;
