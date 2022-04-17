This repo contains my investigations into the speed of character stream processing in [node](https://nodejs.org/). Results are for streaming parsing of the 5.4MB [test.csv](https://raw.githubusercontent.com/conartist6/async-perf/trunk/test.csv) file in ~82 chunks of 65KB. The particular times listed were obtained with node v17.7.1 for ARM.

```
> node parsers/memory.js       
rows: 50002
time: 52ms

> node parsers/async-of-sync.js 
rows: 50002
time: 161ms

> node parsers/sync.js
rows: 50002
time: 295ms

> node parsers/transpiled-asyncish.js
rows: 50002
time: 420ms

> node parsers/sync-composed.js 
rows: 50003
time: 430ms

> node parsers/async.js        
rows: 50002
time: 1.5s

> node parsers/transpiled-async.js 
rows: 50002
time: 1.62

> node parsers/async-composed.js 
rows: 50002
time: 2.6s
```
