"use client";

import { useState } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PageHeaderProps {
  title: string;
  onSearch?: (query: string) => void;
}

export function PageHeader({ title, onSearch }: PageHeaderProps) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const [localDisplayName, setLocalDisplayName] = useState(user?.displayName || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim() || !user) return;
    try {
      await updateProfile(user, { displayName: newName.trim() });
      setLocalDisplayName(newName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update name", error);
    }
  };

  if (isUserLoading || !user) return null;

  return (
    <header className="flex items-center justify-between px-8 py-6 border-b border-white/10">
      {/* Left Side - Search */}
      <div className="flex items-center gap-2 text-muted-foreground bg-white/50 px-4 py-2 rounded-full border border-white/50 w-64 md:w-80">
        <Search className="w-4 h-4" />
        <Input
          placeholder="Search anything..."
          className="border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Right Side - Settings, User Profile */}
      <div className="flex items-center gap-3">
        <SettingsDialog />

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-black/5 transition-colors cursor-pointer border-l border-white/20 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">
                  {localDisplayName || user.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[10px] text-white/50">College Portal</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user/100/100"} />
                <AvatarFallback>
                  {localDisplayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          
          <PopoverContent align="end" className="w-64 p-4 space-y-3 bg-white border-slate-200">
            <div className="flex flex-col space-y-1">
              {isEditingName ? (
                <div className="space-y-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter new name"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveName}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingName(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-900">
                    {localDisplayName || "Unnamed User"}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditingName(true);
                      setNewName(localDisplayName);
                    }}
                  >
                    Edit Name
                  </Button>
                </>
              )}
              <p className="text-xs text-slate-500">{user.email || "No email"}</p>
            </div>

            <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
              <div className="grid grid-cols-2 gap-y-1">
                <span className="font-medium text-slate-600">UID:</span>
                <span className="truncate" title={user.uid}>
                  {user.uid}
                </span>
                {user.metadata?.creationTime && (
                  <>
                    <span className="font-medium text-slate-600">Joined:</span>
                    <span>{new Date(user.metadata.creationTime).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
