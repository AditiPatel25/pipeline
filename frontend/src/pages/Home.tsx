import { useAuth } from '@/context/AuthContext';
import {
    getApplicationStatsRequest,
    getRecentApplicationsRequest,
} from '@/api/application';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useEffect, useState } from 'react';
import { ApplicationStats, Application } from '@/types/application';
import DashboardApplicationCard from '@/components/DashboardApplicationCard';

function Home() {
    const { user } = useAuth();
    const [applicationStats, setApplicationStats] =
        useState<ApplicationStats | null>(null);
    const [recentApplications, setRecentApplications] = useState<Application[]>(
        []
    );
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const activeApplications =
        (applicationStats?.stats.SCREENING ?? 0) +
        (applicationStats?.stats.APPLIED ?? 0) +
        (applicationStats?.stats.INTERVIEW ?? 0);

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
            <div className="mb-4 text-xl">
                <h1>Hi, {user?.name || 'User'}!</h1>
            </div>

            <h1 className="text-2xl font-extrabold mb-4">Dashboard</h1>
            <div className="flex flex-col gap-4">
                {/* applications stats */}
                <h1 className="text-l font-extrabold">Applications</h1>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">
                            {applicationStats?.total ?? 0}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold">
                            {activeApplications ?? 0}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Interviews
                        </p>
                        <p className="text-2xl font-bold">
                            {applicationStats?.stats.INTERVIEW ?? 0}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Offers</p>
                        <p className="text-2xl font-bold">
                            {applicationStats?.stats.OFFER ?? 0}
                        </p>
                    </div>
                </div>

                {/* recent applications */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-l font-extrabold">
                        Recent Applications
                    </h1>
                    {recentApplications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h2 className="text-xl font-bold">
                                You haven't added any applications
                            </h2>
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
            </div>
        </>
    );
}

export default Home;
