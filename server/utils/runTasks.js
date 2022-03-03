async function worker(queue) {
  while (queue.length > 0) {
    let task = queue.shift();
    await task();
  }
}

async function runTasks(tasks, maxRunning = 3) {
  const queue = tasks.slice();
  const workers = [...Array(maxRunning).keys()].map((_) => worker(queue));
  await Promise.all(workers);
}

module.exports = runTasks;
