import { useState, useEffect } from 'react';
import { Save, FileText, Download, Sparkles } from 'lucide-react';
import { supabase, Resume } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
}

const emptyResume: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

export function ResumeBuilder() {
  const { user, profile } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    loadResumes();
    if (profile) {
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: profile.full_name || '',
          email: profile.email || '',
        },
      }));
    }
  }, [profile]);

  const loadResumes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setResumes(data);
    }
  };

  const handleSave = async () => {
    if (!user || !title.trim()) return;

    setSaving(true);
    try {
      if (currentResumeId) {
        await supabase
          .from('resumes')
          .update({
            title,
            content: resumeData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentResumeId);
      } else {
        const { data } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title,
            content: resumeData,
          })
          .select()
          .single();

        if (data) {
          setCurrentResumeId(data.id);
        }
      }

      await loadResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
    }, 2000);
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          degree: '',
          institution: '',
          location: '',
          graduationDate: '',
          gpa: '',
        },
      ],
    }));
  };

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now().toString(),
          name: '',
          description: '',
          technologies: '',
          link: '',
        },
      ],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600 mt-1">Create an ATS-optimized resume with AI assistance</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleOptimize}
            disabled={optimizing}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
          >
            <Sparkles size={18} />
            <span>{optimizing ? 'Optimizing...' : 'AI Optimize'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Software Engineer Resume"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={resumeData.personalInfo.fullName}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={resumeData.personalInfo.email}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value },
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value },
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Location"
                value={resumeData.personalInfo.location}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, location: e.target.value },
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, linkedin: e.target.value },
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="Portfolio URL"
                value={resumeData.personalInfo.portfolio}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, portfolio: e.target.value },
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Summary</h2>
            <textarea
              value={resumeData.summary}
              onChange={(e) => setResumeData((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="Write a compelling summary highlighting your key strengths and experience..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
              <button
                onClick={addExperience}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Add Experience
              </button>
            </div>
            {resumeData.experience.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No experience added yet</p>
            ) : (
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[index].title = e.target.value;
                          setResumeData((prev) => ({ ...prev, experience: updated }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[index].company = e.target.value;
                          setResumeData((prev) => ({ ...prev, experience: updated }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={exp.location}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[index].location = e.target.value;
                          setResumeData((prev) => ({ ...prev, experience: updated }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex space-x-2">
                        <input
                          type="month"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].startDate = e.target.value;
                            setResumeData((prev) => ({ ...prev, experience: updated }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="month"
                          placeholder="End Date"
                          value={exp.endDate}
                          disabled={exp.current}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].endDate = e.target.value;
                            setResumeData((prev) => ({ ...prev, experience: updated }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[index].current = e.target.checked;
                          if (e.target.checked) {
                            updated[index].endDate = '';
                          }
                          setResumeData((prev) => ({ ...prev, experience: updated }));
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>I currently work here</span>
                    </label>
                    <textarea
                      placeholder="Describe your responsibilities and achievements..."
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[index].description = e.target.value;
                        setResumeData((prev) => ({ ...prev, experience: updated }));
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
              <button
                onClick={addEducation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Add Education
              </button>
            </div>
            {resumeData.education.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No education added yet</p>
            ) : (
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[index].degree = e.target.value;
                          setResumeData((prev) => ({ ...prev, education: updated }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[index].institution = e.target.value;
                          setResumeData((prev) => ({ ...prev, education: updated }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={edu.location}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[index].location = e.target.value;
                          setResumeData((prev) => ({ ...prev, education: updated }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="month"
                        placeholder="Graduation Date"
                        value={edu.graduationDate}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[index].graduationDate = e.target.value;
                          setResumeData((prev) => ({ ...prev, education: updated }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
              <button
                onClick={addProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Add Project
              </button>
            </div>
            {resumeData.projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No projects added yet</p>
            ) : (
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={project.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[index].name = e.target.value;
                        setResumeData((prev) => ({ ...prev, projects: updated }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Project Description"
                      value={project.description}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[index].description = e.target.value;
                        setResumeData((prev) => ({ ...prev, projects: updated }));
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Technologies Used"
                        value={project.technologies}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[index].technologies = e.target.value;
                          setResumeData((prev) => ({ ...prev, projects: updated }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Project Link"
                        value={project.link}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[index].link = e.target.value;
                          setResumeData((prev) => ({ ...prev, projects: updated }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {resumes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Resumes</h2>
          <div className="space-y-2">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{resume.title}</p>
                    <p className="text-sm text-gray-500">
                      Updated {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentResumeId(resume.id);
                    setTitle(resume.title);
                    setResumeData(resume.content as ResumeData);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Load
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
