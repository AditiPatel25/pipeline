import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { toast } from 'sonner';

type JobDescriptionDialogProps = {
    onExtract: (jobDescription: string) => Promise<void>;
};

function JobDescriptionDialog({ onExtract }: JobDescriptionDialogProps) {
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!jobDescription.trim()) return;

        try {
            setLoading(true);
            await onExtract(jobDescription);
            setJobDescription('');
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
            {/* add job description to extract application information */}
            <DialogHeader>
                <DialogTitle>Add Job Description</DialogTitle>
                <DialogDescription>
                    Paste a job description and we&apos;ll extract the
                    application details for you.
                </DialogDescription>
            </DialogHeader>

            <form
                className="flex min-h-0 flex-1 flex-col"
                onSubmit={handleSubmit}
            >
                <div className="flex-1 overflow-y-auto pr-6 pb-4">
                    <FieldGroup className="px-2">
                        <Field>
                            <FieldLabel htmlFor="jobDescription">
                                Job Description
                            </FieldLabel>

                            <Textarea
                                id="jobDescription"
                                placeholder="Paste the job description here..."
                                value={jobDescription}
                                onChange={(e) =>
                                    setJobDescription(e.target.value)
                                }
                                className="min-h-64"
                            />
                        </Field>
                    </FieldGroup>
                </div>

                <DialogFooter className="sm:justify-around">
                    <DialogClose
                        render={
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        }
                    />

                    <Button
                        type="submit"
                        disabled={!jobDescription.trim() || loading}
                    >
                        {loading ? 'Extracting...' : 'Extract Information'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}

export default JobDescriptionDialog;
