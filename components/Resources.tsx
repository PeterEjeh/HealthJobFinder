import React from 'react';

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>
);
const BuildingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
);
const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);
const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

const resourcesData = {
  generalStrategies: [
    { title: 'Use Government Job Boards First', description: 'They are the most accurate and verified sources for job listings.' },
    { title: 'Contact Hospitals Directly', description: 'Many healthcare providers prefer direct applicants over third-party agencies.' },
    { title: 'Leverage LinkedIn Smart Alerts', description: 'Set alerts for roles like “Caregiver jobs in Canada” and engage with HR posts to increase visibility.' },
    { title: 'Verify Licensure Requirements', description: 'Check official bodies: AHPRA (Australia), provincial registration (Canada), Ministry of Health (Luxembourg).' },
    { title: 'Join Niche Social Media Groups', description: 'Recruiters often post in country-specific Healthcare Job Groups on Facebook or LinkedIn.' }
  ],
  countries: [
    {
      name: 'Australia',
      flag: '🇦🇺',
      jobSources: [
        { name: 'JobActive / Workforce Australia', description: 'Official Australian Government job platform.', link: 'https://www.workforceaustralia.gov.au' },
        { name: 'Seek', description: 'Australia’s largest and most trusted job board.', link: 'https://www.seek.com.au' },
        { name: 'Health Times', description: 'Dedicated healthcare industry job portal.', link: 'https://www.healthtimes.com.au' },
        { name: 'NSW Health Careers', description: 'Direct government site for New South Wales.', link: 'https://www.health.nsw.gov.au/careers' },
        { name: 'SA Health', description: 'South Australia’s health recruitment site.', link: 'https://www.sahealth.sa.gov.au' },
        { name: 'Queensland Health', description: 'Official site for healthcare roles in Queensland.', link: 'https://www.health.qld.gov.au/employment' },
        { name: 'Bupa Careers (Aged Care)', description: 'One of Australia’s top aged care employers.', link: 'https://careers.bupa.com.au' },
      ],
      directOutreach: [
        { name: 'Ramsay Health Care', link: 'https://www.ramsaycareers.com.au' },
        { name: 'Estia Health (Aged Care)', link: 'https://www.estiahealth.com.au/careers' },
        { name: 'Aveo Group', link: 'https://careers.aveo.com.au' },
        { name: 'Bolton Clarke', link: 'https://careers.boltonclarke.com.au' },
        { name: 'Calvary Health Care', link: 'https://www.calvarycare.org.au/careers' },
      ],
      tips: [
        'Use keywords like: “Personal Care Assistant”, “Community Health Worker”, “Home Support Worker”, “Caregiver”, “Support Worker”.',
        'Send personalized emails introducing your qualifications and interest.',
        'Attach a concise CV and cover letter referencing specific units (e.g., “geriatrics,” “home care,” “mental health”).',
      ]
    },
    {
      name: 'Canada',
      flag: '🇨🇦',
      jobSources: [
        { name: 'Job Bank Canada', description: 'The official Government of Canada job site.', link: 'https://www.jobbank.gc.ca' },
        { name: 'HealthCareCAN', description: 'National association job portal for hospitals and health organizations.', link: 'https://www.healthcarecan.ca' },
        { name: 'Indeed Canada', description: 'Broad coverage but reliable if filtered by verified employers.', link: 'https://www.indeed.ca' },
        { name: 'Canadian Red Cross Careers', description: 'Offers positions in community and emergency health.', link: 'https://www.redcross.ca/careers' },
        { name: 'Ontario Health Careers', description: 'Jobs via HealthForceOntario.', link: 'https://www.healthforceontario.ca' },
        { name: 'Alberta Health Services', description: 'Official provincial recruitment site.', link: 'https://careers.albertahealthservices.ca' },
        { name: 'BC Health Jobs', description: 'Jobs via Health Match BC.', link: 'https://www.healthmatchbc.org' },
      ],
      directOutreach: [
        { name: 'Sunnybrook Health Sciences Centre', link: 'https://sunnybrook.ca/careers' },
        { name: 'Toronto General Hospital (UHN)', link: 'https://uhn.ca/careers' },
        { name: 'Vancouver Coastal Health', link: 'https://careers.vch.ca' },
        { name: 'Covenant Health (Alberta)', link: 'https://www.covenanthealth.ca/careers' },
        { name: 'Revera Living', link: 'https://reveraliving.com/careers' },
        { name: 'Extendicare', link: 'https://www.extendicare.com/careers' },
        { name: 'Bayshore HealthCare', link: 'https://www.bayshore.ca/careers' },
      ],
      tips: [
        'Focus on regions with high demand: Ontario, British Columbia, Alberta, Nova Scotia.',
        'Mention your eligibility for programs like the Home Child Care Provider or Home Support Worker Pilot if applicable.',
      ]
    },
    {
      name: 'Luxembourg',
      flag: '🇱🇺',
      jobSources: [
        { name: 'ADEM', description: 'Luxembourg’s official employment agency; the safest source.', link: 'https://www.adem.public.lu' },
        { name: 'Jobs.lu', description: 'Leading national job board with healthcare listings.', link: 'https://www.jobs.lu' },
        { name: 'Moovijob', description: 'Trusted platform for nursing and elder care roles.', link: 'https://www.moovijob.com' },
        { name: 'EURES Portal (EU)', description: 'Lists cross-border EU healthcare jobs including Luxembourg.', link: 'https://ec.europa.eu/eures' },
        { name: 'LinkedIn Jobs', description: 'Reliable for English-speaking positions in private hospitals.', link: 'https://www.linkedin.com/jobs' },
      ],
      directOutreach: [
        { name: 'Centre Hospitalier de Luxembourg (CHL)', link: 'https://chl.lu/fr/offres-emploi' },
        { name: 'Hôpitaux Robert Schuman', link: 'https://hopitauxschuman.lu/nous-rejoindre' },
        { name: 'Centre Hospitalier Emile Mayrisch (CHEM)', link: 'https://www.chem.lu/emploi' },
        { name: 'Rehazenter Luxembourg', link: 'https://www.rehazenter.lu' },
        { name: 'Help Luxembourg (Elder Care)', link: 'https://help.lu/fr/travailler-chez-help' },
      ],
      tips: [
        'Use search terms like: “infirmier”, “aide-soignant”, “care assistant”, “healthcare worker”.',
        'French or German proficiency is highly valued.',
        'Include bilingual terms in your CV (e.g., “Soins Gériatriques / Geriatric Care”) and translate certificates if possible.',
      ]
    },
  ]
};

export const Resources: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-800 mb-4">
          <GlobeIcon className="w-6 h-6 text-cyan-600"/>
          General Strategies for Success
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resourcesData.generalStrategies.map(strategy => (
            <div key={strategy.title} className="bg-slate-50 p-4 rounded-lg">
              <p className="font-semibold text-slate-700">{strategy.title}</p>
              <p className="text-sm text-slate-600 mt-1">{strategy.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Country-Specific Resources</h2>
        <div className="space-y-6">
          {resourcesData.countries.map((country) => (
            <div key={country.name} className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
              <h3 className="text-lg font-bold text-cyan-800 mb-6">{country.flag} {country.name}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700">
                    <LinkIcon className="h-5 w-5"/>
                    Verified Job Posting Sources
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Platform</th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {country.jobSources.map(source => (
                          <tr key={source.name}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-cyan-700">
                              <a href={source.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{source.name}</a>
                            </td>
                            <td className="px-4 py-3 whitespace-normal text-sm text-slate-600">{source.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 pt-4">
                    <BuildingIcon className="h-5 w-5"/>
                    Direct Outreach to Employers
                  </h4>
                  <ul className="space-y-2">
                    {country.directOutreach.map(employer => (
                      <li key={employer.name}>
                        <a href={employer.link} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-700 hover:underline bg-slate-100 px-3 py-1.5 rounded-md block w-full text-left transition-colors hover:bg-slate-200">
                          {employer.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 lg:border-l lg:pl-8 border-slate-200">
                   <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700">
                    <LightbulbIcon className="h-5 w-5"/>
                    Pro Tips
                  </h4>
                  <ul className="list-disc list-outside space-y-2 pl-5 text-sm text-slate-600">
                    {country.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};