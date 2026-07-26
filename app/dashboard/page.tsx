'use client';

import { useState } from 'react';
import Link from 'next/link';
import Overview from '@/components/dashboard/Overview';
import ProjectsManager from '@/components/dashboard/ProjectsManager';
import MaterialsManager from '@/components/dashboard/MaterialsManager';
import LaborManager from '@/components/dashboard/LaborManager';
import EquipmentManager from '@/components/dashboard/EquipmentManager';
import UsersManager from '@/components/dashboard/UsersManager';

type Tab = 'overview' | 'projects' | 'materials' | 'labor' | 'equipment' | 'users';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const navItems: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Global Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'materials', label: 'Materials Log' },
    { id: 'labor', label: 'Labor Log' },
    { id: 'equipment', label: 'Equipment & Tools' },
    { id: 'users', label: 'Team Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold tracking-tight text-[#111827]">constructy</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Owner Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-[#1677ff]/10 text-[#1677ff]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-gray-600 hover:text-[#1677ff] transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'materials' && <MaterialsManager />}
          {activeTab === 'labor' && <LaborManager />}
          {activeTab === 'equipment' && <EquipmentManager />}
          {activeTab === 'users' && <UsersManager />}
        </div>
      </main>
    </div>
  );
}