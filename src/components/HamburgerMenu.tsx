import { type FC, type ReactNode, useEffect } from 'react';

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const HamburgerMenu: FC<HamburgerMenuProps> = ({ open, onClose, children }) => {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const bgColor = theme === 'dark' ? 'var(--header-bg)' : '#fff';
  const textColor = theme === 'dark' ? 'var(--text-primary)' : '#222';

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      className={open ? ' open' : ''}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: open ? 'rgba(0,0,0,0.6)' : 'transparent',
        display: open ? 'block' : 'none',
        zIndex: 1000,
        transition: 'background 0.3s',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: bgColor,
          color: textColor,
          width: 260,
          maxWidth: '80vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          right: 0,
          boxShadow: '-2px 0 8px rgba(0,0,0,0.2)',
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          padding: 24,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
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
