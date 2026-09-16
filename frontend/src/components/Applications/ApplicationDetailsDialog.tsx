import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Application } from '@/types/application';
import { getLabel } from '@/utils/getLabel';
import { useEffect, useRef } from 'react';

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

import { Button } from '@/components/ui/button';

import { Sparkles } from 'lucide-react';

import {
    employmentTypeLabels,
    sourceLabels,
    workArrangementLabels,
    statusStyles
} from '@/constants/application';

import { Badge } from '@/components/ui/badge';
import { followUpTypeItems } from '@/constants/followUp';

type ApplicationDetailsDialogProps = {
    application: Application | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: (applicationId: number) => Promise<void>;
    onEdit: (application: Application) => void;
    onAddFollowUp: (application: Application) => void;
    onResumeAnalysis: (application: Application) => void;
};

function ApplicationDetailsDialog({
    application,
    open,
    onOpenChange,
    onDelete,
    onEdit,
    onAddFollowUp,
    onResumeAnalysis,
}: ApplicationDetailsDialogProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    // application starts at top of page
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
            }, 0);
        }
    }, [open, application?.id]);

    if (!application) return null;

    const activeFollowUps = application.followUps
        .filter((followUp) => !followUp.completed)
        .sort(
            (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] flex-col gap-0 sm:max-w-2xl">
                {/* header */}
                <DialogHeader className="shrink-0 pb-4">
                    <div className="flex items-start justify-between gap-4 pr-6">
                        <div className="min-w-0">
                            <DialogTitle className="text-xl">
                                {application.company}
                            </DialogTitle>

                            <DialogDescription className="mt-1">
                                {application.position}
                            </DialogDescription>
                        </div>

                        <Badge
                            className={`${statusStyles[application.status]} shrink-0 text-foreground`}
                        >
                            {application.status}
                        </Badge>
                    </div>
                </DialogHeader>

                {/* scrollable content - application details */}
                <div
                    ref={contentRef}
                    className="min-h-0 flex-1 overflow-y-auto pr-6"
                >
                    <div className="space-y-6">
                        <div className="rounded-lg bg-muted/50 p-3">
                            <div className="flex flex-wrap gap-2">
                                {application.location && (
                                    <Badge
                                        variant="outline"
                                        className="border-accent"
                                    >
                                        📍 {application.location}
                                    </Badge>
                                )}

                                {application.workArrangement && (
                                    <Badge
                                        variant="outline"
                                        className="border-accent"
                                    >
                                        {
                                            workArrangementLabels[
                                                application.workArrangement
                                            ]
                                        }
                                    </Badge>
                                )}

                                {application.employmentType && (
                                    <Badge
                                        variant="outline"
                                        className="border-accent"
                                    >
                                        {
                                            employmentTypeLabels[
                                                application.employmentType
                                            ]
                                        }
                                    </Badge>
                                )}

                                {application.source && (
                                    <Badge
                                        variant="outline"
                                        className="border-accent"
                                    >
                                        {sourceLabels[application.source]}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* job description */}
                        {application.description && (
                            <div className="space-y-3 mb-3">
                                <h3 className="border-b pb-2 text-sm font-semibold">
                                    Job Description
                                </h3>

                                <p className="text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                    {application.description}
                                </p>
                            </div>
                        )}

                        {/* notes */}
                        {application.notes && (
                            <div className="space-y-3 mb-4">
                                <h3 className="border-b pb-2 text-sm font-semibold">
                                    Notes
                                </h3>

                                <p className="text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                    {application.notes}
                                </p>
                            </div>
                        )}

                        {!application.description && !application.notes && (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No additional information added.
                            </p>
                        )}

                        {/* follow-ups */}
                        {activeFollowUps.length > 0 && (
                            <div className="space-y-3 mb-4">
                                <h3 className="border-b pb-2 text-sm font-semibold">
                                    Follow-Ups
                                </h3>

                                <div>
                                    {activeFollowUps.map((followUp) => (
                                        <div
                                            key={followUp.id}
                                            className="my-3 flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="mb-1 text-sm font-medium">
                                                    {followUp.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {getLabel(
                                                        followUpTypeItems,
                                                        followUp.type
                                                    )}
                                                </p>
                                            </div>

                                            <p
                                                className={`text-sm ${
                                                    new Date(followUp.dueDate) <
                                                    new Date()
                                                        ? 'text-destructive'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {new Date(
                                                    followUp.dueDate
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* date and job url */}
                        {(application.appliedDate || application.jobUrl) && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t py-4 text-sm text-muted-foreground">
                                {application.appliedDate && (
                                    <span>
                                        Applied{' '}
                                        {new Date(
                                            application.appliedDate
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                )}

                                {application.jobUrl && (
                                    <a
                                        href={application.jobUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Visit job posting ↗
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* footer */}
                <DialogFooter className="shrink-0 border-t pt-4 sm:justify-between">
                    <div className="flex gap-2">
                        {application.description && (
                            <Button
                                onClick={() => onResumeAnalysis(application)}
                            >
                                Resume Analysis <Sparkles />
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={() => onAddFollowUp(application)}
                        >
                            Add Follow-Up
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => onEdit(application)}
                        >
                            Edit
                        </Button>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger
                            render={
                                <Button variant="destructive" type="button">
                                    Delete
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
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ApplicationDetailsDialog;
