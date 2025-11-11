'use client';

interface BookshelfTabsProps {
  activeTab: string | null;
  onTabChange: (status: string | null) => void;
  mediaType: string;
}

export function BookshelfTabs({ activeTab, onTabChange, mediaType }: BookshelfTabsProps) {
  // Dynamic labels based on media type
  const getLabels = () => {
    switch (mediaType) {
      case 'BOOK':
        return {
          backlog: 'WANT TO READ',
          inProgress: 'READING',
          completed: 'READ'
        };
      case 'MOVIE':
        return {
          backlog: 'WANT TO WATCH',
          inProgress: 'WATCHING',
          completed: 'WATCHED'
        };
      case 'TV_SHOW':
        return {
          backlog: 'WANT TO WATCH',
          inProgress: 'WATCHING',
          completed: 'WATCHED'
        };
      case 'VIDEO_GAME':
        return {
          backlog: 'WANT TO PLAY',
          inProgress: 'PLAYING',
          completed: 'PLAYED'
        };
      default:
        return {
          backlog: 'BACKLOG',
          inProgress: 'IN PROGRESS',
          completed: 'COMPLETED'
        };
    }
  };

  const labels = getLabels();
  const tabs = [
    { value: 'BACKLOG', label: labels.backlog },
    { value: 'IN_PROGRESS', label: labels.inProgress },
    { value: 'COMPLETED', label: labels.completed },
  ];

  return (
    <div className="mb-12 sm:mb-16 border-b border-border">
      <nav className="flex gap-1 sm:gap-2 -mb-px overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              py-4 sm:py-4 px-6 sm:px-8 text-sm sm:text-base tracking-wide transition-all relative whitespace-nowrap flex-shrink-0 min-h-[48px] snap-center
              ${
                activeTab === tab.value
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground font-medium hover:text-foreground'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
