import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Overview } from './Overview';
import { ResumeBuilder } from '../Resume/ResumeBuilder';
import { CareerPaths } from '../Career/CareerPaths';
import { SkillGaps } from '../Skills/SkillGaps';
import { LearningRoadmap } from '../Roadmap/LearningRoadmap';
import { ProfileSettings } from '../Profile/ProfileSettings';

export function Dashboard() {
  const [activeView, setActiveView] = useState('overview');

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <Overview onNavigate={setActiveView} />;
      case 'resume':
        return <ResumeBuilder />;
      case 'career':
        return <CareerPaths />;
      case 'skills':
        return <SkillGaps />;
      case 'roadmap':
        return <LearningRoadmap />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <Overview onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
