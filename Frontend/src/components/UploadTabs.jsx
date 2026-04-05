import React from 'react';

export default function UploadTabs({ activeTab, setActiveTab }) {
  const btn = (key) => `rounded-xl px-4 py-2 font-medium transition ${activeTab === key ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-200 hover:bg-white/10'}`;

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={() => setActiveTab('video')} className={btn('video')}>Video Upload</button>
      <button onClick={() => setActiveTab('notes')} className={btn('notes')}>Notes</button>
      <button onClick={() => setActiveTab('ask')} className={btn('ask')}>Ask</button>
    </div>
  );
}