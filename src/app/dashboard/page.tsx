'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/PageHeader';
import { BookOpen, Users, MessageSquare, FolderOpen } from 'lucide-react';

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  const stats = [
    { title: 'Notices', value: '12', icon: BookOpen, href: '/notices', color: 'bg-blue-500/10 text-blue-400' },
    { title: 'Students', value: '148', icon: Users, href: '/students', color: 'bg-green-500/10 text-green-400' },
    { title: 'Discussions', value: '35', icon: MessageSquare, href: '/discussions', color: 'bg-purple-500/10 text-purple-400' },
    { title: 'Library', value: '240', icon: FolderOpen, href: '/library', color: 'bg-orange-500/10 text-orange-400' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#111c2a] p-4 md:p-6 lg:p-8">
      <div className="bg-transparent w-full">
        <div className="flex flex-col h-full glass rounded-[2.5rem] overflow-hidden">
          <PageHeader title="Dashboard" />

          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-10">
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">Welcome back, {user?.displayName || 'User'}!</h1>
                  <p className="text-slate-400 mt-2">Here's an overview of your campus activities</p>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback className="bg-slate-800">{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title} className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-colors cursor-pointer" onClick={() => router.push(stat.href)}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-slate-200">{stat.title}</CardTitle>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <p className="text-xs text-slate-400">Click to view</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-slate-800 bg-slate-900/50 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Recent Notices</CardTitle>
                    <CardDescription>Latest updates from your institution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-800 last:border-0">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-200">Notice #{i}</p>
                            <p className="text-xs text-slate-400 mt-1">Posted 2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-blue-400 hover:text-blue-300" onClick={() => router.push('/notices')}>
                      View All Notices
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Quick Access</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start border-slate-700 hover:bg-slate-800" onClick={() => router.push('/students')}>
                      <Users className="h-4 w-4 mr-2" />
                      View Students
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-slate-700 hover:bg-slate-800" onClick={() => router.push('/groups')}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Join Groups
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-slate-700 hover:bg-slate-800" onClick={() => router.push('/library')}>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Browse Library
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
