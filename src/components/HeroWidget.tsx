import React from 'react';
import { Widget } from './Widget';

export const HeroWidget: React.FC = () => {
  return (
    <Widget
      id="about"
      tag="PERFIL.SYS"
      className="widget-hero"
      showStatusDot={true}
      footer={<span className="quote">"Time waits for no one"</span>}
    >
      <h1 className="hero-name">
        <span className="accent-char">E</span>rnesto <span className="accent-char">V</span>eramendi
      </h1>
      <p className="hero-title">Full-Stack Engineer // UI/UX Designer</p>
      <p className="hero-subtitle">
        Construyendo software con filosofía minimalista y atención obsesiva al pixel. Especializado en el desarrollo de interfaces tácticas, sistemas reactivos y arquitecturas de alto rendimiento.
      </p>
    </Widget>
  );
};

export default HeroWidget;
