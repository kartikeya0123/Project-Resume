import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white/30 mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-400/50 mx-auto"></div>
          </div>
          <p className="text-gray-800 mt-8 text-xl font-light float-animation">Loading VidyaAI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl float-animation"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="w-full max-w-7xl flex items-center justify-between relative z-10">
          <div className="hidden lg:block flex-1 pr-16">
            <div className="glass-card p-12 glow-effect">
              <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Welcome to <span className="text-gradient">VidyaAI</span>
              </h1>
              <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                Your AI-powered career companion for personalized guidance, resume building, and learning roadmaps.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 hover-lift cursor-pointer group">
                  <div className="w-12 h-12 glass-card flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                    <span className="text-blue-400 font-bold text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">ATS-Optimized Resumes</h3>
                    <p className="text-gray-600">Create professional resumes that pass applicant tracking systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 hover-lift cursor-pointer group">
                  <div className="w-12 h-12 glass-card flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                    <span className="text-purple-400 font-bold text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">Personalized Career Paths</h3>
                    <p className="text-gray-600">Get AI-powered recommendations based on your unique profile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 hover-lift cursor-pointer group">
                  <div className="w-12 h-12 glass-card flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                    <span className="text-blue-400 font-bold text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">Skill Gap Analysis</h3>
                    <p className="text-gray-600">Identify areas for growth and bridge skill gaps effectively</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 hover-lift cursor-pointer group">
                  <div className="w-12 h-12 glass-card flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                    <span className="text-purple-400 font-bold text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">Learning Roadmaps</h3>
                    <p className="text-gray-600">Follow structured paths to achieve your career goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="glass-card p-8 glow-effect">
              {showLogin ? (
                <LoginForm onToggleForm={() => setShowLogin(false)} />
              ) : (
                <SignupForm onToggleForm={() => setShowLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}

export default App;
