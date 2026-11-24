/**
 * Shared client-side uploaded text file reader with consistent size bounds,
 * extension/MIME validation, and FileReader error normalization.
 */

export const DEFAULT_MAX_TEXT_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export interface ReadTextUploadOptions {
  maxBytes?: number;
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
  maxSizeErrorMessage?: string;
  invalidTypeErrorMessage?: string;
}

export async function readUploadedTextFile(
  file: File,
  options: ReadTextUploadOptions = {}
): Promise<string> {
  const {
    maxBytes = DEFAULT_MAX_TEXT_UPLOAD_BYTES,
    allowedExtensions,
    allowedMimeTypes,
    maxSizeErrorMessage,
    invalidTypeErrorMessage,
  } = options;

  if (allowedExtensions?.length || allowedMimeTypes?.length) {
    const lowerName = file.name.toLowerCase();
    const matchesExt = allowedExtensions?.some((ext) => lowerName.endsWith(ext.toLowerCase())) ?? false;
    const matchesMime = allowedMimeTypes?.includes(file.type) ?? false;
    if (!matchesExt && !matchesMime) {
      throw new Error(invalidTypeErrorMessage || `Unsupported file type: ${file.name}`);
    }
  }

  if (file.size > maxBytes) {
    const mb = (maxBytes / (1024 * 1024)).toFixed(0);
    throw new Error(maxSizeErrorMessage || `The uploaded file exceeds the ${mb} MB maximum file size.`);
  }

  if (typeof FileReader === 'undefined') {
    if (typeof file.text === 'function') {
      return file.text();
    }
    throw new Error(`FileReader is not available to read: ${file.name}`);
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => {
      reject(new Error(reader.error?.message || `Failed to read uploaded file: ${file.name}`));
    };
    reader.readAsText(file);
  });
}
