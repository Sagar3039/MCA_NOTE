"use client";

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { db } from '@/firebase/config';
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  // User Authentication Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Student Details Fields
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const signUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!semester.trim()) {
      setError('Semester is required.');
      return;
    }
    if (!branch.trim()) {
      setError('Branch is required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and confirm password must match.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update user profile with display name
      await updateProfile(user, { displayName: fullName });

      // 3. Create student document in Firestore using UID as document ID
      await setDoc(doc(db, 'students', user.uid), {
        uid: user.uid,
        name: fullName,
        email: email,
        semester: parseInt(semester),
        branch: branch,
        phone: phone || null,
        photoURL: user.photoURL || '', // Use profile picture from auth
        role: 'student', // Default role
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Redirect to dashboard
      router.push('/');
    } catch (e: any) {
      setError(e.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Create student document with Google sign-up info using UID as document ID
      // User will need to complete their profile later
      await setDoc(doc(db, 'students', user.uid), {
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || '',
        semester: 1, // Default semester - user can update later
        branch: '', // Empty - requires user to fill
        phone: null,
        photoURL: user.photoURL || '', // Use Google profile picture by default
        role: 'student',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        googleSignup: true, // Flag indicating incomplete profile
      });

      router.push('/');
    } catch (e: any) {
      setError(e.message || 'Google sign-up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h1>
        <p className="text-sm text-gray-600 mb-6">Join as a Student</p>

        <form onSubmit={signUp} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
              Full Name *
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="mt-1 border-gray-300"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="mt-1 border-gray-300"
            />
          </div>

          {/* Semester */}
          <div>
            <label htmlFor="semester" className="block text-sm font-semibold text-gray-700">
              Semester *
            </label>
            <select
              id="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label htmlFor="branch" className="block text-sm font-semibold text-gray-700">
              Branch *
            </label>
            <select
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science Engineering</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
              <option value="EE">Electrical Engineering</option>
              <option value="IT">Information Technology</option>
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="mt-1 border-gray-300"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password *
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 border-gray-300"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
              Confirm Password *
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 border-gray-300"
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="my-4 text-center">
          <span className="text-sm text-gray-500">or</span>
        </div>

        <Button onClick={signUpWithGoogle} className="w-full mb-4" variant="outline" disabled={loading}>
          {loading ? 'Please wait...' : 'Continue with Google'}
        </Button>

        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
