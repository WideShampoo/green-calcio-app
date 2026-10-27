const ROLE_COLORS = {
  TOT: '#ffffff',
  POR: '#f97316',
  DIF: '#3b82f6',
  CEN: '#10b981',
  ATT: '#ef4444'
};

// TOT è il primo, quindi va sulla punta alta del pentagono
const AXES = ['TOT', 'POR', 'DIF', 'CEN', 'ATT'];

const getPlayerRoles = (player) => {
  if (player?.isGoalkeeper) return ['POR'];
  return player?.roles?.length ? player.roles : [];
};

const getAverage = (players) => {
  if (!players.length) return 0;
  return players.reduce((sum, p) => sum + p.rating, 0) / players.length;
};

export default function TeamRadar({ team, size = 220 }) {
  if (!team) return null;

  const players = team.players || [];

  const values = {
    TOT: getAverage(players),
    POR: (() => {
  const goalkeepers = players.filter(p =>
    getPlayerRoles(p).includes('POR')
  );

  return goalkeepers.length > 0
    ? getAverage(goalkeepers)
    : 3;
})(),
    DIF: getAverage(players.filter(p => getPlayerRoles(p).includes('DIF'))),
    CEN: getAverage(players.filter(p => getPlayerRoles(p).includes('CEN'))),
    ATT: getAverage(players.filter(p => getPlayerRoles(p).includes('ATT')))
  };

  const center = size / 2;
  const radius = size * 0.34;
  const levels = [0.25, 0.5, 0.75, 1];

  const getPoint = (index, value = 10) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / AXES.length;
    const r = radius * (value / 10);

    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r
    };
  };

  const polygonPoints = AXES
    .map((axis, index) => {
      const p = getPoint(index, values[axis]);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <div className="team-radar-card">
      <div className="team-radar-title">{team.name}</div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {levels.map(level => (
          <polygon
            key={level}
            points={AXES.map((_, index) => {
              const p = getPoint(index, 10 * level);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
        ))}

        {AXES.map((axis, index) => {
          const end = getPoint(index, 10);
          return (
            <line
              key={axis}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={polygonPoints}
          fill="rgba(16,185,129,0.35)"
          stroke="#10b981"
          strokeWidth="3"
        />

        {AXES.map((axis, index) => {
          const label = getPoint(index, 11.8);
          const valuePoint = getPoint(index, values[axis]);

          return (
            <g key={axis}>
              <circle
                cx={valuePoint.x}
                cy={valuePoint.y}
                r="5"
                fill={ROLE_COLORS[axis]}
              />

              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={ROLE_COLORS[axis]}
                fontSize="12"
                fontWeight="800"
              >
                {axis}
              </text>

            </g>
          );
        })}
      </svg>
    </div>
  );
}