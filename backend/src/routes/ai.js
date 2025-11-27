import express from 'express';
import claudeService from '../services/claude.service.js';
import { SYSTEM_PROMPT } from '../config/prompts.js';

const router = express.Router();

// POST /api/ai/chat - SOLO CONVERSAZIONE (NO CODICE MAI)
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    console.log('💬 Chat request with', messages.length, 'messages');

    // PROMPT ULTRA RINFORZATO - SOLO CONVERSAZIONE
    const chatSystemPrompt = `${SYSTEM_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 CRITICAL: YOU ARE IN CONVERSATION MODE ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ABSOLUTE RULES FOR THIS MODE:
❌ DO NOT generate ANY code (HTML, CSS, JavaScript, or any programming language)
❌ DO NOT show code snippets, templates, or examples
❌ DO NOT use markdown code blocks (\`\`\`html or \`\`\`)
❌ DO NOT write <!DOCTYPE html> or any HTML tags
❌ DO NOT create design concepts with code

✅ ONLY have natural conversation in the user's language
✅ ONLY ask questions to understand requirements
✅ ONLY discuss ideas, preferences, and features in plain text
✅ Be friendly, professional, and enthusiastic

YOUR TASK:
1. Understand what website the user wants
2. Ask clarifying questions (3-4 questions)
3. Gather information: colors, style, features, content
4. Respond ONLY with conversational text
5. After gathering enough info, confirm understanding and tell user you're ready when they press the generate button

REMEMBER: This is pure conversation - code generation happens in a separate step later!`;

    // Prepara i messaggi con il system prompt
    const conversationMessages = [
      {
        role: 'user',
        content: chatSystemPrompt + '\n\nUser conversation:\n' + messages.map(m => `${m.role}: ${m.content}`).join('\n')
      }
    ];

    const result = await claudeService.chat(conversationMessages);

    if (result.success) {
      console.log('✅ Chat response received (conversation only)');
      
      return res.json({
        success: true,
        response: result.response,
        tokensUsed: result.tokensUsed
      });
    } else {
      console.error('❌ Chat failed:', result.error);
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/ai/generate - SOLO GENERAZIONE CODICE (NO TESTO)
router.post('/generate', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    console.log('🚀 Generate request - creating website code');

    // PROMPT ULTRA RINFORZATO - SOLO CODICE
    const codeGenerationPrompt = `${SYSTEM_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CRITICAL: YOU ARE IN CODE GENERATION MODE ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONVERSATION HISTORY:
${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}

ABSOLUTE RULES FOR THIS MODE:
✅ Output ONLY complete HTML code
✅ Start directly with <!DOCTYPE html>
✅ NO explanatory text before or after code
✅ NO markdown code blocks (no \`\`\`html)
✅ NO comments outside the HTML structure
✅ Just pure, clean, production-ready HTML

QUALITY REQUIREMENTS:
- Create a STUNNING, PROFESSIONAL website based on the conversation
- Use exact colors, style, and features discussed
- Modern design (2024-2025 trends)
- Fully responsive (mobile-first)
- Smooth animations and micro-interactions
- Professional typography
- Complete functionality (cart, filters, zoom, reviews, newsletter, etc.)
- If multilingual: include language switcher with all languages
- All CSS inline in <style> tag
- All JavaScript inline in <script> tag
- Self-contained single HTML file

REMEMBER: Output ONLY the HTML code, starting with <!DOCTYPE html> - nothing else!`;

    const codeMessages = [
      {
        role: 'user',
        content: codeGenerationPrompt
      }
    ];

    const result = await claudeService.generateWebsite(codeMessages);

    if (result.success) {
      console.log('✅ Website generated successfully!');
      console.log('🎯 Tokens used:', result.tokensUsed);
      
      return res.json({
        success: true,
        code: result.code,
        tokensUsed: result.tokensUsed,
        model: result.model
      });
    } else {
      console.error('❌ Generation failed:', result.error);
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/ai/refine - CORREZIONI RAPIDE (no domande, azione diretta)
router.post('/refine', async (req, res) => {
  try {
    const { messages, previousCode } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    console.log('🔧 Refine request - making corrections');

    // PROMPT PER CORREZIONI IMMEDIATE
    const refinePrompt = `${SYSTEM_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ CRITICAL: YOU ARE IN REFINE MODE - IMMEDIATE ACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONVERSATION HISTORY:
${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}

${previousCode ? `PREVIOUS CODE TO IMPROVE:\n${previousCode}\n\n` : ''}

ABSOLUTE RULES FOR REFINE MODE:
❌ DO NOT ask questions
❌ DO NOT request clarifications
❌ DO NOT explain what you'll do
✅ Take IMMEDIATE action based on the user's correction request
✅ Output ONLY the complete corrected HTML code
✅ Fix ALL issues mentioned by the user
✅ Make it FULLY FUNCTIONAL (100% working features)

USER'S CORRECTION REQUEST (LAST MESSAGE):
${messages[messages.length - 1].content}

YOUR TASK:
1. Understand what needs to be fixed/added
2. Generate complete, corrected HTML with ALL features working
3. If user asks for working menu → create ALL pages with proper navigation
4. If user asks for language switcher → make it FULLY functional with complete translations
5. If user asks for filters → make them ACTUALLY filter the products
6. If user asks for cart → make it FULLY functional with add/remove
7. EVERYTHING must work 100%

OUTPUT FORMAT:
- Start directly with <!DOCTYPE html>
- Complete, production-ready HTML
- All inline CSS and JavaScript
- EVERY feature requested must be FULLY FUNCTIONAL
- NO explanatory text, just code

REMEMBER: User is asking for corrections - ACT IMMEDIATELY, don't ask questions!`;

    const refineMessages = [
      {
        role: 'user',
        content: refinePrompt
      }
    ];

    const result = await claudeService.generateWebsite(refineMessages);

    if (result.success) {
      console.log('✅ Code refined successfully!');
      console.log('🎯 Tokens used:', result.tokensUsed);
      
      return res.json({
        success: true,
        code: result.code,
        tokensUsed: result.tokensUsed,
        model: result.model
      });
    } else {
      console.error('❌ Refine failed:', result.error);
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/ai/generate-project - Genera progetto multi-file con ZIP
router.post('/generate-project', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    console.log('🚀 Generate project request');

    // Import dinamico
    const projectGenerator = (await import('../services/project.generator.js')).default;
    const zipService = (await import('../services/zip.service.js')).default;

    // Genera il progetto
    const result = await projectGenerator.generateProject(messages);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    // Crea ZIP
    const zipBuffer = await zipService.createProjectZip(result.projectData);

    console.log('✅ Project generated and zipped!');
    console.log('🎯 Tokens used:', result.tokensUsed);

    // Invia ZIP come base64 + HTML COMPLETO per preview (con CSS inline)
const base64Zip = zipBuffer.toString('base64');

// Combina HTML + CSS + JS per preview
const htmlFile = result.projectData.files['index.html'] || '';
const cssFile = result.projectData.files['style.css'] || '';
const jsFile = result.projectData.files['script.js'] || '';

// Inserisci CSS e JS inline nell'HTML
const previewHTML = htmlFile
  .replace('</head>', `<style>${cssFile}</style></head>`)
  .replace('</body>', `<script>${jsFile}</script></body>`);

res.json({
  success: true,
  zipData: base64Zip,
  previewHTML: previewHTML,
  projectName: result.projectData.projectName,
  tokensUsed: result.tokensUsed
});

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

export default router;