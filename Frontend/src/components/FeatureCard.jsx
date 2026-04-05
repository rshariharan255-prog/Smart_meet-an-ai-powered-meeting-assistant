import React from 'react';

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-slate-300">{description}</p>
    </div>
  );
}