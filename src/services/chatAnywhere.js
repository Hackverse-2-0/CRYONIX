import axios from 'axios';

const API_KEY = import.meta.env.VITE_CHATANYWHERE_API_KEY;
const BASE_URL = import.meta.env.VITE_CHATANYWHERE_BASE_URL;

export const generateSummary = async (noteContent) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes meeting notes and extracts actionable items. Format your response with a summary section followed by a list of action items.'
          },
          {
            role: 'user',
            content: `Summarize the following notes and extract action items:\n\n${noteContent}`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('AI Summary Error:', error);
    return {
      success: false,
      error: error.message,
      mockData: generateMockSummary(noteContent)
    };
  }
};

const generateMockSummary = (content) => {
  return `**Summary:**\nThis meeting covered key project topics and team coordination.\n\n**Action Items:**\n1. Review technical requirements\n2. Update task assignments\n3. Schedule follow-up meeting\n\n(Note: This is a fallback summary. Please configure ChatAnywhere API key for AI-powered summaries.)`;
};

export const parseActionItems = (summaryText) => {
  const lines = summaryText.split('\n');
  const actionItems = [];
  let inActionSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes('action item')) {
      inActionSection = true;
      continue;
    }
    
    if (inActionSection && line.trim().match(/^\d+\.|^-|^\*/)) {
      const cleanItem = line.replace(/^\d+\.|^-|^\*/, '').trim();
      if (cleanItem) {
        actionItems.push(cleanItem);
      }
    }
  }

  return actionItems;
};
