'use client';

import { Button } from '@/components/ui/button';

interface FilterBarProps {
  statusFilter: string | null;
  typeFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
  onTypeFilterChange: (type: string | null) => void;
}

export function FilterBar({
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange,
}: FilterBarProps) {
  const statusOptions = [
    { value: null, label: 'All' },
    { value: 'BACKLOG', label: 'Backlog' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  const typeOptions = [
    { value: null, label: 'All Media' },
    { value: 'BOOK', label: 'Books' },
    { value: 'MOVIE', label: 'Movies' },
    { value: 'TV_SHOW', label: 'TV Shows' },
    { value: 'VIDEO_GAME', label: 'Video Games' },
  ];

  return (
    <div className="mb-12 sm:mb-16 space-y-8">
      {/* Status Filters */}
      <div>
        <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
          Status
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {statusOptions.map((option) => (
            <Button
              key={option.value || 'all'}
              variant={statusFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange(option.value)}
              className="font-medium"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Type Filters */}
      <div>
        <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
          Media Type
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {typeOptions.map((option) => (
            <Button
              key={option.value || 'all'}
              variant={typeFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeFilterChange(option.value)}
              className="font-medium"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
