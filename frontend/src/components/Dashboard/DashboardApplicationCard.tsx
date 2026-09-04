import type { Application } from '@/types/application';
import { Badge } from '@/components/ui/badge';

type DashboardApplicationCardProps = {
    application: Application;
};

const statusStyles = {
    APPLIED: 'bg-status-applied',
    SCREENING: 'bg-status-screening',
    INTERVIEW: 'bg-status-interview',
    OFFER: 'bg-status-offer',
    REJECTED: 'bg-status-rejected',
    WITHDRAWN: 'bg-status-withdrawn',
    GHOSTED: 'bg-status-ghosted',
};

function DashboardApplicationCard({
    application,
}: DashboardApplicationCardProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md">
            <div>
                <div className="flex items-center justify-between gap-4">
                    <h2 className="truncate text-lg font-bold text-card-foreground">
                        {application.company}
                    </h2>

                    <Badge
                        className={`${statusStyles[application.status]} shrink-0 text-foreground`}
                    >
                        {application.status}
                    </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                    {application.position}
                </p>
            </div>
        </div>
    );
}

export default DashboardApplicationCard;
