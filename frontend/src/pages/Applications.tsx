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

function Applications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingApplication, setEditingApplication] =
        useState<Application | null>(null);

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
            <div className="flex w-full">
                {/* applications */}
                <main className="mt-6 grid w-full grid-cols-1 gap-4 px-4 md:grid-cols-2 xl:grid-cols-3">
                    {loading ? (
                        <div>Loading applications...</div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h2 className="text-xl font-bold">
                                You have no applications!
                            </h2>
                        </div>
                    ) : (
                        applications.map((application) => (
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
