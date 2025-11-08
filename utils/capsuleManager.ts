
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import type { Capsule } from '../types';

// ♠️ Nyro: A well-structured grimoire for our alchemical processes.
// This function encapsulates the logic for packaging a capsule, ensuring a perfect, portable replica of the creative spark.

/**
 * Generate artifact manifest for CLI interoperability
 * @param capsule - The capsule to create manifest for
 * @returns Artifact manifest object
 */
const generateArtifactManifest = (capsule: Capsule) => {
  return {
    codecSchema: 'aetherscore-artifact-v1',
    artifactType: 'capsule',
    version: '1.0.0',
    created: new Date().toISOString(),
    meta: {
      titre: capsule.meta.titre,
      tempo: capsule.meta.tempo,
      mesure: capsule.meta.mesure,
      tonalite: capsule.meta.tonalite,
      ppq: capsule.meta.ppq,
      pickup: capsule.meta.pickup,
      version: capsule.meta.version,
    },
    assets: [
      ...capsule.parts.map((part) => ({
        path: `parts/${part.fileName}`,
        type: 'abc' as const,
        description: `ABC notation source: ${part.fileName}`,
      })),
      {
        path: 'sources/.capsule.json',
        type: 'metadata' as const,
        description: 'Legacy capsule metadata (deprecated, use .artifact.json)',
      },
    ],
    origin: {
      application: 'AetherScore',
      version: 'v0.1.0', // TODO: Pull from package.json
      platform: 'web',
    },
    dependencies: capsule.sources?.map((source) => ({
      name: source.fileName,
      type: source.type,
      uri: source.fileName,
    })) || [],
  };
};

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

  // 1. 🎯 Add .artifact.json (CLI interoperability manifest)
  const artifactManifest = generateArtifactManifest(capsule);
  rootFolder.file('.artifact.json', JSON.stringify(artifactManifest, null, 2));

  // 2. 🎯 Add sources/.capsule.json (legacy metadata)
  const capsuleJsonContent = {
      ...capsule.meta,
      parts: capsule.parts.map(p => p.fileName)
  };
  const sourcesFolder = rootFolder.folder('sources');
  if(sourcesFolder) {
    sourcesFolder.file('.capsule.json', JSON.stringify(capsuleJsonContent, null, 2));
    // In a real app, you'd iterate through `capsule.sources` and add them.
    if (capsule.sources && capsule.sources.length === 0) {
      sourcesFolder.file('.gitkeep', '');
    }
  }

  // 3. 📝 Add parts/
  const partsFolder = rootFolder.folder('parts');
  if(partsFolder) {
    capsule.parts.forEach(part => {
        partsFolder.file(part.fileName, part.content);
    });
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
