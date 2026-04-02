
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Key, Save, Trash2, CheckCircle2, AlertCircle, Loader2, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { verifyApiKey } from '@/ai/flows/summarize-notice-flow';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

interface StudentProfile {
  id?: string;
  name?: string;
  email?: string;
  semester?: number;
  branch?: string;
  phone?: string;
  uid?: string;
}

export function SettingsDialog() {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({});
  const [editedProfile, setEditedProfile] = useState<StudentProfile>({});

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'profile') {
      loadStudentProfile();
    }
  }, [isOpen, activeTab]);

  const loadStudentProfile = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const studentRef = doc(db, 'students', user.uid);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        const data = studentSnap.data() as StudentProfile;
        setStudentProfile(data);
        setEditedProfile(data);
      }
    } catch (error) {
      console.error('Error loading student profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      // Update Firebase Auth displayName
      if (editedProfile.name && editedProfile.name !== user.displayName) {
        await updateProfile(user, {
          displayName: editedProfile.name,
        });
      }

      // Update Firestore student document
      const db = getFirestore();
      const studentRef = doc(db, 'students', user.uid);
      await setDoc(studentRef, {
        uid: user.uid,
        name: editedProfile.name,
        semester: editedProfile.semester,
        branch: editedProfile.branch,
        phone: editedProfile.phone,
        updatedAt: new Date(),
      }, { merge: true });

      setStudentProfile(editedProfile);
      toast({
        title: "Profile Updated",
        description: "Your student profile has been updated successfully.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Key",
        description: "Please enter an API key to verify.",
      });
      return;
    }

    setVerifying(true);
    setStatus('idle');
    try {
      const result = await verifyApiKey(apiKey);
      if (result.success) {
        setStatus('success');
        toast({
          title: "Verification Successful",
          description: result.message,
        });
      } else {
        setStatus('error');
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: result.message,
        });
      }
    } catch (error) {
      setStatus('error');
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during verification.",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    toast({
      title: "Settings Saved",
      description: "Your Gemini API key has been stored locally.",
    });
    setIsOpen(false);
    setStatus('idle');
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setStatus('idle');
    toast({
      title: "Settings Cleared",
      description: "Your Gemini API key has been removed.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-white hover:bg-white/10">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Settings
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api">AI Config</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <DialogDescription>
              Edit your student profile information
            </DialogDescription>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editedProfile.name || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Cannot be changed)</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email || ''}
                  disabled
                  placeholder="your.email@example.com"
                  className="bg-muted cursor-not-allowed opacity-60"
                />
                <p className="text-xs text-muted-foreground">Email is linked to your account and cannot be modified.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select 
                    value={String(editedProfile.semester || '1')}
                    onValueChange={(value) => setEditedProfile({...editedProfile, semester: parseInt(value)})}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <SelectItem key={sem} value={String(sem)}>Semester {sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select 
                    value={editedProfile.branch || ''}
                    onValueChange={(value) => setEditedProfile({...editedProfile, branch: value})}
                  >
                    <SelectTrigger id="branch">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="ME">ME</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="EE">EE</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={editedProfile.phone || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* API Config Tab */}
          <TabsContent value="api" className="space-y-4">
            <DialogDescription>
              Provide your own Gemini API key to use for notice summarization. This key is stored only in your browser.
            </DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="apiKey">Gemini API Key</Label>
                  {status === 'success' && <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Valid</span>}
                  {status === 'error' && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Invalid</span>}
                </div>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setStatus('idle');
                  }}
                  className="col-span-3"
                />
                <p className="text-[10px] text-muted-foreground">
                  Don't have a key? Get one for free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a>.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={handleVerify}
                disabled={verifying || !apiKey.trim()}
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Key'
                )}
              </Button>
            </div>
            <DialogFooter className="flex flex-row justify-between sm:justify-between w-full">
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive hover:bg-destructive/5">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
