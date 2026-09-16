import { followUpTypeItems } from '@/constants/followUp';
import { Application } from '@/types/application';
import { FollowUpData, FollowUpType } from '@/types/followUp';
import { getLabel } from '@/utils/getLabel';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';

import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';

const emptyFollowUp: FollowUpData = {
    title: '',
    dueDate: '',
    type: 'ASSESSMENT',
    notes: '',
    applicationId: -1,
    completed: false,
};

type FollowUpModalProps = {
    initialFollowUp?: FollowUpData;
    handleSubmit: (application: FollowUpData) => Promise<void>;
    onSuccess: () => void;
    applications: Application[];
    applicationId?: number;
    open: boolean;
};

function FollowUpModal({
    initialFollowUp,
    applications,
    handleSubmit,
    onSuccess,
    applicationId,
    open,
}: FollowUpModalProps) {
    const [followUp, setFollowUp] = useState<FollowUpData>(
        initialFollowUp ?? {
            ...emptyFollowUp,
            applicationId: applicationId ?? -1,
        }
    );
    const [applicationSearch, setApplicationSearch] = useState('');

    const [error, setError] = useState('');

    const [fieldErrors, setFieldErrors] = useState({
        dueDate: false,
        title: false,
        application: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setFollowUp(
            initialFollowUp ?? {
                ...emptyFollowUp,
                applicationId: applicationId ?? -1,
            }
        );

        setApplicationSearch('');

        setFieldErrors({
            application: false,
            dueDate: false,
            title: false,
        });

        setError('');
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFollowUp((prev) => ({
            ...prev,
            [name]: value,
        }));

        setFieldErrors((prev) => ({
            ...prev,
            [name]: false,
        }));
        setError('');
    };

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            title: !followUp.title.trim(),
            dueDate: !followUp.dueDate,
            application: followUp.applicationId === -1,
        };

        setFieldErrors(errors);

        if (Object.values(errors).some(Boolean)) {
            setError('Application, title, and due date are required.');
            return;
        }

        try {
            setIsSubmitting(true);
            await handleSubmit(followUp);
            isEditing
                ? toast.success('Follow-up updated successfully')
                : toast.success('Follow-up added');
            resetForm();
            onSuccess();
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEditing = !!initialFollowUp;
    const isApplicationSpecific = applicationId !== undefined || isEditing;
    const selectedApplicationId =
        applicationId ?? initialFollowUp?.applicationId;

    const selectedApplication = applications.find(
        (application) => application.id === selectedApplicationId
    );

    const filteredApplications = applications
        .filter((application) => {
            const search = applicationSearch.toLowerCase();

            return (
                application.company.toLowerCase().includes(search) ||
                application.position.toLowerCase().includes(search)
            );
        })
        .slice(0, applicationSearch ? undefined : 5);

    useEffect(() => {
        setFollowUp(
            initialFollowUp ?? {
                ...emptyFollowUp,
                applicationId: applicationId ?? -1,
            }
        );
    }, [initialFollowUp?.applicationId, applicationId, open]);
    return (
        <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>
                    {isEditing ? 'Edit follow-up' : 'Add follow-up'}
                </DialogTitle>
                <DialogDescription>
                    Add your follow-up here. Click save when you&apos;re done.
                </DialogDescription>
            </DialogHeader>
            {error && (
                <div className="w-full max-w-md rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                    {error}
                </div>
            )}
            <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
                <div className="flex-1 overflow-y-auto pr-6 pb-4">
                    <FieldGroup className="px-2">
                        <Field>
                            <FieldLabel>Application</FieldLabel>
                            {isApplicationSpecific ? (
                                <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm">
                                    {selectedApplication
                                        ? `${selectedApplication.company} — ${selectedApplication.position}`
                                        : 'Application not found'}
                                </div>
                            ) : (
                                <Combobox
                                    items={filteredApplications}
                                    itemToStringValue={(
                                        application: Application
                                    ) =>
                                        `${application.company} — ${application.position}`
                                    }
                                    onValueChange={(selectedValue) => {
                                        const value =
                                            selectedValue as unknown as string;
                                        if (!value) return;

                                        const selected = applications.find(
                                            (app) =>
                                                `${app.company} - ${app.position}` ===
                                                value
                                        );

                                        if (!selected) return;

                                        setFollowUp((prev) => ({
                                            ...prev,
                                            applicationId: selected.id,
                                        }));

                                        setFieldErrors((prev) => ({
                                            ...prev,
                                            application: false,
                                        }));

                                        setError('');

                                        setApplicationSearch('');
                                    }}
                                    onInputValueChange={(value) => {
                                        setApplicationSearch(value);
                                    }}
                                >
                                    <ComboboxInput
                                        className={`rounded-md border bg-muted/50 px-3 py-2 text-sm ${
                                            fieldErrors.application
                                                ? 'border-red-500'
                                                : ''
                                        }`}
                                        placeholder="Search applications..."
                                    />

                                    <ComboboxContent>
                                        <ComboboxEmpty>
                                            No applications found.
                                        </ComboboxEmpty>

                                        <ComboboxList>
                                            {(application) => (
                                                <ComboboxItem
                                                    key={application.id}
                                                    value={`${application.company} - ${application.position}`}
                                                >
                                                    {application.company} —{' '}
                                                    {application.position}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input
                                id="title"
                                name="title"
                                placeholder="OA"
                                onChange={handleChange}
                                value={followUp.title}
                                className={
                                    fieldErrors.title ? 'border-red-500' : ''
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="type">Type</FieldLabel>
                            <Select
                                value={followUp.type}
                                onValueChange={(value) =>
                                    setFollowUp((prev) => ({
                                        ...prev,
                                        type: value as FollowUpType,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select follow-up type">
                                        {followUp.type &&
                                            getLabel(
                                                followUpTypeItems,
                                                followUp.type
                                            )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Type</SelectLabel>
                                        {followUpTypeItems.map((item) => (
                                            <SelectItem
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="dateDue">Date Due</FieldLabel>
                            <Popover>
                                <PopoverTrigger
                                    render={
                                        <Button
                                            variant={'outline'}
                                            data-empty={!followUp.dueDate}
                                            className={`w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-popover border-input ${
                                                fieldErrors.dueDate
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                        >
                                            {followUp.dueDate ? (
                                                format(
                                                    new Date(followUp.dueDate),
                                                    'PPP'
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <ChevronDownIcon data-icon="inline-end" />
                                        </Button>
                                    }
                                />
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        defaultMonth={
                                            followUp.dueDate
                                                ? new Date(followUp.dueDate)
                                                : new Date()
                                        }
                                        selected={
                                            followUp.dueDate
                                                ? new Date(followUp.dueDate)
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            setFollowUp((prev) => ({
                                                ...prev,
                                                dueDate: date
                                                    ? date.toISOString()
                                                    : '',
                                            }));

                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                dueDate: false,
                                            }));

                                            setError('');
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="notes">Notes</FieldLabel>
                            <Textarea
                                id="notes"
                                placeholder="Add any notes about this follow-up..."
                                onChange={handleChange}
                                name="notes"
                                value={followUp.notes}
                            />
                        </Field>
                    </FieldGroup>
                </div>

                <DialogFooter className="sm:justify-around">
                    <DialogClose
                        render={
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                            >
                                Cancel
                            </Button>
                        }
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Spinner />
                                {isEditing ? 'Saving...' : 'Adding...'}
                            </>
                        ) : isEditing ? (
                            'Save changes'
                        ) : (
                            'Save'
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}

export default FollowUpModal;
