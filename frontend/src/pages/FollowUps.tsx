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
import { FollowUpFilter } from '@/types/followUp';

function FollowUps() {
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(
        null
    );
    const [applications, setApplications] = useState<Application[]>([]);
    const [filter, setFilter] = useState<FollowUpFilter>('ALL');

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
                prev.map((followUp) =>
                    followUp.id === followUpId
                        ? response.updatedFollowUp
                        : followUp
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

    const handleCompleteFollowUp = async (
        followUpId: number,
        completed: boolean
    ) => {
        const followUp = followUps.find((f) => f.id === followUpId);

        if (!followUp) return;

        // updates UI immediately
        setFollowUps((prev) =>
            prev.map((f) => (f.id === followUpId ? { ...f, completed } : f))
        );

        try {
            await editFollowUpRequest(followUpId, {
                title: followUp.title,
                dueDate: followUp.dueDate,
                type: followUp.type,
                notes: followUp.notes,
                applicationId: followUp.applicationId,
                completed,
            });
        } catch (err) {
            // reverts if request fails
            setFollowUps((prev) =>
                prev.map((f) =>
                    f.id === followUpId ? { ...f, completed: !completed } : f
                )
            );

            setError(getErrorMessage(err));
        }
    };

    const handleAdd = () => {
        setEditingFollowUp(null);
        setOpen(true);
    };

    const handleEdit = (followUp: FollowUp) => {
        setEditingFollowUp(followUp);
        setOpen(true);
    };

    const filteredFollowUps = followUps
        .filter((followUp) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dueDate = new Date(followUp.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            switch (filter) {
                case 'ALL':
                    return true;
                case 'UPCOMING':
                    return !followUp.completed && dueDate >= today;
                case 'OVERDUE':
                    return !followUp.completed && dueDate < today;
                case 'COMPLETED':
                    return followUp.completed;
            }
        })
        .sort((a, b) => {
            if (filter === 'ALL') {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
            }

            return 0;
        });

    if (loading) {
        return (
            <div className="flex justify-center py-20 text-muted">
                Loading...
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between px-4 pt-2">
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
                                      completed: editingFollowUp.completed,
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
            <div className="mx-4 mt-6 flex gap-2 border-b border-border pb-3">
                {(
                    [
                        'ALL',
                        'UPCOMING',
                        'OVERDUE',
                        'COMPLETED',
                    ] as FollowUpFilter[]
                ).map((option) => (
                    <Button
                        key={option}
                        variant={filter === option ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter(option)}
                    >
                        {option.charAt(0) + option.slice(1).toLowerCase()}
                    </Button>
                ))}
            </div>
            <div className="flex w-full">
                {/* follow ups */}
                <main className="mt-6 flex w-full flex-col gap-3 px-4 lg:max-w-4xl">
                    {filteredFollowUps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h2 className="text-xl font-bold">
                                {followUps.length === 0
                                    ? 'You have no follow-ups!'
                                    : filter === 'UPCOMING'
                                      ? 'No upcoming follow-ups!'
                                      : filter === 'OVERDUE'
                                        ? 'You have no overdue follow-ups!'
                                        : filter === 'COMPLETED'
                                          ? 'You have no completed follow-ups!'
                                          : 'You have no follow-ups!'}
                            </h2>
                        </div>
                    ) : (
                        filteredFollowUps.map((followUp) => (
                            <FollowUpCard
                                key={followUp.id}
                                followUp={followUp}
                                onDelete={handleDeleteFollowUp}
                                onEdit={handleEdit}
                                onToggleComplete={handleCompleteFollowUp}
                            />
                        ))
                    )}
                </main>
            </div>
        </>
    );
}

export default FollowUps;
