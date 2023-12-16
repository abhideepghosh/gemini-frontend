import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./App.css";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiPath = "https://gemini-backend.onrender.com/geminiapi";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult([...result, [prompt]]);
    setPrompt("");
    await sendPromptToAI();
  };

  const sendPromptToAI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: prompt,
        }),
      });
      const data = await response.json();

      const formattedData = data.response.split("\n");
      setResult([...result, [prompt], formattedData]);

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document
      .querySelector(".container")
      .scrollIntoView({ behavior: "smooth", block: "end" });
  }, [result]);

  return (
    <>
      <div className="bg-dark">
        <div className="container text-white">
          {result.map((el, i) => (
            <div key={i} className="prompt-container">
              {el.map((line, id) => (
                <div key={id * 0.1}>{line}</div>
              ))}
            </div>
          ))}
          {isLoading ? <div className="prompt-container">Thinking...</div> : ""}
        </div>
        <form className="prompt-form bg-dark" onSubmit={handleSubmit}>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            className="prompt-input text-white"
            placeholder="Enter your prompt"
          />
          <button type="submit" className="btn btn-dark">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
