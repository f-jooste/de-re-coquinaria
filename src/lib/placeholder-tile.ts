// Colours a Recipe with no Hero Photo from a hash of its title, matching the design file's reference palette.
const PALETTE: ReadonlyArray<{ bg: string; fg: string }> = [
  { bg: '#D9E4C8', fg: '#3B5227' },
  { bg: '#F3D2C2', fg: '#8A3212' },
  { bg: '#F0E1B0', fg: '#6B4E00' },
  { bg: '#CFE0E4', fg: '#1F4E5A' },
  { bg: '#E8D3E2', fg: '#6B2B5A' },
  { bg: '#DCD6C4', fg: '#4A4230' },
];

export interface PlaceholderTile {
  initial: string;
  bg: string;
  fg: string;
}

export function placeholderTile(title: string): PlaceholderTile {
  let hash = 0;
  for (const char of title) hash += char.charCodeAt(0);
  const { bg, fg } = PALETTE[hash % PALETTE.length];
  return { initial: title.charAt(0).toUpperCase(), bg, fg };
}
