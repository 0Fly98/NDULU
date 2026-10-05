import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });
  return aiClient;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, contextItems } = req.body || {};

  try {
    const ai = getAiClient();
    if (!ai) {
      return res.json({
        advice: `### ⚠️ Safety Key Notice\nTo receive real-time customized regulatory mining guidelines from Gemini, please add your **GEMINI_API_KEY** in the Vercel Project Settings > Environment Variables.\n\n### General Safety Standard Checklist:\n1. **Personal Protective Equipment (PPE)**: Ensure certified steel-toe safety boots, high-visibility reflective clothing, and protective glasses/gloves are worn at all times.\n2. **Ventilation**: Ensure proper air circulation in deep underground environments before commencing any work.\n3. **Atmospheric Testing**: Continually check for toxic gases (Methane, CO) using certified safety detectors.\n4. **Hazard Isolation**: Lock out and tag out all electrical and mechanical power systems before cleaning, servicing, or clearing blockages.\n5. **Heavy Material Handling**: For conveyor rubber belting or large hardware, use mechanized cranes or multi-person team lifts.`
      });
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

    return res.json({ advice: response.text });
  } catch (error: any) {
    console.error('Error in safety-advisor endpoint:', error);
    return res.status(500).json({ error: 'Failed to generate safety recommendations. ' + (error.message || '') });
  }
}
