import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Download project as ZIP with separate HTML, CSS, and JS files
 * @param {Object} projectFiles - Object with html, css, javascript properties
 * @param {string} projectName - Name for the project folder and ZIP file
 */
export async function downloadProjectZip(projectFiles, projectName = 'chlorophy-project') {
  try {
    console.log('Creating ZIP with files:', {
      htmlLength: projectFiles?.html?.length || 0,
      cssLength: projectFiles?.css?.length || 0,
      jsLength: projectFiles?.javascript?.length || 0
    });

    const zip = new JSZip();
    
    // Create project folder
    const folder = zip.folder(projectName);
    
    // Add HTML file
    if (projectFiles?.html) {
      folder.file('index.html', projectFiles.html);
    }
    
    // Add CSS file
    if (projectFiles?.css) {
      folder.file('style.css', projectFiles.css);
    }
    
    // Add JavaScript file
    if (projectFiles?.javascript) {
      folder.file('script.js', projectFiles.javascript);
    }
    
    // Add README
    const readme = `# ${projectName}

Generated with Chlorophy AI - https://chlorophy.com

## Files
- index.html - Main HTML file
- style.css - Styles
- script.js - JavaScript functionality

## Usage
1. Open index.html in your browser
2. Or upload to any web hosting service

## Credits
Created with ❤️ by Chlorophy AI
`;
    
    folder.file('README.md', readme);
    
    // Generate ZIP
    const blob = await zip.generateAsync({ type: 'blob' });
    
    // Download
    saveAs(blob, `${projectName}.zip`);
    
    console.log('ZIP downloaded successfully!');
    
  } catch (error) {
    console.error('Error creating ZIP:', error);
    throw error;
  }
}

/**
 * Legacy function for backward compatibility - extracts files from HTML code
 * @deprecated Use downloadProjectZip with projectFiles instead
 */
export async function downloadProjectZipFromCode(htmlCode, projectName = 'chlorophy-project') {
  // Extract CSS
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let cssContent = '';
  let match;
  while ((match = styleRegex.exec(htmlCode)) !== null) {
    cssContent += match[1] + '\n\n';
  }

  // Extract JS
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let jsContent = '';
  while ((match = scriptRegex.exec(htmlCode)) !== null) {
    if (!match[0].includes('src=')) {
      jsContent += match[1] + '\n\n';
    }
  }

  // Clean HTML
  let cleanHtml = htmlCode
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '  <link rel="stylesheet" href="style.css">')
    .replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, '  <script src="script.js"></script>');

  const projectFiles = {
    html: cleanHtml.trim(),
    css: cssContent.trim() || '/* No CSS found */\n\nbody {\n  margin: 0;\n  padding: 0;\n}',
    javascript: jsContent.trim() || '// No JavaScript found\n\nconsole.log("Website loaded!");'
  };

  return downloadProjectZip(projectFiles, projectName);
}