import { Config } from 'tailwindcss';
import sharedConfig from '@react-survey/tailwind-config/tailwind.config';

export default {
  prefix: '',
  darkMode: ['class'],
  presets: [sharedConfig],
  content: ['./src/**/*.{ts,tsx}', '../../node_modules/@react-survey/ui/**/*.{ts,tsx}'],
} satisfies Pick<Config, 'darkMode' | 'prefix' | 'presets' | 'content'>;
