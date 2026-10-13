import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  orbitRadius: number; // pixels for display
  size: number; // pixels for display
  color: string;
  description: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    orbitRadius: 70,
    size: 6,
    color: '#b5b5b5',
    description: 'Самая маленькая и ближайшая к Солнцу планета.',
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    orbitRadius: 105,
    size: 10,
    color: '#e8cda0',
    description: 'Самая горячая планета с плотной атмосферой из CO₂.',
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    orbitRadius: 145,
    size: 11,
    color: '#4da6ff',
    description: 'Наш дом — единственная известная планета с жизнью.',
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    orbitRadius: 190,
    size: 8,
    color: '#e07040',
    description: 'Красная планета с самой высокой горой в Солнечной системе.',
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    orbitRadius: 260,
    size: 28,
    color: '#d4a574',
    description: 'Крупнейшая планета — газовый гигант с Большим красным пятном.',
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    orbitRadius: 330,
    size: 24,
    color: '#e8d5a0',
    description: 'Знаменита своими великолепными кольцами из льда и камня.',
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    orbitRadius: 395,
    size: 16,
    color: '#7de8e8',
    description: 'Ледяной гигант, вращающийся «на боку» относительно плоскости орбиты.',
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    orbitRadius: 450,
    size: 15,
    color: '#4466ff',
    description: 'Самая далёкая планета с самыми сильными ветрами в Солнечной системе.',
  },
];

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * 360));
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(planets.map(() => Math.random() * 360));

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        const newAngles = anglesRef.current.map((angle, i) => {
          // Base speed: Earth completes orbit in ~10 seconds at speed 1
          const baseSpeed = 360 / (planets[i].orbitalPeriod / 365) / 10000;
          return (angle + baseSpeed * delta * speed) % 360;
        });
        anglesRef.current = newAngles;
        setAngles([...newAngles]);
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isPlaying, speed]
  );

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const centerX = 500;
  const centerY = 500;

  // Generate stars once and memoize them
  const stars = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      id: i,
      cx: Math.random() * 1000,
      cy: Math.random() * 1000,
      r: Math.random() * 1.2 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  const getSpeedLabel = (s: number) => {
    if (s === 0.25) return '0.25×';
    if (s === 0.5) return '0.5×';
    if (s === 1) return '1×';
    if (s === 2) return '2×';
    if (s === 5) return '5×';
    if (s === 10) return '10×';
    return `${s}×`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <header className="w-full py-4 px-6 text-center bg-gradient-to-b from-gray-900 to-transparent relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
          🌌 Солнечная Система
        </h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">
          Нажмите на планету для подробной информации
        </p>
      </header>

      {/* Solar System Visualization */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full max-w-[900px] max-h-[900px]"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
        >
          {/* Stars background */}
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7a0" stopOpacity="1" />
              <stop offset="30%" stopColor="#ffcc00" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#ff8800" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="spaceBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0a0a20" />
              <stop offset="100%" stopColor="#000005" />
            </radialGradient>
            {planets.map((planet, i) => (
              <radialGradient key={`grad-${i}`} id={`planetGrad-${i}`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor={lightenColor(planet.color, 40)} />
                <stop offset="100%" stopColor={planet.color} />
              </radialGradient>
            ))}
          </defs>

          {/* Background */}
          <rect width="1000" height="1000" fill="url(#spaceBg)" />

          {/* Stars */}
          {stars.map((star) => (
            <circle
              key={`star-${star.id}`}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              opacity={star.opacity}
            />
          ))}

          {/* Orbit paths */}
          {planets.map((planet, i) => (
            <circle
              key={`orbit-${i}`}
              cx={centerX}
              cy={centerY}
              r={planet.orbitRadius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Sun */}
          <circle cx={centerX} cy={centerY} r="50" fill="url(#sunGlow)" />
          <circle cx={centerX} cy={centerY} r="30" fill="#ffcc00" />
          <circle cx={centerX} cy={centerY} r="25" fill="#ffdd44" opacity="0.8" />

          {/* Planets */}
          {planets.map((planet, i) => {
            const angleRad = (angles[i] * Math.PI) / 180;
            const x = centerX + planet.orbitRadius * Math.cos(angleRad);
            const y = centerY + planet.orbitRadius * Math.sin(angleRad);
            const isSelected = selectedPlanet?.name === planet.name;

            return (
              <g key={`planet-${i}`} className="cursor-pointer" onClick={() => setSelectedPlanet(planet)}>
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={planet.size + 6}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    opacity="0.8"
                    strokeDasharray="3 3"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${x} ${y}`}
                      to={`360 ${x} ${y}`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {/* Planet glow */}
                <circle
                  cx={x}
                  cy={y}
                  r={planet.size + 3}
                  fill={planet.color}
                  opacity="0.2"
                />
                {/* Planet body */}
                <circle
                  cx={x}
                  cy={y}
                  r={planet.size}
                  fill={`url(#planetGrad-${i})`}
                  stroke={isSelected ? 'white' : 'none'}
                  strokeWidth={isSelected ? 2 : 0}
                />
                {/* Saturn rings */}
                {planet.name === 'Saturn' && (
                  <ellipse
                    cx={x}
                    cy={y}
                    rx={planet.size * 1.8}
                    ry={planet.size * 0.4}
                    fill="none"
                    stroke="#d4b878"
                    strokeWidth="3"
                    opacity="0.7"
                    transform={`rotate(-20 ${x} ${y})`}
                  />
                )}
                {/* Planet label */}
                <text
                  x={x}
                  y={y - planet.size - 8}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  opacity="0.8"
                  className="pointer-events-none select-none"
                >
                  {planet.nameRu}
                </text>
                {/* Invisible larger click area */}
                <circle
                  cx={x}
                  cy={y}
                  r={Math.max(planet.size + 10, 18)}
                  fill="transparent"
                  className="cursor-pointer"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPlanet(null)}>
          <div
            className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full shadow-lg"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${lightenColor(selectedPlanet.color, 40)}, ${selectedPlanet.color})`,
                  }}
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPlanet.nameRu}</h2>
                  <p className="text-gray-400 text-sm">{selectedPlanet.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="text-gray-400 hover:text-white transition-colors text-2xl leading-none p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-300 mb-4 text-sm">{selectedPlanet.description}</p>

            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                icon="📏"
                label="Диаметр"
                value={`${selectedPlanet.diameter.toLocaleString()} км`}
              />
              <InfoCard
                icon="☀️"
                label="Расстояние от Солнца"
                value={`${selectedPlanet.distanceFromSun} млн км`}
              />
              <InfoCard
                icon="🔄"
                label="Орбитальный период"
                value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
              />
              <InfoCard
                icon="🌡️"
                label="Порядок от Солнца"
                value={`${planets.indexOf(selectedPlanet) + 1}-я планета`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="w-full bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 p-4 relative z-10">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            {isPlaying ? (
              <>
                <span className="text-lg">⏸</span>
                <span>Пауза</span>
              </>
            ) : (
              <>
                <span className="text-lg">▶</span>
                <span>Пуск</span>
              </>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-3 flex-1">
            <span className="text-gray-400 text-sm whitespace-nowrap">Скорость:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {[0.25, 0.5, 1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    speed === s
                      ? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/25'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {getSpeedLabel(s)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * (percent / 100)));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100)));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * (percent / 100)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} дней`;
  }
  const years = (days / 365.25).toFixed(1);
  return `${years} лет`;
}

export default App;
