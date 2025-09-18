import { type FC, type ReactNode } from 'react';

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const HamburgerMenu: FC<HamburgerMenuProps> = ({ open, onClose, children }) => {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const bgColor = theme === 'dark' ? 'var(--header-bg)' : '#fff';
  const textColor = theme === 'dark' ? 'var(--text-primary)' : '#222';

  return (
    <div
      className={`hamburger-menu-overlay${open ? ' open' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.6)',
        display: open ? 'flex' : 'none',
        flexDirection: 'column',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="hamburger-menu-content"
        style={{
          background: bgColor,
          color: textColor,
          width: '80vw',
          maxWidth: 320,
          margin: 'auto',
          borderRadius: 8,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: textColor,
          }}
          aria-label="Close menu"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default HamburgerMenu;
