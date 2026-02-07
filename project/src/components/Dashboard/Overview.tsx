import { FileText, Target, TrendingUp, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface OverviewProps {
  onNavigate: (view: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const { profile } = useAuth();

  const cards = [
    {
      id: 'resume',
      title: 'Resume Builder',
      description: 'Create ATS-optimized resumes with AI assistance',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      action: 'Build Resume',
    },
    {
      id: 'career',
      title: 'Career Paths',
      description: 'Discover personalized career recommendations',
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
      action: 'Explore Careers',
    },
    {
      id: 'skills',
      title: 'Skill Analysis',
      description: 'Identify gaps and strengthen your skill set',
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500',
      action: 'Analyze Skills',
    },
    {
      id: 'roadmap',
      title: 'Learning Roadmap',
      description: 'Follow a structured path to achieve your goals',
      icon: BookOpen,
      color: 'from-violet-500 to-purple-500',
      action: 'View Roadmap',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Let's continue building your future. Choose where you'd like to start today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <button
                onClick={() => onNavigate(card.id)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {card.action} →
              </button>
            </div>
          );
        })}
      </div>

      {profile?.target_job_title && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Goal</h3>
          <p className="text-gray-700">
            You're working towards becoming a <span className="font-semibold">{profile.target_job_title}</span>
          </p>
        </div>
      )}
    </div>
  );
}
