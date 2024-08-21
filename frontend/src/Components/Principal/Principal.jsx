import React from "react";
import "./Principal.css";
import Card from "../Card/Card.jsx";

const Principal = () => {
  return (
    <div className="container">
      <div className="content">
        <div className="left-section">
          <Card
            title={"Javier Milei"}
            text={
              "En los últimos 15 años, fuimos el país que menos creció en Latinoamérica"
            }
            result={"VERDADERO"}
          />
          <Card
            title={"Axel Kicillof"}
            text={
              "Tuvimos un retroceso de casi 20 años en pocos meses. Los salarios volvieron a niveles de abril de 2006"
            }
            result={"ENGAÑOSO"}
          />
          <Card
            title={"Mariano Cúneo Libarona"}
            text={
              "En el mundo todos los clubes son sociedades con capitales privados: Bayern Múnich, Real Madrid, Barcelona y PSG"
            }
            result={"FALSO"}
          />
        </div>
        <div className="options">
          <div className="choices">
            <label>
              <input type="radio" name="format" value="text" />
              Texto
            </label>
            <label>
              <input type="radio" name="format" value="audio" />
              Audio
            </label>
            <label>
              <input type="radio" name="format" value="video" />
              Video
            </label>
            <label>
              <input type="radio" name="format" value="youtube" />
              Youtube
            </label>
          </div>
          &nbsp;
          <div id={"input-container"}>
            <textarea id={"textarea-input"} placeholder={"Escriba aquí el texto a analizar"}></textarea>
          </div>
          <button className="submit">Enviar</button>
        </div>
        <div className="right-section">
          <Card
            title={"Luis Caputo"}
            text={
              "Desde que asumimos las jubilaciones subieron 4% en términos reales"
            }
            result={"ENGAÑOSO"}
          />
          <Card
            title={"Daniel Scioli"}
            text={
              "La delegación de los juegos olímpicos es la cuerta más importante en cuanto atletas de Argentina"
            }
            result={"EXAGERADO"}
          />
          <Card
            title={"Javier Milei"}
            text={
              "En los últimos 15 años fuimos el país que menos creció en latinoamérica"
            }
            result={"VERDADERO"}
          />
        </div>
      </div>
    </div>
  );
};
export default Principal;
