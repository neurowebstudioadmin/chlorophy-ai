import { useState } from 'react';

export default function LivePreview({ code, isGenerating }) {
  const [viewMode, setViewMode] = useState('desktop');

  const getPreviewWidth = () => {
    switch(viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const handleDownloadZip = () => {
    if (!window.chlorophyZipData) {
      alert('Nessun progetto ZIP disponibile. Genera prima un sito!');
      return;
    }

    const { zipData, projectName } = window.chlorophyZipData;
    
    // Converti base64 in blob
    const byteCharacters = atob(zipData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/zip' });
    
    // Scarica
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
          <p className="text-sm text-gray-500">Real-time website preview</p>
        </div>
        
        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'desktop' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🖥️ Desktop
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'tablet' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📱 Tablet
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'mobile' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📱 Mobile
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {!code && !isGenerating ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-6xl mb-4">👁️</div>
              <p className="text-gray-500 text-lg">Preview will appear here</p>
              <p className="text-gray-400 text-sm mt-2">Generate a website to see the live preview</p>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Generating your website...</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div 
              className="bg-white rounded-lg shadow-xl transition-all duration-300"
              style={{ width: getPreviewWidth(), minHeight: '600px' }}
            >
              <iframe
                srcDoc={code}
                className="w-full h-full rounded-lg"
                style={{ minHeight: '600px' }}
                title="Website Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {code && (
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          {/* Download ZIP Button */}
          {window.chlorophyZipData && (
            <button
              onClick={handleDownloadZip}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center gap-2"
            >
              📦 Scarica ZIP
            </button>
          )}
          
          {/* Full Screen Preview Button */}
          <button
            onClick={() => {
              const blob = new Blob([code], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
          >
            🚀 Vedi Anteprima
          </button>
        </div>
      )}
    </div>
  );
}