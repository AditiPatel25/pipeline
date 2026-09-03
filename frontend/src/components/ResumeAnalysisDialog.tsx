import { Application } from '@/types/application';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { ResumeMatch } from '@/types/resumeMatch';
import { Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type ResumeAnalysisDialogProps = {
    application: Application | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateResumeMatch: (
        applicationId: number,
        resume: string
    ) => Promise<ResumeMatch>;
};

function ResumeAnalysisDialog({
    application,
    open,
    onOpenChange,
    onCreateResumeMatch,
}: ResumeAnalysisDialogProps) {
    const [resume, setResume] = useState('');
    const [loading, setLoading] = useState(false);
    const [resumeMatch, setResumeMatch] = useState<ResumeMatch | null>(
        application?.resumeMatch ?? null
    );

    useEffect(() => {
        setResumeMatch(application?.resumeMatch ?? null);
    }, [application, open]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!resume.trim() || !application) return;

        try {
            setLoading(true);

            const result = await onCreateResumeMatch(application.id, resume);

            setResumeMatch(result);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setResume('');
            setResumeMatch(null);
            setLoading(false);
        }

        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-2xl">
                {!resumeMatch ? (
                    <>
                        <DialogHeader className="pb-2">
                            <div className="mb-1 flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                                    <Sparkles className="size-4 text-primary" />
                                </div>

                                <DialogTitle>Resume Analysis</DialogTitle>
                            </div>

                            <DialogDescription>
                                Paste your resume below and we&apos;ll compare
                                it against the job description to see how well
                                you match.
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
                                            Your resume is only used to analyze
                                            your match for this position.
                                        </p>
                                    </Field>
                                </FieldGroup>
                            </div>

                            <DialogFooter className="border-t pt-4 sm:justify-end">
                                <DialogClose
                                    render={
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    }
                                />

                                <Button
                                    type="submit"
                                    disabled={!resume.trim() || loading}
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
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="size-4 text-primary" />
                                Resume Analysis
                            </DialogTitle>
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
                                            {resumeMatch.matchScore}
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
                                    value={resumeMatch.matchScore}
                                    className="h-1.5"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-muted/50 p-4">
                                        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Matched skills
                                        </p>
                                        {resumeMatch.matchedSkills.length >
                                        0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {resumeMatch.matchedSkills.map(
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
                                        {resumeMatch.extractedGaps.length >
                                        0 ? (
                                            <div className="space-y-2">
                                                {resumeMatch.extractedGaps.map(
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

                                {/* Suggestions */}
                                <div className="rounded-xl bg-muted/50 p-4">
                                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Suggestions
                                    </p>
                                    <div className="space-y-3">
                                        {resumeMatch.suggestions.map(
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
                                variant="outline"
                                onClick={() => setResumeMatch(null)}
                            >
                                Analyze again
                            </Button>

                            <DialogClose
                                render={<Button type="button">Done</Button>}
                            />
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ResumeAnalysisDialog;
