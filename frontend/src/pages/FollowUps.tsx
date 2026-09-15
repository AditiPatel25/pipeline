import { getApplicationsRequest } from '@/api/application';
import {
    createFollowUpRequest,
    deleteFollowUpRequest,
    editFollowUpRequest,
    getAllFollowUpsRequest,
} from '@/api/followUp';
import FollowUpCard from '@/components/FollowUps/FollowUpCard';
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
import { Application } from '@/types/application';
import { FollowUp, FollowUpData, FollowUpFilter } from '@/types/followUp';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { CalendarCheck, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

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
            toast.success('Follow-up deleted');
        } catch (err) {
            toast.error(getErrorMessage(err));
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

            return (
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
        });

    if (loading) {
        return (
            <main className="mt-6 flex w-full flex-col gap-3 px-4 lg:max-w-6xl">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-border bg-card p-3 px-4 shadow-sm"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <Skeleton className="size-5 rounded-sm" />

                                <Skeleton className="h-6 w-40" />

                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>

                            <Skeleton className="h-5 w-12" />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <Skeleton className="h-4 w-56" />

                            <div className="flex gap-2">
                                <Skeleton className="size-9 rounded-md" />
                                <Skeleton className="size-9 rounded-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </main>
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
                        open={open}
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
            <div className="flex w-full justify-center">
                <main className="mt-6 flex w-full max-w-6xl flex-col gap-3 px-4">
                    {filteredFollowUps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            {followUps.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <CalendarCheck />
                                            </EmptyMedia>
                                            <EmptyTitle>
                                                No follow-ups yet
                                            </EmptyTitle>
                                            <EmptyDescription>
                                                Keep track of interviews,
                                                recruiter outreach, and other
                                                important next steps by adding a
                                                follow-up.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                </motion.div>
                            ) : filter === 'UPCOMING' ||
                              filter === 'OVERDUE' ||
                              filter === 'COMPLETED' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <CalendarCheck />
                                            </EmptyMedia>
                                            <EmptyTitle>
                                                No follow-ups match your filter
                                            </EmptyTitle>
                                            <EmptyDescription>
                                                Try selecting a different filter
                                                to see your follow-ups.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                </motion.div>
                            ) : (
                                'You have no follow-ups!'
                            )}
                        </div>
                    ) : (
                        filteredFollowUps.map((followUp, index) => (
                            <motion.div
                                key={followUp.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.2,
                                    delay: index * 0.02,
                                }}
                            >
                                <FollowUpCard
                                    followUp={followUp}
                                    onDelete={handleDeleteFollowUp}
                                    onEdit={handleEdit}
                                    onToggleComplete={handleCompleteFollowUp}
                                />
                            </motion.div>
                        ))
                    )}
                </main>
            </div>
        </>
    );
}

export default FollowUps;
