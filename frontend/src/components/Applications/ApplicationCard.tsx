import type { Application } from '@/types/application';
import { Badge } from '@/components/ui/badge';
import {
    workArrangementLabels,
    employmentTypeLabels,
    sourceLabels,
} from '@/constants/application';
import { Button } from '../ui/button';
import { Trash, Pencil } from 'lucide-react';
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

type ApplicationCardProps = {
    application: Application;
    onDelete: (applicationId: number) => Promise<void>;
    onEdit: (application: Application) => void;
    onSelect: (application: Application) => void;
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

function ApplicationCard({
    application,
    onDelete,
    onEdit,
    onSelect,
}: ApplicationCardProps) {
    return (
        <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md">
            <button
                type="button"
                className="flex w-full flex-1 flex-col text-left"
                onClick={() => onSelect(application)}
            >
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
            </button>

            {/* footer */}

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                <div>
                    {application.appliedDate && (
                        <>
                            Applied on{' '}
                            {new Date(
                                application.appliedDate
                            ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => onEdit(application)}
                    >
                        <Pencil />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger
                            render={
                                <Button
                                    variant="destructive"
                                    size="icon"
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
                                    permanently delete this application.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(application.id)}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}

export default ApplicationCard;
