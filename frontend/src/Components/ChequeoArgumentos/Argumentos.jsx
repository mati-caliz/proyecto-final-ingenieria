import React from "react";
import "./Argumentos.css";
import Card from "../Card/Card.jsx";
import Navbar from "../NavBar/Navbar";

const Argumentos = () => {
  return (
    <div className="container">
      <header className="header">
        <Navbar />
        <h1>Resultado del Análisis</h1>
      </header>
      <div className="content">
        <Card
          title={"Javier Milei"}
          text={
            "En los últimos 15 años, fuimos el país que menos creció en Latinoamérica"
          }
          result={"VERDADERO"}
        />
      </div>
      &nbsp;
      <h2>Acá va el título del análisis del discurso</h2>
      &nbsp;
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis
        nibh nec augue placerat, in sollicitudin libero bibendum. Integer
        lobortis, risus in molestie iaculis, mauris eros faucibus orci, ac
        suscipit ante dui a nibh. Nunc interdum hendrerit fringilla. Morbi
        auctor tincidunt iaculis. Duis sit amet eleifend enim. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis
        egestas. Etiam molestie vel sem a finibus. Nulla ullamcorper laoreet
        auctor. Vivamus interdum lorem at nunc pellentesque fermentum. Nam
        pretium scelerisque velit, in consequat diam posuere vitae. Ut efficitur
        felis eu libero blandit consectetur. Integer cursus magna dui, ac semper
        mi aliquam at. Donec dictum ac nibh eget vestibulum. Integer condimentum
        arcu sed nisi varius cursus. Sed iaculis ultricies ante, ut pulvinar
        metus efficitur ut. Maecenas vel purus pellentesque, sagittis purus
        quis, blandit lacus. Mauris venenatis turpis et bibendum sollicitudin.
        Vivamus a pretium sapien, vel auctor elit. Pellentesque nunc massa,
        ultricies quis dictum non, porta at nisi. Nullam quis finibus elit, eu
        faucibus massa. Etiam ac fermentum ante, in iaculis dolor. Ut eget velit
        sit amet dolor tempor pellentesque quis sit amet quam. Integer diam
        nulla, tincidunt a ultricies vitae, finibus id nisl. Etiam vel elit
        risus. Nam tellus tortor, eleifend ac nibh ac, blandit maximus lacus.
        Curabitur non commodo odio. Fusce malesuada pharetra arcu, nec
        consectetur nulla imperdiet nec. Sed nisi diam, fermentum in ipsum ac,
        pulvinar iaculis ex. Curabitur vel viverra est. Quisque nec nulla
        commodo, blandit velit vitae, eleifend nibh. Vestibulum luctus velit ut
        efficitur dignissim. Aliquam commodo ipsum non nunc tincidunt, ac
        finibus lectus commodo. Integer ut lacus dignissim, elementum diam a,
        pretium mauris. Maecenas a sodales odio, elementum sodales eros. Duis
        vulputate metus eget gravida varius.
      </p>
      <button className="volver">Regresar</button>
    </div>
  );
};

export default Argumentos;
