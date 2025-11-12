import { GoogleGenAI } from "@google/genai";
import type { FilterState, Job, GroundingSource } from "../types.ts";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function parseSources(response: any): GroundingSource[] {
  const sources: GroundingSource[] = [];
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata?.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || new URL(chunk.web.uri).hostname,
          uri: chunk.web.uri,
        });
      }
    }
  }
  return sources;
}

function parseJsonFromMarkdown(markdown: string): any {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = markdown.match(jsonRegex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse JSON from markdown", e);
      throw new Error("The model returned invalid JSON format.");
    }
  }
  throw new Error("Could not find a JSON block in the model's response.");
}

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve((reader.result as string).split(";base64,")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      mimeType: file.type,
      data: base64EncodedData,
    },
  };
};

function calculateDaysAgo(postedDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const postDate = new Date(postedDate);
  postDate.setHours(0, 0, 0, 0);

  const timeDifference = today.getTime() - postDate.getTime();
  const daysAgo = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return Math.max(0, daysAgo);
}

function filterJobsByDate(
  jobs: Job[],
  dateFilter: "all" | "week" | "month"
): Job[] {
  if (dateFilter === "all") return jobs;

  const maxDays = dateFilter === "week" ? 7 : 30;
  return jobs.filter((job) => job.daysAgo <= maxDays);
}

function extractVerificationStatus(
  description: string,
  source: string
): "verified" | "likely" | "unverified" {
  const lowerDesc = description.toLowerCase();
  const verifiedPatterns = [
    "verified by",
    "official",
    "certified",
    "company official page",
    "linkedin verified",
  ];
  const likelyPatterns = [
    "linkedin",
    "indeed",
    "glassdoor",
    "seek",
    "recruitment agency",
  ];

  if (
    verifiedPatterns.some(
      (pattern) => lowerDesc.includes(pattern) || source.includes(pattern)
    )
  ) {
    return "verified";
  }

  if (
    likelyPatterns.some(
      (pattern) =>
        source.toLowerCase().includes(pattern) || lowerDesc.includes(pattern)
    )
  ) {
    return "likely";
  }

  return "unverified";
}

export const findJobs = async (
  filters: FilterState,
  resumeFile?: File | null
): Promise<{ jobs: Job[]; sources: GroundingSource[] }> => {
  const {
    keywords,
    roles,
    countries,
    visaSponsorshipRequired,
    internationalApplicantsOnly,
    datePostedFilter,
  } = filters;

  const visaSponsorshipQuery = visaSponsorshipRequired
    ? "with visa sponsorship OR relocation assistance"
    : "open to international applicants";
  const internationalQuery = internationalApplicantsOnly
    ? "international applicants welcome"
    : "for both local and international candidates";

  const basePrompt = `Act as a HealthJobFinder expert. Find RECENT healthcare job listings (posted within the last 30 days only) based on the following criteria.
  
  - Keywords/Qualifications: "${keywords}"
  - Job Roles: ${roles.length > 0 ? roles.join(", ") : "Any healthcare role"}
  - Countries/Regions: ${countries.length > 0 ? countries.join(", ") : "Any"}
  - Visa Requirements: ${visaSponsorshipQuery}
  - International Applicants: ${internationalQuery}
  
  CRITICAL REQUIREMENTS:
  1. Search across MULTIPLE platforms simultaneously:
     - LinkedIn (linkedin.com) - priority source
     - Indeed (indeed.com)
     - Glassdoor (glassdoor.com)
     - Bing Jobs (bing.com/jobs)
     - Facebook (facebook.com/careers, job groups)
     - Instagram (professional healthcare job posting accounts)
     - TikTok (healthcare recruitment channels)
     - Indeed, Reed, Seek, and other regional job boards
  
  2. ONLY include jobs posted within the LAST 30 DAYS:
     - Filter out any jobs posted more than 30 days ago
     - Include the exact posting date in your results
     - Calculate days ago from today
  
  3. VISA SPONSORSHIP & INTERNATIONAL FOCUS:
     - Explicitly search for keywords: "visa sponsorship", "work visa", "relocation assistance", "immigration support"
     - Prioritize listings that explicitly mention sponsorship or international welcome
     - For each job, clearly indicate if visa sponsorship is available
  
  4. AUTHENTICITY & VERIFICATION:
     - Only include jobs from verified company pages, official recruiters, or established job boards
     - Avoid unverified or suspicious sources
     - Verify company legitimacy through multiple sources if necessary
     - Mark the verification status for each job (verified, likely, unverified)
  
  5. For each job, identify and list:
     - The exact platform/source it was found on
     - The precise posting date
     - Whether visa sponsorship is explicitly mentioned
     - Required documents for international applicants
  
  Only return jobs that match the international applicant criteria. Remove any listings that don't mention openness to international applicants or visa support.
  `;

  const jsonInstruction = `
  Return the results as a JSON object inside a markdown block with the following structure:
  {
    "jobs": [
      {
        "title": string,
        "company": string,
        "location": string,
        "description": string (2-3 sentences),
        "applyLink": string,
        "requiredDocuments": string[],
        "visaSponsorshipAvailable": boolean,
        "internationalApplicantsWelcome": boolean,
        "postedDate": string (YYYY-MM-DD format),
        "daysAgo": number,
        "source": string (e.g., "LinkedIn", "Indeed", "Facebook"),
        "verificationStatus": string ("verified" | "likely" | "unverified")
      }
    ]
  }
  
  CRITICAL:
  - Ensure ALL jobs are from the last 30 days ONLY
  - Ensure ALL jobs support international applicants or have visa sponsorship
  - daysAgo must be <= 30
  - If no jobs match these strict criteria, return an empty array
  - Do NOT include jobs that don't meet these requirements
  `;

  let requestContents: any;

  if (resumeFile) {
    const resumePrompt = `
    Here is the user's resume for personalization. Tailor the job search to match the skills and experience in this resume. Prioritize jobs that align with this profile:
    `;
    const filePart = await fileToGenerativePart(resumeFile);
    requestContents = {
      parts: [
        { text: basePrompt },
        { text: resumePrompt },
        filePart,
        { text: jsonInstruction },
      ],
    };
  } else {
    requestContents = `${basePrompt}\n${jsonInstruction}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: requestContents,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Lower temperature for more deterministic results
      },
    });

    const sources = parseSources(response);
    const jsonResponse = parseJsonFromMarkdown(response.text);

    // Post-process and validate jobs
    let jobs: Job[] = (jsonResponse.jobs || []).map((job: any) => ({
      title: job.title || "Unknown Position",
      company: job.company || "Unknown Company",
      location: job.location || "Unknown Location",
      description: job.description || "No description provided",
      applyLink: job.applyLink || "",
      requiredDocuments: job.requiredDocuments || [],
      visaSponsorshipAvailable: job.visaSponsorshipAvailable || false,
      internationalApplicantsWelcome:
        job.internationalApplicantsWelcome || false,
      postedDate: job.postedDate || new Date().toISOString().split("T")[0],
      daysAgo:
        job.daysAgo ||
        calculateDaysAgo(
          job.postedDate || new Date().toISOString().split("T")[0]
        ),
      source: job.source || "Unknown Source",
      verificationStatus:
        job.verificationStatus ||
        extractVerificationStatus(job.description || "", job.source || ""),
    }));

    // Apply date filter
    jobs = filterJobsByDate(jobs, datePostedFilter);

    // Sort by most recent first
    jobs.sort((a, b) => a.daysAgo - b.daysAgo);

    return { jobs, sources };
  } catch (error) {
    console.error("Error fetching jobs from Gemini:", error);
    throw new Error(
      "Failed to fetch job listings. The model may be unavailable or the response was malformed."
    );
  }
};

export const getMarketInsights = async (
  filters: FilterState
): Promise<{ insights: string; sources: GroundingSource[] }> => {
  const {
    keywords,
    roles,
    countries,
    visaSponsorshipRequired,
    internationalApplicantsOnly,
  } = filters;

  const visaSponsorshipContext = visaSponsorshipRequired
    ? "with focus on visa sponsorship and relocation trends"
    : "for international applicants";
  const internationalContext = internationalApplicantsOnly
    ? "highlighting opportunities for international professionals"
    : "across different applicant backgrounds";

  const prompt = `Act as a healthcare job market analyst specializing in international recruitment. Provide insights ${internationalContext} based on the latest available data from authentic and credible sources for the following criteria:
  
  - Keywords/Qualifications: "${keywords}"
  - Job Roles: ${roles.length > 0 ? roles.join(", ") : "All healthcare roles"}
  - Countries/Regions: ${
    countries.length > 0 ? countries.join(", ") : "Global markets"
  }
  - Focus: ${visaSponsorshipContext}
  
  Your analysis should draw from a wide range of sources, including:
  - Traditional job boards (LinkedIn, Indeed, Glassdoor)
  - Social media insights (Instagram, TikTok trends on healthcare careers)
  - News articles and professional publications
  - Visa and immigration policy updates
  - Industry reports on healthcare recruitment
  
  Your analysis should answer:
  - Which countries offer the best opportunities for international applicants?
  - What visa sponsorship trends are emerging?
  - What are the trending skills and qualifications?
  - What are typical salary ranges and benefits for international hires?
  - What common barriers exist for international applicants?
  - How are companies adapting their recruitment for global talent?
  
  Provide a concise, well-structured analysis in Markdown format. Use headings, bold text, and bullet points for clarity.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    const sources = parseSources(response);
    const insights = response.text;

    return { insights, sources };
  } catch (error) {
    console.error("Error fetching insights from Gemini:", error);
    throw new Error("Failed to fetch market insights. Please try again later.");
  }
};
