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

// POST /api/ai/refine - MODIFICHE INTELLIGENTI E VELOCI ⚡
router.post('/refine', async (req, res) => {
  try {
    const { messages, previousCode } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    if (!previousCode) {
      return res.status(400).json({
        success: false,
        error: 'Previous code is required for refine mode'
      });
    }

    console.log('🔧 Refine request - smart modification');

    const userRequest = messages[messages.length - 1].content;

    // NUOVO PROMPT OTTIMIZZATO - MODIFICHE CHIRURGICHE
    const refinePrompt = `${SYSTEM_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ CRITICAL: SMART REFINE MODE - SURGICAL MODIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USER'S MODIFICATION REQUEST:
"${userRequest}"

EXISTING CODE TO MODIFY:
${previousCode}

YOUR TASK - INTELLIGENT ANALYSIS:

1. **ANALYZE THE REQUEST** - What exactly does the user want?
   - Is it a small change? (color, text, small feature) → Make MINIMAL modification
   - Is it a big feature? (multilingual, new section, complex functionality) → Generate fresh code

2. **MODIFICATION STRATEGY:**

   FOR SMALL CHANGES (color, font, text, button style, spacing, etc.):
   ✅ Keep 95% of existing code IDENTICAL
   ✅ Change ONLY the specific element requested
   ✅ Preserve all functionality, structure, and styling
   ✅ Output complete code with minimal changes
   
   FOR MEDIUM CHANGES (add footer, new button, simple feature):
   ✅ Keep 80% of existing code
   ✅ Add the new element cleanly
   ✅ Maintain existing design consistency
   
   FOR LARGE CHANGES (multilingual, major restructure, new complex features):
   ✅ Generate fresh professional code
   ✅ Incorporate user's request completely
   ✅ Maintain the original design spirit

3. **QUALITY RULES:**
   - Output ONLY complete HTML (start with <!DOCTYPE html>)
   - NO explanatory text before/after code
   - NO markdown code blocks
   - Everything must be FULLY FUNCTIONAL
   - If adding multilingual: ALL content must be translatable, not just navbar

4. **DECISION TREE:**
   - "change color X to Y" → SMALL (minimal modification)
   - "add footer" → MEDIUM (add new section)
   - "add multilingual EN/IT/ES with complete translation" → LARGE (fresh generation)
   - "make menu clickable" → SMALL (fix JavaScript)
   - "add shopping cart with full functionality" → LARGE (complex feature)

ANALYZE THE REQUEST AND CHOOSE THE BEST STRATEGY!

REMEMBER: 
- Small changes = Keep existing code, change only what's needed
- Large features = Generate fresh professional code
- Output only HTML, no explanations!`;

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
      
      // Calcola la differenza per vedere quanto è cambiato
      const changePercentage = calculateChangePercentage(previousCode, result.code);
      console.log(`📊 Code changed: ~${changePercentage}%`);
      
      return res.json({
        success: true,
        code: result.code,
        tokensUsed: result.tokensUsed,
        model: result.model,
        changePercentage: changePercentage
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

// Funzione helper per calcolare percentuale di cambiamento
function calculateChangePercentage(oldCode, newCode) {
  if (!oldCode || !newCode) return 100;
  
  const oldLength = oldCode.length;
  const newLength = newCode.length;
  const lengthDiff = Math.abs(oldLength - newLength);
  
  // Calcolo approssimativo
  const changeRatio = lengthDiff / Math.max(oldLength, newLength);
  return Math.round(changeRatio * 100);
}

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