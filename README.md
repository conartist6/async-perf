# async-perf
Investigations of the speed of JS stream processing

```
> node parsers/memory.js       
rows: 50002
time: 37.656ms
> node parsers/async-of-sync.js 
rows: 50002
time: 161.245ms
> node parsers/async.js        
rows: 50002
time: 1.567s
> node parsers/composed.js 
rows: 50002
time: 2.635s
> node parsers/transpiled-async.js 
rows: 50002
time: 2.181s
> node parsers/transpiled-asyncish.js
rows: 50002
time: 2.214s
```