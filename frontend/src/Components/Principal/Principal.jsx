import React, { useState } from "react";
import "./Principal.css";
import Card from "../Card/Card.jsx";

const Principal = () => {
  const [selectedOption, setSelectedOption] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setInputValue("");
    setFile(null);
    setError("");
  };

  const handleInputChange = (event) => {
    setError(""); // Resetea el mensaje de error al cambiar el input
    if (selectedOption === "text" || selectedOption === "youtube") {
      setInputValue(event.target.value);
    } else {
      const selectedFile = event.target.files[0];
      const validAudioTypes = [".mp3", ".wav"];
      const validVideoTypes = [".mp4", ".avi"];

      if (selectedOption === "audio" && !validAudioTypes.includes(selectedFile.name.slice(-4).toLowerCase())) {
        setError("Formato de archivo de audio no válido. Solo se permiten .mp3 y .wav.");
      } else if (selectedOption === "video" && !validVideoTypes.includes(selectedFile.name.slice(-4).toLowerCase())) {
        setError("Formato de archivo de video no válido. Solo se permiten .mp4 y .avi.");
      } else {
        setFile(selectedFile);
      }
    }
  };

  const validateYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  };

  const handleSubmit = () => {
    setError(""); // Resetea el mensaje de error antes de validar
    if (selectedOption === "text" || selectedOption === "youtube") {
      if (inputValue.trim() === "") {
        setError("El campo de texto no puede estar vacío.");
        return;
      }
      if (selectedOption === "youtube" && !validateYouTubeUrl(inputValue)) {
        setError("La URL proporcionada no es válida. Asegúrese de que sea una URL de YouTube.");
        return;
      }
      console.log(`Input Value: ${inputValue}`);
    } else if (file) {
      console.log(`Uploaded File: ${file.name}, Type: ${file.type}`);
    } else {
      setError("Debe cargar un archivo válido antes de enviar.");
      return;
    }

    // Deshabilita el botón para que el usuario no pueda reenviar antes de recibir una respuesta
    setIsSubmitting(true);

    // Simula la llamada a la API (aquí se reemplazará en el futuro)
    setTimeout(() => {
      console.log("API call simulation complete.");
      setIsSubmitting(false); // Rehabilita el botón de envío
    }, 1000);
  };

  return (
    <div className="container">
      <div className="content">
        <div className="left-section">
          <Card
            text={"En los últimos 15 años, fuimos el país que menos creció en Latinoamérica"}
            result={"VERDADERO"}
          />
          <Card
            text={"Tuvimos un retroceso de casi 20 años en pocos meses. Los salarios volvieron a niveles de abril de 2006"}
            result={"ENGAÑOSO"}
          />
          <Card
            text={"En el mundo todos los clubes son sociedades con capitales privados: Bayern Múnich, Real Madrid, Barcelona y PSG"}
            result={"FALSO"}
          />
        </div>
        <div className="options">
          <div className="choices">
            <label>
              <input
                type="radio"
                name="format"
                value="text"
                checked={selectedOption === "text"}
                onChange={handleOptionChange}
              />
              Texto
            </label>
            <label>
              <input
                type="radio"
                name="format"
                value="audio"
                checked={selectedOption === "audio"}
                onChange={handleOptionChange}
              />
              Audio
            </label>
            <label>
              <input
                type="radio"
                name="format"
                value="video"
                checked={selectedOption === "video"}
                onChange={handleOptionChange}
              />
              Video
            </label>
            <label>
              <input
                type="radio"
                name="format"
                value="youtube"
                checked={selectedOption === "youtube"}
                onChange={handleOptionChange}
              />
              Youtube
            </label>
          </div>
          &nbsp;
          <div id={"input-container"}>
            {selectedOption === "text" && (
              <textarea
                id={"textarea-input"}
                placeholder={"Escriba aquí el texto a analizar"}
                value={inputValue}
                onChange={handleInputChange}
              ></textarea>
            )}
            {(selectedOption === "audio" || selectedOption === "video") && (
              <input
                type="file"
                accept={selectedOption === "audio" ? ".mp3,.wav" : ".mp4,.avi"}
                onChange={handleInputChange}
              />
            )}
            {selectedOption === "youtube" && (
              <input
                type="text"
                placeholder={"Ingrese la URL de YouTube"}
                value={inputValue}
                onChange={handleInputChange}
              />
            )}
          </div>
          {error && <p className="error">{error}</p>}
          <button
            className={`submit ${isSubmitting ? "disabled" : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
          {isSubmitting && (
            <p className="processing-message">
              Estamos procesando la información enviada. Por favor, espere hasta que el análisis sea realizado.
            </p>
          )}
        </div>
        <div className="right-section">
          <Card
            text={"Desde que asumimos las jubilaciones subieron 4% en términos reales"}
            result={"ENGAÑOSO"}
          />
          <Card
            text={"La delegación de los juegos olímpicos es la cuarta más importante en cuanto atletas de Argentina"}
            result={"EXAGERADO"}
          />
          <Card
            text={"En los últimos 15 años fuimos el país que menos creció en latinoamérica"}
            result={"VERDADERO"}
          />
        </div>
      </div>
    </div>
  );
};

export default Principal;
