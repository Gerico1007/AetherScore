import abcjs from 'abcjs';
import { jsPDF } from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';

// 🎸 JamAI: This transforms your musical glyphs into a portable document format.
// From ephemeral notation to tangible score - the alchemical conversion begins!

interface PDFExportOptions {
  filename?: string;
  paperSize?: 'letter' | 'a4';
  orientation?: 'portrait' | 'landscape';
}

/**
 * ♠️ Nyro: The core structural transformation.
 * Converts ABC notation to PDF format through the SVG bridge.
 *
 * @param abcContent - The ABC notation string to export
 * @param options - PDF generation options
 * @returns Promise that resolves when PDF is downloaded
 */
export async function exportToPDF(
  abcContent: string,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename = 'score.pdf',
    paperSize = 'letter',
    orientation = 'portrait'
  } = options;

  try {
    // 🌿 Aureon: Create a temporary vessel for the visual manifestation
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = orientation === 'portrait' ? '816px' : '1056px'; // 8.5" or 11" at 96 DPI
    document.body.appendChild(tempDiv);

    // Render ABC to SVG
    const visualObj = abcjs.renderAbc(tempDiv, abcContent, {
      responsive: 'resize',
      staffwidth: orientation === 'portrait' ? 750 : 990,
      scale: 1.0,
    });

    if (!visualObj || visualObj.length === 0) {
      throw new Error('Failed to render ABC notation');
    }

    // Extract the SVG element
    const svgElement = tempDiv.querySelector('svg');
    if (!svgElement) {
      throw new Error('No SVG element generated');
    }

    // 🧵 Synth: Determine PDF dimensions based on paper size
    const dimensions = getPaperDimensions(paperSize, orientation);

    // Create PDF document
    const pdf = new jsPDF({
      orientation,
      unit: 'pt',
      format: paperSize,
    });

    // Convert SVG to PDF
    await svg2pdf(svgElement, pdf, {
      x: 20,
      y: 20,
      width: dimensions.width - 40,
      height: dimensions.height - 40,
    });

    // Clean up temporary element
    document.body.removeChild(tempDiv);

    // ⚡ Jerry: Download the transformed creation!
    pdf.save(filename);

  } catch (error) {
    console.error('🔴 PDF export failed:', error);
    throw new Error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get paper dimensions in points (72 points = 1 inch)
 */
function getPaperDimensions(
  paperSize: 'letter' | 'a4',
  orientation: 'portrait' | 'landscape'
): { width: number; height: number } {
  const sizes = {
    letter: { width: 612, height: 792 }, // 8.5" x 11"
    a4: { width: 595, height: 842 },     // 210mm x 297mm
  };

  const base = sizes[paperSize];

  return orientation === 'portrait'
    ? base
    : { width: base.height, height: base.width };
}
