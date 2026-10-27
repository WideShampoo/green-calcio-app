import { useState, useEffect, useMemo } from 'react';
import TeamRadar from './TeamRadar';

// --- ICONE SVG INLINE PER EVITARE DIPENDENZE ---
const IconSoccer = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
    <path d="M12 5a7 7 0 0 0-7 7" />
    <path d="M12 19a7 7 0 0 0 7-7" />
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconCopy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconRefresh = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

const IconUpload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconUserCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const IconUserX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="18" y1="8" x2="23" y2="13" />
    <line x1="23" y1="8" x2="18" y2="13" />
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconDownload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PLAYER_ROLES = ['POR', 'DIF', 'CEN', 'ATT'];

const normalizeRoles = (roles = [], isGoalkeeper = false) => {
  if (isGoalkeeper) return ['POR'];

  const clean = [...new Set(
    roles
      .map(r => String(r).toUpperCase().trim())
      .filter(r => PLAYER_ROLES.includes(r))
  )];

  if (clean.includes('POR')) return ['POR'];
  return clean;
};

const isGoalkeeperPlayer = (player) =>
  normalizeRoles(player?.roles, player?.isGoalkeeper).includes('POR');

const getPlayerRoles = (player) =>
  normalizeRoles(player?.roles, player?.isGoalkeeper);

const getRoleLabel = (player) => {
  const roles = getPlayerRoles(player);
  return roles.length ? roles.join('/') : 'AUTO';
};

const togglePlayerRole = (roles = [], role) => {
  const current = normalizeRoles(roles);

  if (role === 'POR') {
    return current.includes('POR') ? [] : ['POR'];
  }

  const withoutPor = current.filter(r => r !== 'POR');

  if (withoutPor.includes(role)) {
    return withoutPor.filter(r => r !== role);
  }

  return [...withoutPor, role];
};

// --- COMPONENTE PER INPUT DEL VOTO (RISOLVE IL TRONCAMENTO DEI DECIMALI SU MOBILE) ---
const RatingInput = ({ value, onChange }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [localValue, setLocalValue] = useState(value.toString());

  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value.toString());
  }

  const handleChange = (e) => {
    const rawVal = e.target.value;
    setLocalValue(rawVal);

    // Normalizza la virgola in punto decimale (comune tastiere IT)
    const normalized = rawVal.replace(',', '.');
    const parsed = parseFloat(normalized);

    if (!isNaN(parsed)) {
      const clamped = Math.max(1, Math.min(10, parsed));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    const normalized = localValue.replace(',', '.');
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed)) {
      const clamped = Math.max(1, Math.min(10, parsed));
      setLocalValue(clamped.toString());
      onChange(clamped);
    } else {
      setLocalValue(value.toString());
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      pattern="[0-9]*[.,]?[0-9]*"
      className="form-input"
      style={{ width: '64px', padding: '4px 6px', fontSize: '0.9rem', textAlign: 'center' }}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};


// --- LISTA GIOCATORI DI PROVA INIZIALE - 14 GIOCATORI PER MATCH 7 vs 7 ---
const SAMPLE_PLAYERS = [
  { name: 'Alessandro', rating: 6, roles: ['CEN'] },
  { name: 'Luca', rating: 6, roles: ['CEN','ATT'] },
  { name: 'Jeff', rating: 6, roles: ['CEN'] },
  { name: 'Roncho', rating: 6, roles: ['DIF'] },
  { name: 'Ross', rating: 6, roles: ['DIF'] },
  { name: 'AndreaV', rating: 6, roles: ['DIF'] },
  { name: 'Giovanni', rating: 6, roles:['DIF', 'CEN']},
  { name: 'Dario', rating: 6, roles:['CEN'] },
  { name: 'Eros', rating: 6, roles: ['ATT'] },
  { name: 'Andrea', rating: 6, roles: ['DIF'] },
  { name: 'Pierluigi', rating: 6,roles: ['DIF','CEN'] },
  { name: 'Albi', rating: 6, roles: ['POR']},
  { name: 'Angelo', rating: 6, roles: ['DIF', 'CEN']},
  { name: 'Steccio', rating: 6, roles: ['CEN'] }
];

function App() {
  // --- STATI PRINCIPALI ---
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('green-calcio-players');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState('singolo'); // 'singolo' | 'massivo'
  const [singleName, setSingleName] = useState('');
  const [singleRating, setSingleRating] = useState(7.0);
  const [singleRoles, setSingleRoles] = useState([]);
  const [bulkText, setBulkText] = useState('');
  const numTeams = 2; // Sempre 2 squadre
  const [matchSize, setMatchSize] = useState(() => {
    const saved = localStorage.getItem('green-calcio-matchSize');
    return saved ? parseInt(saved) : 7;
  }); // 7 = 7vs7, 5 = 5vs5
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('green-calcio-teams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState('');
  const [selectedPlayerForSwap, setSelectedPlayerForSwap] = useState(null); // { teamId, playerId }

  // Selezione per la visualizzazione sul campo da calcio
  const [pitchTeamAId, setPitchTeamAId] = useState(1);
  const [pitchTeamBId, setPitchTeamBId] = useState(2);

  // --- PERSISTENZA LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('green-calcio-players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('green-calcio-teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('green-calcio-matchSize', matchSize.toString());
  }, [matchSize]);

  // Se cambiano le squadre generate, aggiorniamo i selettori del campo
  useEffect(() => {
    if (teams && teams.length >= 2) {
      const existsA = teams.some(t => t.id === pitchTeamAId);
      const existsB = teams.some(t => t.id === pitchTeamBId);
      if (!existsA) setPitchTeamAId(teams[0].id);
      if (!existsB) setPitchTeamBId(teams[1].id);
    }
  }, [teams, pitchTeamAId, pitchTeamBId]);

  // --- STATISTICHE DEI GIOCATORI ---
  const stats = useMemo(() => {
    const total = players.length;
    const available = players.filter(p => p.available).length;
    const gksAvailable = players.filter(p => p.available && isGoalkeeperPlayer(p)).length;
const regularsAvailable = players.filter(p => p.available && !isGoalkeeperPlayer(p)).length;

    const sumRatings = players.reduce((sum, p) => sum + p.rating, 0);
    const avgRating = total > 0 ? (sumRatings / total).toFixed(1) : '0.0';

    const sumAvailable = players.filter(p => p.available).reduce((sum, p) => sum + p.rating, 0);
    const avgAvailable = available > 0 ? (sumAvailable / available).toFixed(1) : '0.0';

    return { total, available, gksAvailable, regularsAvailable, avgRating, avgAvailable, sumAvailable };
  }, [players]);

  // --- STATO CONTEGGIO GIOCATORI vs MODALITÀ ---
  const playerCountStatus = useMemo(() => {
    const required = matchSize * 2; // 7v7 = 14, 5v5 = 10
    const available = stats.available;
    const diff = available - required;

    if (diff === 0) {
      return { ok: true, message: `Perfetto! ${available} giocatori disponibili per ${matchSize}v${matchSize}.`, type: 'success' };
    } else if (diff > 0) {
      return { ok: false, message: `Ci sono ${diff} giocatore/i in più rispetto ai ${required} necessari per il ${matchSize}v${matchSize}. Rimuovi o segna come assenti ${diff} giocatore/i.`, type: 'warning' };
    } else {
      return { ok: false, message: `Mancano ${Math.abs(diff)} giocatore/i per il ${matchSize}v${matchSize}. Servono ${required} giocatori, ne hai ${available}.`, type: 'error' };
    }
  }, [stats.available, matchSize]);

  // --- GESTIONE LISTA ---
  const handleAddSingle = (e) => {
  e.preventDefault();
  const name = singleName.trim();
  if (!name) return;

  const newPlayer = {
    id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name,
    rating: parseFloat(singleRating),
    available: true,
    roles: normalizeRoles(singleRoles)
  };

  setPlayers(prev => [newPlayer, ...prev]);
  setSingleName('');
  setSingleRating(7.0);
  setSingleRoles([]);
  showToast(`Giocatore ${name} aggiunto con successo!`);
};

  const handleAddBulk = (e) => {
  e.preventDefault();
  if (!bulkText.trim()) return;

  const lines = bulkText.split('\n');
  const newPlayers = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let rating = 7.0;
    let name = trimmed;
    let roles = [];

    const roleMatch = name.match(/\((POR|DIF|CEN|ATT)(?:\s*[,/]\s*(POR|DIF|CEN|ATT))*\)/gi);

    if (roleMatch) {
      const lastRoleGroup = roleMatch[roleMatch.length - 1];
      roles = normalizeRoles(
        lastRoleGroup
          .replace(/[()]/g, '')
          .split(/[,/]/)
          .map(r => r.trim())
      );

      name = name.replace(lastRoleGroup, '').trim();
    }

    const ratingAtEnd = name.match(/^(.+?)\s*[:\-–—]*\s*\(?(\d{1,2}(?:[.,]\d+)?)\)?\s*$/);
    const ratingAtStart = name.match(/^(\d{1,2}(?:[.,]\d+)?)\s+(.+)$/);

    if (ratingAtEnd) {
      const parsedRating = parseFloat(ratingAtEnd[2].replace(',', '.'));
      if (parsedRating >= 1 && parsedRating <= 10) {
        name = ratingAtEnd[1].replace(/[:\-–—()]/g, '').trim();
        rating = parsedRating;
      }
    } else if (ratingAtStart) {
      const parsedRating = parseFloat(ratingAtStart[1].replace(',', '.'));
      if (parsedRating >= 1 && parsedRating <= 10) {
        name = ratingAtStart[2].trim();
        rating = parsedRating;
      }
    }

    name = name.replace(/\s+/g, ' ');
    if (!name) name = `Giocatore ${newPlayers.length + 1}`;

    newPlayers.push({
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 5)}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      rating: Math.max(1, Math.min(10, rating)),
      available: true,
      roles
    });
  });

  if (newPlayers.length > 0) {
    setPlayers(prev => [...newPlayers, ...prev]);
    setBulkText('');
    showToast(`Aggiunti ${newPlayers.length} giocatori!`);
  }
};

  const toggleAvailability = (id) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  const toggleRole = (id, role) => {
  setPlayers(prev => {
    const player = prev.find(p => p.id === id);
    if (!player) return prev;

    const nextRoles = togglePlayerRole(getPlayerRoles(player), role);

    if (role === 'POR' && nextRoles.includes('POR')) {
      const goalkeeperCount = prev.filter(p => p.id !== id && isGoalkeeperPlayer(p)).length;

      if (goalkeeperCount >= 2) {
        showToast("Puoi selezionare al massimo 2 portieri 🧤");
        return prev;
      }
    }

    return prev.map(p =>
      p.id === id
        ? { ...p, roles: nextRoles, isGoalkeeper: nextRoles.includes('POR') }
        : p
    );
  });
};

  const updatePlayerRating = (id, newRating) => {
    const val = Math.max(1, Math.min(10, parseFloat(newRating)));
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, rating: val } : p));
  };

  const removePlayer = (id) => {
    const player = players.find(p => p.id === id);
    setPlayers(prev => prev.filter(p => p.id !== id));
    if (player) {
      showToast(`Rimosso ${player.name}`);
    }
  };

  const clearAllPlayers = () => {
    if (window.confirm("Sei sicuro di voler cancellare TUTTI i giocatori dalla lista?")) {
      setPlayers([]);
      setTeams([]);
      showToast("Lista giocatori svuotata");
    }
  };

  const loadSamplePlayers = () => {
  if (window.confirm("Vuoi caricare la lista di giocatori di prova (14 giocatori)? Questa azione sovrascriverà la lista corrente.")) {
    const formatted = SAMPLE_PLAYERS.map((p, idx) => ({
      id: `sample-${idx}-${Date.now()}`,
      name: p.name,
      rating: p.rating,
      available: true,
      roles: normalizeRoles(p.roles, p.isGoalkeeper),
isGoalkeeper: normalizeRoles(p.roles, p.isGoalkeeper).includes('POR')
    }));

    setPlayers(formatted);
    setTeams([]);
    showToast("Caricati 14 giocatori di prova");
  }
};

  // --- CALCOLO SOMMA RATING CON BONUS PORTIERE +2 ---
  const getTeamRatingSum = (teamPlayers) => {
  const baseSum = teamPlayers.reduce((sum, p) => sum + p.rating, 0);
  const gkCount = teamPlayers.filter(p => isGoalkeeperPlayer(p)).length;
  return baseSum + gkCount * 2;
};

  // --- ALGORITMO DI BILANCIAMENTO SQUADRE (CON VINCOLI PORTIERI E BONUS) ---
  const handleGenerateTeams = () => {
    const availablePlayers = players.filter(p => p.available);
    const availableGoalkeepers = availablePlayers.filter(p => isGoalkeeperPlayer(p)).length;

    if (availableGoalkeepers > 2) {
      alert("Non puoi avere più di 2 portieri disponibili. Segna come assente o rimuovi il ruolo portiere da qualcuno.");
      return;
    }
    const required = matchSize * 2;

    if (availablePlayers.length !== required) {
      const diff = availablePlayers.length - required;
      if (diff > 0) {
        alert(`Hai ${diff} giocatore/i in più! Per il ${matchSize}v${matchSize} servono esattamente ${required} giocatori disponibili. Segna ${diff} giocatore/i come assenti.`);
      } else {
        alert(`Mancano ${Math.abs(diff)} giocatore/i! Per il ${matchSize}v${matchSize} servono esattamente ${required} giocatori disponibili.`);
      }
      return;
    }

    let bestTeams = null;
    let bestScore = Infinity;

    for (let trial = 0; trial < 100; trial++) {
      // Inizializza i contenitori per le squadre
      const localTeams = Array.from({ length: numTeams }, (_, i) => {
        let name = `Squadra ${String.fromCharCode(65 + i)}`;
        if (numTeams === 2) {
          name = i === 0 ? 'Team Black' : 'Team White';
        }
        return {
          id: i + 1,
          name: name,
          players: [],
          ratingSum: 0
        };
      });

      // Separa portieri e giocatori di movimento, mescola l'ordine
      const gks = availablePlayers.filter(p => isGoalkeeperPlayer(p)).sort(() => Math.random() - 0.5);
const regulars = availablePlayers.filter(p => !isGoalkeeperPlayer(p)).sort(() => Math.random() - 0.5);

      // Ordina decrescente con perturbazione per parità di voto
      gks.sort((a, b) => {
        const diff = b.rating - a.rating;
        if (Math.abs(diff) < 0.05) return Math.random() - 0.5;
        return diff;
      });
      regulars.sort((a, b) => {
        const diff = b.rating - a.rating;
        if (Math.abs(diff) < 0.05) return Math.random() - 0.5;
        return diff;
      });

      const totalPlayersCount = availablePlayers.length;
      const maxCapacity = Math.ceil(totalPlayersCount / numTeams);
      const minCapacity = Math.floor(totalPlayersCount / numTeams);

      // 1. Distribuzione dei Portieri prima (equamente)
      gks.forEach(player => {
        let eligible = localTeams.filter(t => t.players.length < maxCapacity);

        // Ordina per numero di portieri decrescente (preferisci chi ne ha meno) e poi per somma rating
        eligible.sort((a, b) => {
          const gkCountA = a.players.filter(p => isGoalkeeperPlayer(p)).length;
          const gkCountB = b.players.filter(p => isGoalkeeperPlayer(p)).length;
          if (gkCountA !== gkCountB) {
            return gkCountA - gkCountB;
          }
          const sumA = getTeamRatingSum(a.players);
          const sumB = getTeamRatingSum(b.players);
          if (sumA !== sumB) return sumA - sumB;
          return a.players.length - b.players.length;
        });

        const target = eligible[0];
        target.players.push(player);
        target.ratingSum = getTeamRatingSum(target.players);
      });

      // 2. Distribuzione dei Giocatori di Movimento
      regulars.forEach(player => {
        let eligible = localTeams.filter(t => t.players.length < maxCapacity);

        eligible.sort((a, b) => {
          const sumA = getTeamRatingSum(a.players);
          const sumB = getTeamRatingSum(b.players);
          if (sumA !== sumB) return sumA - sumB;
          return a.players.length - b.players.length;
        });

        const target = eligible[0];
        target.players.push(player);
        target.ratingSum = getTeamRatingSum(target.players);
      });

      // 3. Ottimizzazione locale tramite scambi (Hill Climbing)
      let improved = true;
      let steps = 0;
      while (improved && steps < 400) {
        improved = false;
        steps++;

        // A. Scambi di coppie (solo tra ruoli compatibili: GK <-> GK, Regular <-> Regular)
        for (let i = 0; i < numTeams; i++) {
          for (let j = i + 1; j < numTeams; j++) {
            const teamA = localTeams[i];
            const teamB = localTeams[j];

            for (let pAIdx = 0; pAIdx < teamA.players.length; pAIdx++) {
              for (let pBIdx = 0; pBIdx < teamB.players.length; pBIdx++) {
                const pA = teamA.players[pAIdx];
                const pB = teamB.players[pBIdx];

                // Impedisci scambi incrociati portiere-regolare per non alterare la distribuzione dei portieri
                if (isGoalkeeperPlayer(pA) !== isGoalkeeperPlayer(pB)) continue;

                const currentDiff = Math.abs(teamA.ratingSum - teamB.ratingSum);

                const tempPlayersA = [...teamA.players];
                const tempPlayersB = [...teamB.players];
                tempPlayersA[pAIdx] = pB;
                tempPlayersB[pBIdx] = pA;

                const newSumA = getTeamRatingSum(tempPlayersA);
                const newSumB = getTeamRatingSum(tempPlayersB);
                const newDiff = Math.abs(newSumA - newSumB);

                if (newDiff < currentDiff - 0.01) {
                  teamA.players = tempPlayersA;
                  teamB.players = tempPlayersB;
                  teamA.ratingSum = newSumA;
                  teamB.ratingSum = newSumB;
                  improved = true;
                }
              }
            }
          }
        }

        // B. Spostamenti singoli (solo per giocatori di movimento)
        for (let i = 0; i < numTeams; i++) {
          for (let j = 0; j < numTeams; j++) {
            if (i === j) continue;
            const teamA = localTeams[i];
            const teamB = localTeams[j];

            if (teamA.players.length - 1 >= minCapacity && teamB.players.length + 1 <= maxCapacity) {
              for (let pIdx = 0; pIdx < teamA.players.length; pIdx++) {
                const player = teamA.players[pIdx];

                // Non spostare i portieri per mantenere fisso il loro numero per squadra
                if (isGoalkeeperPlayer(player)) continue;

                const currentDiff = Math.abs(teamA.ratingSum - teamB.ratingSum);

                const tempPlayersA = teamA.players.filter((_, idx) => idx !== pIdx);
                const tempPlayersB = [...teamB.players, player];

                const newSumA = getTeamRatingSum(tempPlayersA);
                const newSumB = getTeamRatingSum(tempPlayersB);
                const newDiff = Math.abs(newSumA - newSumB);

                if (newDiff < currentDiff - 0.01) {
                  teamA.players = tempPlayersA;
                  teamB.players = tempPlayersB;
                  teamA.ratingSum = newSumA;
                  teamB.ratingSum = newSumB;
                  improved = true;
                  break;
                }
              }
            }
            if (improved) break;
          }
          if (improved) break;
        }
      }

      // Calcola score di questo tentativo
      const sums = localTeams.map(t => t.ratingSum);
      const range = Math.max(...sums) - Math.min(...sums);
      const avg = sums.reduce((a, b) => a + b, 0) / numTeams;
      const stdDev = Math.sqrt(sums.reduce((acc, s) => acc + Math.pow(s - avg, 2), 0) / numTeams);


      const rolePenalty = localTeams.reduce((penalty, team) => {
  const playersWithoutGk = team.players.filter(p => !isGoalkeeperPlayer(p));

  const roleCounts = {
    DIF: playersWithoutGk.filter(p => getPlayerRoles(p).includes('DIF')).length,
    CEN: playersWithoutGk.filter(p => getPlayerRoles(p).includes('CEN')).length,
    ATT: playersWithoutGk.filter(p => getPlayerRoles(p).includes('ATT')).length
  };

  const missingDif = Math.max(0, 1 - roleCounts.DIF);
  const missingCen = Math.max(0, 1 - roleCounts.CEN);
  const missingAtt = Math.max(0, 1 - roleCounts.ATT);

  return penalty + missingDif + missingCen + missingAtt;
}, 0);

      
      const trialScore = range * 15 + stdDev + rolePenalty * 8;

      if (trialScore < bestScore) {
        bestScore = trialScore;
        bestTeams = localTeams.map(t => ({
          ...t,
          players: [...t.players],
          ratingSum: t.ratingSum
        }));
      }
    }

    const teamsWithTacticalSlots = bestTeams.map(team => applyTacticalSlots(team));
    setTeams(teamsWithTacticalSlots);
    setSelectedPlayerForSwap(null);
    showToast("Squadre generate in modo bilanciato! ⚽");
  };

  // --- FUNZIONE PER LO SCAMBIO MANUALE RAPIDO ---
  // La selezione usa l'ID del giocatore, non l'indice dell'array.
  // Questo evita che dopo il primo swap un indice ormai cambiato faccia muovere
  // anche un altro elemento dell'anteprima, soprattutto sul Team White.
  const handleSelectForSwap = (teamId, playerIndex) => {
    const sourceTeam = teams.find(t => t.id === teamId);
    const clickedPlayer = sourceTeam?.players[playerIndex];
    if (!sourceTeam || !clickedPlayer) return;

    if (selectedPlayerForSwap === null) {
      setSelectedPlayerForSwap({ teamId, playerId: clickedPlayer.id });
      return;
    }

    if (selectedPlayerForSwap.teamId === teamId && selectedPlayerForSwap.playerId === clickedPlayer.id) {
      setSelectedPlayerForSwap(null);
      return;
    }

    const newTeams = teams.map(t => ({
      ...t,
      players: t.players.map(p => ({ ...p }))
    }));

    const teamA = newTeams.find(t => t.id === selectedPlayerForSwap.teamId);
    const teamB = newTeams.find(t => t.id === teamId);
    if (!teamA || !teamB) {
      setSelectedPlayerForSwap(null);
      return;
    }

    const indexA = teamA.players.findIndex(p => p.id === selectedPlayerForSwap.playerId);
    const indexB = teamB.players.findIndex(p => p.id === clickedPlayer.id);
    if (indexA < 0 || indexB < 0) {
      setSelectedPlayerForSwap(null);
      return;
    }

    const playerA = teamA.players[indexA];
    const playerB = teamB.players[indexB];
    const slotA = { tacticalLine: playerA.tacticalLine, tacticalSlot: playerA.tacticalSlot };
    const slotB = { tacticalLine: playerB.tacticalLine, tacticalSlot: playerB.tacticalSlot };

    if (teamA.id === teamB.id) {
      teamA.players[indexA] = { ...playerB, ...slotA };
      teamA.players[indexB] = { ...playerA, ...slotB };
      teamA.ratingSum = getTeamRatingSum(teamA.players);
    } else {
      // Ogni lato conserva esclusivamente il proprio slot tattico.
      // Il giocatore che arriva prende lo slot della persona sostituita.
      teamA.players[indexA] = { ...playerB, ...slotA };
      teamB.players[indexB] = { ...playerA, ...slotB };
      teamA.ratingSum = getTeamRatingSum(teamA.players);
      teamB.ratingSum = getTeamRatingSum(teamB.players);
    }

    setTeams(newTeams);
    setSelectedPlayerForSwap(null);
    showToast(`Scambio effettuato: ${playerA.name} ⇄ ${playerB.name}`);
  };

  // --- CALCOLO METRICHE DI BILANCIAMENTO ---
  const balanceMetrics = useMemo(() => {
    if (!teams || teams.length < 2) return null;

    const sums = teams.map(t => t.ratingSum);
    const min = Math.min(...sums);
    const max = Math.max(...sums);
    const diff = max - min;

    const percentage = Math.max(0, Math.min(100, Math.round(100 - (diff * 10))));

    let status = 'Buono';
    let statusClass = 'good';
    if (diff <= 1.0) {
      status = 'Bilanciamento Perfetto';
      statusClass = 'perfect';
    } else if (diff > 3.0) {
      status = 'Squilibrato';
      statusClass = 'unbalanced';
    }

    return { diff: diff.toFixed(1), percentage, status, statusClass };
  }, [teams]);

  // --- FORMATTAZIONE E COPIA PER WHATSAPP/TELEGRAM ---
  const handleCopyFormattedText = () => {
    if (!teams || teams.length === 0) return;

    let text = `⚽ *GREEN CALCIO - SQUADRE BILANCIATE* ⚽\n\n`;

    teams.forEach((t, idx) => {
      const emoji = ['🟢', '🔵', '🟠', '🟣', '🔴', '🟡'][idx % 6];
      const avg = t.players.length > 0 ? (t.ratingSum / t.players.length).toFixed(1) : '0.0';
      text += `${emoji} *${t.name.toUpperCase()}* (Media: ${avg} • Tot con Bonus: ${t.ratingSum.toFixed(1)})\n`;

      t.players.forEach((p, pIdx) => {
        text += `${pIdx + 1}. ${p.name}${isGoalkeeperPlayer(p) ? ' 🧤' : ''}\n`;
      });
      text += `\n`;
    });

    if (balanceMetrics) {
      text += `⚖️ *Dislivello Voti Totali (con Bonus):* ${balanceMetrics.diff}\n`;
      text += `📊 *Equilibrio:* ${balanceMetrics.percentage}%\n\n`;
    }

    text += `Generato con Green Calcio App 🚀`;

    navigator.clipboard.writeText(text)
      .then(() => {
        showToast("Riepilogo copiato negli appunti! 📋");
      })
      .catch(err => {
        console.error("Errore nella copia: ", err);
      });
  };

  // --- DOWNLOAD IMMAGINE FORMAZIONI: TABELLONE RETRO BLACK / WHITE ---
  const handleDownloadImage = async () => {
    if (!teams || teams.length < 2) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 1420;
    const ctx = canvas.getContext('2d');

    const loadImage = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    const safeLoadImage = async (src) => {
      try { return await loadImage(src); } catch (error) { console.warn(`Impossibile caricare ${src}`, error); return null; }
    };

    const arrowFiles = ['/FrecciaGiu.png','/FrecciaSuDestra.png','/FrecciaGiuDestra.png','/FrecciaSu.png'];
    const [darioLogo, ...arrowImages] = await Promise.all([
      safeLoadImage('/Dario_Rocchi.webp'),
      ...arrowFiles.map(safeLoadImage)
    ]);

    const randomArrowByPlayer = new Map();
    teams.slice(0, 2).forEach(team => team.players.forEach(player => {
      const available = arrowImages.filter(Boolean);
      randomArrowByPlayer.set(player.id, available.length ? available[Math.floor(Math.random() * available.length)] : null);
    }));

    const blackTeam = teams.find(t => t.name.toLowerCase().includes('black')) || teams[0];
    const whiteTeam = teams.find(t => t.name.toLowerCase().includes('white')) || teams[1];

    const primaryRole = (p) => isGoalkeeperPlayer(p) ? 'POR' : (getPlayerRoles(p)[0] || 'AUTO');

    // Ordine grafico fisso: PT -> DI -> CC -> AT.
    // Non modifica le squadre reali: cambia soltanto l'ordine nella PNG esportata.
    const roleOrder = { POR: 0, DIF: 1, CEN: 2, ATT: 3, AUTO: 4 };
    const sortPlayersForGraphic = (team) => [...team.players].sort((a, b) => {
      const roleDiff = (roleOrder[primaryRole(a)] ?? 99) - (roleOrder[primaryRole(b)] ?? 99);
      if (roleDiff !== 0) return roleDiff;
      return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
    });

    const blackPlayers = sortPlayersForGraphic(blackTeam);
    const whitePlayers = sortPlayersForGraphic(whiteTeam);
    const roleCode = (p) => ({ POR:'PT', DIF:'DI', CEN:'CC', ATT:'AT' }[primaryRole(p)] || '--');
    const roleBorder = (role) => ({ POR:'#e4cf25', DIF:'#2988b8', CEN:'#31a35b', ATT:'#d74b48' }[role] || '#888');
    const oldFont = 'Consolas, "Courier New", monospace';
    // XXX PERSONALIZZARE XXX - stretch orizzontale dei nomi (1.08 = +8%)
    const playerNameStretchX = 1.08;

    const drawStretchedText = (text, x, y, stretchX = 1, align = 'left') => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(stretchX, 1);
      ctx.textAlign = align;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    const fitName = (name, maxWidth, font) => {
      ctx.font = font;
      if (ctx.measureText(name).width <= maxWidth) return name;
      let text = name;
      while (text.length > 1 && ctx.measureText(`${text}…`).width > maxWidth) text = text.slice(0, -1);
      return `${text}…`;
    };

    const drawRoleBox = (player, x, cy, right = false) => {
  const role = primaryRole(player);
  const code = roleCode(player);

  const w = 72;
  const h = 44;

  const bx = right ? x - w : x;
  const by = cy - h / 2;

  // Sfondo nero
  ctx.fillStyle = '#080a09';
  ctx.fillRect(bx, by, w, h);

  // SOLO bordo inferiore colorato in base al ruolo
  ctx.strokeStyle = roleBorder(role);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(bx, by + h - 2.5);
  ctx.lineTo(bx + w, by + h - 2.5);
  ctx.stroke();

  // Testo ruolo grande, bold e quasi a tutta altezza
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "Arial Black", Impact, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(
    code,
    bx + w / 2,
    cy - 1,
    w - 4
  );
};


const drawSecondaryTags = (player, x, y, right = false) => {
  const main = primaryRole(player);
  const secondary = getPlayerRoles(player).filter(r => r !== main);

  let cursor = x;

  secondary.forEach(role => {
    const label = (
      {
        POR: 'PT',
        DIF: 'DI',
        CEN: 'CC',
        ATT: 'AT'
      }[role] || role
    );

    const w = 34;
    const h = 20;

    const bx = right ? cursor - w : cursor;
    const by = y - h / 2;

    // Sfondo nero
    ctx.fillStyle = '#080a09';
    ctx.fillRect(bx, by, w, h);

    // SOLO bordo inferiore colorato in base al ruolo
    ctx.strokeStyle = roleBorder(role);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, by + h - 1.5);
    ctx.lineTo(bx + w, by + h - 1.5);
    ctx.stroke();

    // Testo grande, bold e compatto
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 17px "Arial Black", Impact, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(
      label,
      bx + w / 2,
      y - 1,
      w - 2
    );

    // Posizionamento del tag successivo
    cursor += right ? -(w + 5) : (w + 5);
  });
};

    // Fondo metallico/grigio da vecchio tabellone.
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, '#b9bdb9'); bg.addColorStop(.5, '#eceeeb'); bg.addColorStop(1, '#a9ada9');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tableX = 28, tableY = 28, tableW = canvas.width - 56;
    const headerH = 76, rowH = 92;
    const rows = Math.max(blackPlayers.length, whitePlayers.length);
    const halfW = tableW / 2, midX = tableX + halfW;
    const bodyTop = tableY + headerH;

    // Testate lucide con gradiente e bordatura PES.
    const blackGrad = ctx.createLinearGradient(tableX, tableY, midX, tableY + headerH);
    blackGrad.addColorStop(0, '#111'); blackGrad.addColorStop(.48, '#3a3a38'); blackGrad.addColorStop(1, '#090909');
    ctx.fillStyle = blackGrad; ctx.fillRect(tableX, tableY, halfW, headerH);
    const whiteGrad = ctx.createLinearGradient(midX, tableY, tableX + tableW, tableY + headerH);
    whiteGrad.addColorStop(0, '#d7d8d4'); whiteGrad.addColorStop(.5, '#fafbf7'); whiteGrad.addColorStop(1, '#b9bbb7');
    ctx.fillStyle = whiteGrad; ctx.fillRect(midX, tableY, halfW, headerH);

    // Highlight lucido superiore.
    const shine = ctx.createLinearGradient(0, tableY, 0, tableY + headerH);
    shine.addColorStop(0, 'rgba(255,255,255,.48)'); shine.addColorStop(.42, 'rgba(255,255,255,.08)'); shine.addColorStop(.5, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine; ctx.fillRect(tableX, tableY, tableW, headerH);
    ctx.strokeStyle = '#252827'; ctx.lineWidth = 4; ctx.strokeRect(tableX, tableY, tableW, headerH + rows * rowH);
    ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.lineWidth = 2; ctx.strokeRect(tableX + 4, tableY + 4, tableW - 8, headerH - 8);

    ctx.textBaseline = 'middle';
    ctx.font = `bold 39px ${oldFont}`;
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText('BLACK TEAM', tableX + 22, tableY + headerH/2 + 2);
    ctx.fillStyle = '#222'; ctx.textAlign = 'right'; ctx.fillText('WHITE TEAM', tableX + tableW - 22, tableY + headerH/2 + 2);

    // Corpo tabella e righe.
    for (let i=0; i<rows; i++) {
      const y = bodyTop + i * rowH;
      // Gradienti orizzontali speculari in stile vecchia schermata PES:
      // BLACK (sinistra): più chiaro all'esterno -> più scuro verso il centro.
      // WHITE (destra): più scuro verso il centro -> più chiaro all'esterno.
      const leftRowGrad = ctx.createLinearGradient(tableX, y, midX, y);
      leftRowGrad.addColorStop(0, i % 2 === 0 ? '#f1f2ef' : '#e3e5e1');
      leftRowGrad.addColorStop(0.58, i % 2 === 0 ? '#e4e6e2' : '#d9dcd7');
      leftRowGrad.addColorStop(1, i % 2 === 0 ? '#c9ccc8' : '#c3c6c2');
      ctx.fillStyle = leftRowGrad;
      ctx.fillRect(tableX, y, halfW, rowH);

      const rightRowGrad = ctx.createLinearGradient(midX, y, tableX + tableW, y);
      rightRowGrad.addColorStop(0, i % 2 === 0 ? '#c9ccc8' : '#c3c6c2');
      rightRowGrad.addColorStop(0.42, i % 2 === 0 ? '#e4e6e2' : '#d9dcd7');
      rightRowGrad.addColorStop(1, i % 2 === 0 ? '#f1f2ef' : '#e3e5e1');
      ctx.fillStyle = rightRowGrad;
      ctx.fillRect(midX, y, halfW, rowH);
      ctx.strokeStyle = '#555a58'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(tableX, y); ctx.lineTo(tableX + tableW, y); ctx.stroke();
      // sottile luce interna come nelle vecchie UI
      ctx.strokeStyle = 'rgba(255,255,255,.72)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(tableX+2, y+3); ctx.lineTo(tableX+tableW-2, y+3); ctx.stroke();

      const lp = blackPlayers[i];
      if (lp) {
        const cy = y + rowH/2;
        drawRoleBox(lp, tableX + 12, cy);
        ctx.fillStyle = '#181a19';
        ctx.textAlign = 'left';
        // XXX PERSONALIZZARE XXX - cambia qui la dimensione del nome giocatore (34px)
        ctx.font = `bold 40px ${oldFont}`;
        const nameX = tableX + 105;
        const secondaryCount = getPlayerRoles(lp).filter(r => r !== primaryRole(lp)).length;
        const reservedTagsW = secondaryCount * 39;
        const name = fitName(lp.name, Math.max(150, 390 - reservedTagsW), ctx.font);
        drawStretchedText(name, nameX, cy, playerNameStretchX, 'left');
        const nameWidth = ctx.measureText(name).width * playerNameStretchX;
        drawSecondaryTags(lp, nameX + nameWidth + 12, cy);
        const arrow = randomArrowByPlayer.get(lp.id);
        if (arrow) ctx.drawImage(arrow, midX - 72, cy - 27.5, 55, 55);
      }

      const rp = whitePlayers[i];
      if (rp) {
        const cy = y + rowH/2;
        drawRoleBox(rp, tableX + tableW - 12, cy, true);
        ctx.fillStyle = '#181a19';
        ctx.textAlign = 'right';
        // XXX PERSONALIZZARE XXX - cambia qui la dimensione del nome giocatore (34px)
        ctx.font = `bold 40px ${oldFont}`;
        const nameRightX = tableX + tableW - 105;
        const secondaryCount = getPlayerRoles(rp).filter(r => r !== primaryRole(rp)).length;
        const reservedTagsW = secondaryCount * 39;
        const name = fitName(rp.name, Math.max(150, 390 - reservedTagsW), ctx.font);
        drawStretchedText(name, nameRightX, cy, playerNameStretchX, 'right');
        const nameWidth = ctx.measureText(name).width * playerNameStretchX;
        drawSecondaryTags(rp, nameRightX - nameWidth - 12, cy, true);
        const arrow = randomArrowByPlayer.get(rp.id);
        if (arrow) ctx.drawImage(arrow, midX + 17, cy - 27.5, 55, 55);
      }
    }

    // Griglia completa: bordo centrale + colonne ruolo/forma, come nel riferimento.
    ctx.strokeStyle = '#444947'; ctx.lineWidth = 3;
    [midX, tableX + 92, midX - 88, midX + 88, tableX + tableW - 92].forEach(x => {
      ctx.beginPath(); ctx.moveTo(x, bodyTop); ctx.lineTo(x, bodyTop + rows*rowH); ctx.stroke();
    });
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1;
    [tableX + 95, midX - 85, midX + 91, tableX + tableW - 89].forEach(x => {
      ctx.beginPath(); ctx.moveTo(x, bodyTop); ctx.lineTo(x, bodyTop + rows*rowH); ctx.stroke();
    });
    ctx.strokeStyle = '#292d2b'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(midX, tableY); ctx.lineTo(midX, bodyTop + rows*rowH); ctx.stroke();

    // --- AREA INFERIORE: LOGO, EQUILIBRIO E RADAR COMPARATIVO STILE PES ---
    const footerY = bodyTop + rows * rowH + 18;

    // Logo centrale
    if (darioLogo) {
      ctx.drawImage(darioLogo, canvas.width / 2 - 34, footerY, 68, 68);
    }

    // Dati di equilibrio sotto il logo
    const metricsY = footerY + 96;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#171918';
    ctx.font = `bold 22px ${oldFont}`;
    if (balanceMetrics) {
      ctx.fillText(
        `DISLIVELLO VOTI: ${balanceMetrics.diff}   •   INDICE EQUILIBRIO: ${balanceMetrics.percentage}%`,
        canvas.width / 2,
        metricsY
      );
    }

    // Valori del radar: stessa logica del TeamRadar esistente.
    const getGraphicRoleAverage = (teamPlayers, role) => {
      const filtered = teamPlayers.filter(p => getPlayerRoles(p).includes(role));
      if (!filtered.length) return 0;
      return filtered.reduce((sum, p) => sum + p.rating, 0) / filtered.length;
    };

    const getGraphicRadarValues = (team) => ({
      TOT: team.players.length
        ? team.players.reduce((sum, p) => sum + p.rating, 0) / team.players.length
        : 0,
      POR: (() => {
        const value = getGraphicRoleAverage(team.players, 'POR');
        return value > 0 ? value : 3;
      })(),
      DIF: getGraphicRoleAverage(team.players, 'DIF'),
      CEN: getGraphicRoleAverage(team.players, 'CEN'),
      ATT: getGraphicRoleAverage(team.players, 'ATT')
    });

    const drawComparisonRadar = (teamBlack, teamWhite, centerX, centerY, radius) => {
      const axes = ['TOT', 'POR', 'DIF', 'CEN', 'ATT'];
      const labels = { TOT: 'TOT', POR: 'PT', DIF: 'DI', CEN: 'CC', ATT: 'AT' };
      const blackValues = getGraphicRadarValues(teamBlack);
      const whiteValues = getGraphicRadarValues(teamWhite);

      const boxW = radius * 3.45;
      const boxH = radius * 2.75;
      const boxX = centerX - boxW / 2;
      const boxY = centerY - boxH / 2;

      // Cornice nera rettangolare come nella schermata PES.
      ctx.fillStyle = '#050605';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#111311';
      ctx.lineWidth = 7;
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#777b77';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX + 7, boxY + 7, boxW - 14, boxH - 14);

      // Fascia superiore leggermente metallica.
      const radarHeader = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY);
      radarHeader.addColorStop(0, '#3b3d3a');
      radarHeader.addColorStop(0.5, '#777a75');
      radarHeader.addColorStop(1, '#343633');
      ctx.fillStyle = radarHeader;
      ctx.fillRect(boxX + 9, boxY + 9, boxW - 18, 30);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 16px ${oldFont}`;
      ctx.textAlign = 'center';
      ctx.fillText('BLACK TEAM  /  WHITE TEAM', centerX, boxY + 24);

      const getPoint = (index, value = 10) => {
        const angle = -Math.PI / 2 + index * 2 * Math.PI / axes.length;
        const r = radius * (Math.max(0, Math.min(10, value)) / 10);
        return {
          x: centerX + Math.cos(angle) * r,
          y: centerY + 15 + Math.sin(angle) * r
        };
      };

      // Pentagoni/griglia grigi.
      [0.25, 0.5, 0.75, 1].forEach(level => {
        ctx.beginPath();
        axes.forEach((_, index) => {
          const p = getPoint(index, 10 * level);
          if (index === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.strokeStyle = level === 1 ? '#a4a7a2' : '#555955';
        ctx.lineWidth = level === 1 ? 2 : 1;
        ctx.stroke();
      });

      axes.forEach((axis, index) => {
        const endPoint = getPoint(index, 10);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 15);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = '#454845';
        ctx.lineWidth = 1;
        ctx.stroke();

        const labelPoint = getPoint(index, 12.1);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold 17px ${oldFont}`;
        ctx.textAlign = 'center';
        ctx.fillText(labels[axis], labelPoint.x, labelPoint.y);
      });

      const drawTeamPolygon = (values, stroke, fill) => {
        ctx.beginPath();
        axes.forEach((axis, index) => {
          const p = getPoint(index, values[axis]);
          if (index === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 5;
        ctx.stroke();
      };

      // Prima il Black, poi il White: sovrapposti sullo stesso radar.
      // Il riempimento resta grigio/trasparente, le linee identificano le squadre.
      drawTeamPolygon(blackValues, '#050505', 'rgba(85,85,85,0.24)');
      drawTeamPolygon(whiteValues, '#ffffff', 'rgba(210,210,210,0.16)');

      // Piccola legenda inferiore.
      const legendY = boxY + boxH - 22;
      ctx.font = `bold 15px ${oldFont}`;
      ctx.textBaseline = 'middle';

      ctx.strokeStyle = '#050505';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(centerX - 160, legendY);
      ctx.lineTo(centerX - 115, legendY);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('BLACK', centerX - 105, legendY);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(centerX + 45, legendY);
      ctx.lineTo(centerX + 90, legendY);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('WHITE', centerX + 100, legendY);
    };

    const radarCenterY = metricsY + 185;
    drawComparisonRadar(blackTeam, whiteTeam, canvas.width / 2, radarCenterY, 105);

    // Firma finale
    ctx.font = `bold 16px ${oldFont}`;
    ctx.fillStyle = '#333';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText('GREEN CALCIO', tableX, canvas.height - 22);
    ctx.textAlign = 'right';
    ctx.fillText('BLACK TEAM  vs  WHITE TEAM', tableX + tableW, canvas.height - 22);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'black-vs-white.png', { type:'image/png' });
      try {
        if (navigator.canShare && navigator.canShare({ files:[file] })) {
          await navigator.share({ files:[file], title:'Green Calcio', text:'Black Team vs White Team' });
          showToast('Immagine pronta per la condivisione! 📲');
        } else {
          const link = document.createElement('a'); link.download='black-vs-white.png';
          link.href=URL.createObjectURL(blob); link.click(); URL.revokeObjectURL(link.href);
          showToast('Immagine black-vs-white.png scaricata! 📸');
        }
      } catch (error) {
        console.error('Errore condivisione/download:', error);
        const link=document.createElement('a'); link.download='black-vs-white.png';
        link.href=URL.createObjectURL(blob); link.click(); URL.revokeObjectURL(link.href);
      }
    }, 'image/png');
  };

  const getRoleAverage = (teamPlayers, role) => {
  const filtered = teamPlayers.filter(p => getPlayerRoles(p).includes(role));
  if (filtered.length === 0) return 0;

  return filtered.reduce((sum, p) => sum + p.rating, 0) / filtered.length;
};

const getTeamRadarValues = (teamPlayers) => ({
  POR: (() => {
  const value = getRoleAverage(teamPlayers, 'POR');
  return value > 0 ? value : 3;
})(),
  DIF: getRoleAverage(teamPlayers, 'DIF'),
  CEN: getRoleAverage(teamPlayers, 'CEN'),
  ATT: getRoleAverage(teamPlayers, 'ATT'),
  TOT: teamPlayers.length
    ? teamPlayers.reduce((sum, p) => sum + p.rating, 0) / teamPlayers.length
    : 0
});

const drawTeamRadar = (ctx, team, centerX, centerY, radius, titleColor = '#ffffff') => {
  const axes = ['TOT', 'POR', 'DIF', 'CEN', 'ATT'];
  const values = getTeamRadarValues(team.players);

  const getPoint = (index, value = 10) => {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / axes.length;
    const r = radius * (value / 10);

    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r
    };
  };

  ctx.textAlign = 'center';
  ctx.fillStyle = titleColor;
  ctx.font = 'bold 18px Outfit, sans-serif';
  ctx.fillText(team.name.toUpperCase(), centerX, centerY - radius - 34);

  [0.25, 0.5, 0.75, 1].forEach(level => {
    ctx.beginPath();
    axes.forEach((_, index) => {
      const p = getPoint(index, 10 * level);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  axes.forEach((axis, index) => {
    const end = getPoint(index, 10);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.stroke();

    const label = getPoint(index, 12);

    ctx.fillStyle = getRoleColor(axis);
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(axis, label.x, label.y);
  });

  ctx.beginPath();
  axes.forEach((axis, index) => {
    const p = getPoint(index, values[axis]);
    if (index === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();

  ctx.fillStyle = 'rgba(16,185,129,0.35)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();

  axes.forEach((axis, index) => {
    const p = getPoint(index, values[axis]);
    ctx.fillStyle = getRoleColor(axis);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
};

  // --- UTILITY PER TOAST NOTIFICATIONS ---
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const getRatingBadgeClass = (rating) => {
  if (rating >= 8.0) return 'rating-high';
  if (rating >= 6.0) return 'rating-medium';
  return 'rating-low';
};

  // Ottieni i giocatori delle due squadre per il campo da calcio
  const pitchTeamA = useMemo(() => {
    return teams.find(t => t.id === pitchTeamAId) || null;
  }, [teams, pitchTeamAId]);

  const pitchTeamB = useMemo(() => {
    return teams.find(t => t.id === pitchTeamBId) || null;
  }, [teams, pitchTeamBId]);

  const getAutoTacticalLines = (team) => {
  if (!team) return { gk: [], def: [], mid: [], att: [] };

  const players = [...team.players];

  const goalkeeper =
    players.find(p => isGoalkeeperPlayer(p)) ||
    [...players].sort((a, b) => a.rating - b.rating)[0];

  let remaining = players.filter(p => p.id !== goalkeeper?.id);

  const counts = matchSize === 5
    ? { def: 1, mid: 2, att: 1 }
    : { def: 2, mid: 3, att: 1 };

  const pickLine = (role, count) => {
    const exact = remaining
      .filter(p => getPlayerRoles(p).includes(role))
      .sort((a, b) => b.rating - a.rating);

    const picked = exact.slice(0, count);
    remaining = remaining.filter(p => !picked.some(x => x.id === p.id));

    if (picked.length < count) {
      const fallback = remaining
        .sort((a, b) => b.rating - a.rating)
        .slice(0, count - picked.length);

      picked.push(...fallback);
      remaining = remaining.filter(p => !fallback.some(x => x.id === p.id));
    }

    return picked;
  };

  // Priorità tattica: prima ATT, poi CEN, poi DIF.
  // Così un ATT/CEN viene usato da ATT se manca un attaccante.
  const att = pickLine('ATT', counts.att);
  const mid = pickLine('CEN', counts.mid);
  const def = pickLine('DIF', counts.def);

  return {
    gk: goalkeeper ? [goalkeeper] : [],
    def,
    mid,
    att
  };
};

  // Mantiene le posizioni tattiche dopo gli scambi manuali.
  // Se una squadra non ha ancora slot salvati, usa il calcolo automatico originale.
  const getTacticalLines = (team) => {
    if (!team) return { gk: [], def: [], mid: [], att: [] };

    const hasSavedLayout = team.players.length > 0 && team.players.every(
      p => p.tacticalLine && Number.isInteger(p.tacticalSlot)
    );

    if (!hasSavedLayout) return getAutoTacticalLines(team);

    const byLine = (line) => team.players
      .filter(p => p.tacticalLine === line)
      .sort((a, b) => a.tacticalSlot - b.tacticalSlot);

    return {
      gk: byLine('gk'),
      def: byLine('def'),
      mid: byLine('mid'),
      att: byLine('att')
    };
  };

  const applyTacticalSlots = (team) => {
    const lines = getAutoTacticalLines(team);
    const slotById = new Map();

    Object.entries(lines).forEach(([line, linePlayers]) => {
      linePlayers.forEach((player, slot) => {
        slotById.set(player.id, { tacticalLine: line, tacticalSlot: slot });
      });
    });

    return {
      ...team,
      players: team.players.map(player => ({
        ...player,
        ...(slotById.get(player.id) || {})
      }))
    };
  };

const getPrimaryRoleForLine = (player, line) => {
  if (isGoalkeeperPlayer(player)) return 'POR';

  const roles = getPlayerRoles(player);

  if (line === 'att' && roles.includes('ATT')) return 'ATT';
  if (line === 'mid' && roles.includes('CEN')) return 'CEN';
  if (line === 'def' && roles.includes('DIF')) return 'DIF';

  return roles[0] || 'AUTO';
};

const getRoleColor = (role) => {
  if (role === 'POR') return '#f97316';
  if (role === 'DIF') return '#3b82f6';
  if (role === 'CEN') return '#10b981';
  if (role === 'ATT') return '#ef4444';
  return '#94a3b8';
};
  
  const handleDownloadTacticalPreview = async () => {
  if (!pitchTeamA || !pitchTeamB) return;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1600;

  const ctx = canvas.getContext('2d');

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  let vsLogo = null;

  try {
    vsLogo = await loadImage('/Dario_Rocchi.webp');
  } catch (error) {
    console.error('Errore caricamento immagine VS:', error);
  }

  const bgGrad = ctx.createRadialGradient(540, 780, 80, 540, 780, 900);
  bgGrad.addColorStop(0, '#102d1d');
  bgGrad.addColorStop(1, '#070a09');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 46px Outfit, Arial, sans-serif';
  ctx.fillText('GREEN CALCIO', 540, 70);

  ctx.fillStyle = '#10b981';
  ctx.font = '600 20px Outfit, Arial, sans-serif';
  ctx.fillText('ANTEPRIMA TATTICA • BLACK VS WHITE', 540, 105);

  const pitchX = 90;
  const pitchY = 155;
  const pitchW = 900;
  const pitchH = 1260;

  ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(pitchX, pitchY, pitchW, pitchH, 32);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(pitchX, pitchY + pitchH / 2);
  ctx.lineTo(pitchX + pitchW, pitchY + pitchH / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(540, pitchY + pitchH / 2, 110, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeRect(310, pitchY, 460, 150);
  ctx.strokeRect(310, pitchY + pitchH - 150, 460, 150);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px Outfit, Arial, sans-serif';
  ctx.fillText(pitchTeamA.name.toUpperCase(), 540, 150);
  ctx.fillText(pitchTeamB.name.toUpperCase(), 540, 1450);

  const drawPlayer = (player, x, y, line, darkText = false) => {
    const role = getPrimaryRoleForLine(player, line);
    const color = getRoleColor(role);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 38, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Outfit, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(role, x, y + 6);

    ctx.fillStyle = darkText ? '#0f172a' : '#ffffff';
    ctx.font = '700 18px Outfit, Arial, sans-serif';

    let name = player.name;
    if (name.length > 13) name = name.slice(0, 11) + '...';

    ctx.fillText(name, x, y + 62);
  };

  const drawHorizontalLine = (players, y, line, reverse = false, darkText = false) => {
    if (!players.length) return;

    const spacing = 760 / Math.max(players.length, 1);
    const startX = 540 - ((players.length - 1) * spacing) / 2;

    const ordered = reverse ? [...players].reverse() : players;

    ordered.forEach((player, index) => {
      const x = startX + index * spacing;
      drawPlayer(player, x, y, line, darkText);
    });
  };

  const teamALines = getTacticalLines(pitchTeamA);
  const teamBLines = getTacticalLines(pitchTeamB);

  drawHorizontalLine(teamALines.gk, 250, 'gk');
  drawHorizontalLine(teamALines.def, 395, 'def');
  drawHorizontalLine(teamALines.mid, 545, 'mid');
  drawHorizontalLine(teamALines.att, 690, 'att');

  drawHorizontalLine(teamBLines.att, 880, 'att');
  drawHorizontalLine(teamBLines.mid, 1030, 'mid');
  drawHorizontalLine(teamBLines.def, 1180, 'def');
  drawHorizontalLine(teamBLines.gk, 1325, 'gk');

  const vsX = 540;
  const vsY = 785;
  const vsRadius = 46;

  if (vsLogo) {
    const imgSize = 120;
    ctx.drawImage(vsLogo, vsX - imgSize / 2, vsY - imgSize / 2 - 60, imgSize, imgSize);
  }

  ctx.fillStyle = '#070a09';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(vsX, vsY, vsRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 28px Outfit, Arial, sans-serif';
  ctx.fillText('VS', vsX, vsY + 10);

  const legend = [
    ['POR', '#f97316'],
    ['DIF', '#3b82f6'],
    ['CEN', '#10b981'],
    ['ATT', '#ef4444']
  ];

  ctx.font = 'bold 18px Outfit, Arial, sans-serif';
  legend.forEach(([role, color], index) => {
    const x = 260 + index * 170;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, 1530, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(role, x + 45, 1537);
  });

  canvas.toBlob((blob) => {
    if (!blob) return;

    const link = document.createElement('a');
    link.download = 'anteprima-tattica-black-vs-white.png';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);

    showToast("Anteprima tattica scaricata! 📱");
  }, 'image/png');
};

  const drawRolePills = (ctx, roles, x, y, textColor = '#ffffff') => {
  if (!roles || roles.length === 0) return;

  let offsetX = x;

  roles.forEach(role => {
    const color = getRoleColor(role);
    const pillW = 38;
    const pillH = 18;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(offsetX, y, pillW, pillH, 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(role, offsetX + pillW / 2, y + 13);

    offsetX += pillW + 5;
  });
};

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <IconSoccer />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="app-header">
        <div className="logo-container">
          <span className="logo-icon">⚽</span>
          <h1 className="app-title">Green Calcio</h1>
        </div>
        <p className="app-subtitle">
          Il generatore di squadre equilibrate per il tuo calcetto settimanale.
          Imposta i voti da 1 a 10, marca i portieri 🧤 per bilanciarli e scendi in campo!
        </p>
      </header>

      {/* --- GRIGLIA PRINCIPALE --- */}
      <main className="main-grid">

        {/* COLONNA SINISTRA: INPUT E LISTA GIOCATORI */}
        <section className="inputs-container">

          {/* Card Inserimento */}
          <div className="glass-card">
            <h2 className="card-title">
              <IconPlus /> Aggiungi Giocatori
            </h2>

            {/* Header Tab */}
            <div className="tabs-header">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'singolo' ? 'active' : ''}`}
                onClick={() => setActiveTab('singolo')}
              >
                Giocatore Singolo
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'massivo' ? 'active' : ''}`}
                onClick={() => setActiveTab('massivo')}
              >
                Importazione Massiva
              </button>
            </div>

            {/* Inserimento Singolo */}
            {activeTab === 'singolo' && (
              <form onSubmit={handleAddSingle}>
                <div className="form-group">
                  <label htmlFor="playerName" className="form-label">Nome Giocatore</label>
                  <input
                    id="playerName"
                    type="text"
                    className="form-input"
                    placeholder="Es: Luca, Marco, Pippo..."
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Valutazione / Peso</span>
                    <span className="value">{singleRating.toFixed(1)} / 10</span>
                  </label>
                  <div className="rating-slider-container">
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.5"
                      className="rating-slider"
                      value={singleRating}
                      onChange={(e) => setSingleRating(parseFloat(e.target.value))}
                    />
                    <span className="rating-display">{singleRating.toFixed(1)}</span>
                  </div>
                  <div className="form-group">
  <label className="form-label">Ruolo</label>
  <div className="role-selector">
    {PLAYER_ROLES.map(role => (
      <button
        key={role}
        type="button"
        className={`role-chip ${singleRoles.includes(role) ? 'active' : ''}`}
        onClick={() => setSingleRoles(prev => togglePlayerRole(prev, role))}
      >
        {role}
      </button>
    ))}
  </div>
  <div className="gauge-info-text">
    Puoi selezionare più ruoli, tranne POR che resta esclusivo. Se non selezioni nulla, il ruolo sarà assegnato automaticamente.
  </div>
</div>
                </div>

                <button
                  type="submit"
                  className="btn"
                  disabled={!singleName.trim()}
                  style={{ width: '100%' }}
                >
                  <IconPlus /> Aggiungi alla Roster
                </button>
              </form>
            )}

            {/* Inserimento Massivo */}
            {activeTab === 'massivo' && (
              <form onSubmit={handleAddBulk}>
                <div className="form-group">
                  <label htmlFor="bulkText" className="form-label">
                    <span>Incolla la tua lista (uno per riga)</span>
                    <span style={{ fontSize: '0.8rem' }}>Rileva il voto automaticamente!</span>
                  </label>
                  <textarea
                    id="bulkText"
                    className="form-input form-textarea"
                    placeholder="Esempi di formato supportato:&#10;Luca 8.5 (CEN)&#10;Marco - 7 (DIF/CEN)&#10;Giovanni (ATT)&#10;Christian 6 (POR)&#10;9 Alessandro (CEN,ATT)"
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                  />
                </div>

                <div className="gauge-info-text" style={{ marginBottom: '16px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <IconInfo />
                  <span>Se non viene specificato alcun voto, verrà assegnato un valore di default pari a 7.0.</span>
                </div>

                <button
                  type="submit"
                  className="btn"
                  disabled={!bulkText.trim()}
                  style={{ width: '100%' }}
                >
                  <IconUpload /> Importa Giocatori
                </button>
              </form>
            )}
          </div>

          {/* Card Gestione Lista */}
          <div className="glass-card">
            <div className="player-list-header">
              <h2 className="card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                Roster Giocatori
              </h2>
              <span className="player-count">
                {stats.available} / {stats.total} Pronti
              </span>
            </div>

            {players.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">👥</span>
                <p>Nessun giocatore inserito.</p>
                <p style={{ fontSize: '0.85rem' }}>Aggiungi dei nomi qui sopra oppure carica la lista di prova per iniziare subito!</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginTop: '12px' }}
                  onClick={loadSamplePlayers}
                >
                  Carica Giocatori Esempio
                </button>
              </div>
            ) : (
              <>
                <div className="player-list-scroll">
                  {players.map((player, index) => (
                    <div
                      key={player.id}
                      className="player-item"
                      style={{ opacity: player.available ? 1 : 0.45 }}
                    >
                      <div className="player-info">
                        <span className="player-index">{players.length - index}</span>
                        {/* Checkbox disponibilità veloce */}
                        <button
                          type="button"
                          className="action-icon-btn"
                          title={player.available ? "Segna come assente" : "Segna come disponibile"}
                          onClick={() => toggleAvailability(player.id)}
                          style={{ color: player.available ? 'var(--primary)' : 'var(--text-muted)' }}
                        >
                          {player.available ? <IconUserCheck /> : <IconUserX />}
                        </button>

                        {/* Toggle Portiere */}
                        <div className="player-name-with-roles">
      <span className="player-name">
    {player.name}
    <span style={{ color: '#f97316', fontSize: '0.75rem', fontWeight: 600, marginLeft: '6px' }}>
      ({getRoleLabel(player)})
    </span>
  </span>

  <div className="mini-role-selector">
    {PLAYER_ROLES.map(role => {
      const active = getPlayerRoles(player).includes(role);

      return (
        <button
          key={role}
          type="button"
          className={`mini-role-chip ${active ? 'active' : ''}`}
          title={`Toggle ruolo ${role}`}
          onClick={() => toggleRole(player.id, role)}
        >
          {role}
        </button>
      );
    })}
  </div>
</div>
                      </div>

                      <div className="player-actions">
                        {/* Input veloce del voto */}
                        <RatingInput
                          value={player.rating}
                          onChange={(val) => updatePlayerRating(player.id, val)}
                        />

                        <span className={`rating-badge ${getRatingBadgeClass(player.rating)}`}>
                          {player.rating.toFixed(1)}
                        </span>

                        <button
                          type="button"
                          className="action-icon-btn"
                          title="Elimina"
                          onClick={() => removePlayer(player.id)}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="btn-group" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={loadSamplePlayers}
                  >
                    Carica Esempio
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ flex: 1 }}
                    onClick={clearAllPlayers}
                  >
                    Svuota Roster
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* COLONNA DESTRA: CONFIGURAZIONE & AZIONE GENERAZIONE */}
        <section className="inputs-container">

          <div className="glass-card">
            <h2 className="card-title">
              <IconSoccer /> Generazione Squadre
            </h2>

            <div className="settings-section">
              {/* Selettore Modalità 7v7 / 5v5 */}
              <div className="form-group">
                <label className="form-label">Modalità di Gioco</label>
                <div className="match-mode-toggle">
                  <button
                    type="button"
                    className={`mode-btn ${matchSize === 7 ? 'active' : ''}`}
                    onClick={() => setMatchSize(7)}
                  >
                    <span className="mode-icon">⚽</span>
                    <span className="mode-label">7 vs 7</span>
                    <span className="mode-sub">14 giocatori</span>
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${matchSize === 5 ? 'active' : ''}`}
                    onClick={() => setMatchSize(5)}
                  >
                    <span className="mode-icon">🏃</span>
                    <span className="mode-label">5 vs 5</span>
                    <span className="mode-sub">10 giocatori</span>
                  </button>
                </div>
              </div>

              <div className="config-row">
                <div className="form-group">
                  <label className="form-label">Giocatori Attivi</label>
                  <div className="form-input" style={{ background: 'rgba(0,0,0,0.15)', cursor: 'default', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Disponibili:</span>
                    <strong style={{ color: 'var(--primary)' }}>{stats.available}</strong>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Richiesti</label>
                  <div className="form-input" style={{ background: 'rgba(0,0,0,0.15)', cursor: 'default', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Per {matchSize}v{matchSize}:</span>
                    <strong style={{ color: playerCountStatus.ok ? 'var(--primary)' : 'var(--accent-red)' }}>{matchSize * 2}</strong>
                  </div>
                </div>
              </div>

              <div className="gauge-info-text" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Giocatori di movimento:</span>
                  <strong>{stats.regularsAvailable}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f97316' }}>
                  <span>Portieri disponibili (🧤):</span>
                  <strong>{stats.gksAvailable}</strong>
                </div>
              </div>

              {/* Indicatore stato conteggio giocatori */}
              <div className={`player-count-status status-${playerCountStatus.type}`}>
                <span className="status-icon">
                  {playerCountStatus.type === 'success' ? '✅' : playerCountStatus.type === 'warning' ? '⚠️' : '❌'}
                </span>
                <span>{playerCountStatus.message}</span>
              </div>

              <button
                type="button"
                className="btn btn-generate"
                onClick={handleGenerateTeams}
                disabled={!playerCountStatus.ok}
              >
                <span>Genera Squadre Equilibrate</span>
                <span style={{ fontSize: '1.2rem' }}>⚽</span>
              </button>

              {!playerCountStatus.ok && (
                <div className="gauge-info-text" style={{ textAlign: 'center', color: 'var(--accent-red)', fontWeight: 500 }}>
                  ⛔ Generazione bloccata: correggi il numero di giocatori
                </div>
              )}
            </div>
          </div>

          {/* CARD STATO BILANCIAMENTO */}
          {teams && teams.length > 0 && balanceMetrics && (
            <div className="glass-card balance-gauge-card">
              <div className="gauge-header">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>⚖️</span> Livello di Equilibrio
                </h3>
                <span className={`gauge-status ${balanceMetrics.statusClass}`}>
                  {balanceMetrics.status}
                </span>
              </div>

              <div className="gauge-bar-wrapper">
                <div className="gauge-label-row">
                  <span>Equilibrio Squadre</span>
                  <span>{balanceMetrics.percentage}%</span>
                </div>
                <div className="gauge-bar-bg">
                  <div className="gauge-bar-fill" style={{ width: `${balanceMetrics.percentage}%` }}></div>
                </div>
              </div>

              <div className="gauge-info-text">
                Il dislivello massimo complessivo di somma voti (incluso il bonus portieri di +2) è di{' '}
                <strong style={{ color: '#fff' }}>{balanceMetrics.diff} punti</strong>.
                I portieri sono stati distribuiti in modo equo e ad ognuno è stato attribuito un peso bonus di +2.
              </div>
            </div>
          )}

          {/* ISTRUZIONE DELLO SWAP MANUALE */}
          {teams && teams.length > 0 && (
            <div className="glass-card" style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', lineHeight: '1.45', color: '#93c5fd' }}>
                <span style={{ fontSize: '1.1rem' }}>💡</span>
                <div>
                  <strong>Regola manualmente:</strong> Puoi scambiare due giocatori cliccando sul bottone di scambio ⇄. Nota: per non alterare il bilanciamento dei ruoli, i portieri 🧤 possono essere scambiati solo con altri portieri!
                  {selectedPlayerForSwap && (
                    <div style={{ marginTop: '8px', color: '#fff', fontWeight: 600 }}>
                      [Selezionato per Scambio]: {teams.find(t => t.id === selectedPlayerForSwap.teamId)?.players.find(p => p.id === selectedPlayerForSwap.playerId)?.name}
                      <button
                        type="button"
                        onClick={() => setSelectedPlayerForSwap(null)}
                        style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}
                      >
                        Annulla
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* --- SEZIONE RISULTATI DELLE SQUADRE --- */}
      {teams && teams.length > 0 && (
        <section className="inputs-container" style={{ animation: 'scaleIn 0.4s ease-out' }}>

          <div className="glass-card">
            <div className="results-header">
               {/*
              <button
  type="button"
  className="btn btn-secondary"
  onClick={handleDownloadTacticalPreview}
>
  <IconDownload /> Scarica Anteprima
</button>
              */}
              <h2 className="card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                Squadre Generate
              </h2>
              

              <div className="results-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDownloadImage}
                  title="Scarica la formazione ufficiale come immagine PNG"
                >
                  <IconDownload /> Scarica Grafica
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCopyFormattedText}
                >
                  <IconCopy /> Copia testuale
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handleGenerateTeams}
                >
                  <IconRefresh /> Rimescola
                </button>
              </div>
            </div>

            <div className="teams-grid">
              {teams.map((team, idx) => {
                const avg = team.players.length > 0 ? (team.ratingSum / team.players.length).toFixed(1) : '0.0';
                const colorIndex = (idx % 6) + 1;
                const gkCount = team.players.filter(p => isGoalkeeperPlayer(p)).length;

                return (
                  
                  <div key={team.id} className={`glass-card team-card team-${colorIndex}`}>
                    
                    <div className="team-header">
                      <div className="team-radar-grid">
                    <TeamRadar key={team.id} team={team} />
                  </div>
                      <div className="team-info-left">
                        <span className="team-name">{team.name}</span>
                        <span className="team-stats-summary">
                          {team.players.length} Giocatori
                        </span>
                      </div>

                      <div className="team-badge-stats">
                        <span className="badge-total-rating">
                          Tot: {team.ratingSum.toFixed(1)}
                        </span>
                        {gkCount > 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#f97316', fontWeight: 600, display: 'flex', gap: '3px', alignItems: 'center', margin: '2px 0' }}>
                            <span>🧤</span> Bonus Portiere (+{gkCount * 2})
                          </span>
                        )}
                        <span className="team-avg-stars" title={`Media Voti: ${avg}`}>
                          ⭐ Media: {avg}
                        </span>
                      </div>
                    </div>

                    <div className="team-players-list">
                      {team.players.map((player, pIdx) => {
                        const isSelected = selectedPlayerForSwap &&
                          selectedPlayerForSwap.teamId === team.id &&
                          selectedPlayerForSwap.playerId === player.id;

                        return (
                          <div
                            key={player.id}
                            className="team-player-row"
                            style={{
                              outline: isSelected ? '2px solid var(--primary)' : 'none',
                              boxShadow: isSelected ? '0 0 10px var(--primary-glow)' : 'none'
                            }}
                          >
                            <div className="team-player-left">
                              <span className="jersey-number">{isGoalkeeperPlayer(player) ? '🧤' : pIdx + 1}</span>
                              <span className="team-player-name">
                                {player.name}
                                {isGoalkeeperPlayer(player) && <span style={{ color: '#f97316', fontSize: '0.75rem', fontWeight: 600, marginLeft: '6px' }}>(GK)</span>}
                              </span>
                            </div>

                            <div className="player-actions" style={{ gap: '8px' }}>
                              <span className={`rating-badge ${getRatingBadgeClass(player.rating)}`} style={{ padding: '2px 6px', fontSize: '0.8rem' }}>
                                {player.rating.toFixed(1)}
                              </span>

                              <button
                                type="button"
                                className={`swap-select-btn ${isSelected ? 'selected' : ''}`}
                                title="Scambia questo giocatore"
                                onClick={() => handleSelectForSwap(team.id, pIdx)}
                              >
                                ⇄
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* --- IL CAMPO DA CALCIO INTERATTIVO (STADIUM VIEW) --- */}
          <div className="glass-card soccer-pitch-card">
            <div className="results-header" style={{ margin: 0 }}>
              <div>
                <h2 className="card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                  Anteprima Tattica
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Visualizzazione grafica della partita. I portieri 🧤 sono posizionati alle estremità con maglie dedicate.
                </p>
              </div>

              {/* Selettori Squadre sul Campo */}
              {teams.length > 2 && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="form-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                    <label htmlFor="pitchTeamASelect" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sinistra:</label>
                    <select
                      id="pitchTeamASelect"
                      className="form-input"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      value={pitchTeamAId}
                      onChange={(e) => setPitchTeamAId(parseInt(e.target.value))}
                    >
                      {teams.map(t => (
                        <option key={t.id} value={t.id} disabled={t.id === pitchTeamBId}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <span style={{ color: 'var(--text-muted)' }}>VS</span>

                  <div className="form-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                    <label htmlFor="pitchTeamBSelect" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Destra:</label>
                    <select
                      id="pitchTeamBSelect"
                      className="form-input"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      value={pitchTeamBId}
                      onChange={(e) => setPitchTeamBId(parseInt(e.target.value))}
                    >
                      {teams.map(t => (
                        <option key={t.id} value={t.id} disabled={t.id === pitchTeamAId}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="pitch-container-outer">
              <div className="soccer-pitch">
                <div className="penalty-area-left"></div>
                <div className="penalty-area-right"></div>

                {/* Metà campo sinistra: Team A */}
                <div className="pitch-half pitch-half-left">
                  {pitchTeamA ? (
  ['gk', 'def', 'mid', 'att'].map((line) => (
    <div key={line} className={`pitch-line pitch-line-${line}`}>
      {getTacticalLines(pitchTeamA)[line].map((player) => {
        const pIdx = pitchTeamA.players.indexOf(player);
        const isSelected = selectedPlayerForSwap &&
          selectedPlayerForSwap.teamId === pitchTeamA.id &&
          selectedPlayerForSwap.playerId === player.id;
        const teamColorIndex = (teams.indexOf(pitchTeamA) % 6) + 1;

        return (
          <div
            key={player.id}
            className={`pitch-player-node ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectForSwap(pitchTeamA.id, pIdx)}
          >
            <div className={`pitch-jersey pitch-jersey-${teamColorIndex} ${isGoalkeeperPlayer(player) ? 'gk-jersey' : ''}`}>
              {isGoalkeeperPlayer(player) ? '🧤' : pIdx + 1}
              <span className={`pitch-jersey-badge role-${getPrimaryRoleForLine(player, line)}`}>
  {getPrimaryRoleForLine(player, line)}
</span>
            </div>
            <span className="pitch-player-name" title={player.name}>
              {player.name}
            </span>
          </div>
        );
      })}
    </div>
  ))
) : (
  <span style={{ color: 'rgba(255,255,255,0.3)' }}>Nessuna squadra</span>
)}
                </div>

                {/* Metà campo destra: Team B */}
                <div className="pitch-half pitch-half-right">
                  {pitchTeamB ? (
  ['att', 'mid', 'def', 'gk'].map((line) => (
    <div key={line} className={`pitch-line pitch-line-${line}`}>
      {getTacticalLines(pitchTeamB)[line].map((player) => {
        const pIdx = pitchTeamB.players.indexOf(player);
        const isSelected = selectedPlayerForSwap &&
          selectedPlayerForSwap.teamId === pitchTeamB.id &&
          selectedPlayerForSwap.playerId === player.id;
        const teamColorIndex = (teams.indexOf(pitchTeamB) % 6) + 1;

        return (
          <div
            key={player.id}
            className={`pitch-player-node ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectForSwap(pitchTeamB.id, pIdx)}
          >
            <div className={`pitch-jersey pitch-jersey-${teamColorIndex} ${isGoalkeeperPlayer(player) ? 'gk-jersey' : ''}`}>
              {isGoalkeeperPlayer(player) ? '🧤' : pIdx + 1}
              <span className={`pitch-jersey-badge role-${getPrimaryRoleForLine(player, line)}`}>
  {getPrimaryRoleForLine(player, line)}
</span>
            </div>
            <span className="pitch-player-name" title={player.name}>
              {player.name}
            </span>
          </div>
        );
      })}
    </div>
  ))
) : (
  <span style={{ color: 'rgba(255,255,255,0.3)' }}>Nessuna squadra</span>
)}
                </div>
              </div>
            </div>

            {/* Altre squadre del torneo */}
            {teams.length > 2 && (
              <div className="substitutes-section">
                <span className="substitutes-title">
                  🏃 Altre Squadre Generate nel Torneo
                </span>
                <div className="substitutes-grid">
                  {teams.filter(t => t.id !== pitchTeamAId && t.id !== pitchTeamBId).map(team => {
                    const avg = team.players.length > 0 ? (team.ratingSum / team.players.length).toFixed(1) : '0.0';
                    return (
                      <div key={team.id} className="sub-badge" style={{ borderLeft: `4px solid var(--primary)` }}>
                        <strong>{team.name}</strong>
                        <span>({team.players.length} gioc. • Media: {avg})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* --- FOOTER --- */}
      <footer className="app-footer">
        <p>
          Green Calcio &copy; {new Date().getFullYear()} &bull; Creato per partite equilibrate ed emozionanti.
        </p>
      </footer>
    </div>
  );
}

export default App;
