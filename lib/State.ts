import { create } from 'zustand';
import { StudentTypes } from './Database/Operations';

interface StateStoreTypes {
    // Metrics
    refreshMetricsToken: number,
    toggleRefreshMetricsToken: () => void,

    students: Array<StudentTypes>,
    setStudents: (students: Array<StudentTypes>) => void
};

const StateStore = create<StateStoreTypes>((set) => ({
    refreshMetricsToken: 0,
    toggleRefreshMetricsToken: () => set((state) => ({ refreshMetricsToken: state.refreshMetricsToken + 1 })),

    students: [],
    setStudents: (students: StudentTypes[]) => set({ students })
}));

export default StateStore;