import * as React from 'react';
import { format } from 'date-fns';

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

const applicationStatusItems = [
    { label: 'Applied', value: 'APPLIED' },
    { label: 'Screening', value: 'SCREENING' },
    { label: 'Interview', value: 'INTERVIEW' },
    { label: 'Offer', value: 'OFFER' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Withdrawn', value: 'WITHDRAWN' },
    { label: 'Ghosted', value: 'GHOSTED' },
];

const workArrangementItems = [
    { label: 'Onsite', value: 'ONSITE' },
    { label: 'Hybrid', value: 'HYBRID' },
    { label: 'Remote', value: 'REMOTE' },
];

const employmentTypeItems = [
    { label: 'Full-time', value: 'FULL_TIME' },
    { label: 'Part-time', value: 'PART_TIME' },
    { label: 'Contract', value: 'CONTRACT' },
    { label: 'Internship', value: 'INTERNSHIP' },
    { label: 'Temporary', value: 'TEMPORARY' },
];

const jobSourceItems = [
    { label: 'LinkedIn', value: 'LINKEDIN' },
    { label: 'Referral', value: 'REFERRAL' },
    { label: 'Company Website', value: 'COMPANY_WEBSITE' },
    { label: 'Cold Email', value: 'COLD_EMAIL' },
    { label: 'Career Fair', value: 'CAREER_FAIR' },
    { label: 'Other', value: 'OTHER' },
];

function AddApplicationModal() {
    const [date, setDate] = React.useState<Date>();
    return (
        <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Add application</DialogTitle>
                <DialogDescription>
                    Add your job application here. Click save when you&apos;re
                    done.
                </DialogDescription>
            </DialogHeader>
            <form className="flex-1 overflow-y-auto pr-6" action="">
                <FieldGroup className="px-2">
                    <Field>
                        <FieldLabel htmlFor="company">Company</FieldLabel>
                        <Input
                            id="company"
                            name="company"
                            placeholder="Google"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="position">Position</FieldLabel>
                        <Input
                            id="position"
                            name="position"
                            placeholder="Software Engineer"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="jobUrl">Job Url</FieldLabel>
                        <Input
                            id="jobUrl"
                            name="jobUrl"
                            placeholder="https://..."
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select application status" />
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
                                        data-empty={!date}
                                        className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                                    >
                                        {date ? (
                                            format(date, 'PPP')
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
                                    selected={date}
                                    onSelect={setDate}
                                    defaultMonth={date}
                                />
                            </PopoverContent>
                        </Popover>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="location">Location</FieldLabel>
                            <Input
                                id="location"
                                name="location"
                                placeholder="NYC"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="workArrangement">
                                Work Arrangement
                            </FieldLabel>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select work arrangement" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Work Arrangement
                                        </SelectLabel>
                                        {workArrangementItems.map((item) => (
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
                            <FieldLabel htmlFor="employmentType">
                                Employment Type
                            </FieldLabel>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select employment type" />
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
                            <FieldLabel htmlFor="source">Job Source</FieldLabel>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select job source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Job Source</SelectLabel>
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
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="notes">Notes</FieldLabel>
                        <Textarea
                            id="notes"
                            placeholder="Add any notes about this application..."
                        />
                    </Field>
                </FieldGroup>
            </form>
            <DialogFooter className="sm:justify-around">
                <DialogClose
                    render={<Button variant="outline">Cancel</Button>}
                />
                <Button type="submit">Save</Button>
            </DialogFooter>
        </DialogContent>
    );
}

export default AddApplicationModal;
