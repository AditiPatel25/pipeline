import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    createApplicationRequest,
    deleteApplicationRequest,
    getApplicationsRequest,
    editApplicationRequest,
} from '@/api/application';
import ApplicationCard from '@/components/ApplicationCard';
import type { Application, ApplicationData } from '@/types/application';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ApplicationModal from '@/components/ApplicationModal';
import { getErrorMessage } from '@/utils/getErrorMessage';
import ApplicationToolbar from '@/components/ApplicationToolbar';
import ApplicationDetailsDialog from '@/components/ApplicationDetailsDialog';
import { FollowUpData } from '@/types/followUp';
import { createFollowUpRequest } from '@/api/followUp';
import FollowUpModal from '@/components/FollowUpModal';
import { Skeleton } from '@/components/ui/skeleton';
import AddApplicationDialog from '@/components/AddApplicationDialog';
import JobDescriptionDialog from '@/components/JobDescriptionDialog';
import { extractApplicationRequest } from '@/api/ai';

function Applications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [addApplicationOpen, setAddApplicationOpen] = useState(false);
    const [jobDescriptionOpen, setJobDescriptionOpen] = useState(false);
    const [applicationModalOpen, setApplicationModalOpen] = useState(false);

    const [initialApplication, setInitialApplication] = useState<
        ApplicationData | undefined
    >();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingApplication, setEditingApplication] =
        useState<Application | null>(null);
    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);
    const [followUpOpen, setFollowUpOpen] = useState(false);

    // application toolbar
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [workArrangementFilter, setWorkArrangementFilter] = useState<
        string | null
    >(null);
    const [sortBy, setSortBy] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getApplicationsRequest();
                setApplications(response.applications);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const handleCreateApplication = async (application: ApplicationData) => {
        try {
            const response = await createApplicationRequest(application);

            setApplications((prev) => [...prev, response.application]);

            setError('');
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    };

    const handleEditApplication = async (
        applicationId: number,
        application: ApplicationData
    ) => {
        try {
            const response = await editApplicationRequest(
                applicationId,
                application
            );

            setApplications((prev) =>
                prev.map((app) =>
                    app.id === applicationId ? response.updatedApplication : app
                )
            );
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

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
            setError(getErrorMessage(err));
        }
    }

    const handleCreateFollowUp = async (followUp: FollowUpData) => {
        try {
            const response = await createFollowUpRequest(followUp);

            setApplications((prev) =>
                prev.map((application) =>
                    application.id === followUp.applicationId
                        ? {
                              ...application,
                              followUps: [
                                  ...application.followUps,
                                  response.followUp,
                              ],
                          }
                        : application
                )
            );

            setError('');
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    };

    const handleExtract = async (jobDescription: string) => {
        const extractedInfo = await extractApplicationRequest(jobDescription);

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
    };

    const handleManualAdd = () => {
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

    const handleClearFilters = () => {
        setSearch('');
        setStatusFilter(null);
        setWorkArrangementFilter(null);
        setSortBy('NEWEST');
    };

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

    const getTimestamp = (date: string | undefined) =>
        date ? new Date(date).getTime() : null;

    const displayedApplications = [...filteredApplications].sort((a, b) => {
        switch (sortBy) {
            case 'NEWEST':
                return (
                    (b.appliedDate ? new Date(b.appliedDate).getTime() : 0) -
                    (a.appliedDate ? new Date(a.appliedDate).getTime() : 0)
                );

            case 'OLDEST': {
                const aDate = getTimestamp(a.appliedDate);
                const bDate = getTimestamp(b.appliedDate);

                if (aDate === null) return 1;
                if (bDate === null) return -1;

                return aDate - bDate;
            }

            case 'COMPANY_ASC':
                return a.company.localeCompare(b.company);

            case 'COMPANY_DESC':
                return b.company.localeCompare(a.company);

            default:
                return 0;
        }
    });

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
                            {/* Company + Status */}
                            <div className="flex items-center justify-between gap-4">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>

                            {/* Position */}
                            <Skeleton className="mt-2 h-4 w-40" />

                            {/* Details */}
                            <div className="mt-4 space-y-2 flex gap-2">
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
                <Dialog
                    open={addApplicationOpen}
                    onOpenChange={setAddApplicationOpen}
                >
                    <DialogTrigger
                        render={
                            <Button onClick={() => setEditingApplication(null)}>
                                Add Application <Plus />
                            </Button>
                        }
                    />

                    <AddApplicationDialog
                        onManual={handleManualAdd}
                        onJobDescription={handleAIAdd}
                    />
                </Dialog>

                <Dialog
                    open={jobDescriptionOpen}
                    onOpenChange={setJobDescriptionOpen}
                >
                    <JobDescriptionDialog onExtract={handleExtract} />
                </Dialog>

                <Dialog
                    open={applicationModalOpen}
                    onOpenChange={setApplicationModalOpen}
                >
                    <ApplicationModal
                        initialApplication={
                            initialApplication ??
                            (editingApplication
                                ? {
                                      company: editingApplication.company,
                                      position: editingApplication.position,
                                      jobUrl: editingApplication.jobUrl,
                                      description:
                                          editingApplication.description,
                                      status: editingApplication.status,
                                      appliedDate:
                                          editingApplication.appliedDate,
                                      source: editingApplication.source,
                                      location: editingApplication.location,
                                      workArrangement:
                                          editingApplication.workArrangement,
                                      employmentType:
                                          editingApplication.employmentType,
                                      notes: editingApplication.notes,
                                  }
                                : undefined)
                        }
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
                    />
                </Dialog>
            </div>
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
                            <h2 className="text-xl font-bold">
                                {applications.length === 0
                                    ? 'You have no applications!'
                                    : 'No applications match your filters.'}
                            </h2>
                        </div>
                    ) : (
                        displayedApplications.map((application) => (
                            <ApplicationCard
                                key={application.id}
                                application={application}
                                onDelete={handleDeleteApplication}
                                onEdit={handleEdit}
                                onSelect={setSelectedApplication}
                            />
                        ))
                    )}
                </main>
            </div>
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
            />
            <Dialog open={followUpOpen} onOpenChange={setFollowUpOpen}>
                <FollowUpModal
                    initialFollowUp={undefined}
                    handleSubmit={handleCreateFollowUp}
                    onSuccess={() => {
                        setFollowUpOpen(false);
                    }}
                    applications={applications}
                    applicationId={selectedApplication?.id}
                />
            </Dialog>
        </>
    );
}

export default Applications;
