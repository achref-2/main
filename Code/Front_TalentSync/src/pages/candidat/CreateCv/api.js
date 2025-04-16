import axios from "axios";

// TextRazor API URL
const TEXTRAZOR_API_URL = "https://api.textrazor.com";
const TEXTRAZOR_API_KEY = "5d996bd1cca3e888389361bf4fe907840c37db57b2c9cdf6178a905d"; // Replace with your TextRazor API key

export const fetchAIContent = async (prompt) => {
  try {
    const response = await axios.post(
      TEXTRAZOR_API_URL,
      {
        text: prompt, // The input text (e.g., a CV or job description)
        extractors: "entities,topics,phrases", // Choose the extractors you need (can include entities, topics, keywords, etc.)
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-textrazor-key": TEXTRAZOR_API_KEY, // Add your API key here
        },
      }
    );

    // Extracting relevant data from TextRazor response
    const entities = response.data.response.entities; // Extract entities from the response
    const topics = response.data.response.topics; // Extract topics
    const phrases = response.data.response.phrases; // Extract key phrases

    // Combine the results into a formatted response
    return {
      entities,
      topics,
      phrases,
    };
  } catch (error) {
    console.error("Error fetching AI content from TextRazor:", error);
    throw error;
  }
};
