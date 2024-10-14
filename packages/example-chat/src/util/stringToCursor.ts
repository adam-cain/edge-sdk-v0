// Helper function to generate color from peerId
export default function stringToColor(peerId: string): string {
    let hash = 0;
    for (let i = 0; i < peerId.length; i++) {
      hash = peerId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360; // Use hash to determine the hue
    return `hsl(${hue}, 70%, 70%)`; // Generate HSL color
  }
  