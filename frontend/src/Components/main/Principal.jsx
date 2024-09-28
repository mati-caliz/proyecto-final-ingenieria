import React, { useEffect, useState } from "react";
import "./Principal.css";
import Card from "../cards/Card.jsx";
import Navbar from "../navBar/Navbar";
import { useNavigate } from 'react-router-dom';
import {
  useGetPreviousAnalysesMutation,
  useTextAnalysisMutation,
  useAudioAnalysisMutation,
  useVideoAnalysisMutation, useYoutubeAnalysisMutation,
} from '../../redux/redux/features/analyses/analysisApiSlice';

const Principal = () => {
  const [inputType, setInputType] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [getPreviousAnalyses] = useGetPreviousAnalysesMutation();
  const [requestTextAnalysis] = useTextAnalysisMutation();
  const [requestAudioAnalysis] = useAudioAnalysisMutation();
  const [requestVideoAnalysis] = useVideoAnalysisMutation();
  const [requestYouTubeAnalysis] = useYoutubeAnalysisMutation();
  const [previousAnalyses, setPreviousAnalyses] = useState([]);
  const [loadingPreviousAnalyses, setLoadingPreviousAnalyses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await getPreviousAnalyses();
        console.log('Response de análisis viejos: ', response.data);
        if (!response.data) {
          throw new Error('Response is undefined');
        }
        setPreviousAnalyses(response.data);
      } catch (error) {
        console.error("Error fetching analyses:", error);
      } finally {
        setLoadingPreviousAnalyses(false);
      }
    };

    fetchAnalyses();
  }, []);

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
        setErrorMessage("Formato de archivo de audio no válido. Solo se permiten .mp3 y .wav.");
      } else if (
        inputType === "video" &&
        !validVideoTypes.includes(selectedFile.name.slice(-4).toLowerCase())
      ) {
        setErrorMessage("Formato de archivo de video no válido. Solo se permiten .mp4 y .avi.");
      } else {
        setSelectedFile(selectedFile);
      }
    }
  };

  const validateYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    if ((inputType === "text" || inputType === "youtube") && inputValue.trim() === "") {
      setErrorMessage("El campo de texto no puede estar vacío.");
      return;
    }
    if (inputType === "youtube" && !validateYouTubeUrl(inputValue)) {
      setErrorMessage("La URL proporcionada no es válida. Asegúrese de que sea una URL de YouTube.");
      return;
    }
    if (inputType === "file" && !selectedFile) {
      setErrorMessage("Debe cargar un archivo válido antes de enviar.");
      return;
    }

    setIsSubmitting(true);

    try {
      let result = null;

      switch (inputType) {
        case "text":
          result = await requestTextAnalysis({ text: inputValue });
          console.log('Text analysis result: ', result);
          break;
        case "audio":
          const audioFormData = new FormData();
          audioFormData.append('audio_file', selectedFile);
          result = await requestAudioAnalysis(audioFormData);
          console.log('Audio analysis result: ', result);
          break;
        case "video":
          const videoFormData = new FormData();
          videoFormData.append('video_file', selectedFile);
          result = await requestVideoAnalysis(videoFormData);
          console.log('Video analysis result: ', result);
          break;
        case "youtube":
          result = await requestYouTubeAnalysis({ text: inputValue });
          console.log('YouTube analysis result: ', result);
          break;
        default:
          console.error('Unexpected input type: ', inputType);
          break;
      }

      setIsSubmitting(false);
      if (result) {
        console.log('Pasando a ArgumentAnalysis: ', result)

        navigate('/argument-analysis', { state: { analysisData: result.data.analysis } });
      }
    } catch (e) {
      console.error(`Error requesting analysis of type ${inputType}: `, e);
      setErrorMessage("Error durante el envío. Por favor, intente nuevamente.");
      setIsSubmitting(false);
    }
  };

  const handleCardClick = (analysis) => {
    navigate('/argument-analysis', { state: { analysisData: analysis.analysis } });
  };

  const splitAnalyses = () => {
    const middleIndex = Math.ceil(previousAnalyses.length / 2);
    return {
      left: previousAnalyses.slice(0, middleIndex),
      right: previousAnalyses.slice(middleIndex),
    };
  };

  const { left, right } = splitAnalyses();

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="content">
          <div className="left-section">
            <h2 className="section-title">Análisis Anteriores</h2>
            {loadingPreviousAnalyses ? (
              <p>Cargando...</p>
            ) : (
              left.length > 0 ? (
                left.map((analysis, index) => (
                  <Card
                    key={index}
                    text={<a className='anchor-like' onClick={() => handleCardClick(analysis)}>{JSON.parse(analysis.analysis)['title']}</a>}
                  />
                ))
              ) : (
                <p className="no-analyses-available">No hay análisis disponibles.</p>
              )
            )}
          </div>
          <div className="options">
            <h2 className="central-title">Ingrese un archivo o texto</h2>
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
                YouTube
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
                  className="url-input"
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
                Estamos procesando la información enviada. Por favor, espere hasta que el análisis sea realizado.
              </p>
            )}
          </div>
          <div className="right-section">
            <h2 className="section-title">Análisis Anteriores</h2>
            {loadingPreviousAnalyses ? (
              <p>Cargando...</p>
            ) : (
              right.length > 0 ? (
                right.map((analysis, index) => (
                  <Card
                    key={index}
                    text={<a className='anchor-like' onClick={() => handleCardClick(analysis)}>{JSON.parse(analysis.analysis)['title']}</a>}
                  />
                ))
              ) : (
                <p className="no-analyses-available">No hay análisis disponibles.</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Principal;
