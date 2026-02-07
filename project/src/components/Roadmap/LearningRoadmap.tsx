import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, CheckCircle, Circle, ExternalLink, Plus } from 'lucide-react';
import { supabase, LearningRoadmap as RoadmapType, RoadmapItem } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function LearningRoadmap() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<RoadmapType[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapType | null>(null);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadRoadmaps();
  }, [user]);

  useEffect(() => {
    if (activeRoadmap) {
      loadRoadmapItems(activeRoadmap.id);
    }
  }, [activeRoadmap]);

  const loadRoadmaps = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('learning_roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRoadmaps(data);
        if (data.length > 0 && !activeRoadmap) {
          setActiveRoadmap(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoadmapItems = async (roadmapId: string) => {
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .order('order_index', { ascending: true });

      if (!error && data) {
        setRoadmapItems(data);
      }
    } catch (error) {
      console.error('Error loading roadmap items:', error);
    }
  };

  const generateRoadmap = async () => {
    if (!user) return;

    setGenerating(true);

    try {
      const { data: roadmap } = await supabase
        .from('learning_roadmaps')
        .insert({
          user_id: user.id,
          title: 'Full Stack Developer Learning Path',
          target_role: 'Full Stack Developer',
          description:
            'A comprehensive roadmap to become a proficient full stack developer with modern technologies',
        })
        .select()
        .single();

      if (!roadmap) return;

      const mockItems = [
        {
          roadmap_id: roadmap.id,
          title: 'JavaScript Fundamentals',
          description: 'Master the core concepts of JavaScript including ES6+ features',
          resource_type: 'course',
          resource_url: 'https://javascript.info/',
          estimated_duration: '4 weeks',
          order_index: 1,
        },
        {
          roadmap_id: roadmap.id,
          title: 'React.js Mastery',
          description: 'Build modern web applications with React, hooks, and state management',
          resource_type: 'course',
          resource_url: 'https://react.dev/learn',
          estimated_duration: '6 weeks',
          order_index: 2,
        },
        {
          roadmap_id: roadmap.id,
          title: 'Node.js & Express',
          description: 'Build scalable backend applications with Node.js and Express',
          resource_type: 'course',
          resource_url: 'https://nodejs.org/en/learn',
          estimated_duration: '5 weeks',
          order_index: 3,
        },
        {
          roadmap_id: roadmap.id,
          title: 'Database Design & SQL',
          description: 'Learn relational database design, SQL queries, and optimization',
          resource_type: 'course',
          resource_url: 'https://www.postgresql.org/docs/',
          estimated_duration: '4 weeks',
          order_index: 4,
        },
        {
          roadmap_id: roadmap.id,
          title: 'RESTful API Development',
          description: 'Design and build robust REST APIs with best practices',
          resource_type: 'project',
          resource_url: '',
          estimated_duration: '3 weeks',
          order_index: 5,
        },
        {
          roadmap_id: roadmap.id,
          title: 'Authentication & Security',
          description: 'Implement secure authentication systems and protect against common vulnerabilities',
          resource_type: 'course',
          resource_url: '',
          estimated_duration: '3 weeks',
          order_index: 6,
        },
        {
          roadmap_id: roadmap.id,
          title: 'Cloud Deployment (AWS/Vercel)',
          description: 'Deploy applications to cloud platforms and manage infrastructure',
          resource_type: 'course',
          resource_url: '',
          estimated_duration: '4 weeks',
          order_index: 7,
        },
        {
          roadmap_id: roadmap.id,
          title: 'Build Portfolio Project',
          description: 'Create a full-stack application showcasing all learned skills',
          resource_type: 'project',
          resource_url: '',
          estimated_duration: '6 weeks',
          order_index: 8,
        },
      ];

      for (const item of mockItems) {
        await supabase.from('roadmap_items').insert(item);
      }

      await loadRoadmaps();
      setActiveRoadmap(roadmap);
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setGenerating(false);
    }
  };

  const toggleItemComplete = async (itemId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('roadmap_items')
        .update({ is_completed: !currentStatus })
        .eq('id', itemId);

      setRoadmapItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, is_completed: !currentStatus } : item
        )
      );
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const completedCount = roadmapItems.filter((item) => item.is_completed).length;
  const totalCount = roadmapItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Roadmap</h1>
          <p className="text-gray-600 mt-1">Follow a structured path to achieve your career goals</p>
        </div>
        <button
          onClick={generateRoadmap}
          disabled={generating}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition disabled:opacity-50"
        >
          <Sparkles size={18} />
          <span>{generating ? 'Generating...' : 'Generate Roadmap'}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading roadmap...</p>
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Learning Roadmap Yet</h3>
          <p className="text-gray-600 mb-6">
            Get a personalized learning roadmap to guide your career development journey
          </p>
          <button
            onClick={generateRoadmap}
            disabled={generating}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
          >
            <Sparkles size={18} />
            <span>{generating ? 'Generating...' : 'Generate Roadmap'}</span>
          </button>
        </div>
      ) : (
        <>
          {roadmaps.length > 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Roadmaps</h3>
              <div className="space-y-2">
                {roadmaps.map((roadmap) => (
                  <button
                    key={roadmap.id}
                    onClick={() => setActiveRoadmap(roadmap)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeRoadmap?.id === roadmap.id
                        ? 'bg-violet-50 text-violet-900 border border-violet-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">{roadmap.title}</p>
                    {roadmap.target_role && (
                      <p className="text-sm text-gray-600">{roadmap.target_role}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeRoadmap && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-6 border border-violet-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeRoadmap.title}</h2>
                {activeRoadmap.description && (
                  <p className="text-gray-700 mb-4">{activeRoadmap.description}</p>
                )}
                {activeRoadmap.target_role && (
                  <p className="text-sm text-gray-600">Target Role: {activeRoadmap.target_role}</p>
                )}

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">Overall Progress</span>
                    <span className="text-gray-900">
                      {completedCount} / {totalCount} completed
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Path</h3>
                <div className="space-y-4">
                  {roadmapItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex space-x-4 p-4 rounded-lg border ${
                        item.is_completed
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      } transition`}
                    >
                      <button
                        onClick={() => toggleItemComplete(item.id, item.is_completed)}
                        className="flex-shrink-0 mt-1"
                      >
                        {item.is_completed ? (
                          <CheckCircle className="text-emerald-600" size={24} />
                        ) : (
                          <Circle className="text-gray-400" size={24} />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-gray-500">
                                Step {index + 1}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  item.resource_type === 'course'
                                    ? 'bg-blue-100 text-blue-800'
                                    : item.resource_type === 'project'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {item.resource_type}
                              </span>
                            </div>
                            <h4
                              className={`text-lg font-semibold ${
                                item.is_completed ? 'text-emerald-900' : 'text-gray-900'
                              }`}
                            >
                              {item.title}
                            </h4>
                          </div>
                          {item.estimated_duration && (
                            <span className="text-sm text-gray-600">{item.estimated_duration}</span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-gray-700 mb-2">{item.description}</p>
                        )}

                        {item.resource_url && (
                          <a
                            href={item.resource_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-violet-600 hover:text-violet-700 text-sm font-medium"
                          >
                            <span>View Resource</span>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
