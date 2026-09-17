import { extractApplicationRequest } from '@/api/ai';
import { createFollowUpRequest } from '@/api/followUp';
import { getResumeRequest } from '@/api/resume';
import {
    createApplicationRequest,
    createResumeMatchRequest,
    deleteApplicationRequest,
    editApplicationRequest,
    getApplicationsRequest,
} from '@/api/application';

import ChooseResumeDialog from '@/components/Resume/ChooseResumeDialog';
import JobDescriptionDialog from '@/components/Applications/JobDescriptionDialog';
import ResumeAnalysisDialog from '@/components/Resume/ResumeAnalysisDialog';
import AddApplicationDialog from '@/components/Applications/AddApplicationDialog';
import ApplicationCard from '@/components/Applications/ApplicationCard';
import ApplicationDetailsDialog from '@/components/Applications/ApplicationDetailsDialog';
import ApplicationFormDialog from '@/components/Applications/ApplicationFormDialog';
import ApplicationToolbar from '@/components/Applications/ApplicationToolbar';
import FollowUpModal from '@/components/FollowUps/FollowUpModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { Application, ApplicationData } from '@/types/application';
import type { FollowUpData } from '@/types/followUp';
import type { ResumeData } from '@/types/resume';
import type { ResumeSource } from '@/types/resumeMatch';

import { getErrorMessage } from '@/utils/getErrorMessage';
import { BriefcaseBusiness, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { getTimestamp } from '@/utils/getTimestamp';

function Applications() {
    // applications
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    // application dialogs
    const [addApplicationOpen, setAddApplicationOpen] = useState(false);
    const [jobDescriptionOpen, setJobDescriptionOpen] = useState(false);
    const [applicationModalOpen, setApplicationModalOpen] = useState(false);
    const [initialApplication, setInitialApplication] = useState<
        ApplicationData | undefined
    >();
    const [editingApplication, setEditingApplication] =
        useState<Application | null>(null);
    const [followUpOpen, setFollowUpOpen] = useState(false);

    // selected application
    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);

    // resume analysis
    const [resumeSource, setResumeSource] = useState<ResumeSource | null>(null);
    const [resumeAnalysisView, setResumeAnalysisView] = useState<
        'history' | 'new'
    >('new');
    const [savedResume, setSavedResume] = useState<ResumeData | null>(null);
    const [resumeAnalysisOpen, setResumeAnalysisOpen] = useState(false);
    const [chooseResumeOpen, setChooseResumeOpen] = useState(false);

    // application toolbar
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [workArrangementFilter, setWorkArrangementFilter] = useState<
        string | null
    >(null);
    const [sortBy, setSortBy] = useState<string | null>('NEWEST');

    // helper function to update/refresh applications after editing
    const updateApplication = (
        applicationId: number,
        update: (application: Application) => Application
    ) => {
        setApplications((prev) =>
            prev.map((application) =>
                application.id === applicationId
                    ? update(application)
                    : application
            )
        );

        setSelectedApplication((prev) =>
            prev?.id === applicationId ? update(prev) : prev
        );
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const [applicationsResponse, resumeResponse] =
                    await Promise.all([
                        getApplicationsRequest(),
                        getResumeRequest(),
                    ]);
                setApplications(applicationsResponse.applications);
                setSavedResume(resumeResponse.resume);
            } catch (err) {
                toast.error(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    // creates application
    const handleCreateApplication = async (application: ApplicationData) => {
        try {
            const response = await createApplicationRequest(application);

            setApplications((prev) => [response.application, ...prev]);
        } catch (err) {
            throw err;
        }
    };

    // edit application
    const handleEditApplication = async (
        applicationId: number,
        application: ApplicationData
    ) => {
        try {
            const response = await editApplicationRequest(
                applicationId,
                application
            );

            updateApplication(applicationId, () => response.updatedApplication);
        } catch (err) {
            throw err;
        }
    };

    // delete application
    async function handleDeleteApplication(applicationId: number) {
        try {
            await deleteApplicationRequest(applicationId);
            setApplications((applications) =>
                applications.filter(
                    (application) => application.id !== applicationId
                )
            );
            setSelectedApplication(null);
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    }

    // create follow up inside currently selected application
    const handleCreateFollowUp = async (followUp: FollowUpData) => {
        try {
            const response = await createFollowUpRequest(followUp);

            updateApplication(followUp.applicationId, (application) => ({
                ...application,
                followUps: [...application.followUps, response.followUp],
            }));
        } catch (err) {
            throw err;
        }
    };

    // extract application info from job description
    const handleExtract = async (jobDescription: string) => {
        try {
            const extractedInfo =
                await extractApplicationRequest(jobDescription);

            setInitialApplication({
                company: extractedInfo.company ?? '',
                position: extractedInfo.position ?? '',
                jobUrl: '',
                description: jobDescription,
                status: 'APPLIED',
                appliedDate: undefined,
                source: undefined,
                location: extractedInfo.location ?? '',
                workArrangement: extractedInfo.workArrangement,
                employmentType: extractedInfo.employmentType,
                notes: '',
            });

            setJobDescriptionOpen(false);
            setApplicationModalOpen(true);
        } catch (err) {
            throw err;
        }
    };

    // create resume analysis, comparing resume to application
    const handleCreateResumeMatch = async (
        applicationId: number,
        resumeSource: ResumeSource,
        resume: string
    ) => {
        try {
            const resumeMatch = await createResumeMatchRequest(
                applicationId,
                resumeSource,
                resume
            );

            updateApplication(applicationId, (application) => ({
                ...application,
                resumeMatches: [
                    resumeMatch,
                    ...(application.resumeMatches ?? []),
                ],
            }));

            return resumeMatch;
        } catch (err) {
            throw err;
        }
    };

    const handleManualAdd = () => {
        setEditingApplication(null);
        setInitialApplication(undefined);
        setAddApplicationOpen(false);
        setApplicationModalOpen(true);
    };

    const handleAIAdd = () => {
        setAddApplicationOpen(false);
        setJobDescriptionOpen(true);
    };

    const handleEdit = (application: Application) => {
        setEditingApplication(application);
        setApplicationModalOpen(true);
    };

    const handleAddFollowUp = (application: Application) => {
        setSelectedApplication(application);
        setFollowUpOpen(true);
    };

    const handleResumeSource = (
        application: Application,
        source: ResumeSource
    ) => {
        setSelectedApplication(application);
        setResumeSource(source);
        setResumeAnalysisView('new');
        setChooseResumeOpen(false);
        setResumeAnalysisOpen(true);
    };

    const handleSavedResume = (application: Application) =>
        handleResumeSource(application, 'SAVED');

    const handleAnotherResume = (application: Application) =>
        handleResumeSource(application, 'ANOTHER');

    const handleResumeAnalysis = (application: Application) => {
        setSelectedApplication(application);
        setChooseResumeOpen(true);
    };

    const handlePreviousAnalyses = (application: Application) => {
        setSelectedApplication(application);
        setResumeAnalysisView('history');
        setChooseResumeOpen(false);
        setResumeAnalysisOpen(true);
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatusFilter(null);
        setWorkArrangementFilter(null);
        setSortBy('NEWEST');
    };

    // filters applications based on search, job status, or work arrangement
    const filteredApplications = applications.filter((application) => {
        const matchesSearch =
            application.company.toLowerCase().includes(search.toLowerCase()) ||
            application.position.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            !statusFilter || application.status === statusFilter;

        const matchesWorkArrangement =
            !workArrangementFilter ||
            application.workArrangement === workArrangementFilter;

        return matchesSearch && matchesStatus && matchesWorkArrangement;
    });

    // sort applications by newest, oldest, alphabetically
    const displayedApplications = [...filteredApplications].sort((a, b) => {
        const aDate = getTimestamp(a.appliedDate);
        const bDate = getTimestamp(b.appliedDate);

        switch (sortBy) {
            case 'NEWEST':
                return (bDate ?? 0) - (aDate ?? 0);

            case 'OLDEST':
                if (aDate === null) return 1;
                if (bDate === null) return -1;
                return aDate - bDate;

            case 'COMPANY_ASC':
                return a.company.localeCompare(b.company);

            case 'COMPANY_DESC':
                return b.company.localeCompare(a.company);

            default:
                return 0;
        }
    });

    const applicationToEdit = editingApplication
        ? {
              company: editingApplication.company,
              position: editingApplication.position,
              jobUrl: editingApplication.jobUrl,
              description: editingApplication.description,
              status: editingApplication.status,
              appliedDate: editingApplication.appliedDate,
              source: editingApplication.source,
              location: editingApplication.location,
              workArrangement: editingApplication.workArrangement,
              employmentType: editingApplication.employmentType,
              notes: editingApplication.notes,
          }
        : undefined;

    const modalApplication = initialApplication ?? applicationToEdit;

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-between px-4">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="h-10 w-36" />
                </div>

                <div className="mt-6 flex gap-3 px-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-32" />
                </div>

                <main className="mt-6 grid w-full grid-cols-1 gap-4 px-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-border bg-card p-5 shadow-sm"
                        >
                            {/* company + status */}
                            <div className="flex items-center justify-between gap-4">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>

                            {/* position */}
                            <Skeleton className="mt-2 h-4 w-40" />

                            {/* details */}
                            <div className="mt-4 flex gap-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <Skeleton className="h-4 w-24" />

                                <div className="flex gap-2">
                                    <Skeleton className="size-8 rounded-md" />
                                    <Skeleton className="size-8 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </main>
            </>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between px-4">
                <h1 className="text-2xl font-extrabold">Applications</h1>
                {/* choose method of adding application dialog*/}
                <Dialog
                    open={addApplicationOpen}
                    onOpenChange={setAddApplicationOpen}
                >
                    <DialogTrigger
                        render={
                            <Button>
                                Add Application <Plus />
                            </Button>
                        }
                    />

                    <AddApplicationDialog
                        onManual={handleManualAdd}
                        onJobDescription={handleAIAdd}
                    />
                </Dialog>
                {/* analyze resume via job description dialog */}
                <Dialog
                    open={jobDescriptionOpen}
                    onOpenChange={setJobDescriptionOpen}
                >
                    <JobDescriptionDialog onExtract={handleExtract} />
                </Dialog>
                {/* add application manually dialog */}
                <Dialog
                    open={applicationModalOpen}
                    onOpenChange={setApplicationModalOpen}
                >
                    <ApplicationFormDialog
                        initialApplication={modalApplication}
                        handleSubmit={
                            editingApplication
                                ? (data) =>
                                      handleEditApplication(
                                          editingApplication.id,
                                          data
                                      )
                                : handleCreateApplication
                        }
                        onSuccess={() => {
                            setApplicationModalOpen(false);
                            setEditingApplication(null);
                            setInitialApplication(undefined);
                        }}
                        isEditing={!!editingApplication}
                        open={applicationModalOpen}
                    />
                </Dialog>
            </div>
            {/* application toolbar */}
            <ApplicationToolbar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                workArrangementFilter={workArrangementFilter}
                onWorkArrangementChange={setWorkArrangementFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onClearFilters={handleClearFilters}
            />
            <div className="flex w-full">
                {/* applications */}
                <main className="mt-6 grid w-full grid-cols-1 gap-4 px-4 md:grid-cols-2 xl:grid-cols-3">
                    {displayedApplications.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            {applications.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        ease: 'easeOut',
                                    }}
                                    className="col-span-full"
                                >
                                    <Empty className="py-20">
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <BriefcaseBusiness />
                                            </EmptyMedia>
                                            <EmptyTitle>
                                                No applications yet
                                            </EmptyTitle>
                                            <EmptyDescription>
                                                Start tracking your job search
                                                by adding your first
                                                application.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                </motion.div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold">
                                        No applications match your filters.
                                    </h2>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Try adjusting your search or filters.
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        displayedApplications.map((application, index) => (
                            <motion.div
                                key={application.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.2,
                                    delay: index * 0.02,
                                }}
                            >
                                <ApplicationCard
                                    application={application}
                                    onDelete={handleDeleteApplication}
                                    onEdit={handleEdit}
                                    onSelect={setSelectedApplication}
                                />
                            </motion.div>
                        ))
                    )}
                </main>
            </div>
            {/* detailed application dialog */}
            <ApplicationDetailsDialog
                application={selectedApplication}
                open={selectedApplication !== null}
                onDelete={handleDeleteApplication}
                onEdit={handleEdit}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedApplication(null);
                    }
                }}
                onAddFollowUp={handleAddFollowUp}
                onResumeAnalysis={handleResumeAnalysis}
            />
            {/* resume analysis dialog */}
            <ResumeAnalysisDialog
                application={selectedApplication}
                open={resumeAnalysisOpen}
                onOpenChange={setResumeAnalysisOpen}
                onCreateResumeMatch={handleCreateResumeMatch}
                resumeSource={resumeSource}
                savedResume={savedResume}
                initialView={resumeAnalysisView}
            />
            {/* choose saved or new resume to analyze dialog */}
            <Dialog open={chooseResumeOpen} onOpenChange={setChooseResumeOpen}>
                <ChooseResumeDialog
                    onSavedResume={handleSavedResume}
                    onAnotherResume={handleAnotherResume}
                    application={selectedApplication}
                    onPreviousAnalyses={handlePreviousAnalyses}
                />
            </Dialog>
            {/* add follow up dialog */}
            <Dialog open={followUpOpen} onOpenChange={setFollowUpOpen}>
                <FollowUpModal
                    initialFollowUp={undefined}
                    handleSubmit={handleCreateFollowUp}
                    onSuccess={() => {
                        setFollowUpOpen(false);
                    }}
                    applications={applications}
                    applicationId={selectedApplication?.id}
                    open={followUpOpen}
                />
            </Dialog>
        </>
    );
}

export default Applications;
