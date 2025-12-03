import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Extract HTML, CSS, JS from generated code
 */
export function extractFilesFromCode(htmlCode) {
  if (!htmlCode) return null;

  // Extract CSS from <style> tags
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let cssContent = '';
  let match;
  while ((match = styleRegex.exec(htmlCode)) !== null) {
    cssContent += match[1] + '\n\n';
  }

  // Extract JS from <script> tags (exclude external scripts)
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let jsContent = '';
  while ((match = scriptRegex.exec(htmlCode)) !== null) {
    if (!match[0].includes('src=')) {
      jsContent += match[1] + '\n\n';
    }
  }

  // Create clean HTML with references to external files
  let cleanHtml = htmlCode
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '    <link rel="stylesheet" href="style.css">')
    .replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, '    <script src="script.js"></script>');

  return {
    'index.html': cleanHtml.trim(),
    'style.css': cssContent.trim() || '/* No CSS found */\n\nbody {\n  margin: 0;\n  padding: 0;\n}',
    'script.js': jsContent.trim() || '// No JavaScript found\n\nconsole.log("Website loaded!");'
  };
}

/**
 * Generate and download ZIP file with project files
 */
export async function downloadProjectZip(htmlCode, projectName = 'chlorophy-project') {
  try {
    // Extract files
    const files = extractFilesFromCode(htmlCode);
    if (!files) {
      throw new Error('No code to export');
    }

    // Create ZIP
    const zip = new JSZip();
    
    // Add files to ZIP
    zip.file('index.html', files['index.html']);
    zip.file('style.css', files['style.css']);
    zip.file('script.js', files['script.js']);
    
    // Add README
    const readme = `# ${projectName}

Generated with Chlorophy AI 🌿

## Files
- index.html - Main HTML file
- style.css - Stylesheet
- script.js - JavaScript code

## How to use
1. Extract this ZIP file
2. Open index.html in your browser
3. Deploy to your favorite hosting service

## Deploy Options
- Vercel: https://vercel.com
- Netlify: https://netlify.com
- GitHub Pages: https://pages.github.com
- IONOS: https://www.ionos.com

Generated on: ${new Date().toLocaleString()}
`;
    
    zip.file('README.md', readme);

    // Generate ZIP blob
    const blob = await zip.generateAsync({ type: 'blob' });
    
    // Download
    saveAs(blob, `${projectName}.zip`);
    
    return true;
  } catch (error) {
    console.error('Error creating ZIP:', error);
    throw error;
  }
}

/**
 * Download single file
 */
export function downloadSingleFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  saveAs(blob, filename);
}