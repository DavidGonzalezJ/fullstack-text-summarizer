import { GoogleGenAI } from '@google/genai';
import type { ISummarizer } from './ISummarizer';

const PROMPT_PREFIX =
  'Summarize the following text concisely, preserving the key points. ' +
  'Reply only with the summary, no preamble:\n\n';

export class GeminiSummarizer implements ISummarizer {
  private readonly ai: GoogleGenAI;
  private readonly model: string;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    this.model = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash';
  }

  async summarize(text: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: PROMPT_PREFIX + text,
    });
    return response.text ?? '';
  }
}
