import React, { useState } from 'react';
import { saveLLMSetup } from '../api';
import { useNavigate } from 'react-router-dom';

function Setup({ onSetupComplete }) {
  const navigate = useNavigate(); // Declare navigate here
  const [llmChoice, setLLMChoice] = useState('');
  const [ollamaModel, setOllamaModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const setupData = {
        llmChoice,
        ...(llmChoice === 'ollama' && { ollamaModel }),
        ...(llmChoice !== 'ollama' && { apiKey, modelName }),
      };

      console.log('Setup data:', setupData); // Add this line
      await saveLLMSetup(setupData);
      console.log('Setup saved successfully'); // Add this line
      console.log('Navigating to ImageGenerator');
      onSetupComplete(); // Ensure this is called to update the state
      navigate('/image-generator');
    } catch (error) {
      console.error('Failed to save setup:', error); // Add this line
      setError('Failed to save setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="setup">
      <h2>LLM Setup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="llmChoice">Choose LLM:</label>
          <select
            id="llmChoice"
            value={llmChoice}
            onChange={(e) => setLLMChoice(e.target.value)}
            required
          >
            <option value="">Select an LLM</option>
            <option value="ollama">Ollama</option>
            <option value="sambanova">SambaNova</option>
            <option value="groq">Groq</option>
            <option value="cerebras">Cerebras</option>
          </select>
        </div>

        {llmChoice === 'ollama' && (
          <div>
            <label htmlFor="ollamaModel">Ollama Model:</label>
            <input
              type="text"
              id="ollamaModel"
              value={ollamaModel}
              onChange={(e) => setOllamaModel(e.target.value)}
              required
            />
          </div>
        )}

        {llmChoice !== 'ollama' && llmChoice !== '' && (
          <>
            <div>
              <label htmlFor="apiKey">API Key:</label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="modelName">Model Name:</label>
              <input
                type="text"
                id="modelName"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save and Continue'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Setup;
