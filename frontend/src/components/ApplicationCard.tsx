import type { Application } from '@/types/application';
import { Badge } from '@/components/ui/badge';

type ApplicationCardProps = {
    application: Application;
};

const statusStyles = {
    APPLIED: 'bg-status-applied',
    SCREENING: 'bg-status-screening',
    INTERVIEW: 'bg-status-interview',
    OFFER: 'bg-status-offer',
    REJECTED: 'bg-status-rejected',
    WITHDRAWN: 'bg-status-withdrawn',
    GHOSTED: 'bg-status-withdrawn',
};

const workArrangementLabels = {
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
    ONSITE: 'On-site',
};

const employmentTypeLabels = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
    TEMPORARY: 'Temporary',
};

const sourceLabels = {
    LINKEDIN: 'LinkedIn',
    REFERRAL: 'Referral',
    COLD_EMAIL: 'Cold email',
    CAREER_FAIR: 'Career fair',
    OTHER: 'Other',
};

function ApplicationCard({ application }: ApplicationCardProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md">
            {/* header */}
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

            {/* application details */}
            <div className="mt-4 flex flex-wrap gap-2">
                {application.location && (
                    <Badge variant="outline" className="border-accent">
                        📍 {application.location}
                    </Badge>
                )}
                {application.workArrangement && (
                    <Badge variant="outline" className="border-accent">
                        {workArrangementLabels[application.workArrangement]}
                    </Badge>
                )}

                {application.employmentType && (
                    <Badge variant="outline" className="border-accent">
                        {employmentTypeLabels[application.employmentType]}
                    </Badge>
                )}

                {application.source && (
                    <Badge variant="outline" className="border-accent">
                        {sourceLabels[application.source]}
                    </Badge>
                )}
            </div>

            {/* footer */}
            {application.appliedDate && (
                <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
                    Applied on{' '}
                    {new Date(application.appliedDate).toLocaleDateString(
                        'en-US',
                        {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        }
                    )}
                </div>
            )}
        </div>
    );
}

export default ApplicationCard;
