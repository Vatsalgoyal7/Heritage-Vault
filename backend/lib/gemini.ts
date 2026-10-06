import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface WillGeneratorInput {
  userName: string;
  fatherName?: string;
  residence: string;
  executors: Array<{ name: string; relation: string; email: string }>;
  nominees: Array<{ name: string; relation: string; assignedCategories: string[] }>;
  specialInstructions?: string;
}

export async function generateDigitalWill(input: WillGeneratorInput): Promise<string> {
  if (!genAI) {
    // Fallback template if Gemini API Key is not set
    return `
LAST WILL AND TESTAMENT & DIGITAL ASSET INHERITED DECLARATION

I, ${input.userName}, residing at ${input.residence}, being of sound mind and memory, do hereby make, publish, and declare this instrument to be my Digital Legacy Will and Testament.

1. APPOINTMENT OF DIGITAL EXECUTORS
I appoint the following individual(s) as the Executor(s) of my Digital Estate:
${input.executors.map(e => `- ${e.name} (${e.relation}), Email: ${e.email}`).join('\n')}

2. DISTRIBUTION OF DIGITAL ASSETS & VAULT ITEMS
Upon verification of my incapacity or prolonged absence via the Heritage Vault Protocol, my encrypted digital assets shall be bequeathed as follows:

${input.nominees.map(n => `- To ${n.name} (${n.relation}): Access to categories [${n.assignedCategories.join(', ')}]`).join('\n')}

3. SPECIAL INSTRUCTIONS & MEMORY CAPSULES
${input.specialInstructions || 'No specific custom instructions provided.'}

4. ENCRYPTION & LEGAL DISCLAIMER
This digital will is protected by Heritage Vault AES-256-GCM encryption. Heritage Vault serves as a secure custody and access release system for digital credentials, documents, and memory capsules.

IN WITNESS WHEREOF, I have hereunto set my hand on this ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}.

Signature of Testator: ___________________________
[Generated securely via Heritage Vault AI System]
    `.trim();
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Generate a formal, legally structured "Last Will & Testament for Digital Assets" based on the following user details:

User Full Name: ${input.userName}
Residence / City: ${input.residence}
Designated Digital Executors: ${JSON.stringify(input.executors)}
Nominees & Asset Allocation: ${JSON.stringify(input.nominees)}
Special Instructions / Wishes: ${input.specialInstructions || 'None'}

Format the document professionally with formal legal headers, clear clauses for digital credentials, property papers, insurance, memory capsules, executor responsibilities, and revocation clauses. Keep it legally formal yet clear for family members.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating will with Gemini:', error);
    throw new Error('Failed to generate AI Digital Will');
  }
}
