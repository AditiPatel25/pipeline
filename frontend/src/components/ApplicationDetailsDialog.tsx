import { Application } from '@/types/application';
import { useEffect, useRef } from 'react';
import { getLabel } from '@/utils/getLabel';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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

const statusStyles = {
    APPLIED: 'bg-status-applied',
    SCREENING: 'bg-status-screening',
    INTERVIEW: 'bg-status-interview',
    OFFER: 'bg-status-offer',
    REJECTED: 'bg-status-rejected',
    WITHDRAWN: 'bg-status-withdrawn',
    GHOSTED: 'bg-status-ghosted',
};

import {
    workArrangementLabels,
    employmentTypeLabels,
    sourceLabels,
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
    onResumeAnalysis
}: ApplicationDetailsDialogProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
            }, 0);
        }
    }, [open, application?.id]);

    if (!application) return null;

    const activeFollowUps = application.followUps.filter(
        (followUp) => !followUp.completed
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

                {/* scrollable content */}
                {/* application details */}
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
                            <div className="space-y-3 mb-2">
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
                            <div className="space-y-3 mb-2">
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

                        {/* follow-ups*/}
                        {application.followUps.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="border-b pb-2 text-sm font-semibold">
                                    Follow-Ups
                                </h3>

                                <div className="space-y-2">
                                    {activeFollowUps.map((followUp) => (
                                        <div
                                            key={followUp.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium mb-1">
                                                    {followUp.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {getLabel(
                                                        followUpTypeItems,
                                                        followUp.type
                                                    )}
                                                </p>
                                            </div>

                                            <p className="text-sm text-muted-foreground">
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
                <DialogFooter className="shrink-0 border-t pt-4 sm:justify-end">
                    {application.description && (
                        <Button
                            variant="outline"
                            onClick={() => onResumeAnalysis(application)}
                        >
                            Resume Analysis <Sparkles/>
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
                                    Continue
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
