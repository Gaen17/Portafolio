import React from 'react';

interface WidgetProps {
  id?: string;
  tag: string;
  className?: string;
  showStatusDot?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Widget: React.FC<WidgetProps> = ({
  id,
  tag,
  className = '',
  showStatusDot = false,
  children,
  footer
}) => {
  return (
    <section id={id} className={`widget ${className}`}>
      <div className="widget-header">
        <span className="widget-tag">{tag}</span>
        {showStatusDot && <span className="widget-status-dot"></span>}
      </div>
      <div className="widget-body">
        {children}
      </div>
      {footer && (
        <div className="widget-footer">
          {footer}
        </div>
      )}
    </section>
  );
};
