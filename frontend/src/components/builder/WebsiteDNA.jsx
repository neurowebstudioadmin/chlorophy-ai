import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, Eye, Shield, Activity, AlertCircle, CheckCircle, 
  XCircle, BarChart3, TrendingUp, Cpu, Globe, Code, Image as ImageIcon, 
  FileText, Zap, Search, Gauge, Smartphone, Layers, Link as LinkIcon,
  Type, Wifi, Clock, Hash, FileCode, AlertTriangle, Palette,
  Layout, FileJson, Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const WebsiteDNA = ({ generatedCode }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    if (generatedCode && generatedCode.trim().length > 100) {
      performDeepAnalysis(generatedCode);
    } else {
      setAnalysis(null);
    }
  }, [generatedCode]);

  const extractCSS = (code) => {
    const cssMatches = [];
    
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    while ((styleMatch = styleRegex.exec(code)) !== null) {
      cssMatches.push(styleMatch[1]);
    }
    
    const inlineRegex = /style=["']([^"']+)["']/gi;
    let inlineMatch;
    while ((inlineMatch = inlineRegex.exec(code)) !== null) {
      cssMatches.push(inlineMatch[1]);
    }
    
    const externalRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi;
    const externalCSS = [];
    let externalMatch;
    while ((externalMatch = externalRegex.exec(code)) !== null) {
      externalCSS.push(externalMatch[1]);
    }
    
    return {
      internal: cssMatches.join('\n'),
      inlineCount: (code.match(/style=["']/gi) || []).length,
      external: externalCSS,
      totalSize: cssMatches.join('\n').length
    };
  };

  const extractJavaScript = (code) => {
    const jsMatches = [];
    
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(code)) !== null) {
      if (scriptMatch[1] && !scriptMatch[1].includes('src=')) {
        jsMatches.push(scriptMatch[1]);
      }
    }
    
    const inlineEvents = [
      'onclick', 'onload', 'onmouseover', 'onmouseout', 'onkeydown',
      'onkeyup', 'onsubmit', 'onchange', 'onfocus', 'onblur'
    ];
    
    let inlineJS = [];
    inlineEvents.forEach(event => {
      const regex = new RegExp(`${event}=["']([^"']+)["']`, 'gi');
      const matches = code.match(regex) || [];
      inlineJS = inlineJS.concat(matches);
    });
    
    const externalRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
    const externalJS = [];
    let externalMatch;
    while ((externalMatch = externalRegex.exec(code)) !== null) {
      externalJS.push(externalMatch[1]);
    }
    
    const allJS = jsMatches.join('\n');
    const jsLines = allJS.split('\n').length;
    const jsFunctions = (allJS.match(/function\s+\w+|=>/g) || []).length;
    const jsVariables = (allJS.match(/(const|let|var)\s+\w+/g) || []).length;
    
    return {
      internal: jsMatches.join('\n'),
      inlineEvents: inlineJS.length,
      external: externalJS,
      complexity: {
        lines: jsLines,
        functions: jsFunctions,
        variables: jsVariables,
        size: allJS.length
      }
    };
  };

  const analyzeHTMLStructure = (code) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');
    
    const elements = {
      headers: doc.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
      h1: doc.querySelectorAll('h1').length,
      h2: doc.querySelectorAll('h2').length,
      h3: doc.querySelectorAll('h3').length,
      paragraphs: doc.querySelectorAll('p').length,
      lists: doc.querySelectorAll('ul, ol').length,
      listItems: doc.querySelectorAll('li').length,
      images: doc.querySelectorAll('img').length,
      links: doc.querySelectorAll('a').length,
      forms: doc.querySelectorAll('form').length,
      inputs: doc.querySelectorAll('input, textarea, select').length,
      buttons: doc.querySelectorAll('button, input[type="button"], input[type="submit"]').length,
      tables: doc.querySelectorAll('table').length,
      semantic: {
        header: doc.querySelectorAll('header').length,
        nav: doc.querySelectorAll('nav').length,
        main: doc.querySelectorAll('main').length,
        article: doc.querySelectorAll('article').length,
        section: doc.querySelectorAll('section').length,
        aside: doc.querySelectorAll('aside').length,
        footer: doc.querySelectorAll('footer').length
      },
      imagesWithAlt: Array.from(doc.querySelectorAll('img')).filter(img => img.hasAttribute('alt')).length,
      linksWithTitle: Array.from(doc.querySelectorAll('a')).filter(a => a.hasAttribute('title')).length,
      buttonsWithType: Array.from(doc.querySelectorAll('button')).filter(btn => btn.hasAttribute('type')).length,
      hasLang: doc.documentElement.hasAttribute('lang'),
      langValue: doc.documentElement.getAttribute('lang') || 'none',
      hasViewport: doc.querySelector('meta[name="viewport"]') !== null,
      hasTitle: doc.querySelector('title') !== null,
      titleLength: doc.querySelector('title')?.textContent?.length || 0,
      hasMetaDescription: doc.querySelector('meta[name="description"]') !== null,
      metaDescriptionLength: doc.querySelector('meta[name="description"]')?.getAttribute('content')?.length || 0,
      hasCharset: doc.querySelector('meta[charset]') !== null,
      hasCanonical: doc.querySelector('link[rel="canonical"]') !== null
    };
    
    return elements;
  };

  const analyzeCSSQuality = (css) => {
    if (!css || css.length === 0) return {
      score: 0,
      rules: 0,
      selectors: 0,
      properties: 0,
      mediaQueries: 0,
      specificityIssues: 0,
      duplicates: 0
    };
    
    const lines = css.split('\n');
    let rules = 0;
    let selectors = 0;
    let properties = 0;
    let mediaQueries = 0;
    let specificityIssues = 0;
    const seenRules = new Set();
    let duplicates = 0;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.includes('{') && !trimmed.includes('@')) {
        rules++;
        const selector = trimmed.split('{')[0].trim();
        if (seenRules.has(selector)) {
          duplicates++;
        }
        seenRules.add(selector);
        
        if (selector.includes('#id')) specificityIssues++;
        if (selector.split('.').length > 3) specificityIssues++;
      }
      
      if (trimmed.includes('{') && !trimmed.includes('@')) {
        selectors++;
      }
      
      if (trimmed.includes(':') && trimmed.includes(';')) {
        properties++;
      }
      
      if (trimmed.includes('@media')) {
        mediaQueries++;
      }
    });
    
    let score = 100;
    
    if (css.includes('style="')) score -= 10;
    if (duplicates > 0) score -= Math.min(20, duplicates * 5);
    if (specificityIssues > 0) score -= Math.min(15, specificityIssues * 3);
    if (mediaQueries > 0) score += Math.min(10, mediaQueries * 2);
    if (rules > 5 && properties / rules > 3) score += 10;
    
    return {
      score: Math.max(0, Math.min(100, score)),
      rules,
      selectors,
      properties,
      mediaQueries,
      specificityIssues,
      duplicates,
      hasFlexGrid: css.includes('display: flex') || css.includes('display: grid'),
      hasAnimations: css.includes('@keyframes') || css.includes('animation:'),
      hasVariables: css.includes('--') || css.includes('var('),
      sizeKB: (css.length / 1024).toFixed(2)
    };
  };

  const analyzeJavaScriptQuality = (js) => {
    if (!js || js.length === 0) return {
      score: 0,
      lines: 0,
      functions: 0,
      variables: 0,
      errors: 0,
      modernFeatures: 0,
      hasConsoleLogs: false,
      hasErrors: false
    };
    
    const jsCode = js.internal || js;
    const lines = jsCode.split('\n').length;
    const functions = (jsCode.match(/function\s+\w+|=>|class\s+\w+/g) || []).length;
    const variables = (jsCode.match(/(const|let|var)\s+\w+/g) || []).length;
    
    let score = 100;
    let errors = 0;
    let modernFeatures = 0;
    
    if (jsCode.includes('eval(')) {
      score -= 20;
      errors++;
    }
    
    if (jsCode.includes('document.write(')) {
      score -= 15;
      errors++;
    }
    
    if (jsCode.includes('innerHTML') && !jsCode.includes('textContent')) {
      score -= 10;
      errors++;
    }
    
    if (jsCode.includes('const ') || jsCode.includes('let ')) modernFeatures++;
    if (jsCode.includes('=>')) modernFeatures++;
    if (jsCode.includes('async') || jsCode.includes('await')) modernFeatures++;
    if (jsCode.includes('class ')) modernFeatures++;
    if (jsCode.includes('import ') || jsCode.includes('export ')) modernFeatures++;
    
    score += Math.min(20, modernFeatures * 4);
    
    if (jsCode.includes('console.log')) {
      score -= 5;
    }
    
    if (functions > 10 && lines / functions < 5) {
      score -= 10;
    }
    
    return {
      score: Math.max(0, Math.min(100, score)),
      lines,
      functions,
      variables,
      errors,
      modernFeatures,
      hasConsoleLogs: jsCode.includes('console.log'),
      hasErrors: errors > 0,
      hasDOMmanipulation: jsCode.includes('getElementById') || jsCode.includes('querySelector'),
      hasEvents: jsCode.includes('addEventListener'),
      sizeKB: (jsCode.length / 1024).toFixed(2)
    };
  };

  const calculatePerformanceMetrics = (html, css, js) => {
    const totalSize = (html.length + css.totalSize + js.complexity.size) / 1024;
    
    let score = 100;
    
    if (totalSize > 200) score -= 30;
    else if (totalSize > 100) score -= 15;
    else if (totalSize > 50) score -= 5;
    
    const externalScripts = js.external || [];
    const nonAsyncScripts = externalScripts.filter(url => 
      html.includes(`src="${url}"`) && !html.includes(`async`) && !html.includes(`defer`)
    ).length;
    
    score -= nonAsyncScripts * 5;
    score -= Math.min(10, css.inlineCount);
    
    const lazyImages = (html.match(/loading=["']lazy["']/gi) || []).length;
    score += Math.min(10, lazyImages * 2);
    
    const webpImages = (html.match(/\.webp/gi) || []).length;
    const svgImages = (html.match(/\.svg/gi) || []).length;
    score += Math.min(10, (webpImages + svgImages) * 2);
    
    return {
      score: Math.max(0, Math.min(100, score)),
      totalSize: totalSize.toFixed(2),
      requests: externalScripts.length + (css.external || []).length,
      nonAsyncScripts,
      lazyImages,
      optimizedAssets: webpImages + svgImages,
      cssInlineCount: css.inlineCount
    };
  };

  const calculateAccessibilityScore = (htmlElements, css, js) => {
  let score = 100;
  const issues = [];
  
  // HTML Accessibility
  if (!htmlElements.hasLang) {
    score -= 15;
    issues.push('Missing lang attribute');
  }
  
  if (htmlElements.h1 === 0) {
    score -= 10;
    issues.push('No H1 heading found');
  } else if (htmlElements.h1 > 1) {
    score -= 5;
    issues.push('Multiple H1 headings');
  }
  
  const imagesWithoutAlt = htmlElements.images - htmlElements.imagesWithAlt;
  if (imagesWithoutAlt > 0) {
    score -= Math.min(20, imagesWithoutAlt * 5);
    issues.push(`${imagesWithoutAlt} images without alt text`);
  }
  
  // FIX 1: Aggiungi questo controllo (riga ~356)
  if (css && css.internal && css.internal.includes('color: #000') && css.internal.includes('background: #000')) {
    score -= 10;
    issues.push('Possible contrast issues');
  }
  
  // FIX 2: Aggiungi questi controlli (riga ~360)
  if (js && js.internal && js.complexity && js.complexity.size > 0) {
    if (js.internal.includes('tabIndex') || js.internal.includes('focus()')) {
      score += 10;
    }
  }
  
  // Form accessibility
  if (htmlElements.inputs > 0) {
    const labels = (htmlElements.forms > 0 ? htmlElements.inputs : 0);
    if (labels < htmlElements.inputs) {
      score -= Math.min(15, (htmlElements.inputs - labels) * 3);
      issues.push('Some inputs missing labels');
    }
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    wcagLevel: score >= 90 ? 'AAA' : score >= 80 ? 'AA' : 'A',
    imagesWithoutAlt,
    hasSemanticHTML: Object.values(htmlElements.semantic).some(val => val > 0)
  };
};

  const calculateSEOScore = (htmlElements, css, js, totalSize) => {
    let score = 100;
    const warnings = [];
    const recommendations = [];
    
    if (!htmlElements.hasTitle) {
      score -= 20;
      warnings.push('Missing title tag');
    } else if (htmlElements.titleLength < 30 || htmlElements.titleLength > 60) {
      score -= 10;
      warnings.push(`Title length (${htmlElements.titleLength}) not optimal (30-60 chars)`);
    }
    
    if (!htmlElements.hasMetaDescription) {
      score -= 15;
      warnings.push('Missing meta description');
    } else if (htmlElements.metaDescriptionLength < 120 || htmlElements.metaDescriptionLength > 160) {
      score -= 8;
      warnings.push(`Meta description length (${htmlElements.metaDescriptionLength}) not optimal (120-160 chars)`);
    }
    
    if (!htmlElements.hasCanonical) {
      score -= 5;
      recommendations.push('Add canonical URL');
    }
    
    if (!htmlElements.hasViewport) {
      score -= 10;
      warnings.push('Missing viewport meta tag');
    }
    
    if (!htmlElements.hasCharset) {
      score -= 5;
      warnings.push('Missing charset declaration');
    }
    
    if (htmlElements.paragraphs < 2) {
      score -= 10;
      recommendations.push('Add more text content');
    }
    
    if (htmlElements.headers < 3) {
      score -= 5;
      recommendations.push('Improve heading structure');
    }
    
    if (totalSize > 100) {
      score -= 10;
      recommendations.push('Optimize page size for faster loading');
    }
    
    if (js.external && js.external.length > 5) {
      score -= 5;
      recommendations.push('Reduce external JavaScript requests');
    }
    
    const cssAnalysis = analyzeCSSQuality(css.internal);
    if (cssAnalysis.mediaQueries === 0 && htmlElements.images > 0) {
      score -= 10;
      warnings.push('No responsive design detected');
    }
    
    return {
      score: Math.max(0, Math.min(100, score)),
      warnings,
      recommendations,
      titleOptimal: htmlElements.titleLength >= 30 && htmlElements.titleLength <= 60,
      metaOptimal: htmlElements.metaDescriptionLength >= 120 && htmlElements.metaDescriptionLength <= 160,
      isMobileFriendly: cssAnalysis.mediaQueries > 0,
      headingStructure: htmlElements.headers >= 3
    };
  };

  const performDeepAnalysis = (code) => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        const htmlElements = analyzeHTMLStructure(code);
        const css = extractCSS(code);
        const js = extractJavaScript(code);
        
        const cssAnalysis = analyzeCSSQuality(css.internal);
        const jsAnalysis = analyzeJavaScriptQuality(js);
        const performance = calculatePerformanceMetrics(code, css, js);
        const accessibility = calculateAccessibilityScore(htmlElements, css, js);
        const seo = calculateSEOScore(htmlElements, css, js, performance.totalSize);
        
        const overall = Math.round(
          (seo.score * 0.3) + 
          (accessibility.score * 0.25) + 
          (performance.score * 0.25) + 
          (cssAnalysis.score * 0.1) + 
          (jsAnalysis.score * 0.1)
        );
        
        setAnalysis({
          overall,
          scores: {
            seo: seo.score,
            accessibility: accessibility.score,
            performance: performance.score,
            css: cssAnalysis.score,
            javascript: jsAnalysis.score
          },
          details: {
            html: htmlElements,
            css: cssAnalysis,
            javascript: jsAnalysis,
            performance,
            accessibility,
            seo
          },
          stats: {
            totalSizeKB: performance.totalSize,
            totalLines: code.split('\n').length,
            totalElements: Object.values(htmlElements).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0),
            externalResources: (js.external?.length || 0) + (css.external?.length || 0)
          },
          generatedAt: new Date().toISOString(),
          recommendations: [
            ...seo.recommendations,
            ...accessibility.issues.map(issue => `Accessibility: ${issue}`),
            ...seo.warnings.map(warning => `SEO: ${warning}`)
          ].slice(0, 10)
        });
      } catch (error) {
        console.error('Analysis error:', error);
        setAnalysis({
          overall: 0,
          scores: { seo: 0, accessibility: 0, performance: 0, css: 0, javascript: 0 },
          error: 'Failed to analyze code'
        });
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const generateProfessionalPDF = async () => {
  if (!analysis) {
    alert('No analysis data available');
    return;
  }
  
  setLoading(true);
  
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let y = 20;
    
    // Titolo
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Website Technical Analysis Report', 20, y);
    
    y += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, y);
    
    // Logo Chlorophy AI in alto a destra
    pdf.setFontSize(9);
    pdf.setTextColor(16, 185, 129); // Chlorophy green
    pdf.text('CHLOROPHY AI', 140, 22);

    pdf.setFontSize(7);
    pdf.setTextColor(6, 182, 212); // Chlorophy cyan
    pdf.text('AI Website Builder', 140, 27);

    // Linea sottile decorativa sotto il logo
    pdf.setDrawColor(16, 185, 129);
    pdf.setLineWidth(0.3);
    pdf.line(140, 29, 190, 29);

    // 👆👆👆 FINE LOGO 👆👆👆
    y += 15;
    
    // Overall Score
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Overall Quality Score: ${analysis.overall}/100`, 20, y);
    
    y += 10;
    
    // Score Rings (semplificati)
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Detailed Scores:', 20, y);
    
    y += 10;
    
    const scores = [
      ['SEO Score', analysis.scores.seo],
      ['Accessibility Score', analysis.scores.accessibility],
      ['Performance Score', analysis.scores.performance],
      ['CSS Quality', analysis.scores.css],
      ['JavaScript Quality', analysis.scores.javascript]
    ];
    
    scores.forEach(([label, value]) => {
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`${label}:`, 20, y);
      
      // Colori
      const color = value >= 80 ? [46, 204, 113] : 
                   value >= 60 ? [241, 196, 15] : 
                   [231, 76, 60];
      pdf.setTextColor(...color);
      pdf.text(value.toString() + '/100', 70, y);
      
      y += 8;
    });
    
    y += 10;
    
    // Technical Details
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Technical Details:', 20, y);
    
    y += 10;
    
    const details = [
      ['Total Size', `${analysis.stats?.totalSizeKB || 0} KB`],
      ['HTML Elements', analysis.stats?.totalElements?.toString() || '0'],
      ['Total Images', analysis.details?.html?.images?.toString() || '0'],
      ['Images with Alt', analysis.details?.html?.imagesWithAlt?.toString() || '0'],
      ['CSS Rules', analysis.details?.css?.rules?.toString() || '0'],
      ['JavaScript Functions', analysis.details?.javascript?.functions?.toString() || '0'],
      ['External Resources', analysis.stats?.externalResources?.toString() || '0'],
      ['Mobile Friendly', analysis.details?.seo?.isMobileFriendly ? 'Yes' : 'No']
    ];
    
    details.forEach(([label, value]) => {
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(label, 20, y);
      pdf.setTextColor(40, 40, 40);
      pdf.text(value, 70, y);
      y += 7;
    });
    
    y += 10;
    
    // Recommendations
    if (analysis.recommendations && analysis.recommendations.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Recommendations:', 20, y);
      
      y += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(40, 40, 40);
      
      analysis.recommendations.forEach((rec, index) => {
        if (y > 270) { // Nuova pagina se necessario
          pdf.addPage();
          y = 20;
        }
        pdf.text(`${index + 1}. ${rec}`, 25, y);
        y += 7;
      });
    }
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by WebsiteDNA Analyzer • Professional Web Audit', 105, 287, { align: 'center' });
    
    // Salva
    pdf.save(`website-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('PDF Generated Successfully! Check your downloads folder.');
  } finally {
    setLoading(false);
  }
};

  const ScoreRing = ({ score, label, color, icon: Icon }) => (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle cx="64" cy="64" r="56" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" 
          strokeDasharray={`${score * 3.516} 352`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Icon size={24} className="mb-1" style={{ color }} />
        <div className="text-2xl font-bold" style={{ color }}>{score}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );

  const MetricCard = ({ title, value, optimal, icon: Icon }) => (
    <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
      <div className={`p-2 rounded-lg ${optimal ? 'bg-green-50' : 'bg-red-50'}`}>
        <Icon size={20} className={optimal ? 'text-green-600' : 'text-red-600'} />
      </div>
      <div className="ml-3">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className={`text-sm ${optimal ? 'text-green-600' : 'text-red-600'}`}>{value}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-white rounded-xl border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing website structure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" ref={reportRef}>
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="text-blue-600" />
              Website DNA Analysis
            </h2>
            <p className="text-sm text-gray-600 mt-1">Professional analysis of generated website code</p>
          </div>
          <button
            onClick={generateProfessionalPDF}
            disabled={!analysis}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={18} />
            Export Full Report
          </button>
        </div>
      </div>

      <div className="p-6">
        {!generatedCode ? (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Website Generated</h3>
            <p className="text-gray-600">Generate a website to see detailed analysis</p>
          </div>
        ) : !analysis ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing analysis...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                <TrendingUp size={16} />
                Overall Quality Score
              </div>
              <div className={`text-6xl font-bold mb-2 ${
                analysis.overall >= 80 ? 'text-green-600' :
                analysis.overall >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {analysis.overall}
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <span>{analysis?.stats?.totalLines || 0} lines</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <span>{analysis.stats.totalSizeKB} KB</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <span>{analysis.details.html.images} images</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <ScoreRing score={analysis.scores.seo} label="SEO" color="#3B82F6" icon={Eye} />
              <ScoreRing score={analysis.scores.accessibility} label="Accessibility" color="#10B981" icon={Shield} />
              <ScoreRing score={analysis.scores.performance} label="Performance" color="#F59E0B" icon={Activity} />
              <ScoreRing score={analysis.scores.css} label="CSS Quality" color="#8B5CF6" icon={FileCode} />
              <ScoreRing score={analysis.scores.javascript} label="JS Quality" color="#EC4899" icon={Code} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="text-blue-600" />
                  SEO Analysis
                </h3>
                <div className="space-y-3">
                  <MetricCard 
                    title="Title Tag" 
                    value={analysis.details.html.hasTitle ? 'Present' : 'Missing'}
                    optimal={analysis.details.html.hasTitle}
                    icon={analysis.details.html.hasTitle ? CheckCircle : XCircle}
                  />
                  <MetricCard 
                    title="Meta Description" 
                    value={analysis.details.html.hasMetaDescription ? 'Present' : 'Missing'}
                    optimal={analysis.details.html.hasMetaDescription}
                    icon={analysis.details.html.hasMetaDescription ? CheckCircle : XCircle}
                  />
                  <MetricCard 
                    title="Viewport Meta Tag" 
                    value={analysis.details.html.hasViewport ? 'Present' : 'Missing'}
                    optimal={analysis.details.html.hasViewport}
                    icon={analysis.details.html.hasViewport ? CheckCircle : XCircle}
                  />
                  <MetricCard 
                    title="H1 Heading" 
                    value={analysis.details.html.h1 > 0 ? 'Present' : 'Missing'}
                    optimal={analysis.details.html.h1 === 1}
                    icon={analysis.details.html.h1 > 0 ? CheckCircle : XCircle}
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Cpu className="text-purple-600" />
                  Technical Details
                </h3>
                <div className="space-y-3">
                  <MetricCard 
                    title="Images with Alt Text" 
                    value={`${analysis.details.html.imagesWithAlt}/${analysis.details.html.images}`}
                    optimal={analysis.details.html.imagesWithAlt === analysis.details.html.images}
                    icon={ImageIcon}
                  />
                  <MetricCard 
                    title="CSS Rules" 
                    value={analysis.details.css.rules.toString()}
                    optimal={analysis.details.css.rules > 0 && analysis.details.css.duplicates === 0}
                    icon={FileCode}
                  />
                  <MetricCard 
                    title="JavaScript Functions" 
                    value={analysis.details.javascript.functions.toString()}
                    optimal={analysis.details.javascript.functions > 0}
                    icon={Code}
                  />
                  <MetricCard 
                    title="Semantic HTML" 
                    value={analysis.details.accessibility.hasSemanticHTML ? 'Yes' : 'No'}
                    optimal={analysis.details.accessibility.hasSemanticHTML}
                    icon={Layout}
                  />
                </div>
              </div>
            </div>

            {analysis.recommendations.length > 0 && (
              <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="text-blue-600" />
                  Recommendations for Improvement
                </h3>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{analysis.stats.totalLines}</div>
                <div className="text-sm text-gray-600">Lines of Code</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{analysis.details.html.images}</div>
                <div className="text-sm text-gray-600">Total Images</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{analysis.details.javascript.functions}</div>
                <div className="text-sm text-gray-600">JS Functions</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{analysis.details.html.links}</div>
                <div className="text-sm text-gray-600">Links</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Optimal: 80-100</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Needs Improvement: 60-79</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Critical: 0-59</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDNA;