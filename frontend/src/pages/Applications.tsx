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

function Applications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingApplication, setEditingApplication] =
        useState<Application | null>(null);

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
                getErrorMessage(err);
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
            getErrorMessage(err);
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
            getErrorMessage(err);
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
        } catch (err) {
            getErrorMessage(err);
        }
    }

    const handleAdd = () => {
        setEditingApplication(null);
        setOpen(true);
    };

    const handleEdit = (application: Application) => {
        setEditingApplication(application);
        setOpen(true);
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

    const handleClearFilters = () => {
        setSearch('');
        setStatusFilter(null);
        setWorkArrangementFilter(null);
        setSortBy('NEWEST');
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20 text-muted">
                Loading...
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between px-4">
                <h1 className="text-2xl font-extrabold">Applications</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger
                        render={
                            <Button onClick={handleAdd}>
                                Add Application <Plus />
                            </Button>
                        }
                    />
                    <ApplicationModal
                        initialApplication={
                            editingApplication
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
                                : undefined
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
                            setOpen(false);
                            setEditingApplication(null);
                        }}
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
                            />
                        ))
                    )}
                </main>
            </div>
        </>
    );
}

export default Applications;
