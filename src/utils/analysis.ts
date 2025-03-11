import axios from 'axios';
import { DataFrame } from 'danfojs-node';

// Interface for CV insights
interface CVInsights {
  skills: string[];
  skillsAssessment: string;
  experienceSummary: string;
  educationHighlights: string;
  strengths: string[];
  areasForImprovement: string[];
  careerRecommendations: string[];
  overallAssessment: string;
}

// Interface for LLM API response
interface LLMResponse {
  content: string;
}


async function analyzeCVWithLLM(cvText: string): Promise<CVInsights> {
  try {
    const prompt = `
    Analyze the following CV/resume content and provide structured insights:
    
    ${cvText}
    
    Provide a detailed analysis with the following structure:
    1. Top skills identified (list)
    2. Skills assessment (paragraph)
    3. Experience summary (paragraph)
    4. Education highlights (paragraph)
    5. Key strengths (list)
    6. Areas for improvement (list)
    7. Career path recommendations (list)
    8. Overall assessment (paragraph)
    
    Format your response as JSON with the following keys: skills, skillsAssessment, experienceSummary, educationHighlights, strengths, areasForImprovement, careerRecommendations, overallAssessment.
    `;

    // Make API call to LLM
    const response = await callLLMAPI(prompt);
    
    // Parse the JSON response
    const insights: CVInsights = JSON.parse(response.content);
    
    return insights;
  } catch (error) {
    console.error('Error analyzing CV with LLM:', error);
    throw new Error('Failed to analyze CV');
  }
}

/**
 * Calls the Azure OpenAI API with the given prompt
 * @param prompt The prompt to send to the LLM
 * @returns LLM response
 */
async function callLLMAPI(prompt: string): Promise<LLMResponse> {
  try {
    // Azure OpenAI specific variables
    const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
    const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
    const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4';
    const API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2023-05-15';
    
    if (!AZURE_OPENAI_KEY || !AZURE_OPENAI_ENDPOINT) {
      throw new Error('Azure OpenAI key or endpoint is not configured');
    }

    // Construct Azure OpenAI API URL
    const API_URL = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

    const response = await axios.post(
      API_URL,
      {
        messages: [
          { role: 'system', content: 'You are a professional CV analyst and career advisor.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more focused responses
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_OPENAI_KEY
        },
        timeout:30000
      }
    );

    return {
      content: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error calling Azure OpenAI API:', error);
    throw new Error('Failed to call Azure OpenAI API');
  }
}

/**
 * Formats CV insights into a presentable HTML format
 * @param insights Structured CV insights
 * @returns HTML representation of insights
 */
function formatInsightsToHTML(insights: CVInsights): string {
  return `
    <div class="cv-insights-container">
      <div class="section">
        <h2>Skills Assessment</h2>
        <div class="skills-container">
          <h3>Key Skills</h3>
          <ul class="skills-list">
            ${insights.skills.map(skill => `<li>${skill}</li>`).join('')}
          </ul>
        </div>
        <p>${insights.skillsAssessment}</p>
      </div>
      
      <div class="section">
        <h2>Experience</h2>
        <p>${insights.experienceSummary}</p>
      </div>
      
      <div class="section">
        <h2>Education</h2>
        <p>${insights.educationHighlights}</p>
      </div>
      
      <div class="section">
        <h2>Strengths & Areas for Improvement</h2>
        <div class="two-column">
          <div>
            <h3>Strengths</h3>
            <ul>
              ${insights.strengths.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3>Areas for Growth</h3>
            <ul>
              ${insights.areasForImprovement.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Career Recommendations</h2>
        <ul>
          ${insights.careerRecommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <h2>Overall Assessment</h2>
        <p>${insights.overallAssessment}</p>
      </div>
    </div>
  `;
}

/**
 * Creates a visualization of skills from CV insights
 * @param insights CV insights with skills data
 * @returns DataFrame for visualization
 */
function createSkillsVisualization(insights: CVInsights): DataFrame {
  // Create a simple DataFrame for skills visualization
  const skills = insights.skills;
  const confidenceScores = skills.map(() => Math.floor(Math.random() * 40) + 60); // Generate random scores between 60-100
  
  return new DataFrame({
    'skill': skills,
    'confidence': confidenceScores
  });
}

export {
  analyzeCVWithLLM,
  formatInsightsToHTML,
  createSkillsVisualization,
  CVInsights
};