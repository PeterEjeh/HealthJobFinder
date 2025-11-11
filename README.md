# HealthJobFinder

A React-based AI-powered job search application that helps healthcare professionals find relevant job opportunities. Built with React, TypeScript, Vite, and powered by Google's Gemini API.

## Features

- **Smart Job Search**: Search for healthcare jobs based on keywords, job roles, and countries
- **Resume Matching**: Upload your resume for AI-powered job matching recommendations
- **Market Insights**: Get AI-generated insights about the healthcare job market
- **Filter Management**: Save and load your search filters for quick access
- **Grounded Responses**: All results include source citations for transparency
- **Responsive Design**: Beautiful UI built with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google Gemini API key (get one at [Google AI Studio](https://aistudio.google.com/app/apikey))

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PeterEjeh/HealthJobFinder.git
   cd HealthJobFinder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

## Running the App

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the port shown in your terminal).

## Building for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

- `App.tsx` - Main application component
- `components/` - React components (Header, FilterPanel, ResultsPanel, JobCard, Resources)
- `services/` - API services (Gemini API integration)
- `types.ts` - TypeScript type definitions
- `constants.ts` - Application constants (job roles, countries)
- `index.tsx` - Application entry point

## Tech Stack

- **React** 19.2.0
- **TypeScript** 5.8
- **Vite** 6.2
- **Tailwind CSS** - For styling
- **Google Gemini API** - AI-powered job search and insights
- **React DOM** 19.2.0

## Contributing

Feel free to open issues and submit pull requests to improve the project.

## License

This project is open source and available under the MIT License.
