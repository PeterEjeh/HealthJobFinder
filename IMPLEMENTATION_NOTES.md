# Implementation Notes - HealthJobFinder Enhancements

## AI Search Strategy

### Multi-Platform Coverage

The enhanced AI search specifically targets:

1. **LinkedIn** (Primary)

   - Company career pages
   - Recruiter posts
   - Direct hire opportunities
   - Visa sponsorship opportunities

2. **Indeed**

   - Verified company listings
   - Salary transparency
   - Easy filtering

3. **Glassdoor**

   - Company reviews
   - Salary insights
   - Verified employers

4. **Bing Jobs**

   - Aggregated results
   - Real-time listings

5. **Facebook**

   - Professional groups
   - Company career pages
   - Direct recruitment posts

6. **Instagram**

   - Healthcare professional communities
   - Company recruitment posts
   - Verified healthcare organizations

7. **TikTok**
   - Healthcare recruitment trends
   - Company culture posts
   - Emerging healthcare opportunities

### Visa Sponsorship Emphasis

The search specifically looks for:

- "Visa sponsorship"
- "Work visa support"
- "Relocation assistance"
- "Immigration support"
- "International candidates welcome"
- "Open to foreign workers"

### Recency Enforcement

- AI is instructed to ONLY return jobs ≤30 days old
- Posts results in YYYY-MM-DD format
- Client-side recalculation of `daysAgo`
- Additional filtering applied if needed

### Verification Strategy

Three-tier verification system:

1. **Verified** ✅

   - From official company pages
   - Verified recruiter accounts
   - Certified job boards

2. **Likely** 🟦

   - From reputable platforms (LinkedIn, Indeed)
   - Established job boards
   - Known recruitment agencies

3. **Unverified** ⚠️
   - Unknown sources
   - Social media posts without verification
   - Should be approached with caution

## Code Optimizations

### Temperature Settings

- `findJobs()`: Temperature = 0.1 (lower for deterministic results)
- `getMarketInsights()`: Temperature = 0.3 (moderate for balanced insights)

### Error Handling

- Robust JSON parsing with markdown extraction
- Fallback values for missing fields
- Graceful handling of malformed responses

### Performance Considerations

- Results sorted by recency (most recent first)
- Date filtering happens post-API call
- Minimum data transmission

## Testing Recommendations

### Test Cases:

1. **Visa Sponsorship Filter**

   - Search WITH checkbox: Should prioritize visa sponsorship mentions
   - Search WITHOUT checkbox: Should include all international opportunities

2. **Date Filter**

   - "Last 30 Days": Only jobs ≤30 days old
   - "Last 7 Days": Only jobs ≤7 days old
   - "Any Time": All jobs (but may be older)

3. **Multi-Platform Results**

   - Verify results come from different sources
   - Check source badges display correctly

4. **Verification Status**

   - LinkedIn results: Should show "likely" or "verified"
   - Unknown sources: Should show "unverified"

5. **Required Documents**
   - International jobs should list documents
   - Check for visa types, language tests, etc.

## API Key Setup

Ensure your `.env.local` contains:

```
GEMINI_API_KEY=your_actual_api_key_here
```

The application uses:

- **Model**: `gemini-2.5-flash` (fast, efficient)
- **Tools**: Google Search (for web access)
- **API**: Google Generative AI

## Prompt Engineering Notes

### Search Prompt Key Elements:

1. **Role Definition**: "Act as a HealthJobFinder expert"
2. **Filter Context**: Keywords, roles, countries, visa needs
3. **Platform Scope**: Explicitly lists all target platforms
4. **Recency Requirement**: "LAST 30 DAYS ONLY"
5. **Visa Focus**: Multiple mentions of sponsorship
6. **Authenticity**: Verification status requirements
7. **Output Format**: Strict JSON schema with all fields

### Insight Prompt Key Elements:

1. **Analyst Role**: "healthcare job market analyst"
2. **International Focus**: "specializing in international recruitment"
3. **Broad Source Coverage**: Multiple data sources
4. **Visa Context**: Immigration trends and requirements
5. **Structured Output**: Markdown format with sections

## Future Enhancements

### Short-term:

- Add salary range filtering
- Implement job bookmarking/favorites
- Add search history
- Email notification system

### Medium-term:

- Integration with visa requirement APIs
- LinkedIn profile integration (OAuth)
- Resume matching improvements
- Company review integration

### Long-term:

- Machine learning for job recommendations
- Salary benchmarking by location and role
- Visa pathway planning tools
- Community forum for job seekers
- Job application tracking system

## Troubleshooting

### No Results Returned:

1. Check internet connection
2. Verify API key in `.env.local`
3. Try broader filters (fewer restrictions)
4. Check if all required fields are filled
5. Try "Any Time" date filter temporarily

### Incorrect Results:

1. Verify filter selections
2. Check date filter setting
3. Try different keywords
4. Check visa sponsorship filters

### Slow Performance:

1. Try narrower date range
2. Reduce number of countries selected
3. Try fewer job roles
4. Check network connection

## Security Considerations

- API key stored in `.env.local` (not committed to repo)
- Resume files processed locally and sent to Gemini API
- No data stored on servers
- All searches conducted via Gemini API with Google Search
- Verification status helps identify potential scams

## Contributing

When making future changes:

1. Update type definitions first
2. Update UI components to match types
3. Update API service with new logic
4. Test with multiple filter combinations
5. Verify results meet criteria
