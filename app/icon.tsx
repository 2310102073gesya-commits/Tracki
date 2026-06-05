import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 340,
          background: 'linear-gradient(135deg, #fdf2f8, #e0e7ff)', // pastel pink to pastel lavender
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#db2777', // deeper pastel pink for contrast
          fontWeight: 700,
          fontFamily: 'serif',
          borderRadius: '110px',
          boxShadow: 'inset 0 0 0 20px rgba(255,255,255,0.4)', // subtle inner glow
        }}
      >
        T
      </div>
    ),
    {
      ...size,
    }
  );
}
