import { writable } from 'svelte/store';

const initialData = {
  visitsToday: 0,
  totalVisits: 0,
  totalVisitors: 0,
  totalCountries: 0
};

const { subscribe, set, update } = writable(initialData);

function getStats() {
  let data;
  subscribe(value => {
    data = value;
  })();
  return data;
}

function updateStats(newStats) {
  update(currentData => {
    return { ...currentData, ...newStats };
  });
}

export default {
  subscribe,
  getStats,
  updateStats
};
