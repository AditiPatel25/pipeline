import { Badge } from '@/components/ui/badge';
import { followUpTypeItems } from '@/constants/followUp';
import { FollowUp } from '@/types/followUp';
import { getLabel } from '@/utils/getLabel';

type DashboardFollowUpCardProps = {
    followUp: FollowUp;
};

function DashboardFollowUpCard({ followUp }: DashboardFollowUpCardProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(followUp.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const isOverdue = !followUp.completed && dueDate < today;

    return (
        <div
            className={`rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md ${
                followUp.completed ? 'opacity-60' : ''
            }`}
        >
            <div>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <h2
                            className={`truncate text-lg font-bold text-card-foreground ${
                                followUp.completed
                                    ? 'text-muted-foreground line-through'
                                    : ''
                            }`}
                        >
                            {followUp.title}
                        </h2>

                        <Badge className="shrink-0 text-foreground">
                            {getLabel(
                                followUpTypeItems,
                                followUp.type
                            )?.toUpperCase()}
                        </Badge>
                    </div>

                    <p
                        className={`shrink-0 text-sm ${
                            isOverdue
                                ? 'font-medium text-destructive'
                                : 'text-muted-foreground'
                        }`}
                    >
                        {new Date(followUp.dueDate).toLocaleDateString(
                            'en-US',
                            {
                                month: 'short',
                                day: 'numeric',
                            }
                        )}
                    </p>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                    {followUp.application.company} —{' '}
                    {followUp.application.position}
                </p>
            </div>
        </div>
    );
}

export default DashboardFollowUpCard;
