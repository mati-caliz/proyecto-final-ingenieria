import React, { useState } from "react";
import "./Principal.css";
import Card from "../cards/Card.jsx";
import Navbar from "../navBar/Navbar";

const Principal = () => {
  const [inputType, setInputType] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (event) => {
    setInputType(event.target.value);
    setInputValue("");
    setSelectedFile(null);
    setErrorMessage("");
  };

  const handleInputChange = (event) => {
    setErrorMessage("");
    if (inputType === "text" || inputType === "youtube") {
      setInputValue(event.target.value);
    } else {
      const selectedFile = event.target.files[0];
      const validAudioTypes = [".mp3", ".wav"];
      const validVideoTypes = [".mp4", ".avi"];

      if (
        inputType === "audio" &&
        !validAudioTypes.includes(selectedFile.name.slice(-4).toLowerCase())
      ) {
        setErrorMessage(
          "Formato de archivo de audio no válido. Solo se permiten .mp3 y .wav."
        );
      } else if (
        inputType === "video" &&
        !validVideoTypes.includes(selectedFile.name.slice(-4).toLowerCase())
      ) {
        setErrorMessage(
          "Formato de archivo de video no válido. Solo se permiten .mp4 y .avi."
        );
      } else {
        setSelectedFile(selectedFile);
      }
    }
  };

  const validateYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  };

  const handleSubmit = () => {
    setErrorMessage("");
    if ((inputType === "text" || inputType === "youtube") && inputValue.trim() === "") {
        setErrorMessage("El campo de texto no puede estar vacío.");
        return;
      }
      if (inputType === "youtube" && !validateYouTubeUrl(inputValue)) {
        setErrorMessage(
          "La URL proporcionada no es válida. Asegúrese de que sea una URL de YouTube."
        );
        return;
      }
      if (inputType === "file" && !selectedFile) {
      setErrorMessage("Debe cargar un archivo válido antes de enviar.");
      return;
    }
      setIsSubmitting(true);
      setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
  <div>
    <Navbar />
    <div className="container">
      <div className="content">
        <div className="left-section">
          <h2 className="section-title">Análisis Anteriores</h2>
          <Card
            text={
              "En los últimos 15 años, fuimos el país que menos creció en Latinoamérica"
            }
            result={"VERDADERO"}
          />
          <Card
            text={
              "Tuvimos un retroceso de casi 20 años en pocos meses. Los salarios volvieron a niveles de abril de 2006"
            }
            result={"POLÉMICO"}
          />
          <Card
            text={
              "En el mundo todos los clubes son sociedades con capitales privados: Bayern Múnich, Real Madrid, Barcelona y PSG"
            }
            result={"FALSO"}
          />
        </div>
        <div className="options">
          <h2 className="central-title">
            Ingrese un archivo o texto
          </h2>
          <div className="choices">
            <label>
              <input
                type="radio"
                name="format"
                value="text"
                checked={inputType === "text"}
                onChange={handleOptionChange}
              />
              Texto
            </label>
            <label>
              <input
                type="radio"
                name="format"
                value="audio"
                checked={inputType === "audio"}
                onChange={handleOptionChange}
              />
              Audio
            </label>
            <label>
              <input
                type="radio"
                name="format"
                value="video"
                checked={inputType === "video"}
                onChange={handleOptionChange}
              />
              Video
            </label>
            <label>
              <input
                type="radio"
                name="format"
                value="youtube"
                checked={inputType === "youtube"}
                onChange={handleOptionChange}
              />
              Youtube
            </label>
          </div>
          <div className="input-container">
            {inputType === "text" && (
              <textarea
                id={"textarea-input"}
                className="textarea-input"
                placeholder={"Escriba aquí el texto a analizar"}
                value={inputValue}
                onChange={handleInputChange}
              ></textarea>
            )}
            {(inputType === "audio" || inputType === "video") && (
              <input
                type="file"
                id={"file-input"}
                accept={inputType === "audio" ? ".mp3,.wav" : ".mp4,.avi"}
                onChange={handleInputChange}
              />
            )}
            {inputType === "youtube" && (
              <input
                id={"youtube-input"}
                type="text"
                placeholder={"Ingrese la URL de YouTube"}
                value={inputValue}
                onChange={handleInputChange}
              />
            )}
          </div>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <button
            className={`submit ${isSubmitting ? "disabled" : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
          {isSubmitting && (
            <p className="processing-message">
              Estamos procesando la información enviada. Por favor, espere hasta
              que el análisis sea realizado.
            </p>
          )}
        </div>
        <div className="right-section">
          <h2 className="section-title">Análisis Anteriores</h2>
          <Card
            text={
              "Desde que asumimos las jubilaciones subieron 4% en términos reales"
            }
            result={"POLÉMICO"}
          />
          <Card
            text={
              "La delegación de los juegos olímpicos es la cuarta más importante en cuanto atletas de Argentina"
            }
            result={"POLÉMICO"}
          />
          <Card
            text={
              "En los últimos 15 años fuimos el país que menos creció en latinoamérica"
            }
            result={"VERDADERO"}
          />
        </div>
      </div>
    </div>
  </div>
  );
};

export default Principal;
