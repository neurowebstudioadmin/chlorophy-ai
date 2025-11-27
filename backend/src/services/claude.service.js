import Anthropic from '@anthropic-ai/sdk';
import { generateConversationalPrompt, generateCodePrompt, GENERATION_MESSAGES } from '../config/prompts.js';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 20 * 60 * 1000, // 20 minuti timeout
  maxRetries: 2,
});

class ClaudeService {
  
  // Conversazione intelligente - fa domande prima di generare
  async chat(conversationHistory) {
    try {
      console.log('💬 Starting conversation with Claude...');
      
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: conversationHistory
      });

      const response = message.content[0].text;
      
      return {
        success: true,
        response: response,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens
      };
    } catch (error) {
      console.error('Claude Chat Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Genera website dopo aver raccolto tutte le info
  async generateWebsite(conversationHistory, onProgress) {
    try {
      console.log('🚀 Generating website with Claude...');
      
      // Simula progress messages
      if (onProgress) {
        const messages = [
          '✨ Perfetto! Sto lavorando al tuo progetto...',
          '🎨 Sto creando il design su misura per te...',
          '⚙️ Dammi un attimo, sto ottimizzando ogni dettaglio...',
          '💻 Sto generando il codice HTML...',
          '🚀 Quasi pronto! Ultimi ritocchi...'
        ];
        
        for (let i = 0; i < messages.length; i++) {
          setTimeout(() => onProgress(messages[i]), i * 2000);
        }
      }

      // Prepara conversation per code generation
      const conversationText = conversationHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n\n');

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 50000,
        messages: [
          {
            role: 'user',
            content: generateCodePrompt('', conversationText)
          }
        ]
      });

      const generatedCode = message.content[0].text;
      
      return {
        success: true,
        code: generatedCode,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        model: 'claude-sonnet-4-20250514'
      };
    } catch (error) {
      console.error('Claude Generation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new ClaudeService();