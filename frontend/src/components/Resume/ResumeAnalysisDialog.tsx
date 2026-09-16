import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Application } from '@/types/application';
import { ResumeData } from '@/types/resume';
import { ResumeMatch } from '@/types/resumeMatch';
import { FileText, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

type ResumeAnalysisDialogProps = {
    application: Application | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateResumeMatch: (
        applicationId: number,
        resumeSource: 'SAVED' | 'ANOTHER',
        resume: string
    ) => Promise<ResumeMatch>;
    resumeSource: 'SAVED' | 'ANOTHER' | null;
    savedResume: ResumeData | null;
    initialView: 'history' | 'new';
};

function ResumeAnalysisDialog({
    application,
    open,
    onOpenChange,
    onCreateResumeMatch,
    savedResume,
    resumeSource,
    initialView,
}: ResumeAnalysisDialogProps) {
    const [resume, setResume] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState<'history' | 'new' | 'result'>('history');

    const [selectedMatch, setSelectedMatch] = useState<ResumeMatch | null>(
        null
    );

    useEffect(() => {
        if (open) {
            setView(initialView);
            setSelectedMatch(null);
            setResume('');
            setLoading(false);
        }
    }, [open, initialView]);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!application || !resumeSource) return;

        if (resumeSource === 'ANOTHER' && !resume.trim()) {
            return;
        }

        try {
            setLoading(true);

            const result = await onCreateResumeMatch(
                application.id,
                resumeSource,
                resume
            );

            setSelectedMatch(result);
            setView('result');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        onOpenChange(isOpen);
    };

    const handleViewAnalysis = (match: ResumeMatch) => {
        setSelectedMatch(match);
        setView('result');
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-2xl">
                {/* history / previous analyses */}
                {view === 'history' && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="size-4 text-primary" />
                                Resume Analysis
                            </DialogTitle>

                            <DialogDescription>
                                Previous analyses for this application.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="min-h-0 flex-1 overflow-y-auto py-4 pr-2">
                            <div className="space-y-3">
                                {application?.resumeMatches?.map((match) => (
                                    <button
                                        key={match.id}
                                        type="button"
                                        onClick={() =>
                                            handleViewAnalysis(match)
                                        }
                                        className="w-full rounded-xl border bg-muted/40 p-4 text-left transition-colors hover:bg-muted"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="font-medium">
                                                    {match.resumeSource ===
                                                    'SAVED'
                                                        ? match.resumeName ||
                                                          'Saved resume'
                                                        : 'Another resume'}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(
                                                        match.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-2xl font-semibold">
                                                    {match.matchScore}%
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    match
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="border-t pt-4">
                            <DialogClose
                                render={
                                    <Button type="button" variant="outline">
                                        Done
                                    </Button>
                                }
                            />
                        </DialogFooter>
                    </>
                )}

                {/* new analysis */}
                {view === 'new' && (
                    <>
                        <DialogHeader className="pb-2">
                            <div className="mb-1 flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                                    <Sparkles className="size-4 text-primary" />
                                </div>

                                <DialogTitle>Resume Analysis</DialogTitle>
                            </div>

                            <DialogDescription>
                                {resumeSource === 'SAVED'
                                    ? 'Analyze your saved resume against this job description.'
                                    : 'Paste a resume below to compare it against this job description.'}
                            </DialogDescription>
                        </DialogHeader>

                        {application && (
                            <div className="rounded-lg border bg-muted/40 px-4 py-3">
                                <p className="text-sm font-medium">
                                    {application.position}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {application.company}
                                </p>
                            </div>
                        )}

                        <form
                            className="flex min-h-0 flex-1 flex-col"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex-1 overflow-y-auto py-4 pr-2">
                                {resumeSource === 'ANOTHER' ? (
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="resume">
                                                Resume
                                            </FieldLabel>

                                            <Textarea
                                                id="resume"
                                                placeholder="Paste your resume here..."
                                                value={resume}
                                                onChange={(e) =>
                                                    setResume(e.target.value)
                                                }
                                                className="min-h-72 resize-none"
                                            />

                                            <p className="text-xs text-muted-foreground">
                                                Your resume is only used to
                                                analyze your match for this
                                                position.
                                            </p>
                                        </Field>
                                    </FieldGroup>
                                ) : (
                                    <div className="rounded-xl border bg-muted/40 p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                <FileText className="size-5 text-primary" />
                                            </div>

                                            <div>
                                                <p className="font-medium">
                                                    {savedResume?.fileName ||
                                                        'Saved resume'}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    Your saved resume will be
                                                    compared against this job.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="border-t pt-4 sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={
                                        (resumeSource === 'ANOTHER' &&
                                            !resume.trim()) ||
                                        loading
                                    }
                                >
                                    {loading ? (
                                        <>
                                            <Sparkles className="size-4 animate-pulse" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="size-4" />
                                            Analyze Resume
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}

                {/* result */}
                {view === 'result' && selectedMatch && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="size-4 text-primary" />
                                Resume Analysis
                            </DialogTitle>

                            <DialogDescription>
                                {selectedMatch.resumeSource === 'SAVED'
                                    ? 'Analysis using your saved resume.'
                                    : 'Analysis using another resume.'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="min-h-0 flex-1 overflow-y-auto py-4 pr-2">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium">
                                            {application?.position}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {application?.company}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-4xl font-semibold leading-none">
                                            {selectedMatch.matchScore}

                                            <span className="text-xl text-muted-foreground">
                                                %
                                            </span>
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            match score
                                        </p>
                                    </div>
                                </div>

                                <Progress
                                    value={selectedMatch.matchScore}
                                    className="h-1.5"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-muted/50 p-4">
                                        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Matched skills
                                        </p>

                                        {selectedMatch.matchedSkills.length >
                                        0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedMatch.matchedSkills.map(
                                                    (skill) => (
                                                        <span
                                                            key={skill}
                                                            className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs text-green-600 dark:text-green-400"
                                                        >
                                                            {skill}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No strong matches found.
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-xl bg-muted/50 p-4">
                                        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Potential gaps
                                        </p>

                                        {selectedMatch.extractedGaps.length >
                                        0 ? (
                                            <div className="space-y-2">
                                                {selectedMatch.extractedGaps.map(
                                                    (gap) => (
                                                        <div
                                                            key={gap}
                                                            className="flex items-start gap-2"
                                                        >
                                                            <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />

                                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                                {gap}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No major gaps found.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-muted/50 p-4">
                                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Suggestions
                                    </p>

                                    <div className="space-y-3">
                                        {selectedMatch.suggestions.map(
                                            (suggestion, index) => (
                                                <div key={suggestion}>
                                                    {index !== 0 && (
                                                        <div className="mb-3 border-t border-border" />
                                                    )}

                                                    <div className="flex items-start gap-3">
                                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                                            {index + 1}
                                                        </span>

                                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                                            {suggestion}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="border-t pt-4">
                            <Button
                                type="button"
                                onClick={() => {
                                    setSelectedMatch(null);
                                    setView('history');
                                }}
                            >
                                Back
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ResumeAnalysisDialog;
