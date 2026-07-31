import api from '../lib/axios';

export const summarizeService = {
  async summarize(text: string): Promise<string> {
    const { data } = await api.post<{ summary: string }>('/summarize', { text });
    return data.summary;
  },
};
