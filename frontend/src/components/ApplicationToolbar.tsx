import { Search } from 'lucide-react';
import { getLabel } from '@/utils/getLabel';
import { sortItems } from '@/types/application';

import { Button } from '@/components/ui/button';
import {
    workArrangementItems,
    applicationStatusItems,
} from '@/constants/application';

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type ApplicationToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;

    statusFilter: string | null;
    onStatusChange: (value: string | null) => void;

    workArrangementFilter: string | null;
    onWorkArrangementChange: (value: string | null) => void;

    sortBy: string | null;
    onSortChange: (value: string | null) => void;

    onClearFilters: () => void;
};

function ApplicationToolbar({
    search,
    onSearchChange,
    statusFilter,
    onStatusChange,
    workArrangementFilter,
    onWorkArrangementChange,
    sortBy,
    onSortChange,
    onClearFilters,
}: ApplicationToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 m-4">
            {/* search */}
            <InputGroup className="w-full sm:w-72">
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupInput
                    placeholder="Search applications or positions..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </InputGroup>

            {/* status filter */}
            <div className="flex items-center">
                <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                        onStatusChange(value);
                    }}
                >
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Application Status">
                            {statusFilter
                                ? getLabel(applicationStatusItems, statusFilter)
                                : undefined}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        {applicationStatusItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {statusFilter && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-8 w-8"
                        onClick={() => onStatusChange(null)}
                        aria-label="Clear status filter"
                    >
                        ×
                    </Button>
                )}
            </div>

            {/* work arrangement filter */}
            <div className="flex items-center">
                <Select
                    value={workArrangementFilter}
                    onValueChange={(value) => {
                        onWorkArrangementChange(value);
                    }}
                >
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Work Arrangement">
                            {workArrangementFilter
                                ? getLabel(
                                      workArrangementItems,
                                      workArrangementFilter
                                  )
                                : undefined}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        {workArrangementItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {workArrangementFilter && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-8 w-8"
                        onClick={() => onWorkArrangementChange(null)}
                        aria-label="Clear work arrangement filter"
                    >
                        ×
                    </Button>
                )}
            </div>

            {/* sort by */}
            <Select
                value={sortBy}
                onValueChange={(value) => {
                    if (value !== null) {
                        onSortChange(value);
                    }
                }}
            >
                <SelectTrigger className="w-45">
                    <SelectValue placeholder="Sort by">
                        {sortBy ? getLabel(sortItems, sortBy) : undefined}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    {sortItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* clear all */}
            {(search || statusFilter || workArrangementFilter) && (
                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                    Clear filters
                </Button>
            )}
        </div>
    );
}

export default ApplicationToolbar;
