import React from 'react';
import './ArgumentAnalysis.css';

const argumentsData = [
    {
        statement: '44.7% de pobreza',
        analysis: 'Los primeros datos mencionan la situación de pobreza en la Argentina...',
        conclusion: 'Exagerado',
    },
    {
        statement: '9.6% de indigencia',
        analysis: 'Por su parte, la indigencia alcanzó 11.9% en 2023...',
        conclusion: 'Verdadero',
    },
    {
        statement: 'El crecimiento económico fue de 5%',
        analysis: 'Según los datos del INDEC, el crecimiento económico...',
        conclusion: 'Falso',
    }
];

const ArgumentAnalysis = () => {
    return (
        <div className="container">
            <h1>Chequeo de datos</h1>
            {argumentsData.map((item, index) => (
                <div key={index} className="argument-block">
                    <h2>{index + 1}) {item.statement}</h2>
                    <p className="analysis">{item.analysis}</p>
                    <span className={`conclusion ${item.conclusion.toLowerCase()}`}>
            {item.conclusion}
          </span>
                </div>
            ))}
        </div>
    );
};

export default ArgumentAnalysis;
