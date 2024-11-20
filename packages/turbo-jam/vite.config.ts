import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer'; // Import the visualizer plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // Automatically opens the report in your default browser
      filename: 'bundle-analysis.html', // Output file name
      template: 'treemap', // Visualization type (sunburst, treemap, network)
      gzipSize: true, // Display gzip sizes
      brotliSize: true, // Display Brotli sizes
    }),
  ],
});
