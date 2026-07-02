import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        // Futuristic dark-first palette (PART 1)
        void: '#08080F',
        accent: {
          DEFAULT: '#6366F1',
          glow: '#818CF8',
          // Deeper indigo for solid CTA fills — guarantees ≥4.5:1 contrast
          // with white button text (DEFAULT only measures 4.47:1, just under AA).
          deep: '#4F46E5',
        },
        gold: '#F59E0B',
        // Semantic aliases kept so existing utility classes map to the new theme.
        primary: {
          DEFAULT: '#6366F1', // accent — CTAs, links, active states
          light: '#1B1B33', // dark indigo tint — chips, info badges
          glow: '#818CF8',
          foreground: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#0F0F1A', // card backgrounds
          raised: '#16162A', // elevated cards
          muted: '#13131F', // alt rows, hover, page fills
        },
        border: {
          DEFAULT: '#1E1E38',
          // Slightly brighter resting-state border for form fields, where the
          // boundary needs to be perceivable before focus (WCAG 1.4.11).
          strong: '#33335A',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          // #475569 measured 2.63:1 on void — fails WCAG AA (needs 4.5:1).
          // #7B8AA3 measures 5.71:1, comfortably passing while staying muted.
          muted: '#7B8AA3',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        // Official WhatsApp brand green.
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#1EBE57',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        // Cormorant — luxury display serif for headlines and editorial accents.
        heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
        // Montserrat geometric sans for UI chrome, labels, nav, buttons.
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'var(--font-montserrat)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        base: ['15px', { lineHeight: '1.65' }],
      },
      letterSpacing: {
        // Cormorant is a display serif — it wants near-normal tracking, just a
        // hair tight at large sizes. (Was -0.02em for the old geometric sans.)
        heading: '-0.005em',
        // Loose tracking for the small uppercase eyebrow/kicker labels that
        // carry the "luxury editorial" signal above section headings.
        eyebrow: '0.22em',
      },
      borderRadius: {
        '2xl': '24px',
        xl: '16px',
        lg: '12px',
        md: '10px',
        sm: '6px',
      },
      boxShadow: {
        glow: '0 0 32px rgba(99,102,241,0.18)',
        'glow-lg': '0 0 48px rgba(99,102,241,0.30)',
        'glow-success': '0 0 24px rgba(16,185,129,0.28)',
        'glow-whatsapp': '0 0 24px rgba(37,211,102,0.35)',
      },
      backdropBlur: {
        glass: '16px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.5)' },
          '70%': { boxShadow: '0 0 0 14px rgba(16,185,129,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-ring': 'pulse-ring 2s infinite',
        'gradient-shift': 'gradient-shift 12s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
        marquee: 'marquee 60s linear infinite',
        'marquee-reverse': 'marquee-reverse 70s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
