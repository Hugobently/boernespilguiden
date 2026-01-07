'use client';

// Simple colored border instead of complex decorative frame
// Original backup saved as DecorativeFrame.backup.tsx

export default function DecorativeFrame() {
  return (
    <>
      {/* Simple pastel border - very thin and subtle */}

      {/* Left border */}
      <div
        className="fixed left-0 top-0 h-full w-1 pointer-events-none z-40"
        style={{
          background: 'linear-gradient(180deg, #FFB5A7 0%, #B8E0D2 25%, #A2D2FF 50%, #CDB4DB 75%, #FFE66D 100%)'
        }}
      />

      {/* Right border */}
      <div
        className="fixed right-0 top-0 h-full w-1 pointer-events-none z-40"
        style={{
          background: 'linear-gradient(180deg, #FFE66D 0%, #CDB4DB 25%, #A2D2FF 50%, #B8E0D2 75%, #FFB5A7 100%)'
        }}
      />

      {/* Top border */}
      <div
        className="fixed top-0 left-0 right-0 h-1 pointer-events-none z-40"
        style={{
          background: 'linear-gradient(90deg, #FFB5A7 0%, #B8E0D2 25%, #A2D2FF 50%, #CDB4DB 75%, #FFE66D 100%)'
        }}
      />

      {/* Bottom border */}
      <div
        className="fixed bottom-0 left-0 right-0 h-1 pointer-events-none z-40"
        style={{
          background: 'linear-gradient(90deg, #FFE66D 0%, #CDB4DB 25%, #A2D2FF 50%, #B8E0D2 75%, #FFB5A7 100%)'
        }}
      />
    </>
  );
}
