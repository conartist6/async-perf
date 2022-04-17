This repo contains my investigations into the speed of character stream processing in [node](https://nodejs.org/). Results are for streaming parsing of the 5.4MB [test.csv](https://raw.githubusercontent.com/conartist6/async-perf/trunk/test.csv) file in ~82 chunks of 65KB. The particular times listed were obtained with node v17.7.1 for ARM.

```
# Takes string input and uses string.split. Reallocates string values to avoid memory leaks.
> node parsers/memory.js       
rows: 50002
time: 52ms

# A two-loop solution with an outer async loop and an inner sync loop. Takes chunks of data.
> node parsers/async-of-sync.js 
rows: 50002
time: 161ms

# Uses blocking reads to test the cost of generator functions independently of awaiting.
> node parsers/sync.js
rows: 50002
time: 295ms

# Many sync loops (using methods from iter-tools-es).
> node parsers/sync-composed.js 
rows: 50003
time: 430ms

# A single async loop transpiled to a generator coroutine and altered to skip unnecessary awaits.
> node parsers/transpiled-asyncish.js
rows: 50002
time: 434ms

# A single async loop running natively.
> node parsers/async.js        
rows: 50002
time: 1.5s

# A single async loop as transpiled to a generator coroutine.
> node parsers/transpiled-async.js 
rows: 50002
time: 1.9s

# Many async loops (using methods from iter-tools-es).
> node parsers/async-composed.js 
rows: 50002
time: 2.6s
```
