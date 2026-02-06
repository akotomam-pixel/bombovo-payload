interface WaveDividerProps {
  color: 'yellow' | 'red' | 'blue'
  variant?: 1 | 2 | 3
}

export default function WaveDivider({ color, variant = 1 }: WaveDividerProps) {
  const colorHex = color === 'yellow' ? '#FDCA40' : color === 'red' ? '#DF2935' : '#3772FF'
  
  // Bold, irregular hand-drawn wave patterns - much more visible
  const wavePaths = {
    1: "M-10,25 Q90,10 180,26 Q270,35 360,22 Q450,12 540,28 Q630,38 720,24 Q810,14 900,30 Q990,36 1080,26 Q1170,16 1260,32 Q1350,28 1450,26",
    2: "M-10,20 Q90,32 180,18 Q270,8 360,24 Q450,34 540,20 Q630,10 720,26 Q810,36 900,22 Q990,12 1080,28 Q1170,34 1260,24 Q1350,18 1450,28",
    3: "M-10,28 Q90,16 180,30 Q270,38 360,26 Q450,14 540,32 Q630,40 720,28 Q810,18 900,34 Q990,38 1080,30 Q1170,20 1260,36 Q1350,32 1450,30"
  }
  
  // Second rough layer - slightly offset
  const roughPaths = {
    1: "M-10,23 Q90,8 180,24 Q270,33 360,20 Q450,10 540,26 Q630,36 720,22 Q810,12 900,28 Q990,34 1080,24 Q1170,14 1260,30 Q1350,26 1450,24",
    2: "M-10,18 Q90,30 180,16 Q270,6 360,22 Q450,32 540,18 Q630,8 720,24 Q810,34 900,20 Q990,10 1080,26 Q1170,32 1260,22 Q1350,16 1450,26",
    3: "M-10,26 Q90,14 180,28 Q270,36 360,24 Q450,12 540,30 Q630,38 720,26 Q810,16 900,32 Q990,36 1080,28 Q1170,18 1260,34 Q1350,30 1450,28"
  }
  
  // Third rough layer for texture
  const roughPaths2 = {
    1: "M-10,27 Q90,12 180,28 Q270,37 360,24 Q450,14 540,30 Q630,40 720,26 Q810,16 900,32 Q990,38 1080,28 Q1170,18 1260,34 Q1350,30 1450,28",
    2: "M-10,22 Q90,34 180,20 Q270,10 360,26 Q450,36 540,22 Q630,12 720,28 Q810,38 900,24 Q990,14 1080,30 Q1170,36 1260,26 Q1350,20 1450,30",
    3: "M-10,30 Q90,18 180,32 Q270,40 360,28 Q450,16 540,34 Q630,42 720,30 Q810,20 900,36 Q990,40 1080,32 Q1170,22 1260,38 Q1350,34 1450,32"
  }
  
  // Yellow dividers need to move up to overlap sections properly
  const marginClass = color === 'yellow' ? '-mt-4 md:-mt-5' : ''
  
  return (
    <div className={`w-full h-6 md:h-8 overflow-hidden relative -mb-1 ${marginClass}`}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1440 50" 
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full"
        style={{ filter: 'url(#roughness)' }}
      >
        {/* SVG filter for rough edges */}
        <defs>
          <filter id="roughness">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="turbulence"/>
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" />
          </filter>
        </defs>
        
        {/* First thick hand-drawn line */}
        <path 
          d={wavePaths[variant]}
          fill="none"
          stroke={colorHex}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Second rough layer for thickness */}
        <path 
          d={roughPaths[variant]}
          fill="none"
          stroke={colorHex}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        
        {/* Third rough layer for more texture */}
        <path 
          d={roughPaths2[variant]}
          fill="none"
          stroke={colorHex}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        
        {/* Background fill below the wave */}
        <path 
          d={`${wavePaths[variant]} L1450,50 L-10,50 Z`}
          fill={colorHex}
          stroke="none"
        />
      </svg>
    </div>
  )
}
