
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection } from "firebase/firestore";
import { db } from "@/firebase/config"; // make sure this exists
import { useCollection } from "@/firebase/firestore/use-collection";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

interface Student {
  id?: string;
  name?: string;
  email?: string;
  semester?: number;
  branch?: string;
  photoURL?: string;
}

export default function StudentsPage() {

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
  // ✅ FIX: pass Firestore collection reference
  const studentsRef = useMemo(() => {
  const ref = collection(db, "students");
  (ref as any).__memo = true; // 👈 REQUIRED for your hook
  return ref;
}, []);

  const { data, error } = useCollection<Student>(studentsRef);

  // ✅ FIX: ensure it's always an array


  const [searchQuery, setSearchQuery] = useState("");
  const filteredStudents = useMemo(() => {
  const query = searchQuery.toLowerCase();

  return (data || []).filter((student) => {
    const name = student.name?.toLowerCase() || "";
    const email = student.email?.toLowerCase() || "";
    const branch = student.branch?.toLowerCase() || "";

    return (
      name.includes(query) ||
      email.includes(query) ||
      branch.includes(query)
    );
  });
}, [data, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="px-8 py-8 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent backdrop-blur-sm animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Students
            </h1>
          </div>
          <p className="text-blue-200/70 ml-4">
            Browse and manage all students in the college
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-8 py-6 border-b border-cyan-500/10 bg-gradient-to-r from-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-800/50 to-blue-900/30 px-5 py-3 rounded-2xl border border-cyan-400/30 max-w-md hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
            <Search className="w-5 h-5 text-cyan-400/60" />
            <Input
              placeholder="Search by name, email, or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 text-white placeholder:text-blue-300/40"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-400/80 text-lg font-medium">Error: {error.message}</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-300/40" />
              </div>
              <p className="text-blue-300/60 text-lg font-medium">
                No students found
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-cyan-300/70">
                Showing <span className="font-semibold text-cyan-300">{filteredStudents.length}</span> student{filteredStudents.length !== 1 ? 's' : ''}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student, index) => (
                  <Card
                    key={student.id || student.email || index}
                    className="group p-6 bg-gradient-to-br from-slate-800/40 to-blue-900/20 border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 backdrop-blur-sm overflow-hidden relative"
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                          <Avatar className="relative border-2 border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors duration-500">
                            <AvatarImage 
                              src={user?.photoURL  || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.email || student.name || "user")}`}
                              alt={student.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold">
                              {student.name?.charAt(0)?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors duration-300">
                            {student.name || "Unknown"}
                          </h3>
                          <p className="text-blue-300/60 text-sm group-hover:text-blue-300/80 transition-colors duration-300">
                            {student.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {student.semester && (
                          <Badge className="bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white border-0 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300">
                            Sem {student.semester}
                          </Badge>
                        )}
                        {student.branch && (
                          <Badge className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-0 hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                            {student.branch}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
