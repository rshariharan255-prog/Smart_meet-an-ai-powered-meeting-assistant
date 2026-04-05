import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <div className="text-5xl mb-4">🔑</div>
        <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
        <p className="text-slate-400 text-sm mt-2 mb-6">
          Password reset is not yet available. Please contact your administrator.
        </p>
        <Link
          to="/login"
          className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white hover:from-blue-500 hover:to-indigo-500 transition"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
