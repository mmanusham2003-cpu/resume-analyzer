import API from './api';

export const uploadResume = async (file, jobDescription = '') => {
  const formData = new FormData();
  formData.append('resume', file);
  if (jobDescription) {
    formData.append('jobDescription', jobDescription);
  }

  const { data } = await API.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const analyzeResume = async (resumeId) => {
  const { data } = await API.post(`/resumes/${resumeId}/analyze`);
  return data;
};

export const getResumes = async () => {
  const { data } = await API.get('/resumes');
  return data;
};

export const getResumeById = async (resumeId) => {
  const { data } = await API.get(`/resumes/${resumeId}`);
  return data;
};

export const deleteResume = async (resumeId) => {
  const { data } = await API.delete(`/resumes/${resumeId}`);
  return data;
};

export const getAiSuggestions = async (resumeId, targetRole = '') => {
  const { data } = await API.post(`/ai/suggestions/${resumeId}`, { targetRole });
  return data;
};

export const getJobMatch = async (resumeId, jobDescription) => {
  const { data } = await API.post(`/ai/match/${resumeId}`, { jobDescription });
  return data;
};
