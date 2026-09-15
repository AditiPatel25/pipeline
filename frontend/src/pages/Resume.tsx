import {
    deleteResumeRequest,
    getResumeRequest,
    uploadResumeRequest,
} from '@/api/resume';
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
import type { ResumeData } from '@/types/resume';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { FileText, Trash, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

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

    const handleUpload = async () => {
        if (!resumeFile) {
            setError('File cannot be empty');
            return;
        }

        try {
            setError('');
            setUploading(true);

            const response = await uploadResumeRequest(resumeFile);

            setResume(response.resume);
            toast.success('Resume uploaded successfully');
            clearSelectedFile();
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteResume = async () => {
        try {
            setError('');
            await deleteResumeRequest();
            toast.success('Resume deleted');
            setResume(null);
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setError('');
            setResumeFile(file);
        }
    };

    const clearSelectedFile = () => {
        setResumeFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 px-4 py-2">
                <div>
                    <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
                    <div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-muted" />
                </div>

                <div className="w-full rounded-xl border bg-card p-6 shadow-sm">
                    <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
                    <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-muted" />
                    <div className="mt-6 h-16 w-full animate-pulse rounded-lg bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 py-2">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                }}
            >
                <h1 className="text-2xl font-extrabold">Resume</h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your saved resume for use across Pipeline.
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: 'easeOut',
                }}
                className="w-full rounded-xl border bg-card p-6 shadow-sm"
            >
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
                                    onClick={clearSelectedFile}
                                >
                                    <X className="size-4" />
                                </AttachmentAction>
                            </AttachmentActions>
                        </Attachment>

                        <Button
                            type="button"
                            onClick={handleUpload}
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
                    <div className="flex min-h-90 flex-col items-center justify-center text-center">
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
            </motion.div>
        </div>
    );
}

export default Resume;
