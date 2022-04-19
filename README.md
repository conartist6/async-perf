This repo contains my investigations into the speed of character stream processing in [node](https://nodejs.org/). Results are for streaming parsing of the 5.4MB [test.csv](https://raw.githubusercontent.com/conartist6/async-perf/trunk/test.csv) file in ~82 chunks of 65KB. The particular times listed were obtained with node v17.7.1 for ARM.

## Experiment

This repo was created to experiment with reducing the costs of processing async character streams. Async character streams are a relatively common type of data likely generated by reading from a file or network socket. The data will be in the form of packets or chunks which arrive asynchronously. Each chunk contains many characters. Thus the overall shape of the data is an async iterable of sync iterables.

An async iterable of sync iterables is a difficult shape to work with though. We would almost always prefer to write logic in terms of a single sequence of characters, but when we thransform to a single sequence the only reasonable choice is to make it an async iterable, which means that every single character incurs overhead of creating various Promises and participating in the microtask queue.

**This repository has been successful in demonstrating that there is a practical solution to this problem.** If you look below at the results below the baseline case is #6, and takes about 1.5 seconds to parse the test file. Transpiling that code introduces about another 25% overhead. I was able to show in case #5 that it is possible to modify the transpiled code so that it skips unnecessary awaits, resulting in the 434ms run, or a **4x speedup** over the most comparable result (#7) which is identical aside from the lack of any optimization.

## Results

```
# 1.
# Takes string input and uses string.split. Reallocates string values to avoid memory leaks.
> node parsers/memory.js
rows: 50002
time: 35ms

# 2.
# A two-loop solution with an outer async loop and an inner sync loop. Takes chunks of data.
> node parsers/async-of-sync.js
rows: 50002
time: 161ms

# 3.
# Uses blocking reads to test the cost of generator functions independently of awaiting.
> node parsers/sync.js
rows: 50002
time: 295ms

# 4.
# Many sync loops (using methods from iter-tools-es).
> node parsers/sync-composed.js
rows: 50003
time: 430ms

# 5.
# A single async loop transpiled to a generator coroutine and altered to skip unnecessary awaits.
> node parsers/transpiled-asyncish.js
rows: 50002
time: 434ms

# 6.
# A single async loop running natively.
> node parsers/async.js
rows: 50002
time: 1.5s

# 7.
# A single async loop as transpiled to a generator coroutine.
> node parsers/transpiled-async.js
rows: 50002
time: 1.9s

# 8.
# Many async loops (using methods from iter-tools-es).
> node parsers/async-composed.js
rows: 50002
time: 2.6s
```

## The proposal

The proposed fix to the language is to introduce a `for await? .. of` loop that is defined to only await when awaiting is necessary. It would look like this:

```
async function* readFile(path) {
  for await (const chunk of fs.openReadStream(path, 'utf8')) {
    yield* chunk;
  }
}

async function* codePoints(source) {
  for await? (const chr of source) {
    yield chr.codePointAt(0);
  }
}

// a mixed iterator can yield sync or async results
const iter = codePoints(readFile('./test.csv'))[Symbol.mixedIterator]();
iter.next(); // Promise<{ value: 103, done: false }>
iter.next(); // { value: 117, done: false }

// and for backwards compatibility:
const iter = codePoints(readFile('./test.csv'))[Symbol.asyncIterator]();
iter.next(); // Promise<{ value: 103, done: false }>
iter.next(); // Promise<{ value: 117, done: false }>
```

It would also be necessary to make some changes to the way generators work internally so that they are able to compute a result synchronously as long as the code hits a `yield` before it hits an `await`. To see what those changes would be take a look at how the optimization is implemented in this repo by running `git diff --no-index parsers/transpiled-async.js parsers/transpiled-asyncish.js`.
