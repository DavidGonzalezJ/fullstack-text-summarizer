export interface ISummarizer {
  summarize(text: string): Promise<string>;
}
