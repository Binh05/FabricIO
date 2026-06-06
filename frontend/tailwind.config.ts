import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        'bg-elevated': '#141414',
        surface: '#1a1a1a',
        'surface-soft': '#202020',
        'surface-strong': '#252525',
        
        text: '#f5f7fa',
        muted: '#9ca3af',
        border: 'rgba(255, 255, 255, 0.08)',
        
        accent: '#ff4747',
        'accent-soft': 'rgba(255, 71, 71, 0.14)',
        success: '#44d492',
        warning: '#f7b84b',
        danger: '#ff6b6b',
      },
      borderRadius: {
        'lg-custom': '24px', 
        'md-custom': '18px', 
        'sm-custom': '14px', 
      },
      boxShadow: {
        'custom-shadow': '0 20px 50px rgba(0, 0, 0, 0.35)', 
      },
      spacing: {
        'header-height': '84px', 
        'sidebar-width': '260px', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config;