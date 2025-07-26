const path = require('path');
const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require("@google/genai");

const ai = new GoogleGenAI({});

async function main(filePath) {
  try {
    // Convert relative path to absolute path
    const absolutePath = path.resolve(__dirname, '../../uploads', filePath);
    
    const myfile = await ai.files.upload({
      file: absolutePath,
      config: { mimeType: "audio/mp3,audio/m4a" },
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        "analyze its mood in any of the following options: happy, sad, angry, relaxed, energetic, romantic, nostalgic, or neutral. Only return the mood as a single word.",
      ]),
      config: {
        thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
      },
    });
    return response.text;
  } catch (error) {
    console.error('Error in MusicMood.Service:', error);
    throw error;
  }
}

module.exports = { main };