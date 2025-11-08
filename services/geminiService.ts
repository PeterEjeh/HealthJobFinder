import { GoogleGenAI } from "@google/genai";
import type { FilterState, Job, GroundingSource } from '../types';

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
      reader.onload = () => resolve((reader.result as string).split(';base64,')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        mimeType: file.type,
        data: base64EncodedData,
      },
    };
};


export const findJobs = async (filters: FilterState, resumeFile?: File | null): Promise<{ jobs: Job[], sources: GroundingSource[] }> => {
  const { keywords, roles, countries } = filters;
  
  const basePrompt = `Act as a HealthJobFinder expert. Find healthcare job listings based on the following criteria.
  
  - Keywords/Qualifications: "${keywords}"
  - Job Roles: ${roles.join(', ')}
  - Countries: ${countries.join(', ')}
  
  Please search for up-to-date job postings from authentic and credible sites. Your search should include major job boards as well as social media platforms like LinkedIn, Instagram, and TikTok.
  
  When searching on social media, prioritize posts from official company pages, verified accounts of recruiters, or well-known healthcare organizations to ensure authenticity.
  
  Crucially, prioritize job listings that are open to international applicants, for example from countries like Nigeria. Look for mentions of visa sponsorship, relocation assistance, or statements welcoming foreign candidates.

  For each job, also identify and list the necessary documents required for international applicants. This includes visa types, work permit requirements, professional license verification, language test results (e.g., IELTS, OET), and any other essential paperwork.
  `;
  
  const jsonInstruction = `
  Return the results as a JSON object inside a markdown block with the following structure: { "jobs": [{ "title": string, "company": string, "location": string, "description": string, "applyLink": string, "requiredDocuments": string[] }] }.
  The "description" should be a brief, 2-3 sentence summary.
  The "requiredDocuments" array should list essential documents for international applicants. If none are specified, return an empty array.
  If no jobs are found, return an empty "jobs" array.
  `;

  let requestContents: any;

  if (resumeFile) {
    const resumePrompt = `
    Here is the user's resume for personalization. Tailor the job search to match the skills and experience in this resume:
    `;
    const filePart = await fileToGenerativePart(resumeFile);
    requestContents = {
      parts: [
        { text: basePrompt },
        { text: resumePrompt },
        filePart,
        { text: jsonInstruction }
      ]
    };
  } else {
    requestContents = `${basePrompt}\n${jsonInstruction}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: requestContents,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.2,
      },
    });

    const sources = parseSources(response);
    const jsonResponse = parseJsonFromMarkdown(response.text);

    return { jobs: jsonResponse.jobs || [], sources };
  } catch (error) {
    console.error("Error fetching jobs from Gemini:", error);
    throw new Error("Failed to fetch job listings. The model may be unavailable or the response was malformed.");
  }
};


export const getMarketInsights = async (filters: FilterState): Promise<{ insights: string, sources: GroundingSource[] }> => {
  const { keywords, roles, countries } = filters;

  const prompt = `Act as a healthcare job market analyst. Provide insights based on the latest available data from authentic and credible sites for the following criteria:
  
  - Keywords/Qualifications: "${keywords}"
  - Job Roles: ${roles.join(', ')}
  - Countries: ${countries.join(', ')}
  
  Your analysis should draw from a wide range of sources, including traditional reports, news articles, and discussions on professional networks like LinkedIn, and even trends on platforms like Instagram and TikTok if relevant (e.g., discussions on "day in the life" of a certain role, or Q&As with professionals).

  Your analysis should answer questions like:
  - Which of these countries has the highest demand for these roles?
  - What are the trending skills or qualifications for these positions?
  - Are there any notable salary trends or regional differences?
  
  Provide a concise, well-structured analysis in Markdown format. Use headings, bold text, and bullet points for clarity.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.5,
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