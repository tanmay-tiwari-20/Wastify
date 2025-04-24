'use client'; // If this is a client-side component

import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from 'react-hot-toast'; // If you're using toast notifications

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const testGeminiConnection = async () => {
  try {
    if (!geminiApiKey) {
      throw new Error("Gemini API key is missing. Check your environment variables.");
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or another model if needed

    const prompt = "Hello Gemini!"; // A very simple prompt

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini connection test successful:", text);
    toast.success("Gemini connection test successful!"); // Notify the user (optional)

    return true; // Indicate success

  } catch (error) {
    console.error("Gemini connection test failed:", error);
    toast.error(`Gemini connection test failed: ${error.message}`); // Notify the user (optional)
    return false; // Indicate failure
  }
};


// Example usage (e.g., in a button click handler or useEffect):
const MyComponent = () => {

  const handleTestConnection = async () => {
    const success = await testGeminiConnection();
    if (success) {
      // Proceed with your Gemini-related logic
    } else {
      // Handle the connection failure (e.g., display an error message to the user)
    }
  };

  return (
    <div>
      <button onClick={handleTestConnection}>Test Gemini Connection</button>
      {/* ... rest of your component */}
    </div>
  );
};



export default MyComponent;