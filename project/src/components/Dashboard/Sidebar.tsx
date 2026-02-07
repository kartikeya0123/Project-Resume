import { FileText, TrendingUp, Target, BookOpen, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'resume', label: 'Resume Builder', icon: FileText },
  { id: 'career', label: 'Career Paths', icon: Target },
  { id: 'skills', label: 'Skill Gaps', icon: BookOpen },
  { id: 'roadmap', label: 'Learning Roadmap', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { signOut, profile } = useAuth();

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          VidyaAI
        </h1>
        <p className="text-sm text-slate-400 mt-1">AI Career Companion</p>
      </div>

      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold">
              {profile?.full_name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-slate-400">{profile?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={signOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
