
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
import { Settings, Key, Save, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { verifyApiKey } from '@/ai/flows/summarize-notice-flow';

export function SettingsDialog() {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [isOpen]);

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            AI Configuration
          </DialogTitle>
          <DialogDescription>
            Provide your own Gemini API key to use for notice summarization. This key is stored only in your browser.
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
