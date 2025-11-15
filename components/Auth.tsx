import React, { useState } from 'react';
import { 
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    User as FirebaseUser,
} from '../services/firebase';
import { createUserDocument } from '../services/userService';
import { AtSignIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon, LogoIcon, GoogleIcon } from './Icons';
import { User } from '../types';

interface AuthProps {
    onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  });
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await createUserDocument(result.user);
        onLogin(mapFirebaseUserToAppUser(result.user));
    } catch (err: any) {
        setError(err.message.replace('Firebase: ', ''));
    } finally {
        setLoading(false);
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password !== repeatPassword) {
        return setError('Passwords do not match.');
    }
    if (password.length < 6) {
        return setError('Password should be at least 6 characters.');
    }

    setLoading(true);
    try {
        if (isLogin) {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            onLogin(mapFirebaseUserToAppUser(userCredential.user));
        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            await createUserDocument(userCredential.user);
            // We need to pass the updated user object to onLogin
            const updatedFirebaseUser = { ...userCredential.user, displayName: name };
            onLogin(mapFirebaseUserToAppUser(updatedFirebaseUser as FirebaseUser));
        }
    } catch (err: any) {
        if (isLogin && (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found')) {
            setError('Password or Email Incorrect');
        } else if (!isLogin && err.code === 'auth/email-already-in-use') {
            setError('User already exists. Sign in?');
        } else {
            setError(err.message.replace('Firebase: ', ''));
        }
    } finally {
        setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setRepeatPassword('');
    setName('');
    setEmail('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="inline-block mb-4">
                <LogoIcon size={56} />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 tracking-tight">
                Welcome to Gemini Drive
            </h1>
            <p className="text-slate-500 mt-2">{isLogin ? 'Sign in to access your files' : 'Create an account to get started'}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 px-4 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all font-medium border border-slate-200 shadow-sm disabled:opacity-50"
            >
                <GoogleIcon size={20} />
                Continue with Google
            </button>
            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase">Or</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>
            <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="relative w-full">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all text-slate-900"
                        />
                    </div>
                )}
                <div className="relative">
                    <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all text-slate-900"
                    />
                </div>
                <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all text-slate-900"
                    />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOffIcon size={20}/> : <EyeIcon size={20} />}
                    </button>
                </div>

                {!isLogin && (
                    <div className="relative">
                         <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                         <input 
                            type="password"
                            placeholder="Repeat Password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all text-slate-900"
                        />
                    </div>
                )}
                
                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">{error}</p>}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-indigo-200"
                >
                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : (isLogin ? 'Log In' : 'Create Account')}
                </button>
            </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleForm} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
                {isLogin ? 'Sign up' : 'Log in'}
            </button>
        </p>
      </div>
    </div>
  );
};