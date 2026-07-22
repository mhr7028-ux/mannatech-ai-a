'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AIChatModule from '@/components/AIChatModule';
import CRMModule from '@/components/CRMModule';
import HealthModule from '@/components/HealthModule';
import QuantumModule from '@/components/QuantumModule';
import PhysiognomyModule from '@/components/PhysiognomyModule';
import KnowledgeModule from '@/components/KnowledgeModule';
import BusinessModule from '@/components/BusinessModule';
import ScheduleModule from '@/components/ScheduleModule';
import NetworkModule from '@/components/NetworkModule';
import { Menu, X } from 'lucide-react';

export default function Home() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('chat');

  // Mobile Sidebar Toggle State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // AI Model Selection state
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');

  // Render module based on activeTab
  const renderModule = () => {
    switch (activeTab) {
      case 'crm':
        return <CRMModule />;
      case 'health':
        return <HealthModule />;
      case 'quantum':
        return <QuantumModule />;
      case 'physiognomy':
        return <PhysiognomyModule />;
      case 'knowledge':
        return <KnowledgeModule />;
      case 'business':
        return <BusinessModule />;
      case 'schedule':
        return <ScheduleModule />;
      case 'network':
        return <NetworkModule />;
      case 'chat':
      default:
        return <AIChatModule selectedModel={selectedModel} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-50 antialiased relative">
      {/* Mobile Top Navigation Header */}
      <header className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
            H
          </div>
          <span className="font-bold text-gray-900 text-sm">HBOS MannaTech</span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* 1. Desktop & Mobile Sidebar Component (with integrated bottom STT & Google Auth) */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-40 transform md:transform-none transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false); // Close mobile sidebar on select
          }}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-30 md:hidden"
        />
      )}

      {/* 2. Clean Dynamic Main Content Area */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative">
        {renderModule()}
      </main>
    </div>
  );
}
