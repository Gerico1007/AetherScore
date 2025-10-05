import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';

// 🎸 JamAI: This transforms ABC notation into MEI - the scholarly encoding standard.
// From folk tunes to academic archives - the bridge between traditions!

interface MEIExportOptions {
  filename?: string;
}

// ♠️ Nyro: Verovio toolkit singleton for efficient reuse
let verovioToolkit: VerovioToolkit | null = null;

/**
 * Initialize Verovio toolkit (lazy loading)
 */
async function initVerovio(): Promise<VerovioToolkit> {
  if (verovioToolkit) {
    return verovioToolkit;
  }

  try {
    const VerovioModule = await createVerovioModule();
    verovioToolkit = new VerovioToolkit(VerovioModule);
    return verovioToolkit;
  } catch (error) {
    throw new Error(`Failed to initialize Verovio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * ♠️ Nyro: The core structural transformation.
 * Converts ABC notation to MEI format through Verovio.
 *
 * @param abcContent - The ABC notation string to export
 * @param options - MEI export options
 * @returns Promise that resolves when MEI is downloaded
 */
export async function exportToMEI(
  abcContent: string,
  options: MEIExportOptions = {}
): Promise<void> {
  const {
    filename = 'score.mei'
  } = options;

  try {
    // 🧵 Synth: Initialize Verovio toolkit
    const vrvToolkit = await initVerovio();

    // 🌿 Aureon: Configure Verovio for ABC input
    vrvToolkit.setOptions({
      inputFrom: 'abc',
      scale: 100,
      adjustPageHeight: true,
      breaks: 'auto',
    });

    // Load ABC content into Verovio
    const loaded = vrvToolkit.loadData(abcContent);

    if (!loaded) {
      throw new Error('Failed to load ABC notation into Verovio');
    }

    // Extract MEI from Verovio
    const meiContent = vrvToolkit.getMEI({
      removeIds: false,
      basic: false
    });

    if (!meiContent) {
      throw new Error('Failed to generate MEI from ABC notation');
    }

    // 🎸 JamAI: Create the scholarly artifact for download
    const blob = new Blob([meiContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.mei') ? filename : `${filename}.mei`;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);

    // ⚡ Jerry: The transformation complete - ABC becomes scholarly MEI!

  } catch (error) {
    console.error('🔴 MEI export failed:', error);
    throw new Error(`MEI export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 🌿 Aureon: Helper to explain MEI format to users
 */
export const MEI_INFO = {
  name: 'MEI (Music Encoding Initiative)',
  description: 'A professional music encoding standard used in musicology and digital humanities',
  convertTo: 'Can be imported by MuseScore, Finale, or Sibelius and converted to MusicXML',
  fileExtension: '.mei',
  mimeType: 'application/xml'
};
