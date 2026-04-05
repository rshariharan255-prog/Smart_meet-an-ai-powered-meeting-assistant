import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { uploadMeeting } from '../api/meetingApi';

function DownloadBtn({ label, content, filename }) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-xl glass border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition group"
    >
      <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {label}
    </button>
  );
}

function ResultSection({ title, icon, content, filename, gradient, border }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={`glass-strong rounded-2xl border ${border} overflow-hidden animate-slide-in hover-lift`}>
      <div
        className={`flex items-center justify-between px-6 py-5 cursor-pointer bg-gradient-to-r ${gradient}`}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 font-bold text-white">
          <span className="text-2xl">{icon}</span>
          <span className="text-lg">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <DownloadBtn label="Download" content={content} filename={filename} />
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {expanded && (
        <div className="px-6 py-5 border-t border-white/10">
          <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans max-h-96 overflow-y-auto">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (f) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMsg('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadMeeting(formData);
      setResult(res.data);
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Upload failed. Please try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="animate-slide-in">
          <h1 className="text-4xl font-black text-white mb-2">Upload Meeting</h1>
          <p className="text-slate-400">Upload a video file to get AI-powered transcript, summary, and action items.</p>
        </div>

        {status !== 'done' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            className={`relative rounded-3xl border-2 border-dashed p-16 text-center cursor-pointer transition-all animate-slide-in ${
              dragging
                ? 'border-blue-400 bg-blue-500/10 scale-105'
                : file
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-white/20 glass hover:border-blue-500/50 hover:bg-blue-500/5'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-2xl shadow-green-500/50">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-bold text-white text-xl mb-2">{file.name}</p>
                <p className="text-slate-400 mb-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-xs text-slate-500">Click to change file</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-2xl shadow-blue-500/50 animate-float">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="font-bold text-white text-xl mb-2">Drop your video here</p>
                <p className="text-slate-400 mb-4">or click to browse files</p>
                <div className="inline-flex items-center gap-2 rounded-full glass border border-white/20 px-4 py-2 text-sm text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Supports MP4, MOV, AVI, MKV
                </div>
              </>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/30 px-5 py-4 text-sm text-red-400 backdrop-blur animate-slide-in">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {status === 'uploading' && (
          <div className="glass-strong rounded-3xl p-10 text-center space-y-6 animate-slide-in border border-white/10">
            <div className="flex justify-center">
              <div className="spinner w-16 h-16 border-4" />
            </div>
            <div>
              <p className="font-bold text-white text-xl mb-2">Processing your meeting...</p>
              <p className="text-slate-400">This may take a few minutes depending on file size</p>
            </div>
            <div className="flex justify-center gap-8 text-sm">
              {['🎙️ Transcribing', '🧠 Summarizing', '✅ Extracting'].map((step, i) => (
                <div key={step} className="flex items-center gap-2 text-slate-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(status === 'idle' || status === 'error') && file && (
          <button
            onClick={handleUpload}
            className="group w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Process Meeting
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        )}

        {status === 'done' && result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between glass-strong rounded-2xl p-6 border border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Results Ready!</h2>
                <p className="text-slate-400 text-sm">{result.filename}</p>
              </div>
              <button onClick={reset} className="rounded-xl glass border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition">
                ← Upload Another
              </button>
            </div>

            <ResultSection
              title="Transcript"
              icon="🎙️"
              content={result.transcript}
              filename={`transcript_${result.filename}.txt`}
              gradient="from-blue-600/10 to-cyan-600/10"
              border="border-blue-500/30"
            />
            <ResultSection
              title="Summary"
              icon="🧠"
              content={result.summary}
              filename={`summary_${result.filename}.txt`}
              gradient="from-purple-600/10 to-pink-600/10"
              border="border-purple-500/30"
            />
            <ResultSection
              title="Action Items"
              icon="✅"
              content={result.action_items}
              filename={`actions_${result.filename}.txt`}
              gradient="from-green-600/10 to-emerald-600/10"
              border="border-green-500/30"
            />

            <button
              onClick={() => navigate('/ask')}
              className="w-full rounded-2xl glass border border-purple-500/30 py-4 font-bold text-slate-200 hover:bg-purple-500/10 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Ask questions about this meeting →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
