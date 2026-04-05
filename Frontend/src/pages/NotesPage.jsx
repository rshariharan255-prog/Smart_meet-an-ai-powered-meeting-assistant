import React from 'react';
import Navbar from '../components/Navbar';

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-extrabold">Notes Page</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-6"><h3 className="font-semibold">Transcribe</h3><p className="mt-2 text-slate-300">Transcript content here.</p></div>
          <div className="rounded-2xl bg-white/5 p-6"><h3 className="font-semibold">Summary</h3><p className="mt-2 text-slate-300">Summary content here.</p></div>
          <div className="rounded-2xl bg-white/5 p-6"><h3 className="font-semibold">Action Items</h3><p className="mt-2 text-slate-300">Action items content here.</p></div>
        </div>
      </main>
    </div>
  );
}