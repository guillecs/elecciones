/*
 * Simulador electoral provincial - MIT License (c) 2026 Guillermo Cano Soto
 */
const provinceNameMap = {
  la_corunya: 'acoruña',
  alava: 'alava',
  albacete: 'albacete',
  alicante: 'alicante',
  almeria: 'almeria',
  asturias: 'asturias',
  avila: 'avila',
  badajoz: 'badajoz',
  illes_baleares: 'baleares',
  barcelona: 'barcelona',
  burgos: 'burgos',
  caceres: 'caceres',
  cadiz: 'cadiz',
  cantabria: 'cantabria',
  castellon: 'castellon',
  ceuta: 'ceuta',
  ciudad_real: 'ciudadreal',
  cordoba: 'cordoba',
  cuenca: 'cuenca',
  girona: 'girona',
  granada: 'granada',
  guadalajara: 'guadalajara',
  guipuzcoa: 'guipuzcoa',
  huelva: 'huelva',
  huesca: 'huesca',
  jaen: 'jaen',
  leon: 'leon',
  lleida: 'lerida',
  lugo: 'lugo',
  madrid: 'madrid',
  malaga: 'malaga',
  melilla: 'melilla',
  murcia: 'murcia',
  navarra: 'navarra',
  ourense: 'ourense',
  palencia: 'palencia',
  pontevedra: 'pontevedra',
  la_rioja: 'rioja',
  salamanca: 'salamanca',
  segovia: 'segovia',
  sevilla: 'sevilla',
  soria: 'soria',
  tarragona: 'tarragona',
  teruel: 'teruel',
  toledo: 'toledo',
  valencia: 'valencia',
  valladolid: 'valladolid',
  vizcaya: 'vizcaya',
  zamora: 'zamora',
  zaragoza: 'zaragoza',
  las_palmas: 'laspalmas',
  santa_cruz: 'santacruz'
};

function allocateSeatsByDHondt(votes, seats, thresholdTotal = votes.reduce((sum, vote) => sum + vote, 0)) {
  const allocations = votes.map(() => 0);
  const quotients = [];
  const minimumVotes = thresholdTotal * 0.03;

  votes.forEach((vote, index) => {
    if (vote < minimumVotes) return;
    for (let divisor = 1; divisor <= seats; divisor += 1) {
      quotients.push({ value: vote / divisor, index });
    }
  });

  quotients.sort((a, b) => b.value - a.value);
  quotients.slice(0, seats).forEach((item) => {
    allocations[item.index] += 1;
  });

  return allocations;
}

function createProvince({ id, name, seats, note, parties, leftCoalitionKeys }) {
  return {
    id,
    name,
    seats,
    note,
    parties: parties.map((party) => ({ ...party })),
    leftCoalitionKeys: leftCoalitionKeys || ['psoe', 'sumar']
  };
}

function createOfficialProvince(meta, data) {
  const parties = [];
  const leftKeys = [];

  if (data.psoe) parties.push({ key: 'psoe', name: 'PSOE', votes: data.psoe }), leftKeys.push('psoe');
  if (data.sumar) parties.push({ key: 'sumar', name: 'Sumar', votes: data.sumar }), leftKeys.push('sumar');
  if (data.erc) parties.push({ key: 'erc', name: 'ERC', votes: data.erc }), leftKeys.push('erc');
  if (data.comuns) parties.push({ key: 'comuns', name: 'Comuns', votes: data.comuns }), leftKeys.push('comuns');
  if (data.junts) parties.push({ key: 'junts', name: 'Junts', votes: data.junts });
  if (data.bng) parties.push({ key: 'bng', name: 'BNG', votes: data.bng }), leftKeys.push('bng');
  if (data.pnv) parties.push({ key: 'pnv', name: 'PNV', votes: data.pnv });
  if (data.ehbildu) parties.push({ key: 'ehbildu', name: 'EH Bildu', votes: data.ehbildu }), leftKeys.push('ehbildu');

  if (data.pp) parties.push({ key: 'pp', name: 'PP', votes: data.pp });
  if (data.upn) parties.push({ key: 'upn', name: 'UPN', votes: data.upn });
  if (data.vox) parties.push({ key: 'vox', name: 'Vox', votes: data.vox });
  if (data.cs) parties.push({ key: 'cs', name: 'Ciudadanos', votes: data.cs });
  if (data.cc) parties.push({ key: 'cc', name: 'Coalición Canaria', votes: data.cc });
  if (data.otros) parties.push({ key: 'otros', name: 'Otros', votes: data.otros });

  return createProvince({
    id: meta.id,
    name: meta.name,
    seats: meta.seats,
    note: '',
    parties,
    leftCoalitionKeys: leftKeys.length > 0 ? leftKeys : []
  });
}

function createMissingOfficialProvince(meta) {
  return createProvince({
    id: meta.id,
    name: meta.name,
    seats: meta.seats,
    note: 'Sin datos oficiales publicados por provincia para 2023; no se usa estimación.',
    parties: [],
    leftCoalitionKeys: []
  });
}

const provinceMeta = [
  { id: 'acoruña', name: 'A Coruña', seats: 8 },
  { id: 'alava', name: 'Álava', seats: 4 },
  { id: 'albacete', name: 'Albacete', seats: 4 },
  { id: 'alicante', name: 'Alicante', seats: 12 },
  { id: 'almeria', name: 'Almería', seats: 6 },
  { id: 'asturias', name: 'Asturias', seats: 7 },
  { id: 'avila', name: 'Ávila', seats: 3 },
  { id: 'badajoz', name: 'Badajoz', seats: 5 },
  { id: 'baleares', name: 'Baleares', seats: 8 },
  { id: 'barcelona', name: 'Barcelona', seats: 32 },
  { id: 'burgos', name: 'Burgos', seats: 4 },
  { id: 'caceres', name: 'Cáceres', seats: 4 },
  { id: 'cadiz', name: 'Cádiz', seats: 9 },
  { id: 'cantabria', name: 'Cantabria', seats: 5 },
  { id: 'castellon', name: 'Castellón', seats: 5 },
  { id: 'ceuta', name: 'Ceuta', seats: 1 },
  { id: 'ciudadreal', name: 'Ciudad Real', seats: 5 },
  { id: 'cordoba', name: 'Córdoba', seats: 6 },
  { id: 'cuenca', name: 'Cuenca', seats: 3 },
  { id: 'girona', name: 'Girona', seats: 6 },
  { id: 'granada', name: 'Granada', seats: 7 },
  { id: 'guadalajara', name: 'Guadalajara', seats: 3 },
  { id: 'guipuzcoa', name: 'Guipúzcoa', seats: 6 },
  { id: 'huelva', name: 'Huelva', seats: 5 },
  { id: 'huesca', name: 'Huesca', seats: 3 },
  { id: 'jaen', name: 'Jaén', seats: 5 },
  { id: 'leon', name: 'León', seats: 4 },
  { id: 'lerida', name: 'Lérida', seats: 4 },
  { id: 'lugo', name: 'Lugo', seats: 4 },
  { id: 'madrid', name: 'Madrid', seats: 37 },
  { id: 'malaga', name: 'Málaga', seats: 11 },
  { id: 'melilla', name: 'Melilla', seats: 1 },
  { id: 'murcia', name: 'Murcia', seats: 10 },
  { id: 'navarra', name: 'Navarra', seats: 5 },
  { id: 'ourense', name: 'Ourense', seats: 4 },
  { id: 'palencia', name: 'Palencia', seats: 3 },
  { id: 'pontevedra', name: 'Pontevedra', seats: 7 },
  { id: 'rioja', name: 'La Rioja', seats: 4 },
  { id: 'salamanca', name: 'Salamanca', seats: 4 },
  { id: 'segovia', name: 'Segovia', seats: 3 },
  { id: 'sevilla', name: 'Sevilla', seats: 12 },
  { id: 'soria', name: 'Soria', seats: 2 },
  { id: 'tarragona', name: 'Tarragona', seats: 6 },
  { id: 'teruel', name: 'Teruel', seats: 3 },
  { id: 'toledo', name: 'Toledo', seats: 6 },
  { id: 'valencia', name: 'Valencia', seats: 16 },
  { id: 'valladolid', name: 'Valladolid', seats: 5 },
  { id: 'vizcaya', name: 'Vizcaya', seats: 8 },
  { id: 'zamora', name: 'Zamora', seats: 3 },
  { id: 'zaragoza', name: 'Zaragoza', seats: 7 },
  { id: 'laspalmas', name: 'Las Palmas', seats: 8 },
  { id: 'santacruz', name: 'Santa Cruz de Tenerife', seats: 7 }
];


const manualParties = {};
const manualListOrder = {};
let activeProvinceId = null;
let hemicycleMode = 'with';
let mapMode = 'with';

const BASE_LEFT_KEYS = ['psoe', 'sumar', 'erc', 'comuns', 'bng', 'ehbildu', 'podemos'];

const UNITED_ICON = '<svg class="united-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="12" r="6.2"/><circle cx="15" cy="12" r="6.2"/></svg>';

function applyGlobalPreset(preset) {
  provinces.forEach((prov) => {
    ensureManualParties(prov);
    manualParties[prov.id].forEach((entry) => {
      const isBaseLeft = BASE_LEFT_KEYS.includes(entry.key);
      if (!isBaseLeft) return;
      entry.orientation = 'left';
      if (preset === 'psoe-solo') {
        entry.united = entry.key === 'psoe';
      } else if (preset === 'psoe-sumar') {
        entry.united = entry.key === 'psoe' || entry.key === 'sumar';
      } else if (preset === 'sin-psoe') {
        entry.united = entry.key !== 'psoe';
      } else if (preset === 'toda-izquierda') {
        entry.united = true;
      }
    });
  });
  if (preset === 'baseline') {
    Object.keys(manualParties).forEach((id) => delete manualParties[id]);
  }
  if (activeProvinceId) renderDetail(getProvinceById(activeProvinceId));
  updateTotals();
  applyMapColors();
}

const PARTY_COLORS = {
  left: '#e3425b',
  psoe: '#e2373e',
  sumar: '#e2458d',
  podemos: '#7b4fbf',
  erc: '#ffb500',
  comuns: '#d3185a',
  junts: '#2d9cdb',
  bng: '#8fc74a',
  pnv: '#0f7a3d',
  ehbildu: '#f2c200',
  pp: '#1474c9',
  vox: '#52b548',
  cs: '#f25e2b',
  upn: '#2e7bb2',
  cc: '#f2a900',
  otros: '#9aa7b4'
};

const PARTY_PALETTE = ['#46c6b1', '#ffd166', '#b39ddb', '#f48fb1', '#80cbc4', '#ffab91', '#ce93d8', '#a5d6a7'];

function getBasePartyRows(prov) {
  return prov.parties
    .filter((party) => party.votes > 0)
    .map((party) => {
      const isLeft = prov.leftCoalitionKeys.includes(party.key);
      return {
        key: party.key,
        name: party.name,
        votes: party.votes,
        orientation: isLeft ? 'left' : 'right',
        united: isLeft
      };
    });
}

function getEditablePartyRows(prov) {
  const manual = manualParties[prov.id];
  const base = getBasePartyRows(prov);
  if (!manual) return base;
  const removed = new Set(manual.filter((entry) => entry.removed).map((entry) => entry.key));
  const merged = base.filter((row) => !removed.has(row.key)).map((row) => ({ ...row }));
  manual.forEach((entry) => {
    if (entry.removed) return;
    const existing = merged.find((row) => row.key === entry.key);
    if (existing) {
      existing.name = entry.name;
      existing.votes = entry.votes;
      existing.orientation = entry.orientation || existing.orientation;
      existing.united = entry.united === undefined
        ? (entry.isLeft === undefined ? existing.united : entry.isLeft)
        : entry.united;
    } else {
      merged.push({
        ...entry,
        orientation: entry.orientation || (entry.isLeft === undefined ? 'left' : (entry.isLeft ? 'left' : 'right')),
        united: entry.united === undefined ? (entry.isLeft === undefined ? true : entry.isLeft) : entry.united
      });
    }
  });
  return merged;
}

function ensureManualParties(prov) {
  if (!manualParties[prov.id]) {
    manualParties[prov.id] = getBasePartyRows(prov).map((row) => ({ ...row }));
  }
}

function updatePartyVote(prov, key, value) {
  ensureManualParties(prov);
  const row = manualParties[prov.id].find((entry) => entry.key === key);
  if (!row) return;
  row.votes = Math.max(0, Number(value) || 0);

  if (key === 'otros') {
    const others = manualParties[prov.id].reduce(
      (sum, entry) => sum + (entry.key === 'otros' ? 0 : entry.votes),
      0
    );
    row.votes = Math.max(0, Math.min(row.votes, 100 - others));
    return;
  }

  const total = manualParties[prov.id].reduce((sum, entry) => sum + entry.votes, 0);
  if (total > 100) {
    const otros = manualParties[prov.id].find((entry) => entry.key === 'otros');
    if (otros) otros.votes = Math.max(0, otros.votes - (total - 100));
    const newTotal = manualParties[prov.id].reduce((sum, entry) => sum + entry.votes, 0);
    if (newTotal > 100) {
      const otherTotal = manualParties[prov.id].reduce(
        (sum, entry) => sum + (entry.key === key ? 0 : entry.votes),
        0
      );
      row.votes = Math.max(0, 100 - otherTotal);
    }
  }
}

function setPartyName(prov, key, name) {
  ensureManualParties(prov);
  const row = manualParties[prov.id].find((entry) => entry.key === key);
  if (row) row.name = name;
}

function setPartyUnited(prov, key, united) {
  ensureManualParties(prov);
  const row = manualParties[prov.id].find((entry) => entry.key === key);
  if (row) row.united = united;
}

function setPartyOrientation(prov, key, orientation) {
  ensureManualParties(prov);
  const row = manualParties[prov.id].find((entry) => entry.key === key);
  if (row) row.orientation = orientation === 'right' ? 'right' : 'left';
}

function addParty(prov) {
  ensureManualParties(prov);
  manualParties[prov.id].push({
    key: `p${Date.now()}${Math.random().toString(36).slice(2, 8)}`,
    name: 'Nueva candidatura',
    votes: 3,
    orientation: 'left',
    united: true
  });
}

function removeParty(prov, key) {
  ensureManualParties(prov);
  const entry = manualParties[prov.id].find((row) => row.key === key);
  if (!entry) return;
  entry.removed = true;
}

const provinces = provinceMeta.map((meta) => {
  const data = window.datosElecciones2023[meta.id];
  if (!data) return createMissingOfficialProvince(meta);
  return createOfficialProvince(meta, data);
});

function buildPartyScenario(prov, useManual = true) {
  if (!prov || !prov.parties || prov.parties.length === 0) {
    return {
      withoutParties: [],
      withParties: [],
      withoutSeats: [],
      withSeats: [],
      sharesWithout: [],
      sharesWith: [],
      leftWithoutSeats: 0,
      leftWithSeats: 0
    };
  }

  const rows = (useManual ? getEditablePartyRows(prov) : getBasePartyRows(prov))
    .filter((party) => party.votes > 0);
  const unitedRows = rows.filter((party) => party.united);
  const nonUnitedRows = rows.filter((party) => !party.united);

  const withoutParties = rows.map((party) => ({ ...party }));
  const withParties = [
    {
      key: 'left',
      name: 'Lista común',
      votes: unitedRows.reduce((sum, party) => sum + party.votes, 0)
    },
    ...nonUnitedRows.filter((party) => party.key !== 'otros')
  ].map((party) => ({ ...party }));

  // "Otros" agrupa candidaturas diferentes y no puede competir como un partido único.
  const withoutAllocationParties = withoutParties.filter((party) => party.key !== 'otros');
  const withoutAllocationVotes = withoutAllocationParties.map((party) => party.votes);
  const withVotes = withParties.map((party) => party.votes);

  const withoutAllocationSeats = allocateSeatsByDHondt(withoutAllocationVotes, prov.seats, 100);
  const withoutSeats = withoutParties.map((party) => {
    const allocationIndex = withoutAllocationParties.findIndex((item) => item.key === party.key);
    return allocationIndex === -1 ? 0 : withoutAllocationSeats[allocationIndex];
  });
  const withSeats = allocateSeatsByDHondt(withVotes, prov.seats, 100);

  const totalWithoutVotes = withoutParties.reduce((sum, party) => sum + party.votes, 0);
  const totalWithVotes = withVotes.reduce((sum, vote) => sum + vote, 0);

  let leftWithoutSeats = 0;
  withoutParties.forEach((party, index) => {
    if (party.orientation === 'left') leftWithoutSeats += withoutSeats[index];
  });

  const commonListSeats = withSeats[0] || 0;
  let leftWithSeats = commonListSeats;
  nonUnitedRows.forEach((party) => {
    if (party.orientation !== 'left') return;
    const index = withParties.findIndex((item) => item.key === party.key);
    if (index !== -1) leftWithSeats += withSeats[index];
  });

  return {
    withoutParties,
    withParties,
    withoutSeats,
    withSeats,
    sharesWithout: withoutParties.map((party) => party.votes / totalWithoutVotes),
    sharesWith: withVotes.map((vote) => vote / totalWithVotes),
    commonListSeats,
    leftWithoutSeats,
    leftWithSeats
  };
}

function getScenarioMetrics(prov, useManual) {
  const scenario = buildPartyScenario(prov, useManual);
  const quotients = [];
  const totalValidVotes = 100;
  scenario.withParties.forEach((party, index) => {
    if (party.votes < totalValidVotes * 0.03) return;
    for (let divisor = 1; divisor <= prov.seats; divisor += 1) {
      quotients.push({ value: party.votes / divisor, party, partyIndex: index, divisor });
    }
  });
  quotients.sort((a, b) => b.value - a.value);
  const winning = quotients.slice(0, prov.seats);
  const next = quotients[prov.seats];
  const leftSeats = scenario.withSeats[0] || 0;
  const nextLeftQuotient = (scenario.withParties[0]?.votes || 0) / (leftSeats + 1);
  const nextWinningQuotient = next ? next.value : 0;
  const target = Math.max(nextWinningQuotient, 0) * (leftSeats + 1);

  return {
    ...scenario,
    quotients,
    winning,
    next,
    nextLeftQuotient,
    votesNeededForNextSeat: Math.max(0, target - (scenario.withParties[0]?.votes || 0)),
    leftSeats
  };
}

function computeFragmentationRisk(prov) {
  const rows = getEditablePartyRows(prov);
  const leftParties = rows.filter((party) => party.orientation === 'left' && party.votes > 0);
  if (leftParties.length < 2) return { atRisk: false, wastedVotes: 0, parties: [] };

  const allocationRows = rows.filter((party) => party.key !== 'otros' && party.votes > 0);
  const seatAlloc = allocateSeatsByDHondt(
    allocationRows.map((party) => party.votes),
    prov.seats,
    100
  );

  const leftAtRisk = [];
  let wastedVotes = 0;
  allocationRows.forEach((party, index) => {
    if (party.orientation === 'left' && seatAlloc[index] === 0) {
      leftAtRisk.push({ name: party.name, votes: party.votes });
      wastedVotes += party.votes;
    }
  });
  if (leftAtRisk.length === 0) return { atRisk: false, wastedVotes: 0, parties: [] };

  return {
    atRisk: true,
    wastedVotes: Math.round(wastedVotes * 10) / 10,
    parties: leftAtRisk
  };
}

function getProvinceSimulation(prov) {
  const base = getScenarioMetrics(prov, false);
  const editable = getScenarioMetrics(prov, true);
  return {
    base,
    editable,
    fragmentedSeats: editable.leftWithoutSeats,
    gain: editable.leftWithSeats - editable.leftWithoutSeats,
    fragmentationRisk: computeFragmentationRisk(prov)
  };
}

function simulateProvince(prov) {
  const scenario = buildPartyScenario(prov, true);
  return {
    without: scenario.leftWithoutSeats,
    withCommon: scenario.leftWithSeats,
    gain: scenario.leftWithSeats - scenario.leftWithoutSeats,
    ...scenario
  };
}

function getProvinceById(id) {
  return provinces.find((item) => item.id === id);
}

function serializeName(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '_');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));
}

function getRecommendedListOrder(prov, coalitionSeats) {
  const members = getEditablePartyRows(prov).filter(
    (party) => party.united && party.votes > 0
  );
  if (members.length === 0 || coalitionSeats === 0) return [];

  const seats = new Map(members.map((party) => [party.key, 0]));
  const order = [];
  for (let index = 0; index < coalitionSeats; index += 1) {
    const selected = members.reduce((best, party) => {
      const quotient = party.votes / (seats.get(party.key) + 1);
      if (!best || quotient > best.quotient) return { party, quotient };
      return best;
    }, null);
    seats.set(selected.party.key, seats.get(selected.party.key) + 1);
    order.push({ position: index + 1, party: selected.party.name });
  }
  return order;
}

function renderRecommendedListOrder(prov, coalitionSeats) {
  const recommendedOrder = getRecommendedListOrder(prov, coalitionSeats);
  const savedOrder = manualListOrder[prov.id];
  const order = savedOrder && savedOrder.length === coalitionSeats ? savedOrder : recommendedOrder;
  if (order.length === 0) return '';
  const members = getEditablePartyRows(prov).filter((party) => party.united);
  return `
    <details class="list-order" data-details-key="list-order">
      <summary>Orden recomendado de la lista <span>${coalitionSeats} puesto${coalitionSeats === 1 ? '' : 's'} estimado${coalitionSeats === 1 ? '' : 's'}</span></summary>
      <p>Los puestos se reparten de forma proporcional a los votos de cada partido de la lista común (método D’Hondt). Puedes cambiar el partido de cada puesto manualmente.</p>
      <ol>${order.map((item) => {
        const options = members.map((party) => `<option value="${party.name}" ${party.name === item.party ? 'selected' : ''}>${party.name}</option>`).join('');
        return `<li><strong>${item.position}</strong><select data-list-position="${item.position}" aria-label="Partido del puesto ${item.position}">${options}</select></li>`;
      }).join('')}</ol>
      <small class="list-order-note">Esto modifica la composición interna de la lista, no los votos ni los escaños calculados.</small>
    </details>
  `;
}

function renderScenarioEditor(prov) {
  const rows = getEditablePartyRows(prov);
  const total = rows.reduce((sum, row) => sum + row.votes, 0);
  const remaining = Math.max(0, 100 - total);
  const coalitionRows = rows.filter((row) => row.united);
  const coalitionVotes = coalitionRows.reduce((sum, row) => sum + row.votes, 0);
  const scenario = buildPartyScenario(prov, true);
  const withoutSeatByKey = {};
  scenario.withoutParties.forEach((party, index) => {
    withoutSeatByKey[party.key] = scenario.withoutSeats[index];
  });
  const leftSeats = scenario.commonListSeats;
  const warnMarkup = (votes) => votes < 3 ? '<span class="threshold-warn">Debajo del umbral del 3%</span>' : '';
  const seatsMarkup = (seats) => `· ≈${seats} escaño${seats === 1 ? '' : 's'}`;

  const renderRow = (row) => {
    const otherTotal = total - row.votes;
    const maximum = Math.max(0, 100 - otherTotal);
    const seats = withoutSeatByKey[row.key] || 0;
    return `<div class="party-row ${row.united ? 'left' : ''}">
          <button type="button" class="orientation-toggle ${row.orientation === 'left' ? 'left' : 'right'}" data-party-orientation="${row.key}" title="Ideología del partido: haz clic para cambiar entre izquierda y derecha">${row.orientation === 'left' ? 'Izq.' : 'Der.'}</button>
          <label class="united-toggle" title="${row.united ? 'Se une a la lista común' : 'No se une a la lista común'}">
            <input type="checkbox" data-party-united="${row.key}" ${row.united ? 'checked' : ''} aria-label="¿${escapeHtml(row.name)} se une a la lista común?">
            <span>${UNITED_ICON} Unidos</span>
          </label>
          <div class="party-name-wrap">
            <input class="party-name" type="text" value="${escapeHtml(row.name)}" data-party-name="${row.key}" placeholder="Nombre del partido" aria-label="Nombre del partido">
            <output class="${row.united ? 'left' : ''}"><span data-party-pct="${row.key}">${row.votes.toFixed(1)}%</span> <span class="party-seats" data-party-seats="${row.key}">${seatsMarkup(seats)}</span></output>
            ${warnMarkup(row.votes)}
          </div>
          <input type="range" min="0" max="${maximum.toFixed(1)}" step="0.1" value="${row.votes.toFixed(1)}" data-party-votes="${row.key}" aria-label="Porcentaje de ${escapeHtml(row.name)}">
          <input class="vote-number" type="number" min="0" max="${maximum.toFixed(1)}" step="0.1" value="${row.votes.toFixed(1)}" data-party-votes="${row.key}" aria-label="Porcentaje numérico de ${escapeHtml(row.name)}">
          <button type="button" class="party-remove" data-party-remove="${row.key}" aria-label="Eliminar ${escapeHtml(row.name)}">×</button>
        </div>`;
  };

  const coalitionRow = coalitionRows.length >= 2 ? (() => {
    const maximum = Math.max(0, 100 - (total - coalitionVotes));
    const atRiskNames = new Set(computeFragmentationRisk(prov).parties.map((p) => p.name));
    return `<div class="party-row left coalition-row">
          <label class="united-toggle" title="Todos los marcados se presentan como una sola lista común. Desmarca para separarlos.">
            <input type="checkbox" data-coalition-united checked aria-label="Separar la lista unificada">
            <span>${UNITED_ICON}</span>
          </label>
          <div class="party-name-wrap">
            <span class="coalition-name">${coalitionRows.map((row) => escapeHtml(row.name)).join(' + ')}</span>
            <output class="left"><span data-coalition-pct>${coalitionVotes.toFixed(1)}%</span> <span class="party-seats" data-coalition-seats>${seatsMarkup(leftSeats)}</span></output>
            ${warnMarkup(coalitionVotes)}
          </div>
          <input type="range" min="0" max="${maximum.toFixed(1)}" step="0.1" value="${coalitionVotes.toFixed(1)}" data-coalition-votes aria-label="Porcentaje de la lista unificada">
          <input class="vote-number" type="number" min="0" max="${maximum.toFixed(1)}" step="0.1" value="${coalitionVotes.toFixed(1)}" data-coalition-votes aria-label="Porcentaje numérico de la lista unificada">
          <button type="button" class="party-remove" data-coalition-remove aria-label="Eliminar la lista unificada">×</button>
          <div class="coalition-members">
            ${coalitionRows.map((row) => `<span class="coalition-member${atRiskNames.has(row.name) ? ' at-risk' : ''}" title="Partido dentro de la lista común"><i style="background:${partyColor(row)}"></i>${escapeHtml(row.name)} <span data-coalition-member-votes="${row.key}">${row.votes.toFixed(1)}%</span>${atRiskNames.has(row.name) ? '<em class="coalition-warn">sin escaño</em>' : ''}<button type="button" data-coalition-member-remove="${row.key}" aria-label="Quitar ${escapeHtml(row.name)} de la lista común">×</button></span>`).join('')}
          </div>
        </div>`;
  })() : '';

  const visibleRows = coalitionRows.length >= 2 ? rows.filter((row) => !row.united) : rows;

  return `
    <div class="scenario-editor coalition-editor" data-editor-province="${prov.id}">
      <div class="editor-head">
        <div>
          <h5>Modificar escenario</h5>
          <p>Cada partido lleva una etiqueta <strong>Izq./Der.</strong> para indicar su ideología. Marca con <strong>${UNITED_ICON} Unidos</strong> los partidos que se presentan como una sola lista común: con dos o más marcados se muestran unificados.</p>
        </div>
        <button type="button" class="reset-editor" data-reset-scenario>Restablecer</button>
      </div>
      <div class="editor-budget"><span>Voto asignado</span><strong data-scenario-total>${total.toFixed(1)}%</strong><small data-scenario-remaining>${remaining.toFixed(1)}% disponible</small></div>
      ${coalitionRow}
      ${visibleRows.map(renderRow).join('')}
      <button type="button" class="party-add" data-party-add>Añadir partido</button>
    </div>
  `;
}

function setCoalitionVotes(prov, target) {
  ensureManualParties(prov);
  const coalitionRows = getEditablePartyRows(prov).filter((row) => row.united);
  const current = coalitionRows.reduce((sum, row) => sum + row.votes, 0);
  if (current <= 0) return;
  const ratio = Math.max(0, target) / current;
  coalitionRows.forEach((row) => {
    const entry = manualParties[prov.id].find((item) => item.key === row.key);
    if (entry) entry.votes = Math.min(Math.max(entry.votes * ratio, 0), 100);
  });
}

function refreshScenarioEditor(prov) {
  const editor = document.querySelector(`[data-editor-province="${prov.id}"]`);
  if (!editor) return;
  const rows = getEditablePartyRows(prov);
  const total = rows.reduce((sum, row) => sum + row.votes, 0);
  editor.querySelector('[data-scenario-total]').textContent = `${total.toFixed(1)}%`;
  editor.querySelector('[data-scenario-remaining]').textContent = `${Math.max(0, 100 - total).toFixed(1)}% disponible`;
  const scenario = buildPartyScenario(prov, true);
  const withoutSeatByKey = {};
  scenario.withoutParties.forEach((party, index) => {
    withoutSeatByKey[party.key] = scenario.withoutSeats[index];
  });
  const seatsMarkup = (seats) => `· ≈${seats} escaño${seats === 1 ? '' : 's'}`;
  const updateWarn = (selector, votes) => {
    const output = editor.querySelector(selector);
    const container = output ? output.closest('.party-name-wrap') : null;
    if (!container) return;
    let warn = container.querySelector('.threshold-warn');
    if (votes < 3) {
      if (!warn) {
        warn = document.createElement('span');
        warn.className = 'threshold-warn';
        warn.textContent = 'Debajo del umbral del 3%';
        container.appendChild(warn);
      }
    } else if (warn) {
      warn.remove();
    }
  };
  const leftRows = rows.filter((row) => row.united);
  const coalitionInputs = editor.querySelectorAll('[data-coalition-votes]');
  if (coalitionInputs.length) {
    const coalitionVotes = leftRows.reduce((sum, row) => sum + row.votes, 0);
    const maximum = Math.max(0, 100 - (total - coalitionVotes));
    coalitionInputs.forEach((input) => {
      input.max = maximum.toFixed(1);
      if (document.activeElement && input === document.activeElement) return;
      input.value = coalitionVotes.toFixed(1);
    });
    const pct = editor.querySelector('[data-coalition-pct]');
    if (pct) pct.textContent = `${coalitionVotes.toFixed(1)}%`;
    const seats = editor.querySelector('[data-coalition-seats]');
    if (seats) seats.textContent = seatsMarkup(scenario.withSeats[0] || 0);
    updateWarn('[data-coalition-pct]', coalitionVotes);
    editor.querySelectorAll('[data-coalition-member-votes]').forEach((span) => {
      const row = rows.find((item) => item.key === span.dataset.coalitionMemberVotes);
      if (row) span.textContent = `${row.votes.toFixed(1)}%`;
    });
  }
  rows.forEach((row) => {
    if (row.united && coalitionInputs.length) return;
    const otherTotal = total - row.votes;
    const maximum = Math.max(0, 100 - otherTotal);
    editor.querySelectorAll(`[data-party-votes="${row.key}"]`).forEach((input) => {
      input.max = maximum.toFixed(1);
      if (document.activeElement && input === document.activeElement) return;
      input.value = row.votes.toFixed(1);
    });
    const pct = editor.querySelector(`[data-party-pct="${row.key}"]`);
    if (pct) pct.textContent = `${row.votes.toFixed(1)}%`;
    const seats = editor.querySelector(`[data-party-seats="${row.key}"]`);
    if (seats) seats.textContent = seatsMarkup(withoutSeatByKey[row.key] || 0);
    updateWarn(`[data-party-pct="${row.key}"]`, row.votes);
  });
}

function renderDHonDtExplanation(metrics) {
  if (!metrics.winning.length) return '';
  return `
    <details class="quotient-explanation" data-details-key="quotients">
      <summary>Ver cocientes D’Hondt</summary>
      <div class="quotient-grid">
        ${metrics.winning.map((item, index) => `<div><strong>${index + 1}</strong><span>${item.party.name}</span><small>${item.value.toFixed(2)} (${item.party.votes.toFixed(2)} / ${item.divisor})</small></div>`).join('')}
      </div>
      <p class="threshold-copy">Siguiente cociente: <strong>${metrics.next ? `${metrics.next.party.name} ${metrics.next.value.toFixed(2)}` : 'no disponible'}</strong>. La izquierda necesitaría aproximadamente <strong>${metrics.votesNeededForNextSeat.toFixed(2)} puntos</strong> adicionales para el siguiente escaño, manteniendo el resto constante.</p>
    </details>
  `;
}

function renderEditor(prov) {
  const container = document.getElementById('scenario-editor');
  if (!container) return;
  const title = document.getElementById('editor-title');
  const subtitle = document.getElementById('editor-subtitle');
  if (title) title.textContent = `Simulador: ${prov.name}`;
  if (subtitle) subtitle.textContent = `Edita el nombre y los votos de cada candidatura de ${prov.name}. La etiqueta Izq./Der. indica la ideología; marca como Unidos los partidos que se presentan como una sola lista común.`;
  container.innerHTML = renderScenarioEditor(prov);
}

function renderDetail(prov) {
  renderEditor(prov);
  const sim = simulateProvince(prov);
  const simulation = getProvinceSimulation(prov);
  const editableScenario = simulation.editable;
  const partyScenario = buildPartyScenario(prov, true);

  const withoutParties = partyScenario.withoutParties.map((party, index) => ({
    ...party,
    share: partyScenario.sharesWithout[index],
    seats: partyScenario.withoutSeats[index]
  }));

  const withParties = partyScenario.withParties.map((party, index) => ({
    ...party,
    share: partyScenario.sharesWith[index],
    seats: partyScenario.withSeats[index]
  }));

  const detail = document.getElementById('province-detail');
  const openDetails = {};
  detail.querySelectorAll('details[data-details-key]').forEach((el) => {
    openDetails[el.dataset.detailsKey] = el.open;
  });
  const isLeftParty = (party) => party.orientation === 'left' || party.key === 'left';
  const totalLeftWith = partyScenario.leftWithSeats;
  const commonSeats = partyScenario.commonListSeats;
  const withSummary = commonSeats !== totalLeftWith
    ? `lista común <strong>${commonSeats}</strong> + izquierda por separado <strong>${totalLeftWith - commonSeats}</strong>`
    : `escaño${totalLeftWith === 1 ? '' : 's'} de la lista común`;
  const withoutWinner = { left: partyScenario.leftWithoutSeats, right: prov.seats - partyScenario.leftWithoutSeats };
  const withWinner = { left: totalLeftWith, right: prov.seats - totalLeftWith };
  const winnerClass = (left, right) => (left > right ? 'winner-left' : (right > left ? 'winner-right' : 'winner-tie'));
  const winnerName = (winner) => (winner.left > winner.right ? 'left' : (winner.right > winner.left ? 'right' : 'tie'));
  const winnerFlips = winnerName(withoutWinner) !== 'tie' && winnerName(withoutWinner) !== winnerName(withWinner);

  detail.innerHTML = `
    <h3>${prov.name}</h3>
    <p><strong>${prov.seats}</strong> escaños en juego en esta circunscripción.</p>
    <p class="delta">Ganancia de la lista común: <strong>${sim.gain > 0 ? '+' : ''}${sim.gain}</strong> escaño${Math.abs(sim.gain) === 1 ? '' : 's'}.</p>

    <div class="comparison-grid">
      <section class="scenario-panel ${winnerClass(withoutWinner.left, withoutWinner.right)}">
        <h4>Sin lista unificada</h4>
        <p class="panel-copy">Todos los partidos de izquierda se presentan por separado y pierden fuerza al repartirse el voto.</p>
        <div class="scenario-summary"><span>Escaños de la izquierda: <strong>${partyScenario.leftWithoutSeats}</strong></span></div>
        <table class="party-table">
          <thead>
            <tr><th>Partido</th><th>Fuerza</th><th>Escaños</th></tr>
          </thead>
          <tbody>
            ${withoutParties.map((party) => {
              const noSeat = party.seats === 0;
              return `<tr class="${party.orientation === 'left' ? 'left-party' : ''}${noSeat ? ' no-seat' : ''}"><td>${party.name}${noSeat ? '<span class="no-seat-badge">sin representación</span>' : ''}</td><td>${Math.round(party.share * 100)}%</td><td>${party.seats}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
        ${simulation.fragmentationRisk.atRisk ? `<p class="risk-margin">${simulation.fragmentationRisk.parties.map((p) => p.name).join(', ')} ${simulation.fragmentationRisk.parties.length === 1 ? 'se queda' : 'se quedan'} sin escaño${simulation.fragmentationRisk.parties.length > 1 ? 's' : ''} (${simulation.fragmentationRisk.wastedVotes}% de voto${simulation.fragmentationRisk.parties.length > 1 ? 's' : ''} sin representación). Unificar daría voz a ese voto.</p>` : ''}
      </section>

      <section class="scenario-panel ${winnerClass(withWinner.left, withWinner.right)}">
        <h4>Con lista unificada</h4>
        <p class="panel-copy">Los partidos marcados con <strong>${UNITED_ICON} Unidos</strong> en el editor se presentan en una sola candidatura.</p>
        <div class="scenario-summary"><span>La izquierda obtendría <strong>${totalLeftWith}</strong> escaño${totalLeftWith === 1 ? '' : 's'}</span><small class="scenario-sub">${withSummary}</small>${winnerFlips ? '<em class="winner-flip">¡Cambia el ganador!</em>' : ''}</div>
        <table class="party-table">
          <thead>
            <tr><th>Partido</th><th>Fuerza</th><th>Escaños</th></tr>
          </thead>
          <tbody>
            ${withParties.map((party) => {
              const noSeat = party.seats === 0;
              return `<tr class="${isLeftParty(party) ? 'left-party' : ''}${noSeat ? ' no-seat' : ''}"><td>${party.name}${noSeat ? '<span class="no-seat-badge">sin representación</span>' : ''}</td><td>${Math.round(party.share * 100)}%</td><td>${party.seats}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
        ${renderRecommendedListOrder(prov, editableScenario.leftSeats)}
        ${renderDHonDtExplanation(editableScenario)}
      </section>
    </div>

    ${prov.note ? `<p class="note">${prov.note}</p>` : ''}
  `;
  detail.querySelectorAll('details[data-details-key]').forEach((el) => {
    if (openDetails[el.dataset.detailsKey]) el.open = true;
  });
}

function updateTotals() {
  let withoutTotal = 0;
  let withTotal = 0;
  provinces.forEach((prov) => {
    const sim = simulateProvince(prov);
    withoutTotal += sim.without;
    withTotal += sim.withCommon;
  });

  document.getElementById('total-without').textContent = withoutTotal;
  document.getElementById('total-with').textContent = withTotal;
  document.getElementById('total-gain').textContent = `+${withTotal - withoutTotal}`;

  const majority = 176;
  const gain = withTotal - withoutTotal;
  const verdict = document.getElementById('hero-verdict');
  if (verdict) {
    if (withTotal >= majority) {
      verdict.innerHTML = `Con lista común, la izquierda alcanza la <strong>mayoría absoluta</strong>: <strong>${withTotal}</strong> de ${majority} escaños (sin lista: ${withoutTotal}).`;
    } else if (gain > 0) {
      verdict.innerHTML = `Con lista común la izquierda sube a <strong>${withTotal}</strong> escaños (+${gain}), pero se queda a <strong>${majority - withTotal}</strong> de la mayoría absoluta (${majority}).`;
    } else {
      verdict.innerHTML = `Unir solo no aporta ganancia en este escenario: la izquierda mantiene <strong>${withTotal}</strong> de ${majority} escaños (sin lista: ${withoutTotal}). Le faltan <strong>${majority - withTotal}</strong> para la mayoría absoluta.`;
    }
  }

  renderHemicycle();
}

function partyColor(party) {
  if (PARTY_COLORS[party.key]) return PARTY_COLORS[party.key];
  let hash = 0;
  for (let i = 0; i < party.key.length; i += 1) {
    hash = (hash * 31 + party.key.charCodeAt(i)) % 1000;
  }
  return PARTY_PALETTE[hash % PARTY_PALETTE.length];
}

function sortPartiesForHemicycle(parties) {
  const order = ['left', 'psoe', 'sumar', 'podemos', 'erc', 'comuns', 'ehbildu', 'bng', 'junts', 'pnv', 'upn', 'cc', 'pp', 'vox', 'cs', 'otros'];
  const rank = (party) => {
    const index = order.indexOf(party.key);
    if (index !== -1) return index;
    return party.isLeft ? 2.6 : 11.6;
  };
  return [...parties].sort((a, b) => rank(a) - rank(b) || b.seats - a.seats);
}

function getNationalTotals(mode) {
  const byName = new Map();
  provinces.forEach((prov) => {
    const scenario = buildPartyScenario(prov, true);
    const parties = mode === 'with' ? scenario.withParties : scenario.withoutParties;
    const seats = mode === 'with' ? scenario.withSeats : scenario.withoutSeats;
    parties.forEach((party, index) => {
      const partySeats = seats[index];
      if (!partySeats) return;
      const name = party.name || 'Candidatura';
      const entry = byName.get(name) || {
        name,
        key: party.key,
        isLeft: party.key === 'left' || party.orientation === 'left',
        seats: 0
      };
      entry.seats += partySeats;
      if (PARTY_COLORS[party.key]) entry.key = party.key;
      byName.set(name, entry);
    });
  });
  return sortPartiesForHemicycle([...byName.values()]);
}

function buildHemicycleSVG(parties) {
  const total = parties.reduce((sum, party) => sum + party.seats, 0);
  if (total === 0) return '';

  const rows = [];
  let remaining = total;
  let capacity = 22;
  while (remaining > 0) {
    const count = Math.min(capacity, remaining);
    rows.push(count);
    remaining -= count;
    capacity += 6;
  }

  const spacing = 2.2;
  const positions = [];
  rows.forEach((count, rowIndex) => {
    const radius = 20 + rowIndex * 8;
    const thetaMax = Math.max(0.02, ((count - 1) * spacing) / (2 * radius));
    for (let i = 0; i < count; i += 1) {
      const theta = count === 1 ? 0 : -thetaMax + (2 * thetaMax * i) / (count - 1);
      positions.push({
        x: radius * Math.sin(theta),
        y: -radius * Math.cos(theta),
        theta
      });
    }
  });
  positions.sort((a, b) => a.theta - b.theta || a.y - b.y);

  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = 3;
  const width = 100;
  const height = 56;
  const contentW = maxX - minX + pad * 2;
  const contentH = maxY - minY + pad * 2;
  const scale = Math.min(width / contentW, height / contentH);
  const offsetX = (width - contentW * scale) / 2 - minX * scale + pad * scale;
  const offsetY = (height - contentH * scale) / 2 - minY * scale + pad * scale;
  const seatRadius = Math.max(0.5, (spacing / 2) * scale);

  let cursor = 0;
  const circles = parties.map((party) => {
    const color = partyColor(party);
    const circleMarkup = [];
    for (let i = 0; i < party.seats; i += 1) {
      const pos = positions[cursor];
      cursor += 1;
      circleMarkup.push(`<circle cx="${(pos.x * scale + offsetX).toFixed(2)}" cy="${(pos.y * scale + offsetY).toFixed(2)}" r="${seatRadius.toFixed(2)}" fill="${color}"/>`);
    }
    return circleMarkup.join('');
  }).join('');

  const MAJORITY = 176;
  const tagText = `Mayoría absoluta: ${MAJORITY}`;
  const tagWidth = tagText.length * 1.8 + 3;
  const tagHeight = 4.8;
  const tagX = 50 - tagWidth / 2;
  const lineTop = pad * scale;
  const lineBottom = height - pad * scale;
  const majorityBar = `
    <line x1="50" y1="${lineTop.toFixed(2)}" x2="50" y2="${lineBottom.toFixed(2)}" class="majority-line"/>
    <rect x="${tagX.toFixed(2)}" y="0.4" width="${tagWidth.toFixed(2)}" height="${tagHeight.toFixed(2)}" rx="${(tagHeight / 2).toFixed(2)}" class="majority-tag-bg"/>
    <text x="50" y="${(0.4 + 3.2).toFixed(2)}" text-anchor="middle" class="majority-label">${tagText}</text>`;

  return circles + majorityBar;
}

function renderHemicycle() {
  const parties = getNationalTotals(hemicycleMode);
  const totalSeats = parties.reduce((sum, party) => sum + party.seats, 0);
  const svg = document.getElementById('hemicycle-svg');
  if (!svg) return;
  svg.innerHTML = buildHemicycleSVG(parties);
  const caption = document.getElementById('hemicycle-caption');
  if (caption) {
    caption.textContent = `${hemicycleMode === 'with' ? 'Con lista común de izquierdas' : 'Sin lista común de izquierdas'} · ${totalSeats} escaños`;
  }
  document.querySelectorAll('[data-hemicycle-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.hemicycleMode === hemicycleMode);
  });
  const legend = document.getElementById('hemicycle-legend');
  if (legend) {
    legend.innerHTML = parties.map((party) => `
      <span><i style="background:${partyColor(party)}"></i>${party.name}<strong>${party.seats}</strong></span>
    `).join('');
  }
}

function getScenarioWinner(prov, mode) {
  const scenario = buildPartyScenario(prov, true);
  if (mode === 'with') {
    const left = scenario.leftWithSeats;
    const right = prov.seats - left;
    return { left, right };
  }
  let left = 0;
  let right = 0;
  scenario.withoutParties.forEach((party, index) => {
    if (party.orientation === 'left') left += scenario.withoutSeats[index];
    else right += scenario.withoutSeats[index];
  });
  return { left, right };
}

function applyMapColors() {
  document.querySelectorAll('.province').forEach((path) => {
    const prov = getProvinceById(path.getAttribute('data-id'));
    if (!prov) return;
    const sim = simulateProvince(prov);
    const { left, right } = getScenarioWinner(prov, mapMode);
    const fill = left > right ? '#e3425b' : (right > left ? '#1474c9' : '#2a5c7a');
    const label = mapMode === 'with'
      ? `${prov.name}: ${sim.gain > 0 ? '+' : ''}${sim.gain} escaño${Math.abs(sim.gain) === 1 ? '' : 's'} con lista común (${sim.without} → ${sim.withCommon})`
      : `${prov.name}: izquierda ${left} escaños, resto ${right} escaños`;
    path.setAttribute('fill', fill);
    path.setAttribute('data-gain', sim.gain);
    path.setAttribute('aria-label', label);
  });

  if (mapMode === 'with') {
    document.querySelectorAll('.province-hatch').forEach((hatch) => {
      const prov = getProvinceById(hatch.getAttribute('data-id'));
      if (!prov) return;
      const gain = simulateProvince(prov).gain;
      hatch.setAttribute('fill', gain !== 0 ? 'url(#hatch-change)' : 'none');
    });
  } else {
    document.querySelectorAll('.province-hatch').forEach((hatch) => {
      hatch.setAttribute('fill', 'none');
    });
  }
  updateMapLegend();
}

function updateMapLegend() {
  const legend = document.getElementById('map-legend');
  if (!legend) return;
  legend.innerHTML = `
    <span><i class="dot left-win"></i> Gana la izquierda</span>
    <span><i class="dot right-win"></i> Gana el resto</span>
    <span><i class="dot neutral"></i> Empate</span>
    ${mapMode === 'with' ? '<span class="legend-hatch"><i class="dot hatch-sample"></i> Cambia escaños con la lista común</span>' : ''}`;
}

function selectProvince(id) {
  const prov = getProvinceById(id);
  if (!prov) return;
  activeProvinceId = id;

  document.querySelectorAll('.province').forEach((path) => {
    const isActive = path.getAttribute('data-id') === id;
    path.classList.toggle('active', isActive);
  });

  applyMapColors(id);
  renderDetail(prov);
}

let totalsScheduled = false;
function scheduleTotalsUpdate() {
  if (totalsScheduled) return;
  totalsScheduled = true;
  const frame = typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame
    : ((callback) => setTimeout(callback, 16));
  frame(() => {
    totalsScheduled = false;
    updateTotals();
  });
}

document.addEventListener('input', (event) => {
  const coalitionInput = event.target.closest('[data-coalition-votes]');
  if (coalitionInput && activeProvinceId) {
    const prov = getProvinceById(activeProvinceId);
    setCoalitionVotes(prov, Number(coalitionInput.value));
    refreshScenarioEditor(prov);
    scheduleTotalsUpdate();
    applyMapColors();
    return;
  }

  const votesInput = event.target.closest('[data-party-votes]');
  if (votesInput && activeProvinceId) {
    const prov = getProvinceById(activeProvinceId);
    updatePartyVote(prov, votesInput.dataset.partyVotes, votesInput.value);
    refreshScenarioEditor(prov);
    scheduleTotalsUpdate();
    applyMapColors(activeProvinceId);
    return;
  }

  const nameInput = event.target.closest('[data-party-name]');
  if (nameInput && activeProvinceId) {
    setPartyName(getProvinceById(activeProvinceId), nameInput.dataset.partyName, nameInput.value);
    return;
  }
});

document.addEventListener('change', (event) => {
  const coalitionInput = event.target.closest('[data-coalition-votes]');
  if (coalitionInput && activeProvinceId) {
    renderDetail(getProvinceById(activeProvinceId));
    return;
  }

  const coalitionUnited = event.target.closest('[data-coalition-united]');
  if (coalitionUnited && activeProvinceId) {
    const prov = getProvinceById(activeProvinceId);
    getEditablePartyRows(prov).filter((row) => row.united).forEach((row) => setPartyUnited(prov, row.key, false));
    renderDetail(prov);
    updateTotals();
    applyMapColors();
    return;
  }

  const votesInput = event.target.closest('[data-party-votes]');
  if (votesInput && activeProvinceId) {
    renderDetail(getProvinceById(activeProvinceId));
    return;
  }

  const nameInput = event.target.closest('[data-party-name]');
  if (nameInput && activeProvinceId) {
    renderDetail(getProvinceById(activeProvinceId));
    return;
  }

  const unitedInput = event.target.closest('[data-party-united]');
  if (unitedInput && activeProvinceId) {
    const prov = getProvinceById(activeProvinceId);
    setPartyUnited(prov, unitedInput.dataset.partyUnited, unitedInput.checked);
    renderDetail(prov);
    updateTotals();
    applyMapColors(activeProvinceId);
    return;
  }

  const listPosition = event.target.closest('[data-list-position]');
  if (!listPosition || !activeProvinceId) return;
  const prov = getProvinceById(activeProvinceId);
  const order = manualListOrder[prov.id] || getRecommendedListOrder(prov, getProvinceSimulation(prov).editable.leftSeats);
  const position = Number(listPosition.dataset.listPosition);
  manualListOrder[prov.id] = order.map((item) => (
    item.position === position ? { ...item, party: listPosition.value } : item
  ));
  renderDetail(prov);
});

document.addEventListener('click', (event) => {
  const coalitionRemove = event.target.closest('[data-coalition-remove]');
  if (coalitionRemove && activeProvinceId) {
    const prov = getProvinceById(activeProvinceId);
    getEditablePartyRows(prov).filter((row) => row.united).forEach((row) => removeParty(prov, row.key));
    renderDetail(prov);
    updateTotals();
    applyMapColors();
    return;
  }
  const coalitionMemberRemove = event.target.closest('[data-coalition-member-remove]');
  if (coalitionMemberRemove && activeProvinceId) {
    const prov = getProvinceById(activeProvinceId);
    setPartyUnited(prov, coalitionMemberRemove.dataset.coalitionMemberRemove, false);
    renderDetail(prov);
    updateTotals();
    applyMapColors();
    return;
  }
  const orientationBtn = event.target.closest('[data-party-orientation]');
  if (orientationBtn && activeProvinceId) {
    const prov = getProvinceById(activeProvinceId);
    const current = getEditablePartyRows(prov).find((row) => row.key === orientationBtn.dataset.partyOrientation);
    const newOrientation = current && current.orientation === 'left' ? 'right' : 'left';
    setPartyOrientation(prov, orientationBtn.dataset.partyOrientation, newOrientation);
    if (newOrientation === 'right') setPartyUnited(prov, orientationBtn.dataset.partyOrientation, false);
    renderDetail(prov);
    updateTotals();
    applyMapColors(activeProvinceId);
    return;
  }
  const hemiButton = event.target.closest('[data-hemicycle-mode]');
  if (hemiButton) {
    hemicycleMode = hemiButton.dataset.hemicycleMode;
    renderHemicycle();
    return;
  }
  const mapBtn = event.target.closest('[data-map-mode]');
  if (mapBtn) {
    mapMode = mapBtn.dataset.mapMode;
    document.querySelectorAll('.map-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.mapMode === mapMode);
    });
    applyMapColors();
    return;
  }
  const presetBtn = event.target.closest('[data-preset]');
  if (presetBtn) {
    document.querySelectorAll('.qs-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.preset === presetBtn.dataset.preset);
    });
    applyGlobalPreset(presetBtn.dataset.preset);
    return;
  }
  const reset = event.target.closest('[data-reset-scenario]');
  if (reset && activeProvinceId) {
    delete manualParties[activeProvinceId];
    renderDetail(getProvinceById(activeProvinceId));
    updateTotals();
    applyMapColors(activeProvinceId);
    return;
  }
  const addPartyBtn = event.target.closest('[data-party-add]');
  if (addPartyBtn && activeProvinceId) {
    addParty(getProvinceById(activeProvinceId));
    renderDetail(getProvinceById(activeProvinceId));
    return;
  }
  const removePartyBtn = event.target.closest('[data-party-remove]');
  if (removePartyBtn && activeProvinceId) {
    removeParty(getProvinceById(activeProvinceId), removePartyBtn.dataset.partyRemove);
    renderDetail(getProvinceById(activeProvinceId));
    updateTotals();
    applyMapColors(activeProvinceId);
  }
});

async function buildMap() {
  const svg = document.getElementById('map');
  svg.innerHTML = '';
  svg.setAttribute('viewBox', '150.522 11.305 416.746 348.17');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
  pattern.setAttribute('id', 'hatch-change');
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  pattern.setAttribute('width', '7');
  pattern.setAttribute('height', '7');
  pattern.setAttribute('patternTransform', 'rotate(45)');
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', '0');
  line.setAttribute('y1', '0');
  line.setAttribute('x2', '0');
  line.setAttribute('y2', '7');
  line.setAttribute('stroke', 'rgba(255,255,255,.72)');
  line.setAttribute('stroke-width', '1.5');
  pattern.appendChild(line);
  defs.appendChild(pattern);
  svg.appendChild(defs);

  const response = await fetch('province-shapes.json');
  const shapes = await response.json();
  const layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  shapes.forEach((shape) => {
    const normalized = serializeName(shape.name);
    const mappedId = provinceNameMap[normalized];
    const prov = mappedId ? getProvinceById(mappedId) : null;
    if (!prov) return;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', shape.path);
    path.setAttribute('class', 'province');
    path.setAttribute('data-id', prov.id);
    path.setAttribute('fill', '#2a5c7a');
    path.setAttribute('stroke', '#dce9f2');
    path.setAttribute('stroke-width', '0.8');
    layer.appendChild(path);

    const hatch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hatch.setAttribute('d', shape.path);
    hatch.setAttribute('class', 'province-hatch');
    hatch.setAttribute('data-id', prov.id);
    hatch.setAttribute('fill', 'none');
    hatch.setAttribute('style', 'pointer-events:none');
    layer.appendChild(hatch);
  });

  svg.appendChild(layer);
  setupMapTooltip();
  svg.addEventListener('click', (event) => {
    const target = event.target.closest('.province');
    if (!target) return;
    selectProvince(target.getAttribute('data-id'));
  });

  updateTotals();
  selectProvince('madrid');
}

function setupMapTooltip() {
  const map = document.getElementById('map');
  const tooltip = document.getElementById('map-tooltip');
  if (!map || !tooltip) return;
  map.addEventListener('mousemove', (event) => {
    const path = event.target.closest ? event.target.closest('.province') : null;
    if (!path) {
      tooltip.classList.add('hidden');
      return;
    }
    tooltip.textContent = path.getAttribute('aria-label') || '';
    const tooltipWidth = tooltip.offsetWidth || 0;
    const tooltipHeight = tooltip.offsetHeight || 0;
    const viewportWidth = window.innerWidth || 0;
    const viewportHeight = window.innerHeight || 0;
    const left = Math.min(event.pageX + 14, viewportWidth - tooltipWidth - 8);
    const top = Math.min(event.pageY + 14, viewportHeight - tooltipHeight - 8);
    tooltip.style.left = `${Math.max(8, left)}px`;
    tooltip.style.top = `${Math.max(8, top)}px`;
    tooltip.classList.remove('hidden');
  });
  map.addEventListener('mouseleave', () => {
    tooltip.classList.add('hidden');
  });
}

buildMap().then(() => {
  if (activeProvinceId) selectProvince(activeProvinceId);
});
