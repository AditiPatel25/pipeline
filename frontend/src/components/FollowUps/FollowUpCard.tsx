import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { followUpTypeItems } from '@/constants/followUp';
import { FollowUp } from '@/types/followUp';
import { getLabel } from '@/utils/getLabel';
import { Pencil, Trash } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

type FollowUpCardProps = {
    followUp: FollowUp;
    onDelete: (followUpId: number) => Promise<void>;
    onEdit: (followUp: FollowUp) => void;
    onToggleComplete: (followUpId: number, completed: boolean) => Promise<void>;
};
function FollowUpCard({
    followUp,
    onDelete,
    onEdit,
    onToggleComplete,
}: FollowUpCardProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(followUp.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const isOverdue = !followUp.completed && dueDate < today;
    return (
        <div
            className={`rounded-xl border border-border bg-card p-3 px-4 shadow-sm transition-all ${
                followUp.completed
                    ? 'opacity-60'
                    : 'hover:border-accent hover:shadow-md'
            }`}
        >
            <div className="w-full text-left">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <Checkbox
                            className="size-5"
                            checked={followUp.completed}
                            onCheckedChange={(checked) => {
                                onToggleComplete(followUp.id, checked === true);
                            }}
                        />

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
                            !followUp.completed &&
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
                
                {/* edit + delete buttons */}
                <div className="flex justify-between mt-4 items-center">
                    <p className="text-sm text-muted-foreground">
                        {followUp.application.company} —{' '}
                        {followUp.application.position}
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            type="button"
                            onClick={() => onEdit(followUp)}
                        >
                            <Pencil />
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger
                                render={
                                    <Button
                                        variant="destructive"
                                        size="icon-sm"
                                        type="button"
                                    >
                                        <Trash />
                                    </Button>
                                }
                            />
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone and will
                                        permanently delete this follow-up.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(followUp.id)}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FollowUpCard;
