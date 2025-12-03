import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Award, TrendingUp, Shield, Smartphone, Zap, Eye } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import jsPDF from 'jspdf';

// 🧬 ANALYZE CODE QUALITY - VERSION REAL + VARIABILE
function analyzeWebsiteDNA(htmlCode) {
  if (!htmlCode) return null;

  const lowerCode = htmlCode.toLowerCase();
  const codeLength = htmlCode.length;
  
  // 1. PERFORMANCE SCORE - PIÙ SENSIBILE
  const codeSize = htmlCode.length;
  const hasMinifiedCSS = lowerCode.includes('margin:0') || lowerCode.includes('padding:0');
  const elementCount = (htmlCode.match(/<[^>]+>/g) || []).length;
  const hasInlineStyles = (htmlCode.match(/style="/g) || []).length;
  
  let performanceScore = 95;
  performanceScore -= Math.min(30, codeSize / 500); // Penalità per dimensione
  performanceScore -= hasInlineStyles * 2; // Penalità per inline styles
  performanceScore += hasMinifiedCSS ? 5 : 0;
  performanceScore = Math.max(40, Math.min(100, performanceScore));

  // 2. ACCESSIBILITY SCORE - PIÙ RIGOROSO
  const images = (htmlCode.match(/<img/g) || []).length;
  const altTags = (htmlCode.match(/alt="/g) || []).length;
  const hasAriaLabels = (htmlCode.match(/aria-label/g) || []).length;
  const hasSemanticHTML = lowerCode.includes('<header') || lowerCode.includes('<nav') || lowerCode.includes('<main');
  const hasLangAttribute = lowerCode.includes('lang=');
  
  let accessibilityScore = 50;
  if (images > 0) {
    const altCoverage = (altTags / images) * 30;
    accessibilityScore += altCoverage;
  } else {
    accessibilityScore += 20; // Bonus se no images
  }
  accessibilityScore += hasAriaLabels * 5;
  accessibilityScore += hasSemanticHTML ? 15 : 0;
  accessibilityScore += hasLangAttribute ? 10 : 0;
  accessibilityScore = Math.max(20, Math.min(100, accessibilityScore));

  // 3. MOBILE-FIRST SCORE - PIÙ PRECISO
  const hasViewport = lowerCode.includes('viewport');
  const mediaQueries = (lowerCode.match(/@media/g) || []).length;
  const hasResponsiveUnits = lowerCode.includes('vw') || lowerCode.includes('vh') || lowerCode.includes('%') || lowerCode.includes('rem');
  const hasFlexbox = lowerCode.includes('display: flex') || lowerCode.includes('display:flex');
  const hasGrid = lowerCode.includes('display: grid') || lowerCode.includes('display:grid');
  
  let mobileScore = 30;
  mobileScore += hasViewport ? 25 : 0;
  mobileScore += Math.min(25, mediaQueries * 10);
  mobileScore += hasResponsiveUnits ? 10 : 0;
  mobileScore += hasFlexbox ? 5 : 0;
  mobileScore += hasGrid ? 5 : 0;
  mobileScore = Math.max(30, Math.min(100, mobileScore));

  // 4. SECURITY SCORE - PIÙ STRINGENTE
  const hasInlineScripts = lowerCode.includes('onclick') || lowerCode.includes('onerror');
  const hasEval = lowerCode.includes('eval(');
  const hasDocumentWrite = lowerCode.includes('document.write');
  const externalScripts = (lowerCode.match(/src="http/g) || []).length;
  const hasHttpsLinks = (htmlCode.match(/https:/g) || []).length;
  const hasHttpLinks = (htmlCode.match(/http:/g) || []).length - hasHttpsLinks;
  
  let securityScore = 100;
  securityScore -= hasInlineScripts ? 25 : 0;
  securityScore -= hasEval ? 35 : 0;
  securityScore -= hasDocumentWrite ? 15 : 0;
  securityScore -= hasHttpLinks * 5;
  securityScore -= externalScripts > 5 ? 10 : 0;
  securityScore = Math.max(40, Math.min(100, securityScore));

  // 5. DESIGN SCORE - PIÙ SOFISTICATO
  const hasConsistentSpacing = lowerCode.includes('padding') && lowerCode.includes('margin');
  const fontSizes = (lowerCode.match(/font-size/g) || []).length;
  const colors = (lowerCode.match(/#[0-9a-f]{3,6}/gi) || []).length;
  const hasTransitions = lowerCode.includes('transition');
  const hasHoverEffects = lowerCode.includes(':hover');
  const hasAnimations = lowerCode.includes('@keyframes') || lowerCode.includes('animation');
  
  let designScore = 40;
  designScore += hasConsistentSpacing ? 15 : 0;
  designScore += Math.min(15, fontSizes * 3);
  designScore += Math.min(15, colors * 2);
  designScore += hasTransitions ? 5 : 0;
  designScore += hasHoverEffects ? 5 : 0;
  designScore += hasAnimations ? 5 : 0;
  designScore = Math.max(40, Math.min(100, designScore));

  const overallScore = Math.round(
    (performanceScore + accessibilityScore + mobileScore + securityScore + designScore) / 5
  );

  return {
    overall: overallScore,
    performance: Math.round(performanceScore),
    accessibility: Math.round(accessibilityScore),
    mobile: Math.round(mobileScore),
    security: Math.round(securityScore),
    design: Math.round(designScore),
    details: {
      codeSize,
      elementCount,
      images,
      altTags,
      mediaQueries,
      hasSemanticHTML,
      hasViewport,
      externalScripts,
    }
  };
}

// 📄 CERTIFICATO PDF PROFESSIONALE BIANCO A4 (NO EMOJI)
function generateProfessionalCertificate(dna, projectName) {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  
  // WHITE BACKGROUND
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');
  
  // TOP GREEN HEADER BAR
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 40, 'F');
  
  // LOGO (text only - no emoji)
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('CHLOROPHY', 105, 22, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Website Builder', 105, 30, { align: 'center' });
  
  // CERTIFICATE TITLE
  doc.setFontSize(32);
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.text('QUALITY CERTIFICATE', 105, 60, { align: 'center' });
  
  // SUBTITLE
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Website Quality Analysis Report', 105, 70, { align: 'center' });
  
  // PROJECT NAME BOX
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(30, 80, 150, 15, 3, 3, 'F');
  doc.setFontSize(16);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(`"${projectName}"`, 105, 90, { align: 'center' });
  
  // OVERALL SCORE - BIG
  const grade = dna.overall >= 90 ? 'A+' : dna.overall >= 80 ? 'A' : dna.overall >= 70 ? 'B' : dna.overall >= 60 ? 'C' : 'D';
  const gradeColor = dna.overall >= 90 ? [16, 185, 129] : dna.overall >= 80 ? [59, 130, 246] : dna.overall >= 70 ? [245, 158, 11] : [239, 68, 68];
  
  doc.setFillColor(gradeColor[0], gradeColor[1], gradeColor[2], 0.1);
  doc.roundedRect(60, 105, 90, 35, 5, 5, 'F');
  
  doc.setFontSize(48);
  doc.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`${dna.overall}`, 105, 127, { align: 'center' });
  
  doc.setFontSize(20);
  doc.text(`Grade: ${grade}`, 105, 137, { align: 'center' });
  
  // QUALITY METRICS SECTION
  doc.setFontSize(16);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Quality Metrics Breakdown', 105, 155, { align: 'center' });
  
  // METRICS TABLE (no emoji - use symbols)
  const metrics = [
    { name: 'Performance', score: dna.performance, symbol: '>', color: [245, 158, 11], y: 165 },
    { name: 'Accessibility', score: dna.accessibility, symbol: '*', color: [59, 130, 246], y: 180 },
    { name: 'Mobile-First', score: dna.mobile, symbol: '+', color: [139, 92, 246], y: 195 },
    { name: 'Security', score: dna.security, symbol: '#', color: [239, 68, 68], y: 210 },
    { name: 'Design Quality', score: dna.design, symbol: '~', color: [16, 185, 129], y: 225 },
  ];
  
  metrics.forEach((metric) => {
    // Metric symbol (colored circle)
    doc.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.circle(35, metric.y - 1.5, 2, 'F');
    
    // Metric name
    doc.setFontSize(12);
    doc.setTextColor(70, 70, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(metric.name, 42, metric.y);
    
    // Progress bar background
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(115, metric.y - 4, 60, 6, 2, 2, 'F');
    
    // Progress bar fill
    doc.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.roundedRect(115, metric.y - 4, (metric.score / 100) * 60, 6, 2, 2, 'F');
    
    // Score number
    doc.setFontSize(11);
    doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${metric.score}/100`, 180, metric.y);
  });
  
  // TECHNICAL DETAILS BOX
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(30, 235, 150, 30, 3, 3, 'S');
  
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  doc.setFont('helvetica', 'bold');
  doc.text('Technical Details', 40, 243);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Code Size: ${(dna.details.codeSize / 1024).toFixed(1)} KB`, 40, 250);
  doc.text(`Elements: ${dna.details.elementCount}`, 40, 255);
  doc.text(`Images: ${dna.details.images} (Alt Tags: ${dna.details.altTags})`, 40, 260);
  
  doc.text(`Media Queries: ${dna.details.mediaQueries}`, 120, 250);
  doc.text(`Semantic HTML: ${dna.details.hasSemanticHTML ? 'Yes' : 'No'}`, 120, 255);
  doc.text(`Viewport Meta: ${dna.details.hasViewport ? 'Yes' : 'No'}`, 120, 260);
  
  // FOOTER - GREEN BAR
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 270, 210, 27, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text('Certified by Chlorophy AI', 105, 280, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 286, { align: 'center' });
  doc.text('www.chlorophy.com', 105, 292, { align: 'center' });
  
  // DOWNLOAD
  doc.save(`chlorophy-certificate-${projectName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

export default function WebsiteDNA({ generatedCode }) {
  const [dna, setDna] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!generatedCode) {
      setDna(null);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const analysis = analyzeWebsiteDNA(generatedCode);
      setDna(analysis);
      setIsAnalyzing(false);
    }, 1000);
  }, [generatedCode]);

  const chartData = dna ? [
    { metric: 'Performance', score: dna.performance, fullMark: 100 },
    { metric: 'Accessibility', score: dna.accessibility, fullMark: 100 },
    { metric: 'Mobile', score: dna.mobile, fullMark: 100 },
    { metric: 'Security', score: dna.security, fullMark: 100 },
    { metric: 'Design', score: dna.design, fullMark: 100 },
  ] : [];

  const getGradeColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 80) return '#3B82F6';
    if (score >= 70) return '#F59E0B';
    if (score >= 60) return '#EF4444';
    return '#DC2626';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const handleDownloadCertificate = () => {
    if (!dna) return;
    
    const titleMatch = generatedCode.match(/<title[^>]*>(.*?)<\/title>/i);
    const projectName = titleMatch ? titleMatch[1] : 'My Website';
    
    generateProfessionalCertificate(dna, projectName);
  };

  return (
    <div 
      className="h-full flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: chlorophyTheme.colors.dark,
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
        <div className="flex items-center justify-between">
          <div>
            <h2 
              className="text-xl font-bold flex items-center gap-2"
              style={{
                color: chlorophyTheme.colors.primary,
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              🧬 Website DNA
            </h2>
            <p className="text-sm" style={{ color: '#ffffff60' }}>
              Real-time quality analysis & certification
            </p>
          </div>

          {dna && (
            <motion.button
              onClick={handleDownloadCertificate}
              className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: chlorophyTheme.colors.gradients.primary,
                color: chlorophyTheme.colors.dark,
              }}
            >
              <Award size={16} />
              Download Certificate
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-auto p-6"
        style={{
          background: 'rgba(10, 14, 39, 0.5)',
        }}
      >
        {!generatedCode ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-4"
              >
                🧬
              </motion.div>
              <p 
                className="text-xl font-semibold mb-2"
                style={{ 
                  color: chlorophyTheme.colors.primary,
                  fontFamily: chlorophyTheme.fonts.display,
                }}
              >
                Generate a website first!
              </p>
              <p className="text-sm" style={{ color: '#ffffff60' }}>
                DNA analysis will appear here after generation
              </p>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 rounded-full mx-auto mb-4"
                style={{ 
                  borderColor: chlorophyTheme.colors.primary, 
                  borderTopColor: 'transparent' 
                }}
              />
              <p className="font-medium" style={{ color: '#ffffff80' }}>
                Analyzing website DNA...
              </p>
            </div>
          </div>
        ) : dna && (
          <div className="space-y-6">
            {/* Overall Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6 text-center"
              style={{
                background: 'rgba(26, 31, 58, 0.6)',
                border: `2px solid ${getGradeColor(dna.overall)}40`,
              }}
            >
              <div className="text-sm mb-2" style={{ color: '#ffffff80' }}>
                Overall Quality Score
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-7xl font-black mb-3"
                style={{ 
                  color: getGradeColor(dna.overall),
                  textShadow: `0 0 30px ${getGradeColor(dna.overall)}60`,
                }}
              >
                {dna.overall}
              </motion.div>
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: getGradeColor(dna.overall) }}
              >
                Grade: {getGrade(dna.overall)}
              </div>
              <p className="text-sm" style={{ color: '#ffffff60' }}>
                {dna.overall >= 90 ? '🏆 Exceptional quality!' : 
                 dna.overall >= 80 ? '✨ Great work!' :
                 dna.overall >= 70 ? '👍 Good job!' :
                 dna.overall >= 60 ? '⚠️ Needs improvement' :
                 '❌ Requires attention'}
              </p>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(26, 31, 58, 0.6)',
                border: `1px solid ${chlorophyTheme.colors.primary}20`,
              }}
            >
              <h3 
                className="text-lg font-bold mb-4"
                style={{ color: '#ffffff' }}
              >
                Quality Metrics
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={chartData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: '#ffffff80', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#ffffff60' }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke={chlorophyTheme.colors.primary}
                    fill={chlorophyTheme.colors.primary}
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Performance', score: dna.performance, icon: Zap, color: '#F59E0B' },
                { name: 'Accessibility', score: dna.accessibility, icon: Eye, color: '#3B82F6' },
                { name: 'Mobile-First', score: dna.mobile, icon: Smartphone, color: '#8B5CF6' },
                { name: 'Security', score: dna.security, icon: Shield, color: '#EF4444' },
                { name: 'Design', score: dna.design, icon: TrendingUp, color: '#10B981' },
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="rounded-xl p-4"
                    style={{
                      background: 'rgba(26, 31, 58, 0.6)',
                      border: `1px solid ${metric.color}20`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon size={20} style={{ color: metric.color }} />
                        <span 
                          className="font-semibold"
                          style={{ color: '#ffffff' }}
                        >
                          {metric.name}
                        </span>
                      </div>
                      <span 
                        className="text-xl font-bold"
                        style={{ color: metric.color }}
                      >
                        {metric.score}
                      </span>
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: metric.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.score}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-xl p-4"
              style={{
                background: 'rgba(26, 31, 58, 0.6)',
                border: `1px solid ${chlorophyTheme.colors.primary}20`,
              }}
            >
              <h4 className="font-semibold mb-3" style={{ color: '#ffffff' }}>
                Technical Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span style={{ color: '#ffffff60' }}>Code Size: </span>
                  <span style={{ color: '#ffffff' }}>{(dna.details.codeSize / 1024).toFixed(1)} KB</span>
                </div>
                <div>
                  <span style={{ color: '#ffffff60' }}>Elements: </span>
                  <span style={{ color: '#ffffff' }}>{dna.details.elementCount}</span>
                </div>
                <div>
                  <span style={{ color: '#ffffff60' }}>Images: </span>
                  <span style={{ color: '#ffffff' }}>{dna.details.images}</span>
                </div>
                <div>
                  <span style={{ color: '#ffffff60' }}>Alt Tags: </span>
                  <span style={{ color: dna.details.altTags >= dna.details.images ? '#10B981' : '#EF4444' }}>
                    {dna.details.altTags} / {dna.details.images}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#ffffff60' }}>Media Queries: </span>
                  <span style={{ color: '#ffffff' }}>{dna.details.mediaQueries}</span>
                </div>
                <div>
                  <span style={{ color: '#ffffff60' }}>Semantic HTML: </span>
                  <span style={{ color: dna.details.hasSemanticHTML ? '#10B981' : '#EF4444' }}>
                    {dna.details.hasSemanticHTML ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}