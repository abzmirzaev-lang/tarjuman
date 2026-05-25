'use client'

export default function TelegramButton() {
  return (
    <>
      <style>{`
        .tg-float-btn {
          position: fixed;
          bottom: 20px;
          right: 16px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #229ED9;
          color: #fff;
          border-radius: 50px;
          padding: 12px 18px;
          font-family: Inter, sans-serif;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(34,158,217,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .tg-float-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(34,158,217,0.5);
        }
        .tg-float-btn .tg-label {
          display: inline;
        }
        @media (max-width: 768px) {
          .tg-float-btn {
            bottom: 80px;
            right: 12px;
            padding: 12px;
            border-radius: 50%;
            gap: 0;
          }
          .tg-float-btn .tg-label {
            display: none;
          }
        }
      `}</style>
      <a
        href="https://t.me/tarjuman_help_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="tg-float-btn"
        aria-label="Написать нам в Telegram"
      >
        <svg width="22" height