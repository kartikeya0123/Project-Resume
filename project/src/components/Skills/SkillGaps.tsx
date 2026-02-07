import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { supabase, SkillGap } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const importanceLevels = ['low', 'medium', 'high', 'critical'];
const proficiencyLevels = ['none', 'beginner', 'intermediate', 'advanced', 'expert'];

export function SkillGaps() {
  const { user } = useAuth();
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadSkillGaps();
  }, [user]);

  const loadSkillGaps = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skill_gaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSkillGaps(data);
      }
    } catch (error) {
      console.error('Error loading skill gaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSkills = async () => {
    if (!user) return;

    setAnalyzing(true);

    const mockSkillGaps = [
      {
        user_id: user.id,
        skill_name: 'System Design',
        importance: 'high',
        current_level: 'beginner',
        target_level: 'advanced',
      },
      {
        user_id: user.id,
        skill_name: 'Cloud Architecture (AWS)',
        importance: 'high',
        current_level: 'beginner',
        target_level: 'intermediate',
      },
      {
        user_id: user.id,
        skill_name: 'Docker & Kubernetes',
        importance: 'medium',
        current_level: 'none',
        target_level: 'intermediate',
      },
      {
        user_id: user.id,
        skill_name: 'GraphQL',
        importance: 'medium',
        current_level: 'beginner',
        target_level: 'intermediate',
      },
      {
        user_id: user.id,
        skill_name: 'Testing & TDD',
        importance: 'high',
        current_level: 'intermediate',
        target_level: 'advanced',
      },
      {
        user_id: user.id,
        skill_name: 'Microservices Architecture',
        importance: 'medium',
        current_level: 'none',
        target_level: 'intermediate',
      },
    ];

    try {
      for (const gap of mockSkillGaps) {
        await supabase.from('skill_gaps').insert(gap);
      }

      await loadSkillGaps();
    } catch (error) {
      console.error('Error analyzing skills:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGapSize = (currentLevel: string, targetLevel: string) => {
    const current = proficiencyLevels.indexOf(currentLevel);
    const target = proficiencyLevels.indexOf(targetLevel);
    return target - current;
  };

  const groupedGaps = skillGaps.reduce((acc, gap) => {
    const importance = gap.importance;
    if (!acc[importance]) {
      acc[importance] = [];
    }
    acc[importance].push(gap);
    return acc;
  }, {} as Record<string, SkillGap[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skill Gap Analysis</h1>
          <p className="text-gray-600 mt-1">Identify and bridge skill gaps for your target role</p>
        </div>
        <button
          onClick={analyzeSkills}
          disabled={analyzing}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition disabled:opacity-50"
        >
          <Sparkles size={18} />
          <span>{analyzing ? 'Analyzing...' : 'Analyze Skills'}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading skill analysis...</p>
        </div>
      ) : skillGaps.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Skill Analysis Yet</h3>
          <p className="text-gray-600 mb-6">
            Get AI-powered insights into your skill gaps and areas for improvement
          </p>
          <button
            onClick={analyzeSkills}
            disabled={analyzing}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
          >
            <Sparkles size={18} />
            <span>{analyzing ? 'Analyzing...' : 'Analyze Skills'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {importanceLevels.reverse().map((importance) => {
            const gaps = groupedGaps[importance];
            if (!gaps || gaps.length === 0) return null;

            return (
              <div key={importance}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                  {importance} Priority Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gaps.map((gap) => {
                    const gapSize = getGapSize(gap.current_level, gap.target_level);
                    return (
                      <div
                        key={gap.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{gap.skill_name}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getImportanceColor(
                              gap.importance
                            )}`}
                          >
                            {gap.importance}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Current Level</span>
                              <span className="font-medium text-gray-900 capitalize">
                                {gap.current_level}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Target Level</span>
                              <span className="font-medium text-gray-900 capitalize">
                                {gap.target_level}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Progress to Target</span>
                              <span className="text-gray-900 font-medium">
                                {Math.max(0, proficiencyLevels.indexOf(gap.current_level))} /{' '}
                                {proficiencyLevels.indexOf(gap.target_level)} levels
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all"
                                style={{
                                  width: `${
                                    (Math.max(0, proficiencyLevels.indexOf(gap.current_level)) /
                                      proficiencyLevels.indexOf(gap.target_level)) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          {gapSize > 0 && (
                            <div className="flex items-start space-x-2 p-3 bg-orange-50 rounded-lg">
                              <AlertCircle size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-orange-800">
                                {gapSize} level{gapSize > 1 ? 's' : ''} to reach your target
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
