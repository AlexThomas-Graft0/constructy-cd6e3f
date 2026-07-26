'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, formatCurrency, Alert } from './Shared';

interface ProjectStats {
  id: string;
  client_name: string;
  billed_amount: number;
  total_cost: number;
  margin: number;
  margin_percent: number;
  status: string;
}

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalBilled: 0,
    totalCosts: 0,
    overallMargin: 0,
    activeProjectsCount: 0,
  });
  const [underperforming, setUnderperforming] = useState<ProjectStats[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [projectsRes, materialsRes, laborRes, equipmentRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('materials').select('project_id, total_cost'),
        supabase.from('labor').select('project_id, resulting_cost'),
        supabase.from('equipment').select('project_id, total_cost'),
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (materialsRes.error) throw materialsRes.error;
      if (laborRes.error) throw laborRes.error;
      if (equipmentRes.error) throw equipmentRes.error;

      const projects = projectsRes.data || [];
      const materials = materialsRes.data || [];
      const labor = laborRes.data || [];
      const equipment = equipmentRes.data || [];

      let totalBilled = 0;
      let totalCosts = 0;
      let activeCount = 0;
      const projectStatsMap: Record<string, ProjectStats> = {};

      projects.forEach((p) => {
        if (p.status === 'Active') activeCount++;
        totalBilled += Number(p.billed_amount || 0);
        projectStatsMap[p.id] = {
          id: p.id,
          client_name: p.client_name,
          billed_amount: Number(p.billed_amount || 0),
          total_cost: 0,
          margin: 0,
          margin_percent: 0,
          status: p.status,
        };
      });

      const addCost = (projectId: string, cost: number) => {
        if (projectStatsMap[projectId]) {
          projectStatsMap[projectId].total_cost += cost;
          totalCosts += cost;
        }
      };

      materials.forEach((m) => addCost(m.project_id, Number(m.total_cost || 0)));
      labor.forEach((l) => addCost(l.project_id, Number(l.resulting_cost || 0)));
      equipment.forEach((e) => addCost(e.project_id, Number(e.total_cost || 0)));

      const failingProjects: ProjectStats[] = [];

      Object.values(projectStatsMap).forEach((p) => {
        p.margin = p.billed_amount - p.total_cost;
        p.margin_percent = p.billed_amount > 0 ? (p.margin / p.billed_amount) * 100 : 0;
        if (p.margin < 0 && p.status !== 'Cancelled') {
          failingProjects.push(p);
        }
      });

      setStats({
        totalBilled,
        totalCosts,
        overallMargin: totalBilled - totalCosts,
        activeProjectsCount: activeCount,
      });
      setUnderperforming(failingProjects.sort((a, b) => a.margin - b.margin));
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading overview...</div>;

  const isMarginPositive = stats.overallMargin >= 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Global Dashboard</h2>
        <p className="text-gray-600 mt-1">High-level financial overview across all projects.</p>
      </div>

      {error && <Alert message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Projects</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.activeProjectsCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Billed</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 font-mono tabular-nums">{formatCurrency(stats.totalBilled)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Actual Costs</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 font-mono tabular-nums">{formatCurrency(stats.totalCosts)}</p>
        </Card>
        <Card className={`p-6 border-l-4 ${isMarginPositive ? 'border-l-[#16A34A]' : 'border-l-[#DC2626]'}`}>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Overall Margin</p>
          <p className={`mt-2 text-3xl font-bold font-mono tabular-nums ${isMarginPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
            {formatCurrency(stats.overallMargin)}
          </p>
        </Card>
      </div>

      {underperforming.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#DC2626] mr-2"></span>
            Underperforming Projects (Negative Margin)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {underperforming.map((p) => (
              <Card key={p.id} className="p-5 border-red-200 bg-red-50/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{p.client_name}</h4>
                  <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-600">{p.status}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Billed:</span>
                    <span className="font-mono tabular-nums text-gray-900">{formatCurrency(p.billed_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Costs:</span>
                    <span className="font-mono tabular-nums text-gray-900">{formatCurrency(p.total_cost)}</span>
                  </div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-red-100">
                    <span className="font-medium text-red-800">Deficit:</span>
                    <span className="font-mono tabular-nums font-bold text-red-700">{formatCurrency(p.margin)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}