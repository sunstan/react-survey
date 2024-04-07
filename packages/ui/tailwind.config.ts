import { Config } from 'tailwindcss';
import sharedConfig from '@react-survey/tailwind-config/tailwind.config';

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [sharedConfig],
};

export default config;
