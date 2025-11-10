HealthJobFinder 🩺

Find your next global healthcare role with the power of AI.
HealthJobFinder is a smart, AI-driven aggregator that simplifies the search for healthcare jobs across the globe. Powered by the Google Gemini API, it goes beyond traditional job boards by offering personalized results, deep market insights, and a curated list of verified resources to ensure your job hunt is safe and effective.
(Note: You would replace this with an actual screenshot of your application UI)

✨ Key Features
AI-Powered Job Search: Utilizes the Gemini API to understand complex queries and find relevant job listings from across the web.
Resume-Based Personalization: Upload your resume (.txt, .pdf, .docx) to receive job matches tailored to your specific skills and experience.
In-Depth Market Insights: Generate real-time analysis on job demand, salary trends, and required qualifications for any role in any country.
Verified & Trustworthy Sources: Leverages Google Search grounding to ensure listings are current and provides a dedicated panel of government-endorsed job boards and direct employer links.
International Focus: Prioritizes roles open to international applicants and identifies required documentation like visas and language tests.
Advanced Filtering: Easily narrow your search by job roles, countries, and keywords.
Clean & Responsive UI: A modern, accessible interface built with React and Tailwind CSS.
🚀 How It Works
The application combines a modern frontend stack with the advanced reasoning capabilities of the Google Gemini API.
User Input: The React-based UI captures user filters (roles, countries, keywords) and optional resume uploads.
Prompt Engineering: The geminiService.ts module constructs a detailed, context-rich prompt for the Gemini model (gemini-2.5-flash).
AI-Powered Search: The request is sent to the Gemini API with the googleSearch tool enabled. This allows the model to ground its responses in up-to-date information from the web, preventing outdated results.
Structured Response: The prompt instructs the model to return job listings in a structured JSON format and market insights in clean Markdown.
Data Rendering: The application parses the model's response and dynamically renders the results into interactive components like JobCard and the insights panel.
🛠️ Technology Stack
Frontend: React, TypeScript, Tailwind CSS
AI Engine: Google Gemini API (@google/genai SDK)
Core AI Feature: Google Search Grounding for real-time, fact-checked results.
⚙️ Getting Started
This project is designed to run in an environment where the Gemini API key is securely managed as an environment variable.
Prerequisites
A modern web browser.
A Google Gemini API key. You can get one from Google AI Studio.
Running Locally
Clone the repository:
code
Bash
git clone https://github.com/your-username/healthjobfinder.git
cd healthjobfinder
Set up your API Key:
The application is configured to read the API key from process.env.API_KEY. You will need to set this environment variable in the environment where you are running the application. For local development, you could use a tool like dotenv or set it directly in your shell:
code
Bash
export API_KEY="YOUR_GEMINI_API_KEY"
Serve the application:
Since this project uses importmap and doesn't have a traditional build step, you can run it with any simple local web server.
Using npx serve:
code
Bash
npx serve
Using Python:
code
Bash
python3 -m http.server
Open your browser and navigate to the local server address (e.g., http://localhost:3000 or http://localhost:8000).
📁 Project Structure
code
Code
/
├── components/          # Reusable React components
│   ├── FilterPanel.tsx    # Left-hand side panel for all filters
│   ├── Header.tsx         # Top navigation bar
│   ├── JobCard.tsx        # Individual job listing card
│   ├── Resources.tsx      # Verified resources panel content
│   └── ResultsPanel.tsx   # Main content area for tabs and results
├── services/
│   └── geminiService.ts   # All logic for interacting with the Gemini API
├── App.tsx              # Main application component, state management
├── constants.ts         # Static data (e.g., lists of roles, countries)
├── index.html           # The main HTML entry point with importmap
├── index.tsx            # React root renderer
├── metadata.json        # Application metadata
└── types.ts             # TypeScript type definitions
