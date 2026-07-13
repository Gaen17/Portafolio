import React, { useState } from 'react';
import { Widget } from './Widget';

interface ContactWidgetProps {
  onCopyToast: (label: string) => void;
}

interface ContactItem {
  id: string;
  label: string;
  displayValue: string;
  value: string;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    id: 'email',
    label: 'EMAIL',
    displayValue: 'everamendi17 · gmail',
    value: 'everamendi17@gmail.com',
  },
  {
    id: 'github',
    label: 'GITHUB',
    displayValue: 'github · Gaen17',
    value: 'https://github.com/Gaen17',
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    displayValue: 'linkedin · ernesto-veramendi',
    value: 'https://www.linkedin.com/in/ernesto-veramendi',
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE';

    // Mock mode for local testing or when no key is set
    if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
      setTimeout(() => {
        setIsSending(false);
        setIsSent(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setIsSent(false), 5000);
      }, 1200);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: 'Nuevo mensaje de contacto - Portafolio',
          from_name: 'Portafolio Web',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsSent(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setIsSent(false), 5000);
      } else {
        alert('Error al enviar el mensaje: ' + (data.message || 'Intente de nuevo.'));
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error de conexión. Compruebe su conexión e intente de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyEmail = (value: string) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        onCopyToast('EMAIL');
      })
      .catch((err) => {
        console.error('Error al copiar el correo:', err);
        alert('Correo: ' + value);
      });
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
                <label htmlFor="contact-name" className="sr-only">Tu nombre</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="TU NOMBRE"
                  maxLength={100}
                  required
                  disabled={isSending}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email" className="sr-only">Tu correo electrónico</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="TU CORREO"
                  maxLength={100}
                  required
                  disabled={isSending}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message" className="sr-only">Tu mensaje</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder="ESCRIBE TU MENSAJE..."
                  rows={4}
                  maxLength={1000}
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

        {/* Secure Copyable / Linkable Contacts */}
        <div className="contact-socials-container">
          <h3 className="contact-section-title">CANALES SEGUROS</h3>
          <p className="socials-desc">
            Haz clic para interactuar o visitar los canales externos.
          </p>
          <ul className="contact-list">
            {CONTACT_ITEMS.map((item) => (
              <li key={item.id}>
                {item.id === 'email' ? (
                  <button
                    className="contact-copy-card"
                    onClick={() => handleCopyEmail(item.value)}
                    aria-label={`Copiar correo: ${item.displayValue}`}
                    title={`Copiar correo: ${item.displayValue}`}
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
                ) : (
                  <a
                    className="contact-copy-card"
                    href={item.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visitar ${item.label}`}
                    title={`Visitar ${item.label}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="contact-info">
                      <span className="contact-label">{item.label}</span>
                      <span className="contact-value">{item.displayValue}</span>
                    </div>
                    <span className="copy-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Widget>
  );
};

export default ContactWidget;
