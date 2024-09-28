import React from 'react';
import './ArgumentAnalysis.css';
import Navbar from "../navBar/Navbar";
import { Analysis, AnalysisResponse } from '../../redux/redux/features/analyses/ResponseTypes';
import { useLocation, useNavigate } from 'react-router-dom';

const ArgumentAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisData = location.state?.analysisData;
  let parsedData: AnalysisResponse | null = null;

  console.log('analysisData', analysisData);

  try {
    parsedData = JSON.parse(analysisData) as AnalysisResponse;
    parsedData.analysis.map((item: Analysis, index: number) => {
      console.log(`item ${index}: `, item);
    });
  } catch (error) {
    console.error("Error al parsear el JSON:", error);
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="back-link-container">
          <p className="back-link" onClick={() => navigate(-1)}>&lt; Volver</p>
        </div>

        {parsedData && parsedData.title && parsedData.analysis ? (
          <>
            <h1>{parsedData.title}</h1>
            {parsedData.analysis.map((item: Analysis, index: number) => (
              <div key={index} className="argument-block">
                <h2>{item.affirmation}</h2>
                <p className="analysis">{item.analysis}</p>
                <span className={`conclusion ${item.veredict?.toLowerCase()}`}>
                  {item.veredict}
                </span>
              </div>
            ))}
          </>
        ) : (
          <p>No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default ArgumentAnalysis;
