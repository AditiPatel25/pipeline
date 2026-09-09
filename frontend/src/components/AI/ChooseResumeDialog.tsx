import { Button } from '@/components/ui/button';
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Application } from '@/types/application';
import { FileText, History, Sparkles } from 'lucide-react';

type ChooseResumeDialogProps = {
    onSavedResume: (application: Application) => void;
    onAnotherResume: (application: Application) => void;
    application: Application | null;
    onPreviousAnalyses: (application: Application) => void;
};

function ChooseResumeDialog({
    onSavedResume,
    onAnotherResume,
    application,
    onPreviousAnalyses,
}: ChooseResumeDialogProps) {
    if (!application) return null;

    return (
        <DialogContent className="sm:max-w-xl">
            <DialogHeader className="text-center">
                <DialogTitle className="text-xl">Choose a Resume</DialogTitle>

                <DialogDescription>
                    Select the resume you want to compare against this job.
                </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button
                    type="button"
                    variant="outline"
                    className="group h-auto flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 text-center transition-all hover:border-accent hover:bg-accent/5"
                    onClick={() => onSavedResume(application)}
                >
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-accent/10">
                        <FileText className="size-6 text-muted-foreground group-hover:text-accent" />
                    </div>

                    <div className="space-y-1">
                        <p className="font-semibold">Use saved resume</p>

                        <p className="text-xs font-normal text-muted-foreground">
                            Analyze your saved resume
                        </p>
                    </div>
                </Button>

                <Button
                    type="button"
                    className="group h-auto flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 text-center transition-all"
                    onClick={() => onAnotherResume(application)}
                >
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/10">
                        <Sparkles className="size-6" />
                    </div>

                    <div className="space-y-1">
                        <p className="font-semibold">Use another resume</p>

                        <p className="text-xs font-normal opacity-80">
                            Paste a different resume
                        </p>
                    </div>
                </Button>
            </div>
            {application?.resumeMatches.length > 0 && (
                <>
                    <div className="my-2 border-t" />

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            if (application) {
                                onPreviousAnalyses(application);
                            }
                        }}
                    >
                        <History className='size-4'/> View previous analyses
                    </Button>
                </>
            )}
        </DialogContent>
    );
}

export default ChooseResumeDialog;
