import {
    createFollowUpRequest,
    deleteFollowUpRequest,
    editFollowUpRequest,
    getAllFollowUpsRequest,
} from '@/api/followUp';
import { FollowUp, FollowUpData } from '@/types/followUp';
import { useState, useEffect } from 'react';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FollowUpCard from '@/components/FollowUpCard';
import FollowUpModal from '@/components/FollowUpModal';
import { getApplicationsRequest } from '@/api/application';
import { Application } from '@/types/application';

function FollowUps() {
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(
        null
    );
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const fetchFollowUps = async () => {
            try {
                const [followUpsResponse, applicationsResponse] =
                    await Promise.all([
                        getAllFollowUpsRequest(),
                        getApplicationsRequest(),
                    ]);
                setFollowUps(followUpsResponse.followUps);
                setApplications(applicationsResponse.applications);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        fetchFollowUps();
    }, []);

    const handleCreateFollowUp = async (followUp: FollowUpData) => {
        try {
            const response = await createFollowUpRequest(followUp);

            setFollowUps((prev) => [...prev, response.followUp]);

            setError('');
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    };

    const handleEditFollowUp = async (
        followUpId: number,
        followUp: FollowUpData
    ) => {
        try {
            const response = await editFollowUpRequest(followUpId, followUp);

            setFollowUps((prev) =>
                prev.map((app) =>
                    app.id === followUpId ? response.updatedFollowUp : app
                )
            );
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    async function handleDeleteFollowUp(followUpId: number) {
        try {
            await deleteFollowUpRequest(followUpId);
            setFollowUps((followUps) =>
                followUps.filter((followUp) => followUp.id !== followUpId)
            );
            // setSelectedApplication(null);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    const handleAdd = () => {
        setEditingFollowUp(null);
        setOpen(true);
    };

    const handleEdit = (followUp: FollowUp) => {
        setEditingFollowUp(followUp);
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
                <h1 className="text-2xl font-extrabold">Follow-Ups</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger
                        render={
                            <Button onClick={handleAdd}>
                                Add Follow-up <Plus />
                            </Button>
                        }
                    />
                    <FollowUpModal
                        initialFollowUp={
                            editingFollowUp
                                ? {
                                      applicationId:
                                          editingFollowUp.applicationId,
                                      title: editingFollowUp.title,
                                      dueDate: editingFollowUp.dueDate,
                                      type: editingFollowUp.type,
                                      notes: editingFollowUp.notes,
                                  }
                                : undefined
                        }
                        handleSubmit={
                            editingFollowUp
                                ? (data: FollowUpData) =>
                                      handleEditFollowUp(
                                          editingFollowUp.id,
                                          data
                                      )
                                : handleCreateFollowUp
                        }
                        onSuccess={() => {
                            setOpen(false);
                            setEditingFollowUp(null);
                        }}
                        applications={applications}
                    />
                </Dialog>
            </div>
            <div className="flex w-full">
                {/* follow ups */}
                <main className="mt-6 grid w-full grid-cols-1 gap-4 px-4 md:grid-cols-2 xl:grid-cols-3">
                    {followUps.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <h2 className="text-xl font-bold">
                                You have no follow-ups!
                            </h2>
                        </div>
                    ) : (
                        followUps.map((followUp) => (
                            <FollowUpCard
                                key={followUp.id}
                                followUp={followUp}
                                onDelete={handleDeleteFollowUp}
                                onEdit={handleEdit}
                            />
                        ))
                    )}
                </main>
            </div>
        </>
    );
}

export default FollowUps;
