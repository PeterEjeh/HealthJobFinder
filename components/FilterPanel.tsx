import React from 'react';
import type { FilterState } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  onSearch: () => void;
  onSave: () => void;
  isLoading: boolean;
  allRoles: string[];
  allCountries: string[];
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const ClearIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);


export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  resumeFile,
  setResumeFile,
  onSearch,
  onSave,
  isLoading,
  allRoles,
  allCountries,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const handleMultiSelectChange = (field: 'roles' | 'countries', value: string) => {
    const currentValues = filters[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setFilters({ ...filters, [field]: newValues });
  };

  const handleClearFilters = () => {
    setFilters({ keywords: '', roles: [], countries: [] });
    setResumeFile(null);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h2 className="text-xl font-bold mb-6 text-slate-700">Find Your Next Role</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">Keywords / Skills</label>
          <input
            type="text"
            name="keywords"
            id="keywords"
            value={filters.keywords}
            onChange={handleInputChange}
            placeholder="e.g., Pediatric Nursing, ICU"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Roles</label>
            <div className="max-h-40 overflow-y-auto space-y-2 border p-3 rounded-md">
                {allRoles.map(role => (
                    <div key={role} className="flex items-center">
                        <input
                            id={`role-${role}`}
                            type="checkbox"
                            checked={filters.roles.includes(role)}
                            onChange={() => handleMultiSelectChange('roles', role)}
                            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <label htmlFor={`role-${role}`} className="ml-3 text-sm text-gray-600">{role}</label>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Countries</label>
            <div className="max-h-40 overflow-y-auto space-y-2 border p-3 rounded-md">
                {allCountries.map(country => (
                    <div key={country} className="flex items-center">
                        <input
                            id={`country-${country}`}
                            type="checkbox"
                            checked={filters.countries.includes(country)}
                            onChange={() => handleMultiSelectChange('countries', country)}
                            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <label htmlFor={`country-${country}`} className="ml-3 text-sm text-gray-600">{country}</label>
                    </div>
                ))}
            </div>
        </div>
        
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (Optional)</label>
          <input
            type="file"
            id="resume"
            accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={e => setResumeFile(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
          />
          <p className="mt-1 text-xs text-gray-500">.txt, .pdf, or .docx for personalization.</p>
          {resumeFile && <p className="mt-1 text-xs text-green-600 truncate">Selected: {resumeFile.name}</p>}
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-300 transition-colors"
        >
          <SearchIcon className="h-5 w-5"/>
          {isLoading ? 'Searching...' : 'Search Jobs'}
        </button>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50 transition-colors"
          >
            <SaveIcon className="h-5 w-5"/>
            Save
          </button>
          <button
            onClick={handleClearFilters}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50 transition-colors"
          >
            <ClearIcon className="h-5 w-5"/>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
