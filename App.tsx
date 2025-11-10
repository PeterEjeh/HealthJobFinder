import React, { useState, useEffect, useCallback } from 'react';
import { FilterPanel } from './components/FilterPanel.tsx';
import { ResultsPanel } from './components/ResultsPanel.tsx';
import { Header } from './components/Header.tsx';
import type { FilterState, Job, GroundingSource, Tab, AppError } from './types.ts';
import { findJobs, getMarketInsights } from './services/geminiService.ts';
import { JOB_ROLES, COUNTRIES } from './constants.ts';

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
  const [error, setError] = useState<AppError | null>(null);
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
      console.error("Search failed:", err);
      let appError: AppError;

      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        if (message.includes('json') || message.includes('markdown')) {
          appError = { type: 'parsing', message: "The model's response was improperly formatted. Please try again." };
        } else if (message.includes('fetch') || message.includes('network')) {
          appError = { type: 'network', message: "Failed to connect. Please check your internet connection." };
        } else if (message.includes('api')) { // This could be for API key errors or service unavailable
          appError = { type: 'api', message: "The AI service is currently unavailable or misconfigured. Please try again later." };
        } else {
          appError = { type: 'unknown', message: err.message };
        }
      } else {
        appError = { type: 'unknown', message: 'An unexpected error occurred.' };
      }
      setError(appError);
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