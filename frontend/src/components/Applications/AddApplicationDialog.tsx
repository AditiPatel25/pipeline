import { Button } from '@/components/ui/button';
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Sparkles } from 'lucide-react';

type AddApplicationDialogProps = {
    onManual: () => void;
    onJobDescription: () => void;
};

function AddApplicationDialog({
    onManual,
    onJobDescription,
}: AddApplicationDialogProps) {
    return (
        <DialogContent className="sm:max-w-xl">
            {/* header */}
            <DialogHeader className="text-center">
                <DialogTitle className="text-xl">
                    Add an Application
                </DialogTitle>
                <DialogDescription>
                    How would you like to get started?
                </DialogDescription>
            </DialogHeader>

            {/* options - add manually or add via job description extraction */}
            <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2">
                <Button
                    type="button"
                    variant="outline"
                    className="group h-auto flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 text-center transition-all hover:border-accent hover:bg-accent/5"
                    onClick={onManual}
                >
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-accent/10">
                        <FileText className="size-6 text-muted-foreground group-hover:text-accent" />
                    </div>

                    <div className="space-y-1">
                        <p className="font-semibold">Add Manually</p>
                        <p className="text-xs font-normal text-muted-foreground">
                            Enter the application details yourself
                        </p>
                    </div>
                </Button>

                <Button
                    type="button"
                    className="group h-auto flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 text-center transition-all"
                    onClick={onJobDescription}
                >
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/10">
                        <Sparkles className="size-6" />
                    </div>

                    <div className="space-y-1">
                        <p className="font-semibold">Extract with AI</p>
                        <p className="text-xs font-normal opacity-80">
                            Paste a job description and let AI fill it in
                        </p>
                    </div>
                </Button>
            </div>
        </DialogContent>
    );
}

export default AddApplicationDialog;
