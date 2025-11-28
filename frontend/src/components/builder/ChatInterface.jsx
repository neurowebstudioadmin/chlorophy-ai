import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Zap } from 'lucide-react';
import { chlorophyTheme } from '../../styles/chlorophy-theme';

export default function ChatInterface({ onCodeGenerated, isGenerating, setIsGenerating, generatedCode }) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

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

  // Chat con Claude (fa domande)
  const handleChat = async () => {
    if (!prompt.trim()) {
      setError('Per favore, descrivi cosa vuoi creare o modificare');
      return;
    }

    setError('');
    
    const userMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    const newHistory = [...conversationHistory, { role: 'user', content: prompt }];
    setConversationHistory(newHistory);
    
    const currentPrompt = prompt;
    setPrompt('');
    setIsGenerating(true);

    // Se ha già generato E la richiesta è una modifica → USA REFINE
    if (hasGeneratedOnce && isRefinementRequest(currentPrompt) && generatedCode) {
      console.log('🔧 Detected refinement request:', currentPrompt);
      await handleRefine(newHistory, currentPrompt);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = { role: 'assistant', content: data.response };
        setMessages(prev => [...prev, aiMessage]);
        
        const updatedHistory = [...newHistory, { role: 'assistant', content: data.response }];
        setConversationHistory(updatedHistory);
        
        if (updatedHistory.length >= 4 && !hasGeneratedOnce) {
          setShowGenerateButton(true);
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

  // Refine (correzioni immediate) - OTTIMIZZATO
  const handleRefine = async (history, userRequest) => {
    setShowGenerateButton(false);
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
      console.log('🔧 Sending refine request with previousCode length:', generatedCode?.length);
      
      const response = await fetch('http://localhost:3001/api/ai/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: history,
          previousCode: generatedCode
        })
      });

      const data = await response.json();
      clearInterval(progressInterval);

      if (data.success) {
        setProgressMessage('✅ Modifica applicata!');
        
        console.log('✅ Refine completed. Change percentage:', data.changePercentage + '%');
        
        const successMsg = { 
          role: 'assistant', 
          content: `✅ Fatto! Ho modificato il codice (${data.changePercentage || '~'}% cambiato). Guarda il risultato!`,
          tokensUsed: data.tokensUsed
        };
        setMessages(prev => [...prev, successMsg]);
        
        onCodeGenerated(data.code);
        
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

  // Genera il website - MOSTRA PREVIEW + SALVA ZIP
  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowGenerateButton(false);
    setProgressMessage('✨ Perfetto! Sto lavorando al tuo progetto...');

    const progressMessages = [
      '✨ Perfetto! Sto lavorando al tuo progetto...',
      '🎨 Sto creando il design su misura per te...',
      '⚙️ Generando file HTML, CSS, JS...',
      '📁 Organizzando la struttura del progetto...',
      '📦 Creando il file ZIP...',
      '🚀 Quasi pronto! Ultimi ritocchi...'
    ];

    let progressIndex = 0;
    const progressInterval = setInterval(() => {
      progressIndex++;
      if (progressIndex < progressMessages.length) {
        setProgressMessage(progressMessages[progressIndex]);
      }
    }, 2000);

    try {
      const response = await fetch('http://localhost:3001/api/ai/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      });

      const data = await response.json();
      clearInterval(progressInterval);

      if (data.success) {
        setProgressMessage('✅ Progetto generato con successo!');
        
        // Salva ZIP per download successivo
        window.chlorophyZipData = {
          zipData: data.zipData,
          projectName: data.projectName
        };
        
        // Mostra preview
        onCodeGenerated(data.previewHTML);
        
        setHasGeneratedOnce(true);
        
        const successMsg = { 
          role: 'assistant', 
          content: `✅ Progetto "${data.projectName}" generato! Guarda l'anteprima a destra. Usa il bottone "📦 Scarica ZIP" per scaricare i file. Se vuoi modifiche, scrivimi pure!`,
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
          className="text-lg font-semibold mb-1"
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
                Esempio: "Voglio creare un sito e-commerce per sneakers streetwear"
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
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'text-white' 
                  : 'text-white'
              }`}
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
            placeholder={hasGeneratedOnce ? "Scrivi le modifiche che vuoi fare..." : "Rispondi alle domande o descrivi il tuo sito... (Invio per inviare)"}
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