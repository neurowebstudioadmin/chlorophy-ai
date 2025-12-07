import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Zap, AlertCircle, CreditCard } from 'lucide-react';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import { supabase, projectsService } from '../../services/supabase';

export default function ChatInterface({ onCodeGenerated, onGenerationStart, isGenerating, setIsGenerating, generatedCode, onCreditsUpdate }) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);
  const [creditsNeeded, setCreditsNeeded] = useState(0);

  // Get user ID on mount
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUserId();
  }, []);

  // Parole chiave per riconoscere richieste di correzione
  const isRefinementRequest = (text) => {
    const keywords = [
      'sistema', 'correggi', 'fixa', 'fix', 'modifica', 'cambia', 'aggiungi',
      'togli', 'rimuovi', 'non funziona', 'non va', 'migliora', 'perfeziona',
      'aggiusta', 'ripara', 'manca', 'sbagliato', 'errore', 'colore', 'testo',
      'titolo', 'header', 'footer', 'navbar', 'menu', 'pulsante', 'button'
    ];
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
  };

  const handleChat = async () => {
    if (!prompt.trim()) {
      setError('Per favore, descrivi cosa vuoi creare o modificare');
      return;
    }

    setError('');
    setShowUpgradeAlert(false);
    
    const userMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    const newHistory = [...conversationHistory, { role: 'user', content: prompt }];
    setConversationHistory(newHistory);
    
    const currentPrompt = prompt;
    setPrompt('');
    setIsGenerating(true);

    try {
      // ✅ SOLA MODIFICA: Cambiato "message" in "messages"
      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{  // <-- QUI LA CORREZIONE
            role: "user",
            content: currentPrompt
          }]
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = { role: 'assistant', content: data.response };
        setMessages(prev => [...prev, aiMessage]);
        
        // Se il backend dice di generare, chiama handleGenerate
        if (data.shouldGenerate) {
          console.log('🚀 Auto-generating from chat response');
          // Aggiungi l'AI message alla chat
          setConversationHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
          // Chiama generate con il prompt originale
          await handleGenerateWithPrompt(data.originalPrompt || currentPrompt);
        } else {
          // Altrimenti continua la conversazione
          const updatedHistory = [...newHistory, { role: 'assistant', content: data.response }];
          setConversationHistory(updatedHistory);
          
          // Mostra bottone solo dopo alcune interazioni
          if (updatedHistory.length >= 2) {
            setShowGenerateButton(true);
          }
        }
      } else {
        setError(data.error || 'Errore nella conversazione');
      }
    } catch (err) {
      setError('Errore di rete. Controlla che il backend sia attivo.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Nuova funzione per generare con prompt specifico
  const handleGenerateWithPrompt = async (generationPrompt) => {
  if (!userId) {
    setError('Per favore effettua il login per generare un sito');
    return;
  }

  setIsGenerating(true);
  setShowGenerateButton(false);
  setShowUpgradeAlert(false);
  
  if (onGenerationStart) {
    onGenerationStart(false);
  }
  
  setProgressMessage('✨ Perfetto! Sto generando il tuo sito...');

  const progressMessages = [
    '✨ Perfetto! Sto generando il tuo sito...',
    '🎨 Creando la struttura HTML...',
    '💅 Applicando CSS e design...',
    '⚙️ Aggiungendo JavaScript e interattività...',
    '🚀 Quasi pronto! Ultimi ritocchi...'
  ];

  let progressIndex = 0;
  const progressInterval = setInterval(() => {
    progressIndex++;
    if (progressIndex < progressMessages.length) {
      setProgressMessage(progressMessages[progressIndex]);
    }
  }, 3000);

  try {
    console.log('🚀 Sending generate request for prompt:', generationPrompt);
    
    // ✅ USA LA STESSA LOGICA DI handleGenerate MA CON messages COSTRUITE DAL PROMPT
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        messages: [{
          role: "user",
          content: generationPrompt
        }],
        userId: userId
      })
    });

    const data = await response.json();
    clearInterval(progressInterval);

    // Handle insufficient credits (402 status)
    if (response.status === 402) {
      setProgressMessage('');
      setShowUpgradeAlert(true);
      setCreditsNeeded(data.creditsNeeded || 1);
      
      const errorMsg = { 
        role: 'assistant', 
        content: `⚠️ Crediti insufficienti! Hai ${data.creditsAvailable || 0} crediti, ma servono ${data.creditsNeeded || 1} per generare questo sito. ${data.upgradePrompt || 'Aggiorna il tuo piano!'}`,
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsGenerating(false);
      return;
    }

    if (data.success) {
      setProgressMessage('✅ Sito generato con successo!');
      
      console.log('✅ Generation completed!');
      console.log('🎯 Steps:', data.generation?.steps_completed, '/', data.generation?.total_steps);
      console.log('💳 Credits used:', data.credits?.used, '| Remaining:', data.credits?.remaining);
      console.log('⏱️ Duration:', data.generation?.duration_seconds, 's');
      
      // Update credits in parent
      if (onCreditsUpdate && data.credits?.remaining !== undefined) {
        onCreditsUpdate(data.credits.remaining);
      }
      
      // Send code to builder (will trigger streaming)
      onCodeGenerated(data.code, data);
      
      // SALVA PROGETTO AUTOMATICAMENTE IN DATABASE
      try {
        console.log('💾 Saving project to database...');
        await projectsService.saveAIWebsite(userId, data.code, data.generation?.id);
        console.log('✅ Project saved to database!');
      } catch (saveError) {
        console.error('⚠️ Failed to save project (non-blocking):', saveError);
      }
      
      setHasGeneratedOnce(true);
      
      const successMsg = { 
        role: 'assistant', 
        content: `✅ Sito web generato con successo! 
        
📊 Dettagli:
• Step completati: ${data.generation?.steps_completed || '?'}
• Tempo: ${data.generation?.duration_seconds || '?'}s
• Crediti usati: ${data.credits?.used || '?'}
• Crediti rimanenti: ${data.credits?.remaining || '?'}

Guarda l'anteprima a destra! Se vuoi modifiche, scrivimi pure! 🚀`,
        tokensUsed: data.tokensUsed
      };
      setMessages(prev => [...prev, successMsg]);
      
      setTimeout(() => setProgressMessage(''), 2000);
    } else {
      setError(data.error || 'Errore nella generazione');
      setProgressMessage('');
    }
  } catch (err) {
    clearInterval(progressInterval);
    setError('Errore di rete. Controlla che il backend sia attivo.');
    setProgressMessage('');
    console.error(err);
  } finally {
    setIsGenerating(false);
  }
};

  // Refine (correzioni immediate)
  const handleRefine = async (history, userRequest) => {
    if (!userId) {
      setError('Per favore effettua il login per continuare');
      setIsGenerating(false);
      return;
    }

    setShowGenerateButton(false);
    setShowUpgradeAlert(false);
    
    // 🎯 SWITCH TO STREAMING IMMEDIATELY!
    if (onGenerationStart) {
      onGenerationStart(true); // true = modification
    }
    
    setProgressMessage('⚡ Sto applicando la modifica...');

    const progressMessages = [
      '⚡ Sto applicando la modifica...',
      '🔧 Modificando il codice esistente...',
      '✨ Quasi fatto...'
    ];

    let progressIndex = 0;
    const progressInterval = setInterval(() => {
      progressIndex++;
      if (progressIndex < progressMessages.length) {
        setProgressMessage(progressMessages[progressIndex]);
      }
    }, 1500);

    try {
      console.log('🔧 Sending refine request with userId:', userId);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: history,
          previousCode: generatedCode,
          userId: userId
        })
      });

      const data = await response.json();
      clearInterval(progressInterval);

      // Handle insufficient credits
      if (response.status === 402) {
        setProgressMessage('');
        setShowUpgradeAlert(true);
        setCreditsNeeded(data.creditsNeeded || 1);
        
        const errorMsg = { 
          role: 'assistant', 
          content: `⚠️ Crediti insufficienti! Hai ${data.creditsAvailable || 0} crediti, ma servono ${data.creditsNeeded || 1} per questa modifica.`,
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      if (data.success) {
        setProgressMessage('✅ Modifica applicata!');
        
        console.log('✅ Refine completed. Change:', data.changePercentage + '%');
        console.log('💳 Credits used:', data.creditsUsed, '| Remaining:', data.creditsRemaining);
        
        // Update credits in parent
        if (onCreditsUpdate && data.creditsRemaining !== undefined) {
          onCreditsUpdate(data.creditsRemaining);
        }
        
        const successMsg = { 
          role: 'assistant', 
          content: `✅ Fatto! Ho modificato il codice (~${data.changePercentage || '10'}% cambiato). ${data.creditsUsed ? `Crediti usati: ${data.creditsUsed}` : ''}`,
          tokensUsed: data.tokensUsed
        };
        setMessages(prev => [...prev, successMsg]);
        
        onCodeGenerated(data.code, true);
        
        setTimeout(() => setProgressMessage(''), 2000);
      } else {
        setError(data.error || 'Errore nelle correzioni');
        setProgressMessage('');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Errore di rete. Controlla che il backend sia attivo.');
      setProgressMessage('');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Genera il website
  const handleGenerate = async () => {
    if (!userId) {
      setError('Per favore effettua il login per generare un sito');
      return;
    }

    setIsGenerating(true);
    setShowGenerateButton(false);
    setShowUpgradeAlert(false);
    
    // 🎯 SWITCH TO STREAMING IMMEDIATELY!
    if (onGenerationStart) {
      onGenerationStart(false); // false = new generation
    }
    
    setProgressMessage('✨ Perfetto! Sto generando il tuo sito...');

    const progressMessages = [
      '✨ Perfetto! Sto generando il tuo sito...',
      '🎨 Creando la struttura HTML...',
      '💅 Applicando CSS e design...',
      '⚙️ Aggiungendo JavaScript e interattività...',
      '🚀 Quasi pronto! Ultimi ritocchi...'
    ];

    let progressIndex = 0;
    const progressInterval = setInterval(() => {
      progressIndex++;
      if (progressIndex < progressMessages.length) {
        setProgressMessage(progressMessages[progressIndex]);
      }
    }, 3000);

    try {
      console.log('🚀 Sending generate request with userId:', userId);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: conversationHistory,
          userId: userId
        })
      });

      const data = await response.json();
      clearInterval(progressInterval);

      // Handle insufficient credits (402 status)
      if (response.status === 402) {
        setProgressMessage('');
        setShowUpgradeAlert(true);
        setCreditsNeeded(data.creditsNeeded || 1);
        
        const errorMsg = { 
          role: 'assistant', 
          content: `⚠️ Crediti insufficienti! Hai ${data.creditsAvailable || 0} crediti, ma servono ${data.creditsNeeded || 1} per generare questo sito. ${data.upgradePrompt || 'Aggiorna il tuo piano!'}`,
        };
        setMessages(prev => [...prev, errorMsg]);
        setIsGenerating(false);
        return;
      }

      if (data.success) {
        setProgressMessage('✅ Sito generato con successo!');
        
        console.log('✅ Generation completed!');
        console.log('🎯 Steps:', data.generation?.steps_completed, '/', data.generation?.total_steps);
        console.log('💳 Credits used:', data.credits?.used, '| Remaining:', data.credits?.remaining);
        console.log('⏱️ Duration:', data.generation?.duration_seconds, 's');
        
        // Update credits in parent
        if (onCreditsUpdate && data.credits?.remaining !== undefined) {
          onCreditsUpdate(data.credits.remaining);
        }
        
        // Send code to builder (will trigger streaming)
        onCodeGenerated(data.code, data);
        
        // 🆕 SALVA PROGETTO AUTOMATICAMENTE IN DATABASE
        try {
          console.log('💾 Saving project to database...');
          await projectsService.saveAIWebsite(userId, data.code, data.generation?.id);
          console.log('✅ Project saved to database!');
        } catch (saveError) {
          console.error('⚠️ Failed to save project (non-blocking):', saveError);
          // Non blocchiamo l'UX se il salvataggio fallisce
        }
        
        setHasGeneratedOnce(true);
        
        const successMsg = { 
          role: 'assistant', 
          content: `✅ Sito web generato con successo! 
          
📊 Dettagli:
• Step completati: ${data.generation?.steps_completed || '?'}
• Tempo: ${data.generation?.duration_seconds || '?'}s
• Crediti usati: ${data.credits?.used || '?'}
• Crediti rimanenti: ${data.credits?.remaining || '?'}

Guarda l'anteprima a destra! Se vuoi modifiche, scrivimi pure! 🚀`,
          tokensUsed: data.tokensUsed
        };
        setMessages(prev => [...prev, successMsg]);
        
        setTimeout(() => setProgressMessage(''), 2000);
      } else {
        setError(data.error || 'Errore nella generazione');
        setProgressMessage('');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Errore di rete. Controlla che il backend sia attivo.');
      setProgressMessage('');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="rounded-2xl backdrop-blur-xl h-full flex flex-col overflow-hidden"
      style={{
        background: 'rgba(10, 14, 39, 0.8)',
        border: `1px solid ${chlorophyTheme.colors.primary}20`,
      }}
    >
      {/* Header */}
      <div 
        className="px-6 py-4 border-b backdrop-blur-xl"
        style={{
          background: 'rgba(26, 31, 58, 0.6)',
          borderColor: `${chlorophyTheme.colors.primary}20`,
        }}
      >
        <h2 
          className="text-xl font-bold mb-1"
          style={{
            color: chlorophyTheme.colors.primary,
            fontFamily: chlorophyTheme.fonts.display,
          }}
        >
          💬 Chat con AI
        </h2>
        <p 
          className="text-sm"
          style={{ color: '#ffffff60' }}
        >
          {hasGeneratedOnce ? 'Chiedi modifiche o crea qualcosa di nuovo' : 'Descrivi il tuo sito e l\'AI ti guiderà'}
        </p>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        style={{
          background: 'rgba(10, 14, 39, 0.5)',
        }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                💬
              </motion.div>
              <p 
                className="text-lg mb-2"
                style={{ 
                  color: '#ffffff',
                  fontFamily: chlorophyTheme.fonts.body,
                }}
              >
                Inizia descrivendo il tuo sito web
              </p>
              <p 
                className="text-sm"
                style={{ color: '#ffffff60' }}
              >
                Esempio: "Voglio una landing page moderna per la mia startup"
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-white`}
              style={{
                background: msg.role === 'user'
                  ? chlorophyTheme.colors.gradients.primary
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
              >
                <p 
                  className="whitespace-pre-wrap"
                  style={{
                    fontFamily: chlorophyTheme.fonts.body,
                  }}
                >
                  {msg.content}
                </p>
                {msg.tokensUsed && (
                  <p className="text-xs mt-2 opacity-70">Tokens: {msg.tokensUsed}</p>
                )}
              </div>
            </motion.div>
          ))
        )}
        
        {/* Progress Message */}
        {progressMessage && (
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div 
              className="rounded-2xl px-4 py-3 font-medium"
              style={{
                background: `${chlorophyTheme.colors.primary}20`,
                border: `1px solid ${chlorophyTheme.colors.primary}40`,
                color: chlorophyTheme.colors.primary,
              }}
            >
              {progressMessage}
            </div>
          </motion.div>
        )}
        
        {isGenerating && !progressMessage && (
          <div className="flex justify-start">
            <div 
              className="rounded-2xl px-4 py-3"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-2 h-2 rounded-full"
                  style={{ background: chlorophyTheme.colors.primary }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full"
                  style={{ background: chlorophyTheme.colors.primary }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full"
                  style={{ background: chlorophyTheme.colors.primary }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div 
        className="px-6 py-4 border-t"
        style={{
          background: 'rgba(26, 31, 58, 0.6)',
          borderColor: `${chlorophyTheme.colors.primary}20`,
        }}
      >
        {error && (
          <motion.div 
            className="mb-3 px-4 py-2 rounded-lg text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255, 71, 87, 0.2)',
              border: '1px solid rgba(255, 71, 87, 0.4)',
              color: '#FF4757',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Upgrade Alert */}
        {showUpgradeAlert && (
          <motion.div 
            className="mb-3 px-4 py-3 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(251, 191, 36, 0.2)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              color: '#FBBF24',
            }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-1">Crediti insufficienti!</p>
                <p className="text-sm opacity-90 mb-3">
                  Servono {creditsNeeded} crediti per questa operazione. Aggiorna il tuo piano per continuare!
                </p>
                <motion.button
                  onClick={() => window.location.href = '/billing'}
                  className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: chlorophyTheme.colors.gradients.primary,
                    color: chlorophyTheme.colors.dark,
                  }}
                >
                  <CreditCard size={16} />
                  Upgrade Piano
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Generate Website Button */}
        {showGenerateButton && !isGenerating && (
          <motion.button
            onClick={handleGenerate}
            className="w-full mb-3 px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: chlorophyTheme.colors.gradients.primary,
              color: chlorophyTheme.colors.dark,
              boxShadow: `0 0 30px ${chlorophyTheme.colors.primary}40`,
            }}
          >
            <Zap size={24} />
            Genera Sito Web
          </motion.button>
        )}
        
        <div className="flex gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChat();
              }
            }}
            placeholder={hasGeneratedOnce ? "Scrivi le modifiche che vuoi fare..." : "Descrivi il tuo sito... (Invio per inviare)"}
            className="flex-1 px-4 py-3 rounded-xl focus:outline-none resize-none"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${chlorophyTheme.colors.primary}20`,
              color: '#ffffff',
              fontFamily: chlorophyTheme.fonts.body,
            }}
            rows="3"
            disabled={isGenerating}
          />
          <motion.button
            onClick={handleChat}
            disabled={isGenerating || !prompt.trim()}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: (isGenerating || !prompt.trim()) 
                ? 'rgba(255, 255, 255, 0.1)' 
                : chlorophyTheme.colors.gradients.primary,
              color: (isGenerating || !prompt.trim())
                ? '#ffffff60'
                : chlorophyTheme.colors.dark,
              cursor: (isGenerating || !prompt.trim()) ? 'not-allowed' : 'pointer',
            }}
          >
            {isGenerating ? <Sparkles size={20} /> : <Send size={20} />}
            Invia
          </motion.button>
        </div>
      </div>
    </div>
  );
}