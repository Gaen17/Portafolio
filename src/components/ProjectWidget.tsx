import React from 'react';
import { Widget } from './Widget';

interface ProjectWidgetProps {
  id?: string;
  tag: string;
  matrixText: string;
  title: string;
  description: string;
  url?: string;
}

export const ProjectWidget: React.FC<ProjectWidgetProps> = ({
  id,
  tag,
  matrixText,
  title,
  description,
  url,
}) => {
  const content = (
    <div className="project-placeholder" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="dot-matrix-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="matrix-text">{matrixText}</span>
          {url && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          )}
        </div>
        <h2 className="project-title">{title}</h2>
        <p className="project-desc">{description}</p>
      </div>
    </div>
  );

  return (
    <Widget id={id} tag={tag} className="widget-project">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
          {content}
        </a>
      ) : (
        content
      )}
    </Widget>
  );
};

export default ProjectWidget;
