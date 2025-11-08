// Example usage
import EPUBViewer from './services/epubViewer.js';

// Load epub.js first (optional)
await EPUBViewer.loadEPUBJS();

// Online EPUB
const onlineViewer = new EPUBViewer('https://www.gutenberg.org/ebooks/1342.epub');
await onlineViewer.init();

// Local file from input
const fileInput = document.getElementById('epub-file');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const localViewer = new EPUBViewer(file);
  await localViewer.init();
  
  // Display first chapter
  const content = await localViewer.getChapterContent(0);
  document.getElementById('viewer').innerHTML = content;
});

// Local file path (Electron)
const electronViewer = new EPUBViewer('/book.epub');
await electronViewer.init();