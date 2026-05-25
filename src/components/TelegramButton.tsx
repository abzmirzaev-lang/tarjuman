'use client'

export default function TelegramButton() {
  return (
    <>
      <style>{`
        .tg-float-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #229ED9;
          color: #fff;
          border-radius: 50px;
          padding: 12px 20px;
          font-family: Inter, sans-serif;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(34,158,217,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .tg-float-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(34,158,217,0.5);
        }
      `}</style>
      <a
        href="https://t.me/tarjuman_help_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="tg-float-btn"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.37l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.189z"/>
        </svg>
        Написать нам
      </a>
    </>
  )
}
