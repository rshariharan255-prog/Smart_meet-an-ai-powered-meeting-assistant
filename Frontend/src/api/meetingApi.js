import API from "./axios";

export const uploadMeeting = (formData) =>
  API.post("/meeting/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const listMeetings = () => API.get("/meeting/list");

export const askQuestion = (data) => API.post("/meeting/qa/ask", data);
