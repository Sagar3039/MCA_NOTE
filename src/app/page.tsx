"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, updateProfile } from 'firebase/auth';
import { useUser, useAuth } from '@/firebase';
import { NoticeList } from '@/components/NoticeList';
import { SettingsDialog } from '@/components/SettingsDialog';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Search, Settings, User, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const [localDisplayName, setLocalDisplayName] = useState(user?.displayName || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (user) {
      setLocalDisplayName(user.displayName || '');
    }
  }, [user]);

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

  const handleSaveName = async () => {
    if (!newName.trim() || !user) return;
    try {
      await updateProfile(user, { displayName: newName.trim() });
      setLocalDisplayName(newName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update name', error);
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
                <SettingsDialog />
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-3 pl-4 border-l border-white/20 cursor-pointer hover:bg-black/5 p-2 rounded-xl transition-colors">
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-bold">{localDisplayName || user.email?.split('@')[0] || 'User'}</p>
                        <p className="text-[10px] text-muted-foreground">College Portal</p>
                      </div>
                      <Avatar className="w-10 h-10 border-2 border-primary/20">
                        <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user/100/100"} />
                        <AvatarFallback>{localDisplayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 p-4 space-y-3 bg-white border-slate-200">
                    <div className="flex flex-col space-y-1">
                      {isEditingName ? (
                        <div className="space-y-2">
                          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter new name" />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveName}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setIsEditingName(false)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-slate-900">{localDisplayName || 'Unnamed User'}</p>
                          <Button size="sm" variant="outline" onClick={() => { setIsEditingName(true); setNewName(localDisplayName); }}>Edit Name</Button>
                        </>
                      )}
                      <p className="text-xs text-slate-500">{user.email || 'No email'}</p>
                    </div>
                    <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <div className="grid grid-cols-2 gap-y-1">
                        <span className="font-medium text-slate-600">UID:</span>
                        <span className="truncate" title={user.uid}>{user.uid}</span>
                        {user.metadata?.creationTime && (
                          <>
                            <span className="font-medium text-slate-600">Joined:</span>
                            <span>{new Date(user.metadata.creationTime).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
