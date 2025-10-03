
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import type { Capsule } from '../types';

// ♠️ Nyro: A well-structured grimoire for our alchemical processes.
// This function encapsulates the logic for packaging a capsule, ensuring a perfect, portable replica of the creative spark.

/**
 * Creates a ZIP archive of a musical capsule and triggers a download.
 * @param capsule The capsule object to be archived.
 */
export const exportCapsuleAsZip = async (capsule: Capsule): Promise<void> => {
  const zip = new JSZip();
  const rootFolder = zip.folder(capsule.meta.titre.toLowerCase().replace(/\s+/g, '-'));
  
  if (!rootFolder) {
      console.error("Failed to create root folder in ZIP archive.");
      return;
  }

  // 1. 🎯 Add capsule.json
  const capsuleJsonContent = {
      ...capsule.meta,
      parts: capsule.parts.map(p => p.fileName)
  };
  rootFolder.file('capsule.json', JSON.stringify(capsuleJsonContent, null, 2));

  // 2. 📝 Add parts/
  const partsFolder = rootFolder.folder('parts');
  if(partsFolder) {
    capsule.parts.forEach(part => {
        partsFolder.file(part.fileName, part.content);
    });
  }

  // 3. 🎤 Add sources/ (placeholder)
  const sourcesFolder = rootFolder.folder('sources');
  if(sourcesFolder) {
    // In a real app, you'd iterate through `capsule.sources` and add them.
    sourcesFolder.file('.gitkeep', '');
  }

  // 4. 🎵 Add rendus/ (placeholder)
  const rendusFolder = rootFolder.folder('rendus');
  if(rendusFolder) {
    rendusFolder.folder('midi');
    rendusFolder.folder('musicxml');
    rendusFolder.folder('wav');
  }
  
  // 5. 🔄 Add scripts/ (placeholder)
  const scriptsFolder = rootFolder.folder('scripts');
  if(scriptsFolder) {
    scriptsFolder.file('README.md', 'Automated conversion scripts can be placed here.');
  }

  // Generate and download the ZIP file
  try {
    const content = await zip.generateAsync({ type: 'blob' });
    FileSaver.saveAs(content, `${capsule.meta.titre.replace(/\s+/g, '_')}_capsule.zip`);
  } catch (error) {
      console.error("Error generating ZIP file:", error);
  }
};
