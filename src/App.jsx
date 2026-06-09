import { useState, useEffect, useMemo } from 'react';

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

// --- LISTA GIOCATORI DI PROVA INIZIALE - 14 GIOCATORI PER MATCH 7 vs 7 ---
const SAMPLE_PLAYERS = [
  { name: 'Alessandro', rating: 9, roles: ['ATT'] },
  { name: 'Luca', rating: 8, roles: ['CEN'] },
  { name: 'Francesco', rating: 8, roles: ['DIF'] },
  { name: 'Federico', rating: 9.5, roles: ['ATT', 'CEN'] },
  { name: 'Matteo', rating: 7, roles: ['DIF'] },
  { name: 'Marco', rating: 7, roles: ['CEN'] },
  { name: 'Giovanni', rating: 6 },
  { name: 'Lorenzo', rating: 6 },
  { name: 'Gabriele', rating: 7.5, roles: ['ATT'] },
  { name: 'Andrea', rating: 6.5, roles: ['DIF', 'CEN'] },
  { name: 'Simone', rating: 7 },
  { name: 'Filippo', rating: 6 },
  { name: 'Christian', rating: 5.5, roles: ['POR'] },
  { name: 'Davide', rating: 5.5, roles: ['POR'] }
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
  const [selectedPlayerForSwap, setSelectedPlayerForSwap] = useState(null); // { teamId, playerIndex }

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

    setTeams(bestTeams);
    setSelectedPlayerForSwap(null);
    showToast("Squadre generate in modo bilanciato! ⚽");
  };

  // --- FUNZIONE PER LO SCAMBIO MANUALE RAPIDO ---
  const handleSelectForSwap = (teamId, playerIndex) => {
    if (selectedPlayerForSwap === null) {
      setSelectedPlayerForSwap({ teamId, playerIndex });
    } else {
      if (selectedPlayerForSwap.teamId === teamId && selectedPlayerForSwap.playerIndex === playerIndex) {
        setSelectedPlayerForSwap(null);
        return;
      }

      if (selectedPlayerForSwap.teamId === teamId) {
        setSelectedPlayerForSwap({ teamId, playerIndex });
        return;
      }

      const newTeams = teams.map(t => ({
        ...t,
        players: [...t.players]
      }));

      const teamASource = newTeams.find(t => t.id === selectedPlayerForSwap.teamId);
      const teamBSource = newTeams.find(t => t.id === teamId);

      const playerA = teamASource.players[selectedPlayerForSwap.playerIndex];
      const playerB = teamBSource.players[playerIndex];

      teamASource.players[selectedPlayerForSwap.playerIndex] = playerB;
      teamBSource.players[playerIndex] = playerA;

      // Ricalcola le somme dei rating includendo il bonus +2 portieri
      teamASource.ratingSum = getTeamRatingSum(teamASource.players);
      teamBSource.ratingSum = getTeamRatingSum(teamBSource.players);

      setTeams(newTeams);
      setSelectedPlayerForSwap(null);
      showToast(`Scambio effettuato: ${playerA.name} ⇄ ${playerB.name}`);
    }
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

  // --- DOWNLOAD IMMAGINE FORMAZIONI (DYNAMIC CANVAS RENDER) ---
  const handleDownloadImage = async () => {
    if (!teams || teams.length === 0) return;

    const canvas = document.createElement('canvas');
    // Se ci sono 2 squadre usiamo il layout specifico orizzontale a 2 colonne.
    // Altrimenti creiamo un layout che si allarga a seconda delle squadre.
    const isTwoTeams = teams.length === 2;

    const canvasWidth = isTwoTeams ? 1200 : 80 + teams.length * 280;
    const canvasHeight = 880;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
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

    // 1. Sfondo - Sfumatura stadio notturno/lavagna tattica verde scuro
    const bgGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 50, canvasWidth / 2, canvasHeight / 2, canvasWidth);
    bgGrad.addColorStop(0, '#102d1d'); // Deep green
    bgGrad.addColorStop(1, '#070a09'); // Coal dark
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Disegna cerchi e linee del campo stilizzati
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvasWidth / 2, canvasHeight / 2 + 30, 150, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 120);
    ctx.lineTo(canvasWidth / 2, canvasHeight - 90);
    ctx.stroke();

    // 2. Titolo e Intestazione
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px Outfit, sans-serif';
    ctx.fillText('GREEN CALCIO', canvasWidth / 2, 60);

    ctx.fillStyle = '#10b981';
    ctx.font = '600 18px Outfit, sans-serif';
    ctx.fillText('FORMAZIONI UFFICIALI • BILANCIAMENTO SQUADRE', canvasWidth / 2, 90);

    // 3. Disegna le colonne delle squadre
    if (isTwoTeams) {
      // --- SFIDA CLASSICA: TEAM BLACK vs TEAM WHITE ---
      const t1 = teams[0];
      const t2 = teams[1];

      // A. TEAM BLACK (Card Sfondo Slate 900)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(100, 130, 460, 640, 20);
      ctx.fill();
      ctx.stroke();

      // Intestazione
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 30px Outfit, sans-serif';
      ctx.fillText(t1.name.toUpperCase(), 330, 185);
      const t1Avg = t1.players.length > 0 ? (t1.ratingSum / t1.players.length).toFixed(1) : '0.0';
      const t1Odds = t1Avg !== '0.0' ? (10 / parseFloat(t1Avg)).toFixed(2) : 'N/A';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px Outfit, sans-serif';
      ctx.fillText(`Media: ${t1Avg}`, 330, 215);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(130, 235);
      ctx.lineTo(530, 235);
      ctx.stroke();

      // Giocatori Team Black
      t1.players.forEach((p, idx) => {
        const y = 280 + idx * 62;
        // Sfondo alternato per riga
        if (idx % 2 === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
          ctx.beginPath();
          ctx.roundRect(130, y - 24, 400, 44, 8);
          ctx.fill();
        }

        // Jersey / Ruolo
        if (isGoalkeeperPlayer(p)) {
          ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
          ctx.beginPath();
          ctx.arc(155, y - 4, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f97316';
          ctx.font = '14px Outfit, sans-serif';
          ctx.fillText('🧤', 155, y + 1);
        } else {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
          ctx.beginPath();
          ctx.arc(155, y - 4, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 15px Outfit, sans-serif';
          ctx.fillText(`${idx + 1}`, 155, y + 1);
        }

        // Nome
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 19px Outfit, sans-serif';
        let nameTxt = p.name;
        if (isGoalkeeperPlayer(p)) nameTxt += ' (GK)';
        ctx.fillText(nameTxt, 188, y + 3);

        // Rating
        ctx.textAlign = 'right';
        ctx.font = 'bold 19px Outfit, sans-serif';
        // Rating display removed per user request
        // if (p.rating >= 8) ctx.fillStyle = '#10b981';
        // else if (p.rating >= 6) ctx.fillStyle = '#f59e0b';
        // else ctx.fillStyle = '#ef4444';
        // ctx.fillText(p.rating.toFixed(1), 510, y + 3);
      });

      // B. TEAM WHITE (Card Sfondo Slate 50)
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(640, 130, 460, 640, 20);
      ctx.fill();
      ctx.stroke();

      // Intestazione
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px Outfit, sans-serif';
      ctx.fillText(t2.name.toUpperCase(), 870, 185);
      const t2Avg = t2.players.length > 0 ? (t2.ratingSum / t2.players.length).toFixed(1) : '0.0';
      const t2Odds = t2Avg !== '0.0' ? (10 / parseFloat(t2Avg)).toFixed(2) : 'N/A';
      ctx.fillStyle = '#475569';
      ctx.font = '16px Outfit, sans-serif';
      ctx.fillText(`Media: ${t2Avg}`, 870, 215);

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.beginPath();
      ctx.moveTo(670, 255);
      ctx.lineTo(1070, 255);
      ctx.stroke();

      // Giocatori Team White
      t2.players.forEach((p, idx) => {
        const y = 280 + idx * 62;
        if (idx % 2 === 0) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
          ctx.beginPath();
          ctx.roundRect(670, y - 24, 400, 44, 8);
          ctx.fill();
        }

        if (isGoalkeeperPlayer(p)) {
          ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
          ctx.beginPath();
          ctx.arc(695, y - 4, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f97316';
          ctx.font = '14px Outfit, sans-serif';
          ctx.fillText('🧤', 695, y + 1);
        } else {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
          ctx.beginPath();
          ctx.arc(695, y - 4, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 15px Outfit, sans-serif';
          ctx.fillText(`${idx + 1}`, 695, y + 1);
        }

        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a';
        ctx.font = '600 19px Outfit, sans-serif';
        let nameTxt = p.name;
        if (isGoalkeeperPlayer(p)) nameTxt += ' (GK)';
        ctx.fillText(nameTxt, 728, y + 3);

        ctx.textAlign = 'right';
        ctx.font = 'bold 19px Outfit, sans-serif';
        if (p.rating >= 8) ctx.fillStyle = '#047857';
        else if (p.rating >= 6) ctx.fillStyle = '#d97706';
        else ctx.fillStyle = '#b91c1c';
        // ctx.fillText(p.rating.toFixed(1), 1050, y + 3);
      });

      // C. Cerchio Centrale "VS"
const vsX = 600;
const vsY = 430;
const vsRadius = 36;

// Immagine sopra il bollino VS
if (vsLogo) {
  const imgSize = vsRadius * 2;
  const imgX = vsX - imgSize / 2;
  const imgY = vsY - imgSize / 2 - 45;

  ctx.drawImage(vsLogo, imgX, imgY, imgSize, imgSize);
}

// Bollino VS sopra l'immagine, partendo circa da metà immagine
ctx.textAlign = 'center';
ctx.fillStyle = '#070a09';
ctx.strokeStyle = '#10b981';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(vsX, vsY + vsRadius / 2, vsRadius, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();

ctx.fillStyle = '#10b981';
ctx.font = 'bold 22px Outfit, sans-serif';
ctx.fillText('VS', vsX, vsY + vsRadius / 2 + 8);

      // Determine favored team based on lower odds
      if (t1Odds !== 'N/A' && t2Odds !== 'N/A') {
        const favored = parseFloat(t1Odds) < parseFloat(t2Odds) ? t1.name : t2.name;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic 20px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`È favorito il ${favored}`, canvasWidth / 2, canvasHeight - 60);
      }

    } else {
      // --- TOURNEY LAYOUT (> 2 SQUADRE) ---
      teams.forEach((t, tIdx) => {
        const startX = 40 + tIdx * 280;

        // Card Sfondo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(startX, 130, 260, 640, 16);
        ctx.fill();
        ctx.stroke();

        // Intestazione
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Outfit, sans-serif';
        ctx.fillText(t.name.toUpperCase(), startX + 130, 175);

        const avg = t.players.length > 0 ? (t.ratingSum / t.players.length).toFixed(1) : '0.0';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Outfit, sans-serif';
        ctx.fillText(`Media: ${avg} • Tot: ${t.ratingSum.toFixed(1)}`, startX + 130, 205);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(startX + 20, 220);
        ctx.lineTo(startX + 240, 220);
        ctx.stroke();

        // Lista Giocatori
        t.players.forEach((p, idx) => {
          const y = 260 + idx * 50;

          if (isGoalkeeperPlayer(p)) {
            ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
            ctx.beginPath();
            ctx.arc(startX + 35, y - 4, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f97316';
            ctx.font = '12px Outfit, sans-serif';
            ctx.fillText('🧤', startX + 35, y + 1);
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.arc(startX + 35, y - 4, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 12px Outfit, sans-serif';
            ctx.fillText(`${idx + 1}`, startX + 35, y + 1);
          }

          ctx.textAlign = 'left';
          ctx.fillStyle = '#ffffff';
          ctx.font = '600 15px Outfit, sans-serif';
          let nameTxt = p.name;
          if (isGoalkeeperPlayer(p)) nameTxt += ' (GK)';
          // Trunca se troppo lungo
          if (nameTxt.length > 13) nameTxt = nameTxt.substr(0, 11) + '...';
          ctx.fillText(nameTxt, startX + 60, y + 1);

          ctx.textAlign = 'right';
          ctx.font = 'bold 15px Outfit, sans-serif';
          if (p.rating >= 8) ctx.fillStyle = '#10b981';
          else if (p.rating >= 6) ctx.fillStyle = '#f59e0b';
          else ctx.fillStyle = '#ef4444';
          // ctx.fillText(p.rating.toFixed(1), startX + 240, y + 1);
          ctx.textAlign = 'center';
        });
      });
    }

    // 4. Info di riepilogo in basso
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '300 14px Outfit, sans-serif';

    if (balanceMetrics) {
      ctx.fillStyle = '#10b981';
      ctx.font = '500 15px Outfit, sans-serif';
      ctx.fillText(`Dislivello Voti: ${balanceMetrics.diff} punti  •  Indice Equilibrio: ${balanceMetrics.percentage}%`, canvasWidth / 2, 800);
    }

    // Condividi o scarica l'immagine
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File(
        [blob],
        'black-vs-white.png',
        { type: 'image/png' }
      );

      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Green Calcio',
            text: 'Formazioni ufficiali Green Calcio'
          });

          showToast("Immagine pronta per la condivisione! 📲");
        } else {
          const link = document.createElement('a');
          link.download = 'black-vs-white.png';
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);

          showToast("Immagine black-vs-white.png scaricata! 📸");
        }
      } catch (error) {
        console.error("Errore condivisione/download:", error);

        const link = document.createElement('a');
        link.download = 'black-vs-white.png';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);

        showToast("Download immagine avviato 📸");
      }
    }, 'image/png');
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

  const getTacticalLines = (team) => {
  if (!team) return { gk: [], def: [], mid: [], att: [] };

  const players = [...team.players];

  const goalkeeper =
    players.find(p => isGoalkeeperPlayer(p)) ||
    [...players].sort((a, b) => a.rating - b.rating)[0];

  const fieldPlayers = players.filter(p => p.id !== goalkeeper.id);

  const pickForLine = (available, role, count) => {
    const preferred = available
      .filter(p => getPlayerRoles(p).includes(role))
      .sort((a, b) => b.rating - a.rating);

    const picked = preferred.slice(0, count);
    const pickedIds = new Set(picked.map(p => p.id));

    const remainingSlots = count - picked.length;

    if (remainingSlots > 0) {
      const fallback = available
        .filter(p => !pickedIds.has(p.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, remainingSlots);

      picked.push(...fallback);
    }

    return picked;
  };

  let remaining = [...fieldPlayers];

  const def = pickForLine(remaining, 'DIF', matchSize === 5 ? 1 : 2);
  remaining = remaining.filter(p => !def.some(x => x.id === p.id));

  const mid = pickForLine(remaining, 'CEN', matchSize === 5 ? 2 : 3);
  remaining = remaining.filter(p => !mid.some(x => x.id === p.id));

  const att = pickForLine(remaining, 'ATT', fieldPlayers.length - def.length - mid.length);

  return {
    gk: goalkeeper ? [goalkeeper] : [],
    def,
    mid,
    att
  };
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

                        <span className="player-name">
                          {player.name}
                          <span style={{ color: '#f97316', fontSize: '0.75rem', fontWeight: 600, marginLeft: '6px' }}>
  ({getRoleLabel(player)})
</span>
                        </span>
                      </div>

                      <div className="player-actions">
                        {/* Input veloce del voto */}
                        <input
                          type="number"
                          min="1"
                          max="10"
                          step="0.5"
                          className="form-input"
                          style={{ width: '64px', padding: '4px 6px', fontSize: '0.9rem', textAlign: 'center' }}
                          value={player.rating}
                          onChange={(e) => updatePlayerRating(player.id, e.target.value)}
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
                      [Selezionato per Scambio]: {teams.find(t => t.id === selectedPlayerForSwap.teamId).players[selectedPlayerForSwap.playerIndex].name}
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
                          selectedPlayerForSwap.playerIndex === pIdx;

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
          selectedPlayerForSwap.playerIndex === pIdx;
        const teamColorIndex = (teams.indexOf(pitchTeamA) % 6) + 1;

        return (
          <div
            key={player.id}
            className={`pitch-player-node ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectForSwap(pitchTeamA.id, pIdx)}
          >
            <div className={`pitch-jersey pitch-jersey-${teamColorIndex} ${isGoalkeeperPlayer(player) ? 'gk-jersey' : ''}`}>
              {isGoalkeeperPlayer(player) ? '🧤' : pIdx + 1}
              <span className="pitch-jersey-badge">{player.rating.toFixed(0)}</span>
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
          selectedPlayerForSwap.playerIndex === pIdx;
        const teamColorIndex = (teams.indexOf(pitchTeamB) % 6) + 1;

        return (
          <div
            key={player.id}
            className={`pitch-player-node ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectForSwap(pitchTeamB.id, pIdx)}
          >
            <div className={`pitch-jersey pitch-jersey-${teamColorIndex} ${isGoalkeeperPlayer(player) ? 'gk-jersey' : ''}`}>
              {isGoalkeeperPlayer(player) ? '🧤' : pIdx + 1}
              <span className="pitch-jersey-badge">{player.rating.toFixed(0)}</span>
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
