import type { Application } from '@/types/application';
import { Badge } from '@/components/ui/badge';
import {
    workArrangementLabels,
    employmentTypeLabels,
    sourceLabels,
} from '@/constants/application';
import { Button } from './ui/button';
import { FollowUp } from '@/types/followUp';
import { getLabel } from '@/utils/getLabel';
import { followUpTypeItems } from '@/constants/followUp';

type DashboardFollowUpCardProps = {
    followUp: FollowUp;
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

function DashboardFollowUpCard({ followUp }: DashboardFollowUpCardProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md">
            {/* <button
                type="button"
                className="w-full text-left"
                onClick={() => onSelect(application)}
            > */}
            <div>
                <div className="flex items-center justify-between gap-4">
                    <h2 className="truncate text-lg font-bold text-card-foreground">
                        {followUp.title}
                    </h2>

                    <Badge className="shrink-0 text-foreground">
                        {getLabel(
                            followUpTypeItems,
                            followUp.type
                        )?.toUpperCase()}
                    </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                    {followUp.application.position}
                </p>
            </div>
            {/* </button> */}
        </div>
    );
}

export default DashboardFollowUpCard;
