import { diffChars } from 'diff';

/**
 * Generates a diff between two text strings
 * @param oldText Original text
 * @param newText Updated text
 * @returns JSON diff object
 */
export const diffTexts = (oldText: string, newText: string) => {
  // Use the diff library to generate character-level diffs
  const changes = diffChars(oldText, newText);
  
  // Convert to a simpler format for storage
  const patches = changes.map(change => {
    if (change.added) {
      return { type: 'add', value: change.value };
    } else if (change.removed) {
      return { type: 'remove', value: change.value };
    } else {
      return { type: 'equal', count: change.value.length };
    }
  });
  
  return {
    oldLength: oldText.length,
    newLength: newText.length,
    patches
  };
};

/**
 * Applies a diff to the original text to reconstruct the updated text
 * @param original Original text
 * @param diff Diff object
 * @returns Reconstructed text
 */
export const applyDiff = (original: string, diff: any) => {
  let result = '';
  let pos = 0;
  
  diff.patches.forEach((patch: any) => {
    if (patch.type === 'equal') {
      result += original.substr(pos, patch.count);
      pos += patch.count;
    } else if (patch.type === 'remove') {
      pos += patch.value.length;
    } else if (patch.type === 'add') {
      result += patch.value;
    }
  });
  
  return result;
};

/**
 * Visualizes the differences between two texts
 * @param oldText Original text
 * @param newText Updated text
 * @returns HTML with highlighted differences
 */
export const visualizeDiff = (oldText: string, newText: string) => {
  const changes = diffChars(oldText, newText);
  
  let html = '';
  
  changes.forEach(change => {
    if (change.added) {
      html += `<span class="bg-green-100 text-green-800">${change.value}</span>`;
    } else if (change.removed) {
      html += `<span class="bg-red-100 text-red-800">${change.value}</span>`;
    } else {
      html += change.value;
    }
  });
  
  return html;
};