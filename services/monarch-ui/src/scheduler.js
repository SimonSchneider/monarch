
let tasks = new Map();

const schedule = (key, interval, fn) => {
  if (tasks.has(key)) {
    tasks.get(key)();
  }
  var running = true;
  const runner = () => {
    fn();
    if (running) {
      setTimeout(runner, interval);
    }
  }
  runner()
  tasks.set(key, () => (running = false));
}

export default schedule;