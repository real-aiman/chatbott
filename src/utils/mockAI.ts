// This file simulates an AI response stream entirely on the client, since this
// project intentionally ships with no backend. If the user supplies their own
// API key in Settings, `streamRealResponse` sends a direct request to the
// provider's REST API from the browser instead of using the mock.

import axios from 'axios';

export interface StreamHandlers {
  onToken: (token: string) => void;
  onDone: () => void;
  signal: AbortSignal;
}

const CODING_RESPONSES = [
  `Here's a quick way to think about it:

1. **Break the problem down** into the smallest pieces you can reason about independently.
2. **Prototype fast** — a rough version that works beats a perfect version that doesn't exist.
3. **Iterate from feedback**, not from assumptions.

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}! Let's build something great.\`;
}
console.log(greet('there'));
\`\`\`

Want me to go deeper on any one of these steps?`,
  `Great question. There are a few angles worth considering here:

- **Performance**: keep renders cheap and memoize expensive work.
- **Clarity**: code that reads like the problem it solves ages better than clever code.
- **Resilience**: assume things will fail, and design the happy path *and* the recovery path.

> "Simplicity is a great virtue but it requires hard work to achieve it." — Edsger Dijkstra

Let me know which direction you'd like to explore next.`,
  `Sure — here's a structured take:

| Approach | Best for | Trade-off |
|---|---|---|
| Quick fix | Urgent bugs | Technical debt |
| Refactor | Long-term health | Upfront time cost |
| Rewrite | Legacy systems | High risk |

I'd lean toward the option that matches your current timeline. What's the constraint you're working with — time, budget, or team size?`,
  `Happy to help with that. Here's how I'd approach it step by step, keeping things practical and easy to adapt to your specific case. Let me know if you'd like me to tailor this further, add code, or explain the reasoning behind any step in more depth.`,
];

const GREETING_RESPONSES = [
  `Hey there! 👋 I'm Chatty, your AI assistant. How can I help you today?`,
  `Hello! Great to see you. What would you like to talk about or work on?`,
  `Hi! I'm here and ready to help — ask me anything, from quick questions to code.`,
  `Assalam-o-Alaikum! 😊 Kaise hain aap? Bataiye main aapki kis tarah madad kar sakta hoon?`,
];

const THANKS_RESPONSES = [
  `You're very welcome! Let me know if there's anything else you need.`,
  `Anytime! Happy to help — feel free to ask another question whenever.`,
  `Glad that helped! I'm here if you need anything else.`,
];

const FAREWELL_RESPONSES = [
  `Goodbye! Have a great day — come back whenever you need help. 👋`,
  `Take care! Feel free to start a new chat anytime.`,
  `See you soon! Khuda Hafiz. 😊`,
];

const HOW_ARE_YOU_RESPONSES = [
  `I'm doing great, thanks for asking! I'm just a demo assistant, but I'm ready to help. How about you?`,
  `Doing well! Alhamdulillah. What can I help you with today?`,
];

const GENERAL_RESPONSES = [
  `That's an interesting thought! Since this is running in demo mode right now, my answers are simulated rather than truly generated — but tell me more about what you have in mind and I'll do my best to respond helpfully. If you'd like real AI-generated answers, you can add your API key in Settings.`,
  `Thanks for sharing that. I'm currently in demo mode, so my replies are pre-written examples rather than a live model, but I'm happy to keep the conversation going — what would you like to explore?`,
];

type Intent = 'greeting' | 'thanks' | 'farewell' | 'howAreYou' | 'coding' | 'general';

function detectIntent(rawPrompt: string): Intent {
  const prompt = rawPrompt.trim().toLowerCase();

  const greetingWords = [
    'hi', 'hii', 'hiii', 'hello', 'hey', 'heya', 'yo', 'salam', 'assalam',
    'assalamualaikum', 'assalam o alaikum', 'aoa', 'good morning', 'good evening',
    'good afternoon', 'namaste', 'sup', "what's up",
  ];
  const thanksWords = ['thanks', 'thank you', 'thankyou', 'shukriya', 'shukria', 'thx', 'tysm'];
  const farewellWords = ['bye', 'goodbye', 'see you', 'khuda hafiz', 'allah hafiz', 'good night', 'gn', 'take care'];
  const howAreYouWords = ['how are you', 'kaise ho', 'kaisay ho', 'kya hal hai', 'kya haal hai', 'how r u', "how's it going"];

  const isShortMatch = (words: string[]) =>
    words.some((w) => prompt === w || prompt.startsWith(w + ' ') || prompt.startsWith(w + '!') || prompt.startsWith(w + ','));

  if (isShortMatch(howAreYouWords)) return 'howAreYou';
  if (isShortMatch(greetingWords)) return 'greeting';
  if (isShortMatch(thanksWords)) return 'thanks';
  if (isShortMatch(farewellWords)) return 'farewell';

  const codingKeywords = [
    'code', 'function', 'bug', 'error', 'javascript', 'typescript', 'python',
    'react', 'component', 'api', 'array', 'variable', 'compile', 'syntax',
    'debug', 'algorithm', 'css', 'html', 'sql', 'database', 'refactor',
    'exception', 'null', 'undefined', 'loop', 'class ', 'import ', 'npm',
    'git', 'server', 'frontend', 'backend', 'programming', 'script',
  ];
  if (codingKeywords.some((kw) => prompt.includes(kw))) return 'coding';

  // Short, non-coding messages default to a general conversational reply
  // instead of always dumping a coding answer.
  return prompt.length < 40 ? 'general' : 'coding';
}

function pickFrom(list: string[], prompt: string): string {
  const hash = Array.from(prompt).reduce((a, c) => a + c.charCodeAt(0), 0);
  return list[hash % list.length];
}

function pickResponse(prompt: string): string {
  const intent = detectIntent(prompt);
  switch (intent) {
    case 'greeting':
      return pickFrom(GREETING_RESPONSES, prompt);
    case 'thanks':
      return pickFrom(THANKS_RESPONSES, prompt);
    case 'farewell':
      return pickFrom(FAREWELL_RESPONSES, prompt);
    case 'howAreYou':
      return pickFrom(HOW_ARE_YOU_RESPONSES, prompt);
    case 'general':
      return pickFrom(GENERAL_RESPONSES, prompt);
    case 'coding':
    default:
      return pickFrom(CODING_RESPONSES, prompt);
  }
}

// Simulates token-by-token streaming, similar to a real LLM response.
export async function streamMockResponse(prompt: string, { onToken, onDone, signal }: StreamHandlers) {
  const full = pickResponse(prompt);
  const words = full.split(/(\s+)/);
  for (const word of words) {
    if (signal.aborted) return;
    await new Promise((r) => setTimeout(r, 14 + Math.random() * 30));
    onToken(word);
  }
  onDone();
}

// Optional: if the user adds their own API key, this sends a real streaming-ish
// request directly from the browser. Kept simple (non-SSE) for a frontend-only app.
export async function streamRealResponse(
  prompt: string,
  provider: 'openai' | 'anthropic',
  apiKey: string,
  { onToken, onDone, signal }: StreamHandlers,
) {
  try {
    if (provider === 'openai') {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }] },
        { headers: { Authorization: `Bearer ${apiKey}` }, signal },
      );
      const text: string = res.data.choices?.[0]?.message?.content ?? '';
      await typeOut(text, onToken, signal);
    } else {
      const res = await axios.post(
        'https://api.anthropic.com/v1/messages',
        { model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] },
        { headers: { 'Content-Type': 'application/json' }, signal },
      );
      const text: string = res.data.content?.[0]?.text ?? '';
      await typeOut(text, onToken, signal);
    }
  } catch (err) {
    onToken('\n\n*(Could not reach the API — check your key and network, or switch back to Demo mode in Settings.)*');
  }
  onDone();
}

async function typeOut(text: string, onToken: (t: string) => void, signal: AbortSignal) {
  const words = text.split(/(\s+)/);
  for (const w of words) {
    if (signal.aborted) return;
    await new Promise((r) => setTimeout(r, 10));
    onToken(w);
  }
}
