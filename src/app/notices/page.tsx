"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { NoticeList } from '@/components/NoticeList';
import { PageHeader } from '@/components/PageHeader';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#111c2a] p-4 md:p-6 lg:p-8">
      <div className="bg-transparent w-full">
        <div className="flex flex-col h-full glass rounded-[2.5rem] overflow-hidden">
          <PageHeader title="Notice Board" />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-7xl mx-auto space-y-10">
                {/* Dashboard Title Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">Dashboard</p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#1a2b3c]">
                      Notice Board
                    </h1>
                  </div>
                  
                </div>

                <NoticeList />
              </div>
            </main>
          </div>
        </div>
      </div>
    
  );
}
