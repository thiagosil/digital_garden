'use client';

import { useState } from 'react';
import { NavigationHeader } from './navigation-header';
import { AddMediaDialog } from './add-media-dialog';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleItemAdded = () => {
    setIsAddDialogOpen(false);
    // Trigger a page refresh to show the new item
    window.location.reload();
  };

  return (
    <>
      <NavigationHeader onAddMedia={() => setIsAddDialogOpen(true)} />
      {children}
      <AddMediaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onItemAdded={handleItemAdded}
      />
    </>
  );
}
