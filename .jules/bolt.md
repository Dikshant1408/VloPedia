## 2024-05-24 - Unnecessary Filtering During Audio Playback
**Learning:** Found that `AgentsTab` re-renders every 100ms during audio playback (due to `setCurrentTime` tracking progress), which caused the entire agent list to be re-filtered and multiple strings allocated (via `.toLowerCase()`) on every tick.
**Action:** Wrap derived/filtered lists in `useMemo` and extract static string conversions outside the filter loop, especially in components with high-frequency state updates.
