import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API to prevent crash if key is missing during startup
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiClient) {
    return aiClient;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI advisor features will return simulated fallback guidance.");
    return null;
  }
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return aiClient;
}

// AI Safety Advisor Endpoint
app.post('/api/safety-advisor', async (req: Request, res: Response) => {
  const { query, contextItems } = req.body;

  try {
    const ai = getAiClient();
    if (!ai) {
      // Fallback response when API key is not configured
      res.json({
        advice: `### ⚠️ Safety Key Notice\nTo receive real-time customized regulatory mining guidelines from Gemini, please add your **GEMINI_API_KEY** in the **Settings > Secrets** panel in the AI Studio sidebar.\n\n### General Safety Standard Checklist:\n1. **Personal Protective Equipment (PPE)**: Ensure certified steel-toe safety boots, high-visibility reflective clothing, and protective glasses/gloves are worn at all times.\n2. **Ventilation**: Ensure proper air circulation in deep underground environments before commencing any work.\n3. **Atmospheric Testing**: Continually check for toxic gases (Methane, CO) using certified safety detectors.\n4. **Hazard Isolation**: Lock out and tag out all electrical and mechanical power systems before cleaning, servicing, or clearing blockages.\n5. **Heavy Material Handling**: For conveyor rubber belting or large hardware, use mechanized cranes or multi-person team lifts.`
      });
      return;
    }

    const contextStr = contextItems && contextItems.length > 0 
      ? `Selected item details to incorporate in safety recommendations:\n${JSON.stringify(contextItems, null, 2)}`
      : 'No specific items selected. Provide general mining or industrial safety advice.';

    const systemInstruction = `You are "Ndulu AI Safety Advisor", an expert regulatory compliance officer and occupational health and safety engineer specializing in certified industrial mining safety standards (ISO, statutory OHS Act, MQA, MHSA).
Your goal is to provide concise, actionable, and authoritative safety advice, protective gear recommendations, hazard checks, and compliance guidelines based on the user's query and the items they selected from our inventory.
Always format your response beautifully in clear Markdown with visual sections, bullet points, and safety checklists. Mention specific compliance codes (like ISO, OHS) if applicable. Keep your tone helpful, professional, and uncompromisingly safety-focused.`;

    const prompt = `User Query: "${query}"\n\n${contextStr}\n\nProvide tailored safety advice, hazard mitigation steps, and protective equipment checklists for this setup.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error('Error in safety-advisor endpoint:', error);
    res.status(500).json({ error: 'Failed to generate safety recommendations. ' + (error.message || '') });
  }
});

// Configure Vite dynamic middleware in Development or static file serving in Production
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  console.log('Running in DEVELOPMENT mode - Loading Vite dev middleware...');
  // Dynamically import Vite only in development to prevent production dependency crashes
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  console.log('Running in PRODUCTION mode - Serving static assets...');
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  
  // SPA Fallback: Serve index.html for all other non-API requests
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
