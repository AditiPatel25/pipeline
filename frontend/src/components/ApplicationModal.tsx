import { format } from 'date-fns';
import { ApplicationData } from '@/types/application';
import { useState, useEffect } from 'react';
import { getLabel } from '@/utils/getLabel';

import {
    ApplicationSource,
    WorkArrangement,
    EmploymentType,
    Status,
} from '@/types/application';
import {
    workArrangementItems,
    jobSourceItems,
    employmentTypeItems,
    applicationStatusItems,
} from '@/constants/application';

import { Button } from '@/components/ui/button';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldDescription,
} from '@/components/ui/field';
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

import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const emptyApplication: ApplicationData = {
    company: '',
    position: '',
    jobUrl: '',
    description: '',
    status: 'APPLIED',
    appliedDate: '',
    source: null,
    location: '',
    workArrangement: null,
    employmentType: null,
    notes: '',
};

type ApplicationModalProps = {
    initialApplication?: ApplicationData;
    handleSubmit: (application: ApplicationData) => Promise<void>;
    onSuccess: () => void;
};

function ApplicationModal({
    initialApplication,
    handleSubmit,
    onSuccess,
}: ApplicationModalProps) {
    const [application, setApplication] = useState<ApplicationData>(
        initialApplication ?? emptyApplication
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setApplication((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await handleSubmit(application);
            onSuccess();
        } catch (err) {
            // Keep modal open if submission fails
        }
    };

    const isEditing = !!initialApplication;

    useEffect(() => {
        setApplication(initialApplication ?? emptyApplication);
    }, [initialApplication]);

    return (
        <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>
                    {isEditing ? 'Edit application' : 'Add application'}
                </DialogTitle>
                <DialogDescription>
                    Add your job application here. Click save when you&apos;re
                    done.
                </DialogDescription>
            </DialogHeader>
            <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
                <div className="flex-1 overflow-y-auto pr-6 pb-4">
                    <FieldGroup className="px-2">
                        <Field>
                            <FieldLabel htmlFor="company">Company</FieldLabel>
                            <Input
                                id="company"
                                name="company"
                                placeholder="Google"
                                onChange={handleChange}
                                value={application.company}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="position">Position</FieldLabel>
                            <Input
                                id="position"
                                name="position"
                                placeholder="Software Engineer"
                                onChange={handleChange}
                                value={application.position}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="jobUrl">Job Url</FieldLabel>
                            <Input
                                id="jobUrl"
                                name="jobUrl"
                                placeholder="https://..."
                                onChange={handleChange}
                                value={application.jobUrl}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <Select
                                value={application.status}
                                onValueChange={(value) =>
                                    setApplication((prev) => ({
                                        ...prev,
                                        status: value as Status,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select application status">
                                        {application.status &&
                                            getLabel(
                                                applicationStatusItems,
                                                application.status
                                            )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Application Status
                                        </SelectLabel>
                                        {applicationStatusItems.map((item) => (
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
                            <FieldLabel htmlFor="dateApplied">
                                Date Applied
                            </FieldLabel>
                            <Popover>
                                <PopoverTrigger
                                    render={
                                        <Button
                                            variant={'outline'}
                                            data-empty={
                                                !application.appliedDate
                                            }
                                            className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-popover border-input"
                                        >
                                            {application.appliedDate ? (
                                                format(
                                                    new Date(
                                                        application.appliedDate
                                                    ),
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
                                            application.appliedDate
                                                ? new Date(
                                                      application.appliedDate
                                                  )
                                                : new Date()
                                        }
                                        selected={
                                            application.appliedDate
                                                ? new Date(
                                                      application.appliedDate
                                                  )
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            setApplication((prev) => ({
                                                ...prev,
                                                appliedDate: date
                                                    ? date.toISOString()
                                                    : '',
                                            }))
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="location">
                                    Location
                                </FieldLabel>
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="NYC"
                                    onChange={handleChange}
                                    value={application.location}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="workArrangement">
                                    Work Arrangement
                                </FieldLabel>
                                <Select
                                    value={
                                        application.workArrangement ?? 'None'
                                    }
                                    onValueChange={(value) =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            workArrangement:
                                                value === 'None'
                                                    ? null
                                                    : (value as WorkArrangement),
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select work arrangement">
                                            {application.workArrangement &&
                                                getLabel(
                                                    workArrangementItems,
                                                    application.workArrangement
                                                )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Work Arrangement
                                            </SelectLabel>
                                            {workArrangementItems.map(
                                                (item) => (
                                                    <SelectItem
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="employmentType">
                                    Employment Type
                                </FieldLabel>
                                <Select
                                    value={application.employmentType ?? 'None'}
                                    onValueChange={(value) =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            employmentType:
                                                value === 'None'
                                                    ? null
                                                    : (value as EmploymentType),
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select employment type">
                                            {application.employmentType &&
                                                getLabel(
                                                    employmentTypeItems,
                                                    application.employmentType
                                                )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Employment Type
                                            </SelectLabel>
                                            {employmentTypeItems.map((item) => (
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
                                <FieldLabel htmlFor="source">
                                    Job Source
                                </FieldLabel>
                                <Select
                                    value={application.source ?? 'None'}
                                    onValueChange={(value) =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            source:
                                                value === 'None'
                                                    ? null
                                                    : (value as ApplicationSource),
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select job source">
                                            {application.source &&
                                                getLabel(
                                                    jobSourceItems,
                                                    application.source
                                                )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Job Source
                                            </SelectLabel>
                                            {jobSourceItems.map((item) => (
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
                        </div>
                        <Field>
                            <FieldLabel htmlFor="description">
                                Job Description
                            </FieldLabel>
                            <FieldDescription>
                                Paste the job description here for reference.
                            </FieldDescription>
                            <Textarea
                                id="description"
                                placeholder="Type your message here."
                                onChange={handleChange}
                                name="description"
                                value={application.description}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="notes">Notes</FieldLabel>
                            <Textarea
                                id="notes"
                                placeholder="Add any notes about this application..."
                                onChange={handleChange}
                                name="notes"
                                value={application.notes}
                            />
                        </Field>
                    </FieldGroup>
                </div>

                <DialogFooter className="sm:justify-around">
                    <DialogClose
                        render={
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        }
                    />
                    <Button type="submit">
                        {isEditing ? 'Save changes' : 'Save'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}

export default ApplicationModal;
