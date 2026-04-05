import React from 'react';

export default function MeetingList({ meetings, selectedMeeting, setSelectedMeeting }) {
  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <button
          key={meeting.id}
          onClick={() => setSelectedMeeting(meeting)}
          className={`w-full rounded-2xl border p-4 text-left transition ${selectedMeeting?.id === meeting.id ? 'border-blue-500 bg-blue-500/15' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
        >
          <div className="font-semibold text-white">{meeting.title}</div>
          <div className="mt-1 text-sm text-slate-300">{meeting.date}</div>
        </button>
      ))}
    </div>
  );
}