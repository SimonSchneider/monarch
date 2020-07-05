let tasks = new Map();

export default (key, interval, fn) => {
  if (tasks.has(key)) {
    tasks.get(key)();
  }
  let running = true;
  const runner = () => {
    fn();
    if (running) {
      setTimeout(runner, interval);
    }
  };
  runner();
  tasks.set(key, () => (running = false));
};
