'use client';

import { useState } from 'react';
import { NavigationHeader } from './navigation-header';
import { AddMediaDialog } from './add-media-dialog';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<string>('');

  const handleItemAdded = () => {
    setIsAddDialogOpen(false);
    // Trigger a page refresh to show the new item
    window.location.reload();
  };

  const handleAddMedia = (mediaType: string) => {
    setSelectedMediaType(mediaType);
    setIsAddDialogOpen(true);
  };

  return (
    <>
      <NavigationHeader onAddMedia={handleAddMedia} />
      {children}
      <AddMediaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onItemAdded={handleItemAdded}
        defaultMediaType={selectedMediaType}
      />
    </>
  );
}
