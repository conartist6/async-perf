import { createReadStream } from 'fs';

class Awaited {
  constructor(value) {
    this.awaitable = value;
  }
}

export function _awaitWrap(value) {
  return new Awaited(value);
}

export function _asyncGeneratorDelegate(inner, _awaitWrap) {
  const iter = {};
  let waiting = false;

  function pump(key, arg) {
    var step = inner[key](arg);
    if (step instanceof Promise) {
      waiting = true;
      return { done: false, value: _awaitWrap(step) };
    } else {
      return step;
    }
  }

  iter[Symbol.iterator] = function () {
    return this;
  };

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }
    return pump('next', value);
  };

  if (typeof inner.throw === 'function') {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }
      return pump('throw', value);
    };
  }

  if (typeof inner.return === 'function') {
    iter.return = function (value) {
      if (waiting) {
        waiting = false;
        return value;
      }
      return pump('return', value);
    };
  }

  return iter;
}

export function _wrapAsyncGenerator(fn) {
  return function () {
    return new _AsyncGenerator(fn.apply(this, arguments));
  };
}

export class _AsyncGenerator {
  constructor(gen) {
    this._gen = gen;
    this._front = undefined;
    this._back = undefined;

    if (typeof gen.return !== 'function') {
      this.return = undefined;
    }
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  _send(method, arg) {
    const step = this._gen[method](arg);
    const isAsync = step.value instanceof Awaited || step.value instanceof Promise;

    return !isAsync ? step : new Promise((resolve, reject) => {
      const request = { method, arg, resolve, reject, next: null };
      if (this._back) {
        this._back = this._back.next = request;
      } else {
        this._front = this._back = request;
        this._resume(method, arg, step);
      }
    });
  }

  _resume(method, arg, step) {
    try {
      if (!step) step = this._gen[method](arg);
      const { value } = step;
      const isAwait = value instanceof Awaited;
      
      Promise.resolve(isAwait ? value.awaitable : value).then(
        (arg) => {
          if (isAwait) {
            // the sync generator hit an `await`
            this._resume(method === 'return' ? 'return' : 'next', arg);
          } else {
            // the sync generator hit a `yield`
            this._settle(step.done ? 'return' : 'normal', arg);
          }
        },
        (err) => {
          this._resume('throw', err);
        },
      );
    } catch (err) {
      this._settle('throw', err);
    }
  }

  _settle(type, value) {
    let front = this._front;
    switch (type) {
      case 'return':
        front.resolve({ value, done: true });
        break;
      case 'throw':
        front.reject(value);
        break;
      default:
        front.resolve({ value, done: false });
        break;
    }
    this._front = front = front.next;
    if (front) {
      this._resume(front.method, front.arg);
    } else {
      this._back = null;
    }
  }

  next(arg) {
    return this._send('next', arg);
  }

  throw(arg) {
    return this._send('throw', arg);
  }

  return(arg) {
    return this._send('return', arg);
  }
}

function _SyncAsAsyncIterator(s) {
  this.s = s;
  this.n = s.next;
}
_SyncAsAsyncIterator.prototype = {
  s: null,
  n: null,
  next: function () {
    return AsyncFromSyncIteratorContinuation(
      this.n.apply(this.s, arguments)
    );
  },
  return: function (value) {
    var ret = this.s.return;
    return ret === undefined
      ? Promise.resolve({ value, done: true })
      : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
  },
  throw: function (value) {
    var thr = this.s.return;
    return thr === undefined
      ? Promise.reject(value)
      : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
  },
}

export function _asyncIterator(iterable) {
  let method;

  if ((method = iterable[Symbol.asyncIterator]) != null) {
    return method.call(iterable);
  }
  if ((method = iterable[Symbol.iterator]) != null) {
    return new _SyncAsAsyncIterator(method.call(iterable));
  }
  throw new TypeError('Object is not async iterable');
}

function join(_x) {
  return _join.apply(this, arguments);
}

const _join = _wrapAsyncGenerator(function* (chunks) {
  let _iteratorAbruptCompletion = false;
  let _didIteratorError = false;
  let _iterator;
  let _iteratorError;

  try {
    _iterator = _asyncIterator(chunks);
    for (
      let _step, _step2;
      (_step2 = _iterator.next()),
        (_iteratorAbruptCompletion = !(_step = _step2 instanceof Promise ? yield _awaitWrap(_step2) : _step2).done);
      _iteratorAbruptCompletion = false
    ) {
      const chunk = _step.value;
      yield* _asyncGeneratorDelegate(_asyncIterator(chunk), _awaitWrap);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (_iteratorAbruptCompletion && _iterator.return != null) {
        yield _awaitWrap(_iterator.return());
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
});

function csvParse(_x2) {
  return _csvParse.apply(this, arguments);
}

const _csvParse = _wrapAsyncGenerator(function* (document) {
  let row = [];
  let value = '';
  let _iteratorAbruptCompletion = false;
  let _didIteratorError = false;
  let _iterator;
  let _iteratorError;

  try {
    _iterator = _asyncIterator(document);
    for (
      let _step, _step2;
      (_step2 = _iterator.next()),
        (_iteratorAbruptCompletion = !(_step = _step2 instanceof Promise ? yield _awaitWrap(_step2) : _step2).done);
      _iteratorAbruptCompletion = false
    ) {
      const chr = _step.value;

      if (chr === ',') {
        row.push(value);
        value = '';
      } else if (chr === '\n') {
        row.push(value);
        value = '';
        yield row;
        row = [];
      } else {
        value += chr;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (_iteratorAbruptCompletion && _iterator.return != null) {
        yield _awaitWrap(_iterator.return());
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  row.push(value);
  yield row;
});

async function asyncToArray(source) {
  const arr = [];
  var _iteratorAbruptCompletion = false;
  var _didIteratorError = false;
  var _iterator = _asyncIterator(source);
  var _iteratorError;

  try {
    for (
      let _step, _step2;
      (_step2 = _iterator.next()),
        (_iteratorAbruptCompletion = !(_step = _step2 instanceof Promise ? await _step2 : _step2).done);
      _iteratorAbruptCompletion = false
    ) {
      const value = _step.value instanceof Promise ? (await _step.value) : _step.value;
      arr.push(value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (_iteratorAbruptCompletion && _iterator.return != null) {
        await _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return arr;
}

console.time('time');
const rows = await asyncToArray(csvParse(join(createReadStream('./test.csv', 'utf-8'))));
console.log('rows:', rows.length);
console.timeEnd('time');