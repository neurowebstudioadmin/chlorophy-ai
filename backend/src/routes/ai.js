import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Anthropic client
let anthropicClient = null;
function getAnthropicClient() {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY non trovata');
    }
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return anthropicClient;
}

// Supabase client
let supabaseClient = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('SUPABASE_URL o SUPABASE_SERVICE_KEY non trovate');
    }
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabaseClient;
}

// TIER LIMITS CONFIGURATION
const TIER_CONFIG = {
  free: {
    max_credits: 10,
    max_steps: 2,
    features: { watermark: true, download_zip: false, white_label: false }
  },
  pro: {
    max_credits: 150,
    max_steps: 6,
    features: { watermark: false, download_zip: true, white_label: false }
  },
  business: {
    max_credits: 500,
    max_steps: 10,
    features: { watermark: false, download_zip: true, white_label: true }
  },
  premium: {
    max_credits: 1500,
    max_steps: 15,
    features: { watermark: false, download_zip: true, white_label: true }
  },
  ultra: {
    max_credits: 5000,
    max_steps: 999999, // unlimited
    features: { watermark: false, download_zip: true, white_label: true }
  }
};

// 🧹 CLEAN GENERATED CODE - Remove technical descriptions
function cleanGeneratedCode(code) {
  if (!code) return code;
  
  // Patterns to remove (technical descriptions that shouldn't be visible)
  const patternsToRemove = [
    // Feature lists with emojis
    /\*\*.*?(Caratteristiche|Features|Requirements).*?\*\*[\s\S]*?(?=<\/|$)/gi,
    // Technical notes after footer
    /<\/footer>[\s\S]*?(?:pagina|page|website|sito).*?(?:professionale|modern|responsive)[\s\S]*?$/gi,
    // Lists with technical terms
    /[-•]\s*[🎨⏰📧🎭📊🔗📱🌊🚀].*?(?:responsive|animation|design|countdown|form|newsletter).*?\n/gi,
    // "Ready to use" type notes
    /🚀\s*\*\*Pronta all'uso\*\*[\s\S]*?$/gi,
    /🚀\s*\*\*Ready to use\*\*[\s\S]*?$/gi,
    // Technical feature descriptions at end
    /(?:con:|with:)[\s\S]*?(?:Design|responsive|animation|countdown)[\s\S]*?(?=<\/html>|$)/gi,
  ];
  
  let cleanedCode = code;
  
  for (const pattern of patternsToRemove) {
    cleanedCode = cleanedCode.replace(pattern, '');
  }
  
  // Remove excessive whitespace at end
  cleanedCode = cleanedCode.replace(/<\/footer>\s+<\/body>/gi, '</footer>\n</body>');
  cleanedCode = cleanedCode.trim();
  
  // Check if cleaning removed too much (sanity check)
  if (cleanedCode.length < code.length * 0.5) {
    console.warn('⚠️ Cleaning removed >50% of code, using original');
    return code;
  }
  
  if (cleanedCode.length < code.length) {
    console.log(`🧹 Cleaned code: removed ${code.length - cleanedCode.length} chars of technical text`);
  }
  
  return cleanedCode;
}

// 💬 CHAT - Claude 3 Haiku (veloce ed economico)
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array richiesto'
      });
    }

    console.log('💬 Chat request with', messages.length, 'messages');

    const lastMessage = messages[messages.length - 1];
    const userRequest = lastMessage.content.toLowerCase();

    const simpleKeywords = [
      'coming soon', 'landing page', 'portfolio', 'contact page',
      '404 page', 'thank you page', 'under construction', 'one page',
      'single page', 'simple page', 'basic page', 'startup'
    ];

    const detailedKeywords = [
      'sezioni', 'sections', 'features', 'complete', 'completo',
      'animation', 'animazioni', 'glassmorphism', 'parallax',
      'carousel', 'form', 'navbar', 'footer', 'hero'
    ];

    const isSimpleRequest = simpleKeywords.some(keyword => userRequest.includes(keyword));
    const isDetailedRequest = detailedKeywords.some(keyword => userRequest.includes(keyword)) && userRequest.length > 200;

    // Risposte immediate (0 tokens)
    if ((isSimpleRequest || isDetailedRequest) && messages.length === 1) {
      console.log('⚡ Simple/Detailed request - instant response (0 tokens)');
      
      const isItalian = /creami|crea|fai|vorrei|voglio|pagina/i.test(userRequest);
      const isSpanish = /crear|hacer|página|quiero/i.test(userRequest);
      
      let response;
      if (isItalian) {
        response = "Perfetto! Creerò una bellissima pagina per te. Premi 'Genera Sito Web' quando sei pronto! 🚀";
      } else if (isSpanish) {
        response = "¡Perfecto! Crearé una hermosa página para ti. ¡Presiona 'Generar Sitio Web' cuando estés listo! 🚀";
      } else {
        response = "Perfect! I'll create a beautiful page for you. Click 'Generate Website' when you're ready! 🚀";
      }

      return res.json({
        success: true,
        response: response,
        tokensUsed: 0
      });
    }

    const client = getAnthropicClient();
    
    console.log('🤖 Using Claude 3 Haiku');

    const chatResponse = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      messages: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      system: `You are an AI assistant for Chlorophy AI, a powerful AI website builder.

YOUR ROLE:
- Help users describe their ideal website
- Ask 1-2 clarifying questions about their project
- Be enthusiastic about Chlorophy AI's capabilities
- Keep responses SHORT and friendly

CRITICAL RULES:
- NEVER mention other tools (Wix, Squarespace, Webflow, etc.)
- NEVER say you can't generate code - Chlorophy AI does it automatically!
- After gathering info, tell them: "Perfect! Click 'Generate Website' and I'll create it for you with AI!"
- Respond in the user's language

You don't write code in chat - the "Generate Website" button triggers AI code generation.`
    });

    const responseText = chatResponse.content[0].text;

    console.log('✅ Chat response received');
    console.log(`🎯 Tokens: ${chatResponse.usage.input_tokens + chatResponse.usage.output_tokens}`);

    return res.json({
      success: true,
      response: responseText,
      tokensUsed: chatResponse.usage.input_tokens + chatResponse.usage.output_tokens
    });

  } catch (error) {
    console.error('❌ Errore chat:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Errore nella conversazione'
    });
  }
});

// 🚀 GENERATE - Multi-Step con Tier Verification
router.post('/generate', async (req, res) => {
  try {
    const { messages, userId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array richiesto'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID richiesto (authentication required)'
      });
    }

    console.log('🚀 Generate request from user:', userId);

    const supabase = getSupabaseClient();
    const client = getAnthropicClient();

    // 1. GET USER TIER & CREDITS
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('tier, credits_remaining, subscription_status')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      console.error('❌ Profile error:', profileError);
      return res.status(403).json({
        success: false,
        error: 'User profile not found'
      });
    }

    const userTier = userProfile.tier || 'free';
    const creditsAvailable = userProfile.credits_remaining || 0;
    const tierConfig = TIER_CONFIG[userTier] || TIER_CONFIG.free;

    console.log(`👤 User tier: ${userTier}, Credits: ${creditsAvailable}/${tierConfig.max_credits}`);

    // 2. DETERMINE COMPLEXITY & STEPS NEEDED
    const conversationText = messages.map(m => m.content).join(' ').toLowerCase();
    
    const complexityIndicators = {
      simple: /landing|coming soon|404|thank you|contact page|under construction/i,
      medium: /portfolio|about|blog|single page/i,
      complex: /e-commerce|shop|dashboard|multi.*page|admin/i,
      veryComplex: /saas|platform|marketplace|social|network/i
    };

    let estimatedSteps = 2; // default
    if (complexityIndicators.veryComplex.test(conversationText)) {
      estimatedSteps = 12;
    } else if (complexityIndicators.complex.test(conversationText)) {
      estimatedSteps = 8;
    } else if (complexityIndicators.medium.test(conversationText)) {
      estimatedSteps = 4;
    } else if (complexityIndicators.simple.test(conversationText)) {
      estimatedSteps = 1;  // ✅ FIXED: Pagine semplici = 1 step solo!
    }

    // Check if detailed request (long description with keywords)
    const hasDetailedSpecs = conversationText.length > 300 && 
      (conversationText.match(/section|sezione|feature|animation/gi) || []).length > 3;
    
    if (hasDetailedSpecs) {
      estimatedSteps = Math.max(estimatedSteps, 6);
    }

    // Cap steps based on tier
    const maxAllowedSteps = tierConfig.max_steps;
    const actualSteps = Math.min(estimatedSteps, maxAllowedSteps);

    console.log(`📊 Complexity: ${estimatedSteps} steps needed, ${actualSteps} allowed for ${userTier} tier`);

    // 3. CHECK CREDITS AVAILABILITY
    if (creditsAvailable < actualSteps) {
      return res.status(402).json({
        success: false,
        error: 'Insufficient credits',
        creditsNeeded: actualSteps,
        creditsAvailable: creditsAvailable,
        tierLimit: tierConfig.max_credits,
        upgradePrompt: `Upgrade to ${userTier === 'free' ? 'PRO' : 'higher tier'} for more credits!`
      });
    }

    // 4. CREATE GENERATION RECORD
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        description: messages[messages.length - 1].content.substring(0, 500),
        total_steps: actualSteps,
        completed_steps: 0,
        status: 'generating',
        model_used: 'claude-sonnet-4-5-20250929'
      })
      .select()
      .single();

    if (genError || !generation) {
      console.error('❌ Generation record error:', genError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create generation record'
      });
    }

    console.log(`📝 Generation record created: ${generation.id}`);

    // 5. MULTI-STEP GENERATION
    const conversationSummary = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    let generatedParts = [];
    let totalTokensUsed = 0;
    const startTime = Date.now();

    try {
      if (actualSteps === 1) {
        // ✅ SINGLE STEP - Complete website in one call
        console.log(`🔄 Generating complete website in 1 step...`);
        
        const prompt = `Create a complete, professional website based on this request:

${conversationSummary}

CRITICAL REQUIREMENTS:
1. Complete HTML structure with semantic tags
2. ALL CSS inside <style> tags in <head>
3. ALL JavaScript inside <script> tags before </body>
4. Modern, professional design (2024-2025 trends)
5. Responsive (mobile-first)
6. Beautiful colors and typography
7. Smooth animations and interactions
8. EVERYTHING in ONE file

ABSOLUTE PROHIBITIONS - NEVER INCLUDE:
❌ NO technical descriptions in visible HTML
❌ NO feature lists (e.g., "Characteristics:", "Features include:")
❌ NO text about "responsive", "animations", "modern design"
❌ NO comments visible to end users
❌ NO explanatory text after footer
❌ NO emoji lists of features (⏰ 📧 🎨 etc.)
❌ ONLY content the user explicitly requested
❌ NO meta-commentary about the website itself

VALIDATION:
- Everything visible must be actual website content
- No technical documentation in the HTML
- Client-ready, professional output ONLY
- If you include ANY of the prohibited items, the code will be rejected

OUTPUT: Complete, production-ready HTML file - CLEAN, PROFESSIONAL, NO TECHNICAL TEXT.`;

        const response = await client.messages.create({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 8192,
          messages: [{ role: 'user', content: prompt }]
        });

        const finalCode = response.content[0].text
          .replace(/```html\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        generatedParts.push(finalCode);
        totalTokensUsed += response.usage.input_tokens + response.usage.output_tokens;

        await supabase
          .from('generations')
          .update({ completed_steps: 1, tokens_used: totalTokensUsed })
          .eq('id', generation.id);

        console.log(`✅ Single step complete: ${response.usage.output_tokens} tokens`);

      } else {
        // STEP 1: HTML Structure + CSS
        console.log(`🔄 Step 1/${actualSteps}: Generating HTML + CSS...`);
        
        const step1Prompt = `Create a professional website based on this request:

${conversationSummary}

FOR THIS STEP: Generate ONLY the HTML structure and ALL CSS styling.

CRITICAL REQUIREMENTS:
1. Complete HTML structure with semantic tags
2. ALL CSS inside <style> tags in <head>
3. Modern, professional design (2024-2025 trends)
4. Responsive (mobile-first)
5. Beautiful colors and typography
6. NO JavaScript yet (that comes in next step)
7. Placeholder content where dynamic content will go

ABSOLUTE PROHIBITIONS - NEVER INCLUDE:
❌ NO technical descriptions in visible HTML
❌ NO feature lists (e.g., "Characteristics:", "Features include:")
❌ NO text about "responsive", "animations", "modern design"
❌ NO comments visible to end users
❌ NO explanatory text after footer
❌ NO emoji lists of features (⏰ 📧 🎨 etc.)
❌ ONLY content the user explicitly requested

OUTPUT: Complete HTML with CSS, ready for JavaScript - CLEAN, PROFESSIONAL, NO TECHNICAL TEXT.`;

        const step1Response = await client.messages.create({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 8192,
          messages: [{ role: 'user', content: step1Prompt }]
        });

        const step1Code = step1Response.content[0].text
          .replace(/```html\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        generatedParts.push(step1Code);
        totalTokensUsed += step1Response.usage.input_tokens + step1Response.usage.output_tokens;

        // Update progress
        await supabase
          .from('generations')
          .update({ completed_steps: 1, tokens_used: totalTokensUsed })
          .eq('id', generation.id);

        console.log(`✅ Step 1 complete: ${step1Response.usage.output_tokens} tokens`);

        // STEP 2+: Add JavaScript & Interactivity
        console.log(`🔄 Step 2/${actualSteps}: Adding JavaScript & Interactivity...`);

        const step2Prompt = `Add JavaScript functionality to this website:

${step1Code}

ORIGINAL REQUEST:
${conversationSummary}

FOR THIS STEP: Add ALL JavaScript functionality needed.

REQUIREMENTS:
1. Add <script> tags before </body>
2. Implement ALL interactive features requested
3. Smooth animations and transitions
4. Form validation if forms exist
5. Mobile menu functionality
6. Scroll effects
7. Any other dynamic features mentioned

ABSOLUTE PROHIBITIONS - NEVER INCLUDE:
❌ NO technical descriptions in visible HTML
❌ NO feature lists (e.g., "Characteristics:", "Features include:")
❌ NO text about "responsive", "animations", "modern design"
❌ NO comments visible to end users
❌ NO explanatory text after footer
❌ NO emoji lists of features (⏰ 📧 🎨 etc.)
❌ ONLY content the user explicitly requested

OUTPUT: The COMPLETE HTML file with CSS AND JavaScript - CLEAN, PROFESSIONAL, NO TECHNICAL TEXT.`;

        const step2Response = await client.messages.create({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 8192,
          messages: [{ role: 'user', content: step2Prompt }]
        });

        const finalCode = step2Response.content[0].text
          .replace(/```html\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        totalTokensUsed += step2Response.usage.input_tokens + step2Response.usage.output_tokens;

        // Update progress
        await supabase
          .from('generations')
          .update({ completed_steps: actualSteps, tokens_used: totalTokensUsed })
          .eq('id', generation.id);

        console.log(`✅ Step 2 complete: ${step2Response.usage.output_tokens} tokens`);

        // Use final code (includes both steps merged by Claude)
        generatedParts = [finalCode];
      }

      // 6. FINAL CODE & CLEANING
      let finalGeneratedCode = generatedParts[generatedParts.length - 1];
      
      // 🧹 Clean technical descriptions from generated code
      finalGeneratedCode = cleanGeneratedCode(finalGeneratedCode);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      // 7. USE CREDITS
      const { data: creditUsed, error: creditError } = await supabase
        .rpc('use_credits', {
          p_user_id: userId,
          p_credits_amount: actualSteps,
          p_generation_id: generation.id,
          p_description: `Generated website with ${actualSteps} steps`
        });

      if (creditError || !creditUsed) {
        console.error('⚠️ Credit deduction failed:', creditError);
        // Continue anyway - generation is done
      }

      // 8. UPDATE GENERATION RECORD
      await supabase
        .from('generations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          generated_code: finalGeneratedCode,
          html_code: finalGeneratedCode,
          credits_used: actualSteps,
          tokens_used: totalTokensUsed,
          generation_time_seconds: parseInt(duration)
        })
        .eq('id', generation.id);

      console.log('✅ Website generated successfully!');
      console.log(`🎯 Model: claude-sonnet-4-5-20250929`);
      console.log(`⏱️ Time: ${duration}s`);
      console.log(`🎯 Total tokens: ${totalTokensUsed}`);
      console.log(`💳 Credits used: ${actualSteps}`);
      console.log(`📄 Code length: ${finalGeneratedCode.length} chars`);

      return res.json({
        success: true,
        code: finalGeneratedCode,
        generation: {
          id: generation.id,
          steps_completed: actualSteps,
          total_steps: actualSteps,
          duration_seconds: parseFloat(duration)
        },
        credits: {
          used: actualSteps,
          remaining: creditsAvailable - actualSteps,
          tier: userTier
        },
        tokensUsed: totalTokensUsed
      });

    } catch (genError) {
      console.error('❌ Generation error:', genError);

      // Update generation record as failed
      await supabase
        .from('generations')
        .update({
          status: 'failed',
          error_message: genError.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', generation.id);

      throw genError;
    }

  } catch (error) {
    console.error('❌ Errore generazione:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Errore nella generazione'
    });
  }
});

// 🔧 REFINE - Multi-Step con Credit Check
router.post('/refine', async (req, res) => {
  try {
    const { messages, previousCode, userId } = req.body;

    if (!messages || !previousCode) {
      return res.status(400).json({
        success: false,
        error: 'Messages e previousCode richiesti'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID richiesto'
      });
    }

    console.log('🔧 Refine request');

    const supabase = getSupabaseClient();

    // Get user credits
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('tier, credits_remaining')
      .eq('id', userId)
      .single();

    const userTier = userProfile?.tier || 'free';
    const creditsAvailable = userProfile?.credits_remaining || 0;

    const lastUserMessage = messages[messages.length - 1].content;
    const requestLength = lastUserMessage.length;

    const hasColorKeyword = /colore|color|sfondo|background|tinta/i.test(lastUserMessage);
    const hasTitleKeyword = /titolo|title|heading|testo|text|h1|h2/i.test(lastUserMessage);

    const isTitleChange = !hasColorKeyword && hasTitleKeyword && /cambia|change|modifica|cancella|scrivi|metti/i.test(lastUserMessage) && requestLength < 100;
    const isColorChange = hasColorKeyword && /cambia|change|modifica/i.test(lastUserMessage) && requestLength < 100;

    // REGEX (0 tokens, 0 credits!)
    if (isTitleChange || isColorChange) {
      console.log('🎯 TINY CHANGE - Using regex (0 tokens, 0 credits!)');
      
      let refinedCode = previousCode;
      let changeApplied = false;

      if (isTitleChange) {
        const patterns = [
          /(?:in |to |a |con |with |metti |put |scrivi |write )["]?([^"]+)["]?$/i,
          /["]([^"]+)["]/, 
          /\b([A-Z][A-Za-z0-9\s]{2,40})$/,
          /cancella\s+(.+?)\s+(?:e\s+)?metti\s+(.+)$/i
        ];
        
        let newTitle = null;
        
        const cancellaMatch = lastUserMessage.match(/cancella\s+.+?\s+(?:e\s+)?(?:metti|scrivi|crea)\s+(.+)$/i);
        if (cancellaMatch) {
          newTitle = cancellaMatch[1].trim();
        } else {
          for (const pattern of patterns) {
            const match = lastUserMessage.match(pattern);
            if (match) {
              newTitle = match[1].trim();
              break;
            }
          }
        }
        
        if (newTitle) {
          console.log(`📝 Changing title to: "${newTitle}"`);
          refinedCode = refinedCode.replace(/(<h1[^>]*>)([^<]+)(<\/h1>)/gi, `$1${newTitle}$3`);
          refinedCode = refinedCode.replace(/(<title[^>]*>)([^<|]+)(\|?[^<]*)(<\/title>)/gi, (match, p1, p2, p3, p4) => {
            return `${p1}${newTitle}${p3}${p4}`;
          });
          changeApplied = true;
        }
      }

      if (isColorChange && !changeApplied) {
        const colorMatch = lastUserMessage.match(/(?:in |to |a )([a-z]+|#[0-9a-f]{3,6})/i);
        if (colorMatch) {
          const newColor = colorMatch[1];
          console.log(`🎨 Changing color to: "${newColor}"`);
          refinedCode = refinedCode.replace(/(background-color:\s*)[^;]+/gi, `$1${newColor}`);
          refinedCode = refinedCode.replace(/(background:\s*linear-gradient\([^)]+\))[^;]*/gi, `background: ${newColor}`);
          refinedCode = refinedCode.replace(/(--primary:\s*)[^;]+/gi, `$1${newColor}`);
          changeApplied = true;
        }
      }

      if (changeApplied) {
        console.log('✅ Applied with 0 tokens, 0 credits!');
        return res.json({
          success: true,
          code: refinedCode,
          changePercentage: 1,
          tokensUsed: 0,
          creditsUsed: 0
        });
      } else {
        console.log('⚠️ Regex failed, falling back to Claude');
      }
    }

    // CLAUDE REFINE (uses 1 credit)
    if (creditsAvailable < 1) {
      return res.status(402).json({
        success: false,
        error: 'Insufficient credits for refinement',
        creditsNeeded: 1,
        creditsAvailable: creditsAvailable
      });
    }

    console.log('🤖 Using Claude Sonnet 4.5 for refine (1 credit)');

    const client = getAnthropicClient();

    const prompt = `Modify this website based on the user's request.

USER REQUEST: "${lastUserMessage}"

CRITICAL RULES:
- Change ONLY what the user requested
- Keep 95%+ of the code identical
- Output the COMPLETE modified HTML
- Include ALL CSS and JavaScript
- NO explanations, NO markdown

CURRENT CODE:
${previousCode}

Output the complete modified HTML:`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    let refinedCode = response.content[0].text
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    if (!refinedCode.includes('<!DOCTYPE html>') || !refinedCode.includes('</html>')) {
      console.error('⚠️ Invalid code, using previous');
      refinedCode = previousCode;
    }

    // Use 1 credit
    await supabase.rpc('use_credits', {
      p_user_id: userId,
      p_credits_amount: 1,
      p_description: 'Code refinement'
    });

    console.log('✅ Code refined');
    console.log(`🎯 Tokens: ${response.usage.input_tokens + response.usage.output_tokens}`);
    console.log(`💳 Credits used: 1`);

    const changePercentage = Math.min(
      Math.round((Math.abs(refinedCode.length - previousCode.length) / previousCode.length) * 100),
      100
    );

    return res.json({
      success: true,
      code: refinedCode,
      changePercentage: changePercentage,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      creditsUsed: 1,
      creditsRemaining: creditsAvailable - 1
    });

  } catch (error) {
    console.error('❌ Errore refine:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Errore nelle correzioni'
    });
  }
});

// 📊 ANALYZE - STATIC (0 tokens, 0 credits!)
router.post('/analyze', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code richiesto'
      });
    }

    console.log('🔍 Static analysis (0 tokens, 0 credits)');

    const insights = [];
    let score = 100;

    const hasTitle = /<title[^>]*>(.+?)<\/title>/i.test(code);
    const hasDescription = /<meta[^>]*name=["']description["'][^>]*>/i.test(code);
    const hasOgTags = /<meta[^>]*property=["']og:/i.test(code);
    const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(code);
    const hasMediaQueries = /@media[^{]*\{/i.test(code);

    if (!hasTitle) {
      insights.push({
        type: 'seo',
        title: 'Missing Title Tag',
        message: 'Add a <title> tag for better SEO.',
        priority: 'high'
      });
      score -= 15;
    }

    if (!hasDescription) {
      insights.push({
        type: 'seo',
        title: 'Missing Meta Description',
        message: 'Add meta description for search engines.',
        priority: 'medium'
      });
      score -= 10;
    }

    if (!hasOgTags) {
      insights.push({
        type: 'seo',
        title: 'Add Open Graph Tags',
        message: 'Include OG tags for social sharing.',
        priority: 'low'
      });
      score -= 5;
    }

    if (!hasViewport) {
      insights.push({
        type: 'mobile',
        title: 'Missing Viewport Meta',
        message: 'Add viewport meta for mobile display.',
        priority: 'high'
      });
      score -= 15;
    }

    if (!hasMediaQueries && code.length > 5000) {
      insights.push({
        type: 'mobile',
        title: 'Add Media Queries',
        message: 'Use media queries for responsiveness.',
        priority: 'medium'
      });
      score -= 8;
    }

    const images = code.match(/<img[^>]*>/gi) || [];
    const imagesWithoutAlt = images.filter(img => !img.includes('alt=')).length;

    if (imagesWithoutAlt > 0) {
      insights.push({
        type: 'accessibility',
        title: `${imagesWithoutAlt} Images Missing Alt`,
        message: 'Add alt text for accessibility.',
        priority: 'high'
      });
      score -= Math.min(imagesWithoutAlt * 5, 20);
    }

    const hasLazyLoading = /loading=["']lazy["']/i.test(code);
    if (!hasLazyLoading && images.length > 3) {
      insights.push({
        type: 'optimization',
        title: 'Enable Lazy Loading',
        message: 'Add loading="lazy" to images.',
        priority: 'medium'
      });
      score -= 8;
    }

    if (insights.length === 0) {
      insights.push({
        type: 'design',
        title: '✨ Excellent Website!',
        message: 'Your website follows best practices.',
        priority: 'info'
      });
    }

    score = Math.max(score, 40);

    console.log(`✅ Score: ${score}/100, Insights: ${insights.length}`);

    return res.json({
      success: true,
      analysis: {
        overallScore: score,
        insights: insights
      },
      tokensUsed: 0,
      creditsUsed: 0
    });

  } catch (error) {
    console.error('❌ Errore analyze:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Errore nell\'analisi'
    });
  }
});

// 💳 GET USER CREDITS (nuovo endpoint)
router.get('/credits/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID richiesto'
      });
    }

    const supabase = getSupabaseClient();

    const { data: userProfile, error } = await supabase
      .from('profiles')
      .select('tier, credits_remaining, credits_total, credits_reset_date, subscription_status')
      .eq('id', userId)
      .single();

    if (error || !userProfile) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }

    const tierConfig = TIER_CONFIG[userProfile.tier] || TIER_CONFIG.free;

    return res.json({
      success: true,
      credits: {
        remaining: userProfile.credits_remaining,
        total: userProfile.credits_total,
        reset_date: userProfile.credits_reset_date,
        tier: userProfile.tier,
        subscription_status: userProfile.subscription_status
      },
      tier_limits: {
        max_credits: tierConfig.max_credits,
        max_steps: tierConfig.max_steps,
        features: tierConfig.features
      }
    });

  } catch (error) {
    console.error('❌ Errore get credits:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Errore nel recupero crediti'
    });
  }
});

export default router;