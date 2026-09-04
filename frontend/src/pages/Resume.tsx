import {
    deleteResumeRequest,
    getResumeRequest,
    uploadResumeRequest,
} from '@/api/resume';
import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentMedia,
    AttachmentTitle,
} from '@/components/ui/attachment';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ResumeData } from '@/types/resume';
import { getErrorMessage } from '@/utils/getErrorMessage';
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
import { FileText, Trash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function Resume() {
    const [resume, setResume] = useState<ResumeData | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await getResumeRequest();
                setResume(response.resume);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, []);

    const handleSubmit = async () => {
        if (!resumeFile) {
            setError('File cannot be empty');
            return;
        }

        try {
            setError('');
            setUploading(true);

            const response = await uploadResumeRequest(resumeFile);

            setResume(response.resume);
            setResumeFile(null);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteResume = async () => {
        try {
            setError('');
            await deleteResumeRequest();
            setResume(null);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setError('');
            setResumeFile(file);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 py-6">
            <div>
                <h1 className="text-2xl font-extrabold">Resume</h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your saved resume for use across Pipeline.
                </p>
            </div>

            <div className="max-w-6xl rounded-xl border bg-card p-6 shadow-sm">
                {resumeFile ? (
                    <div className="space-y-5">
                        <div>
                            <h2 className="text-base font-semibold">
                                Ready to upload
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Review your file before saving it.
                            </p>
                        </div>

                        <Attachment className="w-full">
                            <AttachmentMedia>
                                <FileText className="size-5" />
                            </AttachmentMedia>

                            <AttachmentContent>
                                <AttachmentTitle>
                                    {resumeFile.name}
                                </AttachmentTitle>

                                <AttachmentDescription>
                                    {(resumeFile.size / 1024 / 1024).toFixed(2)}{' '}
                                    MB
                                </AttachmentDescription>
                            </AttachmentContent>

                            <AttachmentActions>
                                <AttachmentAction
                                    aria-label="Remove selected resume"
                                    onClick={() => setResumeFile(null)}
                                >
                                    <X className="size-4" />
                                </AttachmentAction>
                            </AttachmentActions>
                        </Attachment>

                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <>
                                    <Spinner />
                                    Uploading...
                                </>
                            ) : (
                                'Save resume'
                            )}
                        </Button>
                    </div>
                ) : resume ? (
                    <div className="space-y-5">
                        <div>
                            <h2 className="text-base font-semibold">
                                Your resume
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Your saved resume is ready to use across
                                Pipeline.
                            </p>
                        </div>

                        <Attachment className="w-full">
                            <AttachmentMedia>
                                <FileText className="size-5" />
                            </AttachmentMedia>

                            <AttachmentContent>
                                <AttachmentTitle>
                                    {resume.fileName}
                                </AttachmentTitle>

                                <AttachmentDescription>
                                    Saved resume
                                </AttachmentDescription>
                            </AttachmentContent>

                            <AttachmentActions>
                                <AlertDialog>
                                    <AlertDialogTrigger
                                        render={
                                            <AttachmentAction aria-label="Delete resume">
                                                <Trash className="size-4 text-destructive" />
                                            </AttachmentAction>
                                        }
                                    />

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete resume?
                                            </AlertDialogTitle>

                                            <AlertDialogDescription>
                                                This action cannot be undone and
                                                will permanently delete your
                                                resume.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>

                                            <AlertDialogAction
                                                onClick={handleDeleteResume}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </AttachmentActions>
                        </Attachment>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Replace resume
                        </Button>
                    </div>
                ) : (
                    <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted">
                            <FileText className="size-8 text-muted-foreground" />
                        </div>

                        <h2 className="text-lg font-semibold">
                            Upload your resume
                        </h2>

                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                            Save your resume once and use it across Pipeline for
                            resume analysis and other AI tools.
                        </p>

                        <Button
                            type="button"
                            className="mt-6"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload resume
                        </Button>

                        <p className="mt-3 text-xs text-muted-foreground">
                            PDF or DOCX · 10 MB max
                        </p>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {error && (
                    <p className="mt-4 text-sm text-destructive">{error}</p>
                )}
            </div>
        </div>
    );
}

export default Resume;
