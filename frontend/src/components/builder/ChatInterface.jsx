import { useState } from 'react';

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat con AI</h2>
        <p className="text-sm text-gray-500">
          {hasGeneratedOnce ? 'Chiedi modifiche o crea qualcosa di nuovo' : 'Descrivi il tuo sito e l\'AI ti guiderà'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-500 text-lg">Inizia descrivendo il tuo sito web</p>
              <p className="text-gray-400 text-sm mt-2">Esempio: "Voglio creare un sito e-commerce per sneakers streetwear"</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.tokensUsed && (
                  <p className="text-xs mt-2 opacity-70">Tokens: {msg.tokensUsed}</p>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Progress Message */}
        {progressMessage && (
          <div className="flex justify-center">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-700 font-medium">
              {progressMessage}
            </div>
          </div>
        )}
        
        {isGenerating && !progressMessage && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        {error && (
          <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        
        {/* Generate Website Button */}
        {showGenerateButton && !isGenerating && (
          <button
            onClick={handleGenerate}
            className="w-full mb-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            🚀 Genera Sito Web
          </button>
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
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows="3"
            disabled={isGenerating}
          />
          <button
            onClick={handleChat}
            disabled={isGenerating || !prompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? '⏳' : '📤'} Invia
          </button>
        </div>
      </div>
    </div>
  );
}