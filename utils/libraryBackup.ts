import type { Capsule } from '../types';

// 🧵 Synth: Library backup and restore utilities
// Provides full capsule library export/import functionality with validation

export interface LibraryExport {
  version: string; // Schema version (e.g., "1.0.0")
  exportDate: string; // ISO timestamp
  capsuleCount: number;
  capsules: Capsule[];
  metadata: {
    aetherscoreVersion: string;
    creator: string;
    description?: string;
  };
}

/**
 * Export all capsules as a JSON backup file
 * @param capsules - Array of capsules to export
 * @returns LibraryExport object ready for download
 */
export const exportLibraryAsJSON = (capsules: Capsule[]): LibraryExport => {
  const exportData: LibraryExport = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    capsuleCount: capsules.length,
    capsules,
    metadata: {
      aetherscoreVersion: 'v0.1.0', // TODO: Pull from package.json
      creator: 'AetherScore',
      description: 'Full capsule library backup',
    },
  };

  return exportData;
};

/**
 * Download library export as JSON file
 * @param capsules - Array of capsules to export
 */
export const downloadLibraryAsJSON = (capsules: Capsule[]): void => {
  const exportData = exportLibraryAsJSON(capsules);
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `aetherscore-library-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Validate library export structure
 * @param data - Parsed JSON data to validate
 * @returns Validation result with errors if any
 */
export const validateLibraryExport = (data: any): {
  valid: boolean;
  errors: string[];
  data?: LibraryExport;
} => {
  const errors: string[] = [];

  // Check required top-level fields
  if (!data.version) errors.push('Missing "version" field');
  if (!data.exportDate) errors.push('Missing "exportDate" field');
  if (typeof data.capsuleCount !== 'number') errors.push('Missing or invalid "capsuleCount" field');
  if (!Array.isArray(data.capsules)) errors.push('"capsules" must be an array');
  if (!data.metadata) errors.push('Missing "metadata" field');

  // Validate version compatibility
  const [major] = data.version?.split('.').map(Number) || [0];
  if (major > 1) {
    errors.push(`Unsupported schema version: ${data.version}. This version of AetherScore supports up to v1.x.x`);
  }

  // Validate capsules array
  if (Array.isArray(data.capsules)) {
    data.capsules.forEach((capsule: any, index: number) => {
      if (!capsule.id) errors.push(`Capsule at index ${index} missing "id"`);
      if (!capsule.meta) errors.push(`Capsule at index ${index} missing "meta"`);
      if (!Array.isArray(capsule.parts)) errors.push(`Capsule at index ${index} missing "parts" array`);

      // Validate meta structure
      if (capsule.meta) {
        const requiredMetaFields = ['titre', 'tempo', 'mesure', 'tonalite', 'ppq', 'pickup', 'version'];
        requiredMetaFields.forEach((field) => {
          if (capsule.meta[field] === undefined) {
            errors.push(`Capsule "${capsule.id}" meta missing field: ${field}`);
          }
        });
      }

      // Validate parts
      if (Array.isArray(capsule.parts)) {
        capsule.parts.forEach((part: any, partIndex: number) => {
          if (!part.fileName) errors.push(`Capsule "${capsule.id}" part ${partIndex} missing "fileName"`);
          if (typeof part.content !== 'string') errors.push(`Capsule "${capsule.id}" part ${partIndex} missing or invalid "content"`);
        });
      }
    });

    // Validate capsule count matches
    if (data.capsules.length !== data.capsuleCount) {
      errors.push(`Capsule count mismatch: expected ${data.capsuleCount}, got ${data.capsules.length}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? (data as LibraryExport) : undefined,
  };
};

/**
 * Import library from JSON file
 * @param file - File object from file input
 * @param onSuccess - Callback with validated capsules
 * @param onError - Callback with error messages
 */
export const importLibraryFromJSON = (
  file: File,
  onSuccess: (capsules: Capsule[], metadata: LibraryExport['metadata']) => void,
  onError: (errors: string[]) => void
): void => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const json = e.target?.result as string;
      const data = JSON.parse(json);

      const validation = validateLibraryExport(data);

      if (!validation.valid) {
        onError(validation.errors);
        return;
      }

      if (validation.data) {
        onSuccess(validation.data.capsules, validation.data.metadata);
      }
    } catch (error) {
      onError([`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  };

  reader.onerror = () => {
    onError(['Failed to read file']);
  };

  reader.readAsText(file);
};

/**
 * Merge imported capsules with existing ones
 * Handles ID conflicts by appending "-imported-{timestamp}" to duplicates
 * @param existingCapsules - Current capsules in the store
 * @param importedCapsules - Capsules from import
 * @returns Merged capsules array
 */
export const mergeCapsules = (
  existingCapsules: Capsule[],
  importedCapsules: Capsule[]
): Capsule[] => {
  const existingIds = new Set(existingCapsules.map((c) => c.id));
  const timestamp = Date.now();

  const resolvedImports = importedCapsules.map((capsule) => {
    if (existingIds.has(capsule.id)) {
      // ID conflict - rename imported capsule
      return {
        ...capsule,
        id: `${capsule.id}-imported-${timestamp}`,
        meta: {
          ...capsule.meta,
          titre: `${capsule.meta.titre} (Imported)`,
        },
      };
    }
    return capsule;
  });

  return [...existingCapsules, ...resolvedImports];
};

/**
 * Replace all capsules with imported ones
 * @param importedCapsules - Capsules from import
 * @returns Imported capsules array
 */
export const replaceCapsules = (importedCapsules: Capsule[]): Capsule[] => {
  return importedCapsules;
};
