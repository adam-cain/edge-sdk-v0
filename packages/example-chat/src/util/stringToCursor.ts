export default function stringToColor(peerId: string): string {
  let hash = 0;
  for (let i = 0; i < peerId.length; i++) {
      hash = peerId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate RGB components from the hash
  const r = (hash >> 16) & 0xFF;
  const g = (hash >> 8) & 0xFF;
  const b = hash & 0xFF;
  
  // Convert RGB to hexadecimal and ensure two digits
  const hex = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  return hex;
}

// Helper function to convert a single color component to hex
function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}