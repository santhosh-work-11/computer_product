import React, { useEffect, useRef, useState } from 'react';

const CursorGlow = () => {
  const cursorRef = useRef(null);
  const [enabled, setEnabled] = useState(localStorage.getItem('admin_custom_cursor') !== 'false');

  useEffect(() => {
    const handleStorageChange = () => {
      setEnabled(localStorage.getItem('admin_custom_cursor') !== 'false');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={cursorRef} className="cursor-glow" />;
};

export default CursorGlow;
