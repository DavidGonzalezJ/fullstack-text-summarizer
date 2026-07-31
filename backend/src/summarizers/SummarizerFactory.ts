import type { ISummarizer } from './ISummarizer';
import { GeminiSummarizer } from './GeminiSummarizer';

// To add a new provider:
//   1. Create MyProviderSummarizer implementing ISummarizer
//   2. Add a new case below
//   3. Set SUMMARIZER_PROVIDER=myprovider in .env.local
const PROVIDERS = {
  gemini: () => new GeminiSummarizer(),
  // openai: () => new OpenAISummarizer(),
  // claude: () => new ClaudeSummarizer(),
} as const;

type ProviderKey = keyof typeof PROVIDERS;

export function createSummarizer(): ISummarizer {
  const key = (process.env.SUMMARIZER_PROVIDER ?? 'gemini') as ProviderKey;

  const factory = PROVIDERS[key];
  if (!factory) {
    throw new Error(`Unknown summarizer provider: "${key}". Valid options: ${Object.keys(PROVIDERS).join(', ')}`);
  }

  return factory();
}
