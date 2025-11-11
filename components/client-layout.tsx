'use client';

import { NavigationHeader } from './navigation-header';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <NavigationHeader />
      {children}
    </>
  );
}
