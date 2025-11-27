import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '../config/prompts.js';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 20 * 60 * 1000,
  maxRetries: 2,
});

class ProjectGenerator {
  
  async generateProject(conversationHistory) {
    try {
      console.log('🚀 Generating 3-file project (HTML + CSS + JS)...');

      const projectPrompt = `${SYSTEM_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 3-FILE PROJECT GENERATION MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONVERSATION HISTORY:
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n\n')}

YOUR TASK:
Generate a complete, professional website with 3 SEPARATE files.

CRITICAL OUTPUT FORMAT:
Output ONLY a valid JSON object with this EXACT structure:

{
  "projectName": "project-name",
  "files": {
    "index.html": "complete HTML code here",
    "style.css": "complete CSS code here",
    "script.js": "complete JavaScript code here"
  }
}

FILE REQUIREMENTS:

**index.html:**
- Complete HTML5 structure
- Link to style.css: <link rel="stylesheet" href="style.css">
- Link to script.js: <script src="script.js"></script>
- All content sections (hero, about, services, contact, etc.)
- Semantic HTML
- Responsive structure
- NO inline CSS or JavaScript

**style.css:**
- ALL styling for the website
- Responsive design (mobile-first)
- Modern CSS (flexbox, grid, variables)
- Smooth animations and transitions
- Professional typography
- Exact colors from conversation

**script.js:**
- ALL JavaScript functionality
- Navigation, forms, animations
- Interactive elements
- Multilingual system (if requested)
- Cart, filters, etc. (if requested)
- Everything 100% functional

QUALITY STANDARDS:
- Modern, professional design (2024-2025 trends)
- Fully responsive
- All features working 100%
- Clean, organized code
- Production-ready

IMPORTANT:
- Output ONLY valid JSON
- NO markdown code blocks
- NO explanations
- Complete code in each file
- Everything must work perfectly`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 30000,
        messages: [
          {
            role: 'user',
            content: projectPrompt
          }
        ]
      });

      let responseText = message.content[0].text;
      
      // Remove markdown if present
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to parse JSON
      let projectData;
      try {
        projectData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.log('Response text:', responseText.substring(0, 500));
        throw new Error('Failed to parse project JSON');
      }

      console.log('✅ Project generated successfully!');
      console.log('📁 Files:', Object.keys(projectData.files).length);
      console.log('🎯 Tokens used:', message.usage.input_tokens + message.usage.output_tokens);

      return {
        success: true,
        projectData: projectData,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        model: 'claude-sonnet-4-20250514'
      };

    } catch (error) {
      console.error('❌ Project generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new ProjectGenerator();