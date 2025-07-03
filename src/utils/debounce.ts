let debounceTimer: number;

const debounce = (callback: TimerHandler, time: number): void => {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(callback, time);
};

export default debounce;
