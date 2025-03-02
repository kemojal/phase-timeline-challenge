import { create } from 'zustand'

interface TimelineState {
  time: number
  duration: number
  scrollLeft: number
  setTime: (time: number) => void
  setDuration: (duration: number) => void
  setScrollLeft: (scrollLeft: number) => void
}

export const useTimelineStore = create<TimelineState>((set) => ({
  time: 0,
  duration: 1000,
  scrollLeft: 0,
  setTime: (time) => set({ time }),
  setDuration: (duration) => set({ duration }),
  setScrollLeft: (scrollLeft) => set({ scrollLeft })
}))