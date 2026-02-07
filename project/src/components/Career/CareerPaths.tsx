import { useState, useEffect } from 'react';
import { Target, Sparkles, TrendingUp, DollarSign, BookOpen } from 'lucide-react';
import { supabase, CareerRecommendation } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function CareerPaths() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('career_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('match_score', { ascending: false });

      if (!error && data) {
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!user) return;

    setGenerating(true);

    const mockRecommendations = [
      {
        user_id: user.id,
        recommended_role: 'Full Stack Developer',
        match_score: 92,
        reasoning:
          'Based on your background and skills, you would excel as a Full Stack Developer. Your understanding of both frontend and backend technologies makes you well-suited for this role.',
        required_skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs'],
        salary_range: '$80,000 - $130,000',
      },
      {
        user_id: user.id,
        recommended_role: 'Frontend Engineer',
        match_score: 88,
        reasoning:
          'Your strong UI/UX sensibilities and modern framework knowledge position you well for a Frontend Engineer role. This path emphasizes creating exceptional user experiences.',
        required_skills: ['React', 'TypeScript', 'CSS', 'Responsive Design', 'Performance Optimization'],
        salary_range: '$75,000 - $120,000',
      },
      {
        user_id: user.id,
        recommended_role: 'Product Manager',
        match_score: 75,
        reasoning:
          'Your technical background combined with strategic thinking makes Product Management a viable career transition. This role bridges technology and business strategy.',
        required_skills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis', 'Stakeholder Management'],
        salary_range: '$90,000 - $140,000',
      },
      {
        user_id: user.id,
        recommended_role: 'DevOps Engineer',
        match_score: 70,
        reasoning:
          'Your interest in infrastructure and automation aligns with DevOps engineering. This path focuses on building and maintaining robust deployment pipelines.',
        required_skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Monitoring'],
        salary_range: '$85,000 - $135,000',
      },
    ];

    try {
      for (const rec of mockRecommendations) {
        await supabase.from('career_recommendations').insert(rec);
      }

      await loadRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    return 'text-amber-600 bg-amber-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Career Path Recommendations</h1>
          <p className="text-gray-600 mt-1">AI-powered career suggestions based on your profile</p>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={generating}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50"
        >
          <Sparkles size={18} />
          <span>{generating ? 'Generating...' : 'Generate Recommendations'}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading recommendations...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 mb-6">
            Get AI-powered career path recommendations tailored to your profile and skills
          </p>
          <button
            onClick={generateRecommendations}
            disabled={generating}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Sparkles size={18} />
            <span>{generating ? 'Generating...' : 'Generate Recommendations'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{rec.recommended_role}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(
                        rec.match_score
                      )}`}
                    >
                      {rec.match_score}% Match
                    </span>
                  </div>
                  {rec.salary_range && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign size={16} />
                      <span className="text-sm">{rec.salary_range}</span>
                    </div>
                  )}
                </div>
              </div>

              {rec.reasoning && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-700">{rec.reasoning}</p>
                </div>
              )}

              {rec.required_skills && rec.required_skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <BookOpen size={16} />
                    <span>Key Skills Required</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
