# async-perf
Investigations of the speed of JS stream processing

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

> node parsers/sync-composed.js 
rows: 50003
time: 430ms

> node parsers/async.js        
rows: 50002
time: 1.5s

> node parsers/transpiled-async.js 
rows: 50002
time: 2.1s

> node parsers/transpiled-asyncish.js
rows: 50002
time: 2.2s

> node parsers/composed.js 
rows: 50002
time: 2.6s
```