"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useUser, useAuth } from '@/firebase';
import { NoticeList } from '@/components/NoticeList';
import { SettingsDialog } from '@/components/SettingsDialog';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Search, Bell, Settings, User, Plus, Grid, List, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#111c2a] p-4 md:p-6 lg:p-8">
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <div className="flex flex-col h-full glass rounded-[2.5rem] overflow-hidden">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground bg-white/50 px-4 py-2 rounded-full border border-white/50 w-64 md:w-80">
                  <Search className="w-4 h-4" />
                  <Input 
                    placeholder="Search anything..." 
                    className="border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full bg-white/50">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </Button>
                <SettingsDialog />
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
                <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold">Admin User</p>
                    <p className="text-[10px] text-muted-foreground">College Portal</p>
                  </div>
                  <Avatar className="w-10 h-10 border-2 border-primary/20">
                    <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>

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
                  <div className="flex items-center gap-3">
                    <div className="flex bg-white/50 p-1 rounded-lg border border-white/50">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white shadow-sm">
                        <Grid className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <List className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white/50 h-10 gap-2 border-white/50 rounded-xl">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                    <Button className="bg-[#1a2b3c] hover:bg-[#2c3e50] text-white rounded-xl h-10 gap-2 shadow-lg px-6">
                      <Plus className="w-4 h-4" />
                      Post Update
                    </Button>
                  </div>
                </div>

                <NoticeList />
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
