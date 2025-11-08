import React, { useState, useEffect, useCallback } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { Header } from './components/Header';
import type { FilterState, Job, GroundingSource, Tab } from './types';
import { findJobs, getMarketInsights } from './services/geminiService';
import { JOB_ROLES, COUNTRIES } from './constants';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    keywords: '',
    roles: [],
    countries: [],
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [insights, setInsights] = useState<string>('');
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('listings');

  useEffect(() => {
    const savedFilters = localStorage.getItem('healthJobFinderFilters');
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      // Basic validation to ensure saved filters have the correct structure
      if (
        'keywords' in parsedFilters &&
        'roles' in parsedFilters &&
        'countries' in parsedFilters
      ) {
        setFilters(parsedFilters);
      }
    }
  }, []);

  const handleSaveFilters = useCallback(() => {
    localStorage.setItem('healthJobFinderFilters', JSON.stringify(filters));
    alert('Filters saved!');
  }, [filters]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setJobs([]);
    setInsights('');
    setGroundingSources([]);

    try {
      if (activeTab === 'listings') {
        const result = await findJobs(filters, resumeFile);
        setJobs(result.jobs);
        setGroundingSources(result.sources);
      } else {
        const result = await getMarketInsights(filters);
        setInsights(result.insights);
        setGroundingSources(result.sources);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, resumeFile, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <aside className="lg:col-span-4 xl:col-span-3">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            onSearch={handleSearch}
            onSave={handleSaveFilters}
            isLoading={isLoading}
            allRoles={JOB_ROLES}
            allCountries={COUNTRIES}
          />
        </aside>
        <section className="lg:col-span-8 xl:col-span-9">
          <ResultsPanel
            jobs={jobs}
            insights={insights}
            sources={groundingSources}
            isLoading={isLoading}
            error={error}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </section>
      </main>
    </div>
  );
};

export default App;
