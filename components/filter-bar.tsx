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
    <div className="mb-8 space-y-4">
      {/* Status Filters */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">STATUS</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value || 'all'}
              variant={statusFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Type Filters */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">MEDIA TYPE</h3>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((option) => (
            <Button
              key={option.value || 'all'}
              variant={typeFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeFilterChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
