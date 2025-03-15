// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'), // This will use Tailwind as a PostCSS plugin
    require('autoprefixer'), // For autoprefixing
  ],
};
