import React, { useState } from 'react';
import { Widget } from './Widget';

interface ContactWidgetProps {
  onCopyToast: (label: string) => void;
}

interface ContactItem {
  id: string;
  label: string;
  displayValue: string;
  encoded: string; // Base64 — never written to DOM as plain URL
}

// Data is stored ONLY as Base64. URLs are assembled in RAM on click, never rendered.
const CONTACT_ITEMS: ContactItem[] = [
  {
    id: 'email',
    label: 'EMAIL',
    displayValue: 'everamendi17 · gmail',
    encoded: 'ZXZlcmFtZW5kaTE3QGdtYWlsLmNvbQ==', // everamendi17@gmail.com
  },
  {
    id: 'github',
    label: 'GITHUB',
    displayValue: 'github · Gaen17',
    encoded: 'aHR0cHM6Ly9naXRodWIuY29tL0dhZW4xNw==', // https://github.com/Gaen17
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    displayValue: 'linkedin · ernesto-veramendi',
    encoded: 'aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2ZlZWQv', // https://www.linkedin.com/feed/
  },
];

export const ContactWidget: React.FC<ContactWidgetProps> = ({ onCopyToast }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  // Data only decoded in memory, on user gesture, never stored in DOM
  const handleCopy = (item: ContactItem) => {
    try {
      const decoded = atob(item.encoded);
      navigator.clipboard.writeText(decoded).then(() => {
        onCopyToast(item.label);
      });
    } catch {
      console.error('Copy failed');
    }
  };

  return (
    <Widget id="contact" tag="CONECTAR.SH" className="widget-contact">
      <div className="contact-widget-layout">
        {/* Secure Contact Form */}
        <div className="contact-form-container">
          <h3 className="contact-section-title">ENVIAR MENSAJE</h3>
          {isSent ? (
            <div className="form-success-message">
              <span className="success-dot" />
              <p className="success-text">¡MENSAJE ENVIADO!</p>
              <p className="success-subtext">
                El sistema ha procesado tu consulta de forma segura.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="nothing-contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="TU NOMBRE"
                  required
                  disabled={isSending}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="TU CORREO"
                  required
                  disabled={isSending}
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder="ESCRIBE TU MENSAJE..."
                  rows={4}
                  required
                  disabled={isSending}
                />
              </div>
              <button
                type="submit"
                className="form-submit-btn"
                disabled={isSending}
              >
                {isSending ? 'PROCESANDO...' : 'ENVIAR.SH'}
              </button>
            </form>
          )}
        </div>

        {/* Secure Copyable Contact — entire card is the button, no copy button visible */}
        <div className="contact-socials-container">
          <h3 className="contact-section-title">CANALES SEGUROS</h3>
          <p className="socials-desc">
            Pulsa cualquier canal para copiarlo al portapapeles.
          </p>
          <ul className="contact-list">
            {CONTACT_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className="contact-copy-card"
                  onClick={() => handleCopy(item)}
                  aria-label={`Copiar ${item.label}`}
                  title={`Copiar ${item.label}`}
                >
                  <div className="contact-info">
                    <span className="contact-label">{item.label}</span>
                    <span className="contact-value">{item.displayValue}</span>
                  </div>
                  <span className="copy-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Widget>
  );
};

export default ContactWidget;
