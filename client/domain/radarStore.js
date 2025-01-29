import { create } from 'zustand';

const useRadarStore = create((set) => ({
  radarData: [],
  setRadarData: (data) => set({ radarData: data }),
}));

export default useRadarStore;
