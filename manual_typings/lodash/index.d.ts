// Type definitions for Lo-Dash 4.14
// Project: http://lodash.com/
// Definitions by: Brian Zengel <https://github.com/bczengel>, Ilya Mochalov <https://github.com/chrootsu>, Stepan Mikhaylyuk <https://github.com/stepancar>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


/**
 ### 4.0.0 Changelog (https://github.com/lodash/lodash/wiki/Changelog)

 #### TODO:
 removed:
 - [x] Removed support
 - [x] Removed findWhere in favor of find with iteratee shorthand
 - [x] Removed where in favor of filter with iteratee shorthand
 - [x] Removed pluck in favor of map with iteratee shorthand

 renamed:
 - [x] Renamed first to head
 - [x] Renamed indexBy to keyBy
 - [x] Renamed invoke to invokeMap
 - [x] Renamed overArgs to overArgs
 - [x] Renamed padLeft & padRight to padStart & padEnd
 - [x] Renamed pairs to toPairs
 - [x] Renamed rest to tail
 - [x] Renamed restParam to rest
 - [x] Renamed sortByOrder to orderBy
 - [x] Renamed trimLeft & trimRight to trimStart & trimEnd
 - [x] Renamed trunc to truncate

 split:
 - [x] Split indexOf & lastIndexOf into sortedIndexOf & sortedLastIndexOf
 - [x] Split max & min into maxBy & minBy
 - [x] Split omit & pick into omitBy & pickBy
 - [x] Split sample into sampleSize
 - [x] Split sortedIndex into sortedIndexBy
 - [x] Split sortedLastIndex into sortedLastIndexBy
 - [x] Split uniq into sortedUniq, sortedUniqBy, & uniqBy

 changes:
 - [x] Absorbed sortByAll into sortBy
 - [x] Changed the category of at to “Object”
 - [x] Changed the category of bindAll to “Utility”
 - [x] Made capitalize uppercase the first character & lowercase the rest
 - [x] Made functions return only own method names


 added 23 array methods:
 - [x] concat
 - [x] differenceBy
 - [x] differenceWith
 - [x] flatMap
 - [x] fromPairs
 - [x] intersectionBy
 - [x] intersectionWith
 - [x] join
 - [x] pullAll
 - [x] pullAllBy
 - [x] reverse
 - [x] sortedIndexBy
 - [x] sortedIndexOf
 - [x] sortedLastIndexBy
 - [x] sortedLastIndexOf
 - [x] sortedUniq
 - [x] sortedUniqBy
 - [x] unionBy
 - [x] unionWith
 - [x] uniqBy
 - [x] uniqWith
 - [x] xorBy
 - [x] xorWith

 added 18 lang methods:
 - [x] cloneDeepWith
 - [x] cloneWith
 - [x] eq
 - [x] isArrayLike
 - [x] isArrayLikeObject
 - [x] isEqualWith
 - [x] isInteger
 - [x] isLength
 - [x] isMatchWith
 - [x] isNil
 - [x] isObjectLike
 - [x] isSafeInteger
 - [x] isSymbol
 - [x] toInteger
 - [x] toLength
 - [x] toNumber
 - [x] toSafeInteger
 - [x] toString

 added 13 object methods:
 - [x] assignIn
 - [x] assignInWith
 - [x] assignWith
 - [x] functionsIn
 - [x] hasIn
 - [x] mergeWith
 - [x] omitBy
 - [x] pickBy


 added 8 string methods:
 - [x] lowerCase
 - [x] lowerFirst
 - [x] upperCase
 - [x] upperFirst
 - [x] toLower
 - [x] toUpper

 added 8 utility methods:
 - [x] toPath

 added 4 math methods:
 - [x] maxBy
 - [x] mean
 - [x] minBy
 - [x] sumBy

 added 2 function methods:
 - [x] flip
 - [x] unary

 added 2 number methods:
 - [x] clamp
 - [x] subtract

 added collection method:
 - [x] sampleSize

 Added 3 aliases

 - [x] first as an alias of head

 Removed 17 aliases
 - [x] Removed aliase all
 - [x] Removed aliase any
 - [x] Removed aliase backflow
 - [x] Removed aliase callback
 - [x] Removed aliase collect
 - [x] Removed aliase compose
 - [x] Removed aliase contains
 - [x] Removed aliase detect
 - [x] Removed aliase foldl
 - [x] Removed aliase foldr
 - [x] Removed aliase include
 - [x] Removed aliase inject
 - [x] Removed aliase methods
 - [x] Removed aliase object
 - [x] Removed aliase run
 - [x] Removed aliase select
 - [x] Removed aliase unique

 Other changes
 - [x] Added support for array buffers to isEqual
 - [x] Added support for converting iterators to toArray
 - [x] Added support for deep paths to zipObject
 - [x] Changed UMD to export to window or self when available regardless of other exports
 - [x] Ensured debounce cancel clears args & thisArg references
 - [x] Ensured add, subtract, & sum don’t skip NaN values
 - [x] Ensured clone treats generators like functions
 - [x] Ensured clone produces clones with the source’s [[Prototype]]
 - [x] Ensured defaults assigns properties that shadow Object.prototype
 - [x] Ensured defaultsDeep doesn’t merge a string into an array
 - [x] Ensured defaultsDeep & merge don’t modify sources
 - [x] Ensured defaultsDeep works with circular references
 - [x] Ensured keys skips “length” on strict mode arguments objects in Safari 9
 - [x] Ensured merge doesn’t convert strings to arrays
 - [x] Ensured merge merges plain-objects onto non plain-objects
 - [x] Ensured _#plant resets iterator data of cloned sequences
 - [x] Ensured random swaps min & max if min is greater than max
 - [x] Ensured range preserves the sign of start of -0
 - [x] Ensured reduce & reduceRight use getIteratee in their array branch
 - [x] Fixed rounding issue with the precision param of floor
 - [x] Added flush method to debounced & throttled functions

 ** LATER **
 Misc:
 - [ ] Made forEach, forIn, forOwn, & times implicitly end a chain sequence
 - [ ] Removed thisArg params from most methods
 - [ ] Made “By” methods provide a single param to iteratees
 - [ ] Made words chainable by default
 - [ ] Removed isDeep params from clone & flatten
 - [ ] Removed bindAll support for binding all methods when no names are provided
 - [ ] Removed func-first param signature from before & after
 - [ ] extend as an alias of assignIn
 - [ ] extendWith as an alias of assignInWith
 - [ ] Added clear method to memoize.Cache
 - [ ] Added support for ES6 maps, sets, & symbols to clone, isEqual, & toArray
 - [ ] Enabled flow & flowRight to accept an array of functions
 - [ ] Ensured “Collection” methods treat functions as objects
 - [ ] Ensured assign, defaults, & merge coerce object values to objects
 - [ ] Ensured bindKey bound functions call object[key] when called with the new operator
 - [ ] Ensured isFunction returns true for generator functions
 - [ ] Ensured merge assigns typed arrays directly
 - [ ] Made _(...) an iterator & iterable
 - [ ] Made drop, take, & right forms coerce n of undefined to 0

 Methods:
 - [ ] concat
 - [ ] differenceBy
 - [ ] differenceWith
 - [ ] flatMap
 - [ ] fromPairs
 - [ ] intersectionBy
 - [ ] intersectionWith
 - [ ] join
 - [ ] pullAll
 - [ ] pullAllBy
 - [ ] reverse
 - [ ] sortedLastIndexOf
 - [ ] unionBy
 - [ ] unionWith
 - [ ] uniqWith
 - [ ] xorBy
 - [ ] xorWith
 - [ ] toString

 - [ ] invoke
 - [ ] setWith
 - [ ] toPairs
 - [ ] toPairsIn
 - [ ] unset

 - [ ] replace
 - [ ] split

 - [ ] cond
 - [ ] conforms
 - [ ] nthArg
 - [ ] over
 - [ ] overEvery
 - [ ] overSome
 - [ ] rangeRight

 - [ ] next
 */

declare interface LoDashStatic {
  /**
   * Creates a lodash object which wraps the given value to enable intuitive method chaining.
   *
   * In addition to Lo-Dash methods, wrappers also have the following Array methods:
   * concat, join, pop, push, reverse, shift, slice, sort, splice, and unshift
   *
   * Chaining is supported in custom builds as long as the value method is implicitly or
   * explicitly included in the build.
   *
   * The chainable wrapper functions are:
   * after, assign, bind, bindAll, bindKey, chain, chunk, compact, compose, concat, countBy,
   * createCallback, curry, debounce, defaults, defer, delay, difference, filter, flatten,
   * forEach, forEachRight, forIn, forInRight, forOwn, forOwnRight, functions, groupBy,
   * keyBy, initial, intersection, invert, invoke, keys, map, max, memoize, merge, min,
   * object, omit, once, pairs, partial, partialRight, pick, pluck, pull, push, range, reject,
   * remove, rest, reverse, sample, shuffle, slice, sort, sortBy, splice, tap, throttle, times,
   * toArray, transform, union, uniq, unset, unshift, unzip, values, where, without, wrap, and zip
   *
   * The non-chainable wrapper functions are:
   * clone, cloneDeep, contains, escape, every, find, findIndex, findKey, findLast,
   * findLastIndex, findLastKey, has, identity, indexOf, isArguments, isArray, isBoolean,
   * isDate, isElement, isEmpty, isEqual, isFinite, isFunction, isNaN, isNull, isNumber,
   * isObject, isPlainObject, isRegExp, isString, isUndefined, join, lastIndexOf, mixin,
   * noConflict, parseInt, pop, random, reduce, reduceRight, result, shift, size, some,
   * sortedIndex, runInContext, template, unescape, uniqueId, and value
   *
   * The wrapper functions first and last return wrapped values when n is provided, otherwise
   * they return unwrapped values.
   *
   * Explicit chaining can be enabled by using the chain method.
   **/
  (value: number): LoDashImplicitWrapper<number>;
  (value: string): LoDashImplicitStringWrapper;
  (value: boolean): LoDashImplicitWrapper<boolean>;
  (value: Array<number>): LoDashImplicitNumberArrayWrapper;
  <T>(value: Array<T>): LoDashImplicitArrayWrapper<T>;
  <T extends {}>(value: T): LoDashImplicitObjectWrapper<T>;
  (value: any): LoDashImplicitWrapper<any>;

  /**
   * The semantic version number.
   **/
  VERSION: string;

  /**
   * By default, the template delimiters used by Lo-Dash are similar to those in embedded Ruby
   * (ERB). Change the following template settings to use alternative delimiters.
   **/
  templateSettings: TemplateSettings;
}

/**
 * By default, the template delimiters used by Lo-Dash are similar to those in embedded Ruby
 * (ERB). Change the following template settings to use alternative delimiters.
 **/
interface TemplateSettings {
  /**
   * The "escape" delimiter.
   **/
  escape?: RegExp;

  /**
   * The "evaluate" delimiter.
   **/
  evaluate?: RegExp;

  /**
   * An object to import into the template as local variables.
   **/
  imports?: Dictionary<any>;

  /**
   * The "interpolate" delimiter.
   **/
  interpolate?: RegExp;

  /**
   * Used to reference the data object in the template text.
   **/
  variable?: string;
}

/**
 * Creates a cache object to store key/value pairs.
 */
interface MapCache {
  /**
   * Removes `key` and its value from the cache.
   * @param key The key of the value to remove.
   * @return Returns `true` if the entry was removed successfully, else `false`.
   */
  delete(key: string): boolean;

  /**
   * Gets the cached value for `key`.
   * @param key The key of the value to get.
   * @return Returns the cached value.
   */
  get(key: string): any;

  /**
   * Checks if a cached value for `key` exists.
   * @param key The key of the entry to check.
   * @return Returns `true` if an entry for `key` exists, else `false`.
   */
  has(key: string): boolean;

  /**
   * Sets `value` to `key` of the cache.
   * @param key The key of the value to cache.
   * @param value The value to cache.
   * @return Returns the cache object.
   */
  set(key: string, value: any): Dictionary<any>;
}
interface MapCacheConstructor {
  new (): MapCache;
}

interface LoDashWrapperBase<T, TWrapper> { }

interface LoDashImplicitWrapperBase<T, TWrapper> extends LoDashWrapperBase<T, TWrapper> { }

interface LoDashExplicitWrapperBase<T, TWrapper> extends LoDashWrapperBase<T, TWrapper> { }

interface LoDashImplicitWrapper<T> extends LoDashImplicitWrapperBase<T, LoDashImplicitWrapper<T>> { }

interface LoDashExplicitWrapper<T> extends LoDashExplicitWrapperBase<T, LoDashExplicitWrapper<T>> { }

interface LoDashImplicitStringWrapper extends LoDashImplicitWrapper<string> { }

interface LoDashExplicitStringWrapper extends LoDashExplicitWrapper<string> { }

interface LoDashImplicitObjectWrapper<T> extends LoDashImplicitWrapperBase<T, LoDashImplicitObjectWrapper<T>> { }

interface LoDashExplicitObjectWrapper<T> extends LoDashExplicitWrapperBase<T, LoDashExplicitObjectWrapper<T>> { }

interface LoDashImplicitArrayWrapper<T> extends LoDashImplicitWrapperBase<T[], LoDashImplicitArrayWrapper<T>> {
  pop(): T;
  push(...items: T[]): LoDashImplicitArrayWrapper<T>;
  shift(): T;
  sort(compareFn?: (a: T, b: T) => number): LoDashImplicitArrayWrapper<T>;
  splice(start: number): LoDashImplicitArrayWrapper<T>;
  splice(start: number, deleteCount: number, ...items: any[]): LoDashImplicitArrayWrapper<T>;
  unshift(...items: T[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> extends LoDashExplicitWrapperBase<T[], LoDashExplicitArrayWrapper<T>> {
  pop(): LoDashExplicitObjectWrapper<T>;
  push(...items: T[]): LoDashExplicitArrayWrapper<T>;
  shift(): LoDashExplicitObjectWrapper<T>;
  sort(compareFn?: (a: T, b: T) => number): LoDashExplicitArrayWrapper<T>;
  splice(start: number): LoDashExplicitArrayWrapper<T>;
  splice(start: number, deleteCount: number, ...items: any[]): LoDashExplicitArrayWrapper<T>;
  unshift(...items: T[]): LoDashExplicitArrayWrapper<T>;
}

interface LoDashImplicitNumberArrayWrapper extends LoDashImplicitArrayWrapper<number> { }

interface LoDashExplicitNumberArrayWrapper extends LoDashExplicitArrayWrapper<number> { }

/*********
 * Array *
 *********/

//chunk
interface LoDashStatic {
  /**
   * Creates an array of elements split into groups the length of size. If collection can’t be split evenly, the
   * final chunk will be the remaining elements.
   *
   * @param array The array to process.
   * @param size The length of each chunk.
   * @return Returns the new array containing chunks.
   */
  chunk<T>(
    array: List<T>,
    size?: number
  ): T[][];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see chunk
   */
  chunk(size?: number): LoDashImplicitArrayWrapper<T[]>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see chunk
   */
  chunk<TResult>(size?: number): LoDashImplicitArrayWrapper<TResult[]>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see chunk
   */
  chunk(size?: number): LoDashExplicitArrayWrapper<T[]>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see chunk
   */
  chunk<TResult>(size?: number): LoDashExplicitArrayWrapper<TResult[]>;
}

//compact
interface LoDashStatic {
  /**
   * Creates an array with all falsey values removed. The values false, null, 0, "", undefined, and NaN are
   * falsey.
   *
   * @param array The array to compact.
   * @return (Array) Returns the new array of filtered values.
   */
  compact<T>(array?: List<T>): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see compact
   */
  compact(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see compact
   */
  compact<TResult>(): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see compact
   */
  compact(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see compact
   */
  compact<TResult>(): LoDashExplicitArrayWrapper<TResult>;
}

//concat DUMMY
interface LoDashStatic {
  /**
   * Creates a new array concatenating `array` with any additional arrays
   * and/or values.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to concatenate.
   * @param {...*} [values] The values to concatenate.
   * @returns {Array} Returns the new concatenated array.
   * @example
   *
   * var array = [1];
   * var other = concat(array, 2, [3], [[4]]);
   *
   * console.log(other);
   * // => [1, 2, 3, [4]]
   *
   * console.log(array);
   * // => [1]
   */
  concat<T>(array: T[]|List<T>, ...values: (T|T[]|List<T>)[]) : T[];
}

//difference
interface LoDashStatic {
  /**
   * Creates an array of unique array values not included in the other provided arrays using SameValueZero for
   * equality comparisons.
   *
   * @param array The array to inspect.
   * @param values The arrays of values to exclude.
   * @return Returns the new array of filtered values.
   */
  difference<T>(
    array: T[]|List<T>,
    ...values: Array<T[]|List<T>>
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see difference
   */
  difference(...values: (T[]|List<T>)[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see difference
   */
  difference<TValue>(...values: (TValue[]|List<TValue>)[]): LoDashImplicitArrayWrapper<TValue>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see difference
   */
  difference(...values: (T[]|List<T>)[]): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see difference
   */
  difference<TValue>(...values: (TValue[]|List<TValue>)[]): LoDashExplicitArrayWrapper<TValue>;
}

//differenceBy
interface LoDashStatic {
  /**
   * This method is like difference except that it accepts iteratee which is invoked for each element of array
   * and values to generate the criterion by which uniqueness is computed. The iteratee is invoked with one
   * argument: (value).
   *
   * @param array The array to inspect.
   * @param values The values to exclude.
   * @param iteratee The iteratee invoked per element.
   * @returns Returns the new array of filtered values.
   */
  differenceBy<T>(
    array: T[]|List<T>,
    values?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    array: T[]|List<T>,
    values?: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    array: T[]|List<T>,
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    array: T[]|List<T>,
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    array: T[]|List<T>,
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    array: T[]|List<T>,
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    array: T[]|List<T>,
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    array: T[]|List<T>,
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    array: T[]|List<T>,
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    array: T[]|List<T>,
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    array: T[]|List<T>,
    ...values: any[]
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    ...values: any[]
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    ...values: any[]
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    ...values: any[]
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: ((value: T) => any)|string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T, W extends Object>(
    values1?: T[]|List<T>,
    values2?: T[]|List<T>,
    values3?: T[]|List<T>,
    values4?: T[]|List<T>,
    values5?: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see differenceBy
   */
  differenceBy<T>(
    ...values: any[]
  ): LoDashExplicitArrayWrapper<T>;
}

//differenceWith DUMMY
interface LoDashStatic {
  /**
   * Creates an array of unique `array` values not included in the other
   * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {...Array} [values] The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   * @example
   *
   * difference([3, 2, 1], [4, 2]);
   * // => [3, 1]
   */
  differenceWith(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//drop
interface LoDashStatic {
  /**
   * Creates a slice of array with n elements dropped from the beginning.
   *
   * @param array The array to query.
   * @param n The number of elements to drop.
   * @return Returns the slice of array.
   */
  drop<T>(array: T[]|List<T>, n?: number): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see drop
   */
  drop(n?: number): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see drop
   */
  drop<T>(n?: number): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see drop
   */
  drop(n?: number): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see drop
   */
  drop<T>(n?: number): LoDashExplicitArrayWrapper<T>;
}

//dropRight
interface LoDashStatic {
  /**
   * Creates a slice of array with n elements dropped from the end.
   *
   * @param array The array to query.
   * @param n The number of elements to drop.
   * @return Returns the slice of array.
   */
  dropRight<T>(
    array: List<T>,
    n?: number
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see dropRight
   */
  dropRight(n?: number): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see dropRight
   */
  dropRight<TResult>(n?: number): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see dropRight
   */
  dropRight(n?: number): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see dropRight
   */
  dropRight<TResult>(n?: number): LoDashExplicitArrayWrapper<TResult>;
}

//dropRightWhile
interface LoDashStatic {
  /**
   * Creates a slice of array excluding elements dropped from the end. Elements are dropped until predicate
   * returns falsey. The predicate is bound to thisArg and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * match the properties of the given object, else false.
   *
   * @param array The array to query.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the slice of array.
   */
  dropRightWhile<TValue>(
    array: List<TValue>,
    predicate?: ListIterator<TValue, boolean>
  ): TValue[];

  /**
   * @see dropRightWhile
   */
  dropRightWhile<TValue>(
    array: List<TValue>,
    predicate?: string
  ): TValue[];

  /**
   * @see dropRightWhile
   */
  dropRightWhile<TWhere, TValue>(
    array: List<TValue>,
    predicate?: TWhere
  ): TValue[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see dropRightWhile
   */
  dropRightWhile(
    predicate?: ListIterator<T, boolean>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see dropRightWhile
   */
  dropRightWhile(
    predicate?: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see dropRightWhile
   */
  dropRightWhile<TWhere>(
    predicate?: TWhere
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see dropRightWhile
   */
  dropRightWhile<TValue>(
    predicate?: ListIterator<TValue, boolean>
  ): LoDashImplicitArrayWrapper<TValue>;

  /**
   * @see dropRightWhile
   */
  dropRightWhile<TValue>(
    predicate?: string
  ): LoDashImplicitArrayWrapper<TValue>;

  /**
   * @see dropRightWhile
   */
  dropRightWhile<TWhere, TValue>(
    predicate?: TWhere
  ): LoDashImplicitArrayWrapper<TValue>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see dropRightWhile
   */
  dropRightWhile(
    predicate?: ListIterator<T, boolean>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see dropRightWhile
   */
  dropRightWhile(
    predicate?: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see dropRightWhile
   */
  dropRightWhile<TWhere>(
    predicate?: TWhere
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see dropRightWhile
   */
  dropRightWhile<TValue>(
    predicate?: ListIterator<TValue, boolean>
  ): LoDashExplicitArrayWrapper<TValue>;

  /**
   * @see dropRightWhile
   */
  dropRightWhile<TValue>(
    predicate?: string
  ): LoDashExplicitArrayWrapper<TValue>;

  /**
   * @see dropRightWhile
   */
  dropRightWhile<TWhere, TValue>(
    predicate?: TWhere
  ): LoDashExplicitArrayWrapper<TValue>;
}

//dropWhile
interface LoDashStatic {
  /**
   * Creates a slice of array excluding elements dropped from the beginning. Elements are dropped until predicate
   * returns falsey. The predicate is bound to thisArg and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param array The array to query.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the slice of array.
   */
  dropWhile<TValue>(
    array: List<TValue>,
    predicate?: ListIterator<TValue, boolean>
  ): TValue[];

  /**
   * @see dropWhile
   */
  dropWhile<TValue>(
    array: List<TValue>,
    predicate?: string
  ): TValue[];

  /**
   * @see dropWhile
   */
  dropWhile<TWhere, TValue>(
    array: List<TValue>,
    predicate?: TWhere
  ): TValue[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see dropWhile
   */
  dropWhile(
    predicate?: ListIterator<T, boolean>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see dropWhile
   */
  dropWhile(
    predicate?: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see dropWhile
   */
  dropWhile<TWhere>(
    predicate?: TWhere
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see dropWhile
   */
  dropWhile<TValue>(
    predicate?: ListIterator<TValue, boolean>
  ): LoDashImplicitArrayWrapper<TValue>;

  /**
   * @see dropWhile
   */
  dropWhile<TValue>(
    predicate?: string
  ): LoDashImplicitArrayWrapper<TValue>;

  /**
   * @see dropWhile
   */
  dropWhile<TWhere, TValue>(
    predicate?: TWhere
  ): LoDashImplicitArrayWrapper<TValue>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see dropWhile
   */
  dropWhile(
    predicate?: ListIterator<T, boolean>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see dropWhile
   */
  dropWhile(
    predicate?: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see dropWhile
   */
  dropWhile<TWhere>(
    predicate?: TWhere
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see dropWhile
   */
  dropWhile<TValue>(
    predicate?: ListIterator<TValue, boolean>
  ): LoDashExplicitArrayWrapper<TValue>;

  /**
   * @see dropWhile
   */
  dropWhile<TValue>(
    predicate?: string
  ): LoDashExplicitArrayWrapper<TValue>;

  /**
   * @see dropWhile
   */
  dropWhile<TWhere, TValue>(
    predicate?: TWhere
  ): LoDashExplicitArrayWrapper<TValue>;
}

//fill
interface LoDashStatic {
  /**
   * Fills elements of array with value from start up to, but not including, end.
   *
   * Note: This method mutates array.
   *
   * @param array The array to fill.
   * @param value The value to fill array with.
   * @param start The start position.
   * @param end The end position.
   * @return Returns array.
   */
  fill<T>(
    array: any[],
    value: T,
    start?: number,
    end?: number
  ): T[];

  /**
   * @see fill
   */
  fill<T>(
    array: List<any>,
    value: T,
    start?: number,
    end?: number
  ): List<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see fill
   */
  fill<T>(
    value: T,
    start?: number,
    end?: number
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see fill
   */
  fill<T>(
    value: T,
    start?: number,
    end?: number
  ): LoDashImplicitObjectWrapper<List<T>>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see fill
   */
  fill<T>(
    value: T,
    start?: number,
    end?: number
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see fill
   */
  fill<T>(
    value: T,
    start?: number,
    end?: number
  ): LoDashExplicitObjectWrapper<List<T>>;
}

//findIndex
interface LoDashStatic {
  /**
   * This method is like find except that it returns the index of the first element predicate returns truthy
   * for instead of the element itself.
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param array The array to search.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the index of the found element, else -1.
   */
  findIndex<T>(
    array: List<T>,
    predicate?: ListIterator<T, boolean>
  ): number;

  /**
   * @see findIndex
   */
  findIndex<T>(
    array: List<T>,
    predicate?: string
  ): number;

  /**
   * @see findIndex
   */
  findIndex<W, T>(
    array: List<T>,
    predicate?: W
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see findIndex
   */
  findIndex(
    predicate?: ListIterator<T, boolean>
  ): number;

  /**
   * @see findIndex
   */
  findIndex(
    predicate?: string
  ): number;

  /**
   * @see findIndex
   */
  findIndex<W>(
    predicate?: W
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see findIndex
   */
  findIndex<TResult>(
    predicate?: ListIterator<TResult, boolean>
  ): number;

  /**
   * @see findIndex
   */
  findIndex(
    predicate?: string
  ): number;

  /**
   * @see findIndex
   */
  findIndex<W>(
    predicate?: W
  ): number;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see findIndex
   */
  findIndex(
    predicate?: ListIterator<T, boolean>
  ): LoDashExplicitWrapper<number>;

  /**
   * @see findIndex
   */
  findIndex(
    predicate?: string
  ): LoDashExplicitWrapper<number>;

  /**
   * @see findIndex
   */
  findIndex<W>(
    predicate?: W
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see findIndex
   */
  findIndex<TResult>(
    predicate?: ListIterator<TResult, boolean>
  ): LoDashExplicitWrapper<number>;

  /**
   * @see findIndex
   */
  findIndex(
    predicate?: string
  ): LoDashExplicitWrapper<number>;

  /**
   * @see findIndex
   */
  findIndex<W>(
    predicate?: W
  ): LoDashExplicitWrapper<number>;
}

//findLastIndex
interface LoDashStatic {
  /**
   * This method is like findIndex except that it iterates over elements of collection from right to left.
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param array The array to search.
   * @param predicate The function invoked per iteration.
   * @param thisArg The function invoked per iteration.
   * @return Returns the index of the found element, else -1.
   */
  findLastIndex<T>(
    array: List<T>,
    predicate?: ListIterator<T, boolean>
  ): number;

  /**
   * @see findLastIndex
   */
  findLastIndex<T>(
    array: List<T>,
    predicate?: string
  ): number;

  /**
   * @see findLastIndex
   */
  findLastIndex<W, T>(
    array: List<T>,
    predicate?: W
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see findLastIndex
   */
  findLastIndex(
    predicate?: ListIterator<T, boolean>
  ): number;

  /**
   * @see findLastIndex
   */
  findLastIndex(
    predicate?: string
  ): number;

  /**
   * @see findLastIndex
   */
  findLastIndex<W>(
    predicate?: W
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see findLastIndex
   */
  findLastIndex<TResult>(
    predicate?: ListIterator<TResult, boolean>
  ): number;

  /**
   * @see findLastIndex
   */
  findLastIndex(
    predicate?: string
  ): number;

  /**
   * @see findLastIndex
   */
  findLastIndex<W>(
    predicate?: W
  ): number;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see findLastIndex
   */
  findLastIndex(
    predicate?: ListIterator<T, boolean>
  ): LoDashExplicitWrapper<number>;

  /**
   * @see findLastIndex
   */
  findLastIndex(
    predicate?: string
  ): LoDashExplicitWrapper<number>;

  /**
   * @see findLastIndex
   */
  findLastIndex<W>(
    predicate?: W
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see findLastIndex
   */
  findLastIndex<TResult>(
    predicate?: ListIterator<TResult, boolean>
  ): LoDashExplicitWrapper<number>;

  /**
   * @see findLastIndex
   */
  findLastIndex(
    predicate?: string
  ): LoDashExplicitWrapper<number>;

  /**
   * @see findLastIndex
   */
  findLastIndex<W>(
    predicate?: W
  ): LoDashExplicitWrapper<number>;
}

//first
interface LoDashStatic {
  /**
   * @see head
   */
  first<T>(array: List<T>): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see head
   */
  first(): string;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see head
   */
  first(): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see head
   */
  first<T>(): T;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see head
   */
  first(): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see head
   */
  first<T>(): T;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see head
   */
  first<T>(): T;
}

interface RecursiveArray<T> extends Array<T|RecursiveArray<T>> {}
interface ListOfRecursiveArraysOrValues<T> extends List<T|RecursiveArray<T>> {}

//flatten
interface LoDashStatic {
  /**
   * Flattens a nested array. If isDeep is true the array is recursively flattened, otherwise it’s only
   * flattened a single level.
   *
   * @param array The array to flatten.
   * @param isDeep Specify a deep flatten.
   * @return Returns the new flattened array.
   */
  flatten<T>(array: ListOfRecursiveArraysOrValues<T>, isDeep: boolean): T[];

  /**
   * @see flatten
   */
  flatten<T>(array: List<T|T[]>): T[];

  /**
   * @see flatten
   */
  flatten<T>(array: ListOfRecursiveArraysOrValues<T>): RecursiveArray<T>;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see flatten
   */
  flatten(): LoDashImplicitArrayWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see flatten
   */
  flatten<TResult>(isDeep?: boolean): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see flatten
   */
  flatten<TResult>(isDeep?: boolean): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see flatten
   */
  flatten(): LoDashExplicitArrayWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see flatten
   */
  flatten<TResult>(isDeep?: boolean): LoDashExplicitArrayWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see flatten
   */
  flatten<TResult>(isDeep?: boolean): LoDashExplicitArrayWrapper<TResult>;
}

//flattenDeep
interface LoDashStatic {
  /**
   * Recursively flattens a nested array.
   *
   * @param array The array to recursively flatten.
   * @return Returns the new flattened array.
   */
  flattenDeep<T>(array: ListOfRecursiveArraysOrValues<T>): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see flattenDeep
   */
  flattenDeep(): LoDashImplicitArrayWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see flattenDeep
   */
  flattenDeep<T>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see flattenDeep
   */
  flattenDeep<T>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see flattenDeep
   */
  flattenDeep(): LoDashExplicitArrayWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see flattenDeep
   */
  flattenDeep<T>(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see flattenDeep
   */
  flattenDeep<T>(): LoDashExplicitArrayWrapper<T>;
}

// flattenDepth
interface LoDashStatic {
  /**
   * Recursively flatten array up to depth times.
   *
   * @param array The array to recursively flatten.
   * @param number The maximum recursion depth.
   * @return Returns the new flattened array.
   */
  flattenDepth<T>(array: ListOfRecursiveArraysOrValues<T>, depth?: number): T[];
}

//fromPairs
interface LoDashStatic {
  /**
   * The inverse of `toPairs`; this method returns an object composed
   * from key-value `pairs`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} pairs The key-value pairs.
   * @returns {Object} Returns the new object.
   * @example
   *
   * fromPairs([['fred', 30], ['barney', 40]]);
   * // => { 'fred': 30, 'barney': 40 }
   */
  fromPairs<T>(
    array: List<[StringRepresentable, T]>
  ): Dictionary<T>;

  /**
   @see fromPairs
   */
  fromPairs(
    array: List<any[]>
  ): Dictionary<any>;
}

//fromPairs DUMMY
interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see fromPairs
   */
  fromPairs(): LoDashImplicitObjectWrapper<any>;
}

//fromPairs DUMMY
interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see fromPairs
   */
  fromPairs(): LoDashExplicitObjectWrapper<any>;
}

//head
interface LoDashStatic {
  /**
   * Gets the first element of array.
   *
   * @alias first
   *
   * @param array The array to query.
   * @return Returns the first element of array.
   */
  head<T>(array: List<T>): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see head
   */
  head(): string;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see head
   */
  head(): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see head
   */
  head<T>(): T;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see head
   */
  head(): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see head
   */
  head<T>(): T;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see head
   */
  head<T>(): T;
}

//indexOf
interface LoDashStatic {
  /**
   * Gets the index at which the first occurrence of `value` is found in `array`
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons. If `fromIndex` is negative, it's used as the offset
   * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
   * performs a faster binary search.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   * @example
   *
   * indexOf([1, 2, 1, 2], 2);
   * // => 1
   *
   * // using `fromIndex`
   * indexOf([1, 2, 1, 2], 2, 2);
   * // => 3
   */
  indexOf<T>(
    array: List<T>,
    value: T,
    fromIndex?: boolean|number
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see indexOf
   */
  indexOf(
    value: T,
    fromIndex?: boolean|number
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see indexOf
   */
  indexOf<TValue>(
    value: TValue,
    fromIndex?: boolean|number
  ): number;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see indexOf
   */
  indexOf(
    value: T,
    fromIndex?: boolean|number
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see indexOf
   */
  indexOf<TValue>(
    value: TValue,
    fromIndex?: boolean|number
  ): LoDashExplicitWrapper<number>;
}

//intersectionBy DUMMY
interface LoDashStatic {
  /**
   * This method is like `intersection` except that it accepts `iteratee`
   * which is invoked for each element of each `arrays` to generate the criterion
   * by which uniqueness is computed. The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @param {Function|Object|string} [iteratee=identity] The iteratee invoked per element.
   * @returns {Array} Returns the new array of shared values.
   * @example
   *
   * intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
   * // => [2.1]
   *
   * // using the `property` iteratee shorthand
   * intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
   * // => [{ 'x': 1 }]
   */
  intersectionBy(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//intersectionWith DUMMY
interface LoDashStatic {
  /**
   * This method is like `intersection` except that it accepts `comparator`
   * which is invoked to compare elements of `arrays`. The comparator is invoked
   * with two arguments: (arrVal, othVal).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of shared values.
   * @example
   *
   * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
   * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
   *
   * intersectionWith(objects, others, isEqual);
   * // => [{ 'x': 1, 'y': 2 }]
   */
  intersectionWith(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//join
interface LoDashStatic {
  /**
   * Converts all elements in `array` into a string separated by `separator`.
   *
   * @param array The array to convert.
   * @param separator The element separator.
   * @returns Returns the joined string.
   */
  join(
    array: List<any>,
    separator?: string
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see join
   */
  join(separator?: string): string;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see join
   */
  join(separator?: string): string;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see join
   */
  join(separator?: string): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see join
   */
  join(separator?: string): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see join
   */
  join(separator?: string): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see join
   */
  join(separator?: string): LoDashExplicitWrapper<string>;
}

//pullAll DUMMY
interface LoDashStatic {
  /**
   * This method is like `pull` except that it accepts an array of values to remove.
   *
   * **Note:** Unlike `difference`, this method mutates `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to modify.
   * @param {Array} values The values to remove.
   * @returns {Array} Returns `array`.
   * @example
   *
   * var array = [1, 2, 3, 1, 2, 3];
   *
   * pull(array, [2, 3]);
   * console.log(array);
   * // => [1, 1]
   */
  pullAll(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//pullAllBy DUMMY
interface LoDashStatic {
  /**
   * This method is like `pullAll` except that it accepts `iteratee` which is
   * invoked for each element of `array` and `values` to to generate the criterion
   * by which uniqueness is computed. The iteratee is invoked with one argument: (value).
   *
   * **Note:** Unlike `differenceBy`, this method mutates `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to modify.
   * @param {Array} values The values to remove.
   * @param {Function|Object|string} [iteratee=identity] The iteratee invoked per element.
   * @returns {Array} Returns `array`.
   * @example
   *
   * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
   *
   * pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
   * console.log(array);
   * // => [{ 'x': 2 }]
   */
  pullAllBy(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//reverse DUMMY
interface LoDashStatic {
  /**
   * Reverses `array` so that the first element becomes the last, the second
   * element becomes the second to last, and so on.
   *
   * **Note:** This method mutates `array` and is based on
   * [`Array#reverse`](https://mdn.io/Array/reverse).
   *
   * @memberOf _
   * @category Array
   * @returns {Array} Returns `array`.
   * @example
   *
   * var array = [1, 2, 3];
   *
   * reverse(array);
   * // => [3, 2, 1]
   *
   * console.log(array);
   * // => [3, 2, 1]
   */
  reverse(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//sortedIndexOf
interface LoDashStatic {
  /**
   * This method is like `indexOf` except that it performs a binary
   * search on a sorted `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   * @example
   *
   * sortedIndexOf([1, 1, 2, 2], 2);
   * // => 2
   */
  sortedIndexOf<T>(
    array: List<T>,
    value: T
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sortedIndexOf
   */
  sortedIndexOf(
    value: T
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sortedIndexOf
   */
  sortedIndexOf<TValue>(
    value: TValue
  ): number;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sortedIndexOf
   */
  sortedIndexOf(
    value: T
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sortedIndexOf
   */
  sortedIndexOf<TValue>(
    value: TValue
  ): LoDashExplicitWrapper<number>;
}

//initial
interface LoDashStatic {
  /**
   * Gets all but the last element of array.
   *
   * @param array The array to query.
   * @return Returns the slice of array.
   */
  initial<T>(array: List<T>): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see initial
   */
  initial(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see initial
   */
  initial<T>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see initial
   */
  initial(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see initial
   */
  initial<T>(): LoDashExplicitArrayWrapper<T>;
}

//intersection
interface LoDashStatic {
  /**
   * Creates an array of unique values that are included in all of the provided arrays using SameValueZero for
   * equality comparisons.
   *
   * @param arrays The arrays to inspect.
   * @return Returns the new array of shared values.
   */
  intersection<T>(...arrays: (T[]|List<T>)[]): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see intersection
   */
  intersection<TResult>(...arrays: (TResult[]|List<TResult>)[]): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see intersection
   */
  intersection<TResult>(...arrays: (TResult[]|List<TResult>)[]): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see intersection
   */
  intersection<TResult>(...arrays: (TResult[]|List<TResult>)[]): LoDashExplicitArrayWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see intersection
   */
  intersection<TResult>(...arrays: (TResult[]|List<TResult>)[]): LoDashExplicitArrayWrapper<TResult>;
}

//last
interface LoDashStatic {
  /**
   * Gets the last element of array.
   *
   * @param array The array to query.
   * @return Returns the last element of array.
   */
  last<T>(array: List<T>): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see last
   */
  last(): string;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see last
   */
  last(): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see last
   */
  last<T>(): T;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see last
   */
  last(): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see last
   */
  last<T>(): T;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see last
   */
  last<T>(): T;
}

//lastIndexOf
interface LoDashStatic {
  /**
   * This method is like indexOf except that it iterates over elements of array from right to left.
   *
   * @param array The array to search.
   * @param value The value to search for.
   * @param fromIndex The index to search from or true to perform a binary search on a sorted array.
   * @return Returns the index of the matched value, else -1.
   */
  lastIndexOf<T>(
    array: List<T>,
    value: T,
    fromIndex?: boolean|number
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see lastIndexOf
   */
  lastIndexOf(
    value: T,
    fromIndex?: boolean|number
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see lastIndexOf
   */
  lastIndexOf<TResult>(
    value: TResult,
    fromIndex?: boolean|number
  ): number;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see lastIndexOf
   */
  lastIndexOf(
    value: T,
    fromIndex?: boolean|number
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see lastIndexOf
   */
  lastIndexOf<TResult>(
    value: TResult,
    fromIndex?: boolean|number
  ): LoDashExplicitWrapper<number>;
}

//pull
interface LoDashStatic {
  /**
   * Removes all provided values from array using SameValueZero for equality comparisons.
   *
   * Note: Unlike without, this method mutates array.
   *
   * @param array The array to modify.
   * @param values The values to remove.
   * @return Returns array.
   */
  pull<T>(
    array: T[],
    ...values: T[]
  ): T[];

  /**
   * @see pull
   */
  pull<T>(
    array: List<T>,
    ...values: T[]
  ): List<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see pull
   */
  pull(...values: T[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see pull
   */
  pull<TValue>(...values: TValue[]): LoDashImplicitObjectWrapper<List<TValue>>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see pull
   */
  pull(...values: T[]): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see pull
   */
  pull<TValue>(...values: TValue[]): LoDashExplicitObjectWrapper<List<TValue>>;
}

//pullAt
interface LoDashStatic {
  /**
   * Removes elements from array corresponding to the given indexes and returns an array of the removed elements.
   * Indexes may be specified as an array of indexes or as individual arguments.
   *
   * Note: Unlike at, this method mutates array.
   *
   * @param array The array to modify.
   * @param indexes The indexes of elements to remove, specified as individual indexes or arrays of indexes.
   * @return Returns the new array of removed elements.
   */
  pullAt<T>(
    array: List<T>,
    ...indexes: (number|number[])[]
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see pullAt
   */
  pullAt(...indexes: (number|number[])[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see pullAt
   */
  pullAt<T>(...indexes: (number|number[])[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see pullAt
   */
  pullAt(...indexes: (number|number[])[]): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see pullAt
   */
  pullAt<T>(...indexes: (number|number[])[]): LoDashExplicitArrayWrapper<T>;
}

//remove
interface LoDashStatic {
  /**
   * Removes all elements from array that predicate returns truthy for and returns an array of the removed
   * elements. The predicate is bound to thisArg and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * Note: Unlike filter, this method mutates array.
   *
   * @param array The array to modify.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the new array of removed elements.
   */
  remove<T>(
    array: List<T>,
    predicate?: ListIterator<T, boolean>
  ): T[];

  /**
   * @see remove
   */
  remove<T>(
    array: List<T>,
    predicate?: string
  ): T[];

  /**
   * @see remove
   */
  remove<W, T>(
    array: List<T>,
    predicate?: W
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see remove
   */
  remove(
    predicate?: ListIterator<T, boolean>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see remove
   */
  remove(
    predicate?: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see remove
   */
  remove<W>(
    predicate?: W
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see remove
   */
  remove<TResult>(
    predicate?: ListIterator<TResult, boolean>
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see remove
   */
  remove<TResult>(
    predicate?: string
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see remove
   */
  remove<W, TResult>(
    predicate?: W
  ): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see remove
   */
  remove(
    predicate?: ListIterator<T, boolean>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see remove
   */
  remove(
    predicate?: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see remove
   */
  remove<W>(
    predicate?: W
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see remove
   */
  remove<TResult>(
    predicate?: ListIterator<TResult, boolean>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see remove
   */
  remove<TResult>(
    predicate?: string
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see remove
   */
  remove<W, TResult>(
    predicate?: W
  ): LoDashExplicitArrayWrapper<TResult>;
}

//tail
interface LoDashStatic {
  /**
   * Gets all but the first element of array.
   *
   * @alias tail
   *
   * @param array The array to query.
   * @return Returns the slice of array.
   */
  tail<T>(array: List<T>): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see tail
   */
  tail(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see tail
   */
  tail<T>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see tail
   */
  tail(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see tail
   */
  tail<T>(): LoDashExplicitArrayWrapper<T>;
}

//slice
interface LoDashStatic {
  /**
   * Creates a slice of array from start up to, but not including, end.
   *
   * @param array The array to slice.
   * @param start The start position.
   * @param end The end position.
   * @return Returns the slice of array.
   */
  slice<T>(
    array: T[],
    start?: number,
    end?: number
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see slice
   */
  slice(
    start?: number,
    end?: number
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see slice
   */
  slice(
    start?: number,
    end?: number
  ): LoDashExplicitArrayWrapper<T>;
}

//sortedIndex
interface LoDashStatic {
  /**
   * Uses a binary search to determine the lowest index at which `value` should
   * be inserted into `array` in order to maintain its sort order.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The sorted array to inspect.
   * @param {*} value The value to evaluate.
   * @returns {number} Returns the index at which `value` should be inserted into `array`.
   * @example
   *
   * sortedIndex([30, 50], 40);
   * // => 1
   *
   * sortedIndex([4, 5], 4);
   * // => 0
   */
  sortedIndex<T, TSort>(
    array: List<T>,
    value: T
  ): number;

  /**
   * @see sortedIndex
   */
  sortedIndex<T>(
    array: List<T>,
    value: T
  ): number;

  /**
   * @see sortedIndex
   */
  sortedIndex<T>(
    array: List<T>,
    value: T
  ): number;

  /**
   * @see sortedIndex
   */
  sortedIndex<W, T>(
    array: List<T>,
    value: T
  ): number;

  /**
   * @see sortedIndex
   */
  sortedIndex<T>(
    array: List<T>,
    value: T
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see sortedIndex
   */
  sortedIndex<TSort>(
    value: string
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sortedIndex
   */
  sortedIndex<TSort>(
    value: T
  ): number;

  /**
   * @see sortedIndex
   */
  sortedIndex(
    value: T
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sortedIndex
   */
  sortedIndex<T, TSort>(
    value: T
  ): number;

  /**
   * @see sortedIndex
   */
  sortedIndex<T>(
    value: T
  ): number;

  /**
   * @see sortedIndex
   */
  sortedIndex<W, T>(
    value: T
  ): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see sortedIndex
   */
  sortedIndex<TSort>(
    value: string
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sortedIndex
   */
  sortedIndex<TSort>(
    value: T
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndex
   */
  sortedIndex(
    value: T
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndex
   */
  sortedIndex<W>(
    value: T
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sortedIndex
   */
  sortedIndex<T, TSort>(
    value: T
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndex
   */
  sortedIndex<T>(
    value: T
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndex
   */
  sortedIndex<W, T>(
    value: T
  ): LoDashExplicitWrapper<number>;


}

//sortedIndexBy
interface LoDashStatic {
  /**
   * This method is like `sortedIndex` except that it accepts `iteratee`
   * which is invoked for `value` and each element of `array` to compute their
   * sort ranking. The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The sorted array to inspect.
   * @param {*} value The value to evaluate.
   * @param {Function|Object|string} [iteratee=identity] The iteratee invoked per element.
   * @returns {number} Returns the index at which `value` should be inserted into `array`.
   * @example
   *
   * var dict = { 'thirty': 30, 'forty': 40, 'fifty': 50 };
   *
   * sortedIndexBy(['thirty', 'fifty'], 'forty', propertyOf(dict));
   * // => 1
   *
   * // using the `property` iteratee shorthand
   * sortedIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
   * // => 0
   */
  sortedIndexBy<T, TSort>(
    array: List<T>,
    value: T,
    iteratee: (x: T) => TSort
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T>(
    array: List<T>,
    value: T,
    iteratee: (x: T) => any
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T>(
    array: List<T>,
    value: T,
    iteratee: string
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<W, T>(
    array: List<T>,
    value: T,
    iteratee: W
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T>(
    array: List<T>,
    value: T,
    iteratee: Object
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<TSort>(
    value: string,
    iteratee: (x: string) => TSort
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<TSort>(
    value: T,
    iteratee: (x: T) => TSort
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy(
    value: T,
    iteratee: string
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<W>(
    value: T,
    iteratee: W
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T, TSort>(
    value: T,
    iteratee: (x: T) => TSort
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T>(
    value: T,
    iteratee: (x: T) => any
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T>(
    value: T,
    iteratee: string
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<W, T>(
    value: T,
    iteratee: W
  ): number;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T>(
    value: T,
    iteratee: Object
  ): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<TSort>(
    value: string,
    iteratee: (x: string) => TSort
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<TSort>(
    value: T,
    iteratee: (x: T) => TSort
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy(
    value: T,
    iteratee: string
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<W>(
    value: T,
    iteratee: W
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T, TSort>(
    value: T,
    iteratee: (x: T) => TSort
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T>(
    value: T,
    iteratee: (x: T) => any
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T>(
    value: T,
    iteratee: string
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<W, T>(
    value: T,
    iteratee: W
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedIndexBy
   */
  sortedIndexBy<T>(
    value: T,
    iteratee: Object
  ): LoDashExplicitWrapper<number>;
}

//sortedLastIndex
interface LoDashStatic {
  /**
   * This method is like `sortedIndex` except that it returns the highest
   * index at which `value` should be inserted into `array` in order to
   * maintain its sort order.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The sorted array to inspect.
   * @param {*} value The value to evaluate.
   * @returns {number} Returns the index at which `value` should be inserted into `array`.
   * @example
   *
   * sortedLastIndex([4, 5], 4);
   * // => 1
   */
  sortedLastIndex<T, TSort>(
    array: List<T>,
    value: T
  ): number;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<T>(
    array: List<T>,
    value: T
  ): number;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<T>(
    array: List<T>,
    value: T
  ): number;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<W, T>(
    array: List<T>,
    value: T
  ): number;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<T>(
    array: List<T>,
    value: T
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<TSort>(
    value: string
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<TSort>(
    value: T
  ): number;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex(
    value: T
  ): number;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<W>(
    value: T
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<T, TSort>(
    value: T
  ): number;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<T>(
    value: T
  ): number;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<W, T>(
    value: T
  ): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<TSort>(
    value: string
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<TSort>(
    value: T
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex(
    value: T
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<T, TSort>(
    value: T
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<T>(
    value: T
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedLastIndex
   */
  sortedLastIndex<W, T>(
    value: T
  ): LoDashExplicitWrapper<number>;
}

//sortedLastIndexBy
interface LoDashStatic {
  /**
   * This method is like `sortedLastIndex` except that it accepts `iteratee`
   * which is invoked for `value` and each element of `array` to compute their
   * sort ranking. The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The sorted array to inspect.
   * @param {*} value The value to evaluate.
   * @param {Function|Object|string} [iteratee=identity] The iteratee invoked per element.
   * @returns {number} Returns the index at which `value` should be inserted into `array`.
   * @example
   *
   * // using the `property` iteratee shorthand
   * sortedLastIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
   * // => 1
   */
  sortedLastIndexBy<T, TSort>(
    array: List<T>,
    value: T,
    iteratee: (x: T) => TSort
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T>(
    array: List<T>,
    value: T,
    iteratee: (x: T) => any
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T>(
    array: List<T>,
    value: T,
    iteratee: string
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<W, T>(
    array: List<T>,
    value: T,
    iteratee: W
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T>(
    array: List<T>,
    value: T,
    iteratee: Object
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<TSort>(
    value: string,
    iteratee: (x: string) => TSort
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<TSort>(
    value: T,
    iteratee: (x: T) => TSort
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy(
    value: T,
    iteratee: string
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<W>(
    value: T,
    iteratee: W
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T, TSort>(
    value: T,
    iteratee: (x: T) => TSort
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T>(
    value: T,
    iteratee: (x: T) => any
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T>(
    value: T,
    iteratee: string
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<W, T>(
    value: T,
    iteratee: W
  ): number;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T>(
    value: T,
    iteratee: Object
  ): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<TSort>(
    value: string,
    iteratee: (x: string) => TSort
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<TSort>(
    value: T,
    iteratee: (x: T) => TSort
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy(
    value: T,
    iteratee: string
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<W>(
    value: T,
    iteratee: W
  ): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T, TSort>(
    value: T,
    iteratee: (x: T) => TSort
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T>(
    value: T,
    iteratee: (x: T) => any
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T>(
    value: T,
    iteratee: string
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<W, T>(
    value: T,
    iteratee: W
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sortedLastIndexBy
   */
  sortedLastIndexBy<T>(
    value: T,
    iteratee: Object
  ): LoDashExplicitWrapper<number>;
}

//sortedLastIndexOf DUMMY
interface LoDashStatic {
  /**
   * This method is like `lastIndexOf` except that it performs a binary
   * search on a sorted `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   * @example
   *
   * sortedLastIndexOf([1, 1, 2, 2], 2);
   * // => 3
   */
  sortedLastIndexOf(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//tail
interface LoDashStatic {
  /**
   * @see rest
   */
  tail<T>(array: List<T>): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see rest
   */
  tail(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see rest
   */
  tail<T>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see rest
   */
  tail(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see rest
   */
  tail<T>(): LoDashExplicitArrayWrapper<T>;
}

//take
interface LoDashStatic {
  /**
   * Creates a slice of array with n elements taken from the beginning.
   *
   * @param array The array to query.
   * @param n The number of elements to take.
   * @return Returns the slice of array.
   */
  take<T>(
    array: List<T>,
    n?: number
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see take
   */
  take(n?: number): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see take
   */
  take<TResult>(n?: number): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see take
   */
  take(n?: number): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see take
   */
  take<TResult>(n?: number): LoDashExplicitArrayWrapper<TResult>;
}

//takeRight
interface LoDashStatic {
  /**
   * Creates a slice of array with n elements taken from the end.
   *
   * @param array The array to query.
   * @param n The number of elements to take.
   * @return Returns the slice of array.
   */
  takeRight<T>(
    array: List<T>,
    n?: number
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see takeRight
   */
  takeRight(n?: number): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see takeRight
   */
  takeRight<TResult>(n?: number): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see takeRight
   */
  takeRight(n?: number): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see takeRight
   */
  takeRight<TResult>(n?: number): LoDashExplicitArrayWrapper<TResult>;
}

//takeRightWhile
interface LoDashStatic {
  /**
   * Creates a slice of array with elements taken from the end. Elements are taken until predicate returns
   * falsey. The predicate is bound to thisArg and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param array The array to query.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the slice of array.
   */
  takeRightWhile<TValue>(
    array: List<TValue>,
    predicate?: ListIterator<TValue, boolean>
  ): TValue[];

  /**
   * @see takeRightWhile
   */
  takeRightWhile<TValue>(
    array: List<TValue>,
    predicate?: string
  ): TValue[];

  /**
   * @see takeRightWhile
   */
  takeRightWhile<TWhere, TValue>(
    array: List<TValue>,
    predicate?: TWhere
  ): TValue[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see takeRightWhile
   */
  takeRightWhile(
    predicate?: ListIterator<T, boolean>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see takeRightWhile
   */
  takeRightWhile(
    predicate?: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see takeRightWhile
   */
  takeRightWhile<TWhere>(
    predicate?: TWhere
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see takeRightWhile
   */
  takeRightWhile<TValue>(
    predicate?: ListIterator<TValue, boolean>
  ): LoDashImplicitArrayWrapper<TValue>;

  /**
   * @see takeRightWhile
   */
  takeRightWhile<TValue>(
    predicate?: string
  ): LoDashImplicitArrayWrapper<TValue>;

  /**
   * @see takeRightWhile
   */
  takeRightWhile<TWhere, TValue>(
    predicate?: TWhere
  ): LoDashImplicitArrayWrapper<TValue>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see takeRightWhile
   */
  takeRightWhile(
    predicate?: ListIterator<T, boolean>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see takeRightWhile
   */
  takeRightWhile(
    predicate?: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see takeRightWhile
   */
  takeRightWhile<TWhere>(
    predicate?: TWhere
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see takeRightWhile
   */
  takeRightWhile<TValue>(
    predicate?: ListIterator<TValue, boolean>
  ): LoDashExplicitArrayWrapper<TValue>;

  /**
   * @see takeRightWhile
   */
  takeRightWhile<TValue>(
    predicate?: string
  ): LoDashExplicitArrayWrapper<TValue>;

  /**
   * @see takeRightWhile
   */
  takeRightWhile<TWhere, TValue>(
    predicate?: TWhere
  ): LoDashExplicitArrayWrapper<TValue>;
}

//takeWhile
interface LoDashStatic {
  /**
   * Creates a slice of array with elements taken from the beginning. Elements are taken until predicate returns
   * falsey. The predicate is bound to thisArg and invoked with three arguments: (value, index, array).
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param array The array to query.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the slice of array.
   */
  takeWhile<TValue>(
    array: List<TValue>,
    predicate?: ListIterator<TValue, boolean>
  ): TValue[];

  /**
   * @see takeWhile
   */
  takeWhile<TValue>(
    array: List<TValue>,
    predicate?: string
  ): TValue[];

  /**
   * @see takeWhile
   */
  takeWhile<TWhere, TValue>(
    array: List<TValue>,
    predicate?: TWhere
  ): TValue[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see takeWhile
   */
  takeWhile(
    predicate?: ListIterator<T, boolean>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see takeWhile
   */
  takeWhile(
    predicate?: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see takeWhile
   */
  takeWhile<TWhere>(
    predicate?: TWhere
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see takeWhile
   */
  takeWhile<TValue>(
    predicate?: ListIterator<TValue, boolean>
  ): LoDashImplicitArrayWrapper<TValue>;

  /**
   * @see takeWhile
   */
  takeWhile<TValue>(
    predicate?: string
  ): LoDashImplicitArrayWrapper<TValue>;

  /**
   * @see takeWhile
   */
  takeWhile<TWhere, TValue>(
    predicate?: TWhere
  ): LoDashImplicitArrayWrapper<TValue>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see takeWhile
   */
  takeWhile(
    predicate?: ListIterator<T, boolean>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see takeWhile
   */
  takeWhile(
    predicate?: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see takeWhile
   */
  takeWhile<TWhere>(
    predicate?: TWhere
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see takeWhile
   */
  takeWhile<TValue>(
    predicate?: ListIterator<TValue, boolean>
  ): LoDashExplicitArrayWrapper<TValue>;

  /**
   * @see takeWhile
   */
  takeWhile<TValue>(
    predicate?: string
  ): LoDashExplicitArrayWrapper<TValue>;

  /**
   * @see takeWhile
   */
  takeWhile<TWhere, TValue>(
    predicate?: TWhere
  ): LoDashExplicitArrayWrapper<TValue>;
}

//union
interface LoDashStatic {
  /**
   * Creates an array of unique values, in order, from all of the provided arrays using SameValueZero for
   * equality comparisons.
   *
   * @param arrays The arrays to inspect.
   * @return Returns the new array of combined values.
   */
  union<T>(...arrays: List<T>[]): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see union
   */
  union(...arrays: List<T>[]): LoDashImplicitArrayWrapper<T>;

  /**
   * @see union
   */
  union<T>(...arrays: List<T>[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see union
   */
  union<T>(...arrays: List<T>[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see union
   */
  union(...arrays: List<T>[]): LoDashExplicitArrayWrapper<T>;

  /**
   * @see union
   */
  union<T>(...arrays: List<T>[]): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see union
   */
  union<T>(...arrays: List<T>[]): LoDashExplicitArrayWrapper<T>;
}

//unionBy
interface LoDashStatic {
  /**
   * This method is like `union` except that it accepts `iteratee` which is
   * invoked for each element of each `arrays` to generate the criterion by which
   * uniqueness is computed. The iteratee is invoked with one argument: (value).
   *
   * @param arrays The arrays to inspect.
   * @param iteratee The iteratee invoked per element.
   * @return Returns the new array of combined values.
   */
  unionBy<T>(
    arrays: T[]|List<T>,
    iteratee?: (value: T) => any
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays1: T[]|List<T>,
    arrays2: T[]|List<T>,
    iteratee?: (value: T) => any
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays1: T[]|List<T>,
    arrays2: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays1: T[]|List<T>,
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: (value: T) => any
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays1: T[]|List<T>,
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays1: T[]|List<T>,
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: (value: T) => any
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays1: T[]|List<T>,
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays1: T[]|List<T>,
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: (value: T) => any
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays1: T[]|List<T>,
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: W
  ): T[];

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays: T[]|List<T>,
    ...iteratee: any[]
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see unionBy
   */
  unionBy<T>(
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    ...iteratee: any[]
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see unionBy
   */
  unionBy<T>(
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: W
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    ...iteratee: any[]
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see unionBy
   */
  unionBy<T>(
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    ...iteratee: any[]
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see unionBy
   */
  unionBy<T>(
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: (value: T) => any
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T, W extends Object>(
    arrays2: T[]|List<T>,
    arrays3: T[]|List<T>,
    arrays4: T[]|List<T>,
    arrays5: T[]|List<T>,
    iteratee?: W
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see unionBy
   */
  unionBy<T>(
    ...iteratee: any[]
  ): LoDashExplicitArrayWrapper<T>;
}

//uniq
interface LoDashStatic {
  /**
   * Creates a duplicate-free version of an array, using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons, in which only the first occurrence of each element
   * is kept.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to inspect.
   * @returns {Array} Returns the new duplicate free array.
   * @example
   *
   * uniq([2, 1, 2]);
   * // => [2, 1]
   */
  uniq<T>(
    array: List<T>
  ): T[];

  /**
   * @see uniq
   */
  uniq<T, TSort>(
    array: List<T>
  ): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see uniq
   */
  uniq<TSort>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see uniq
   */
  uniq<TSort>(): LoDashImplicitArrayWrapper<T>;

  /**
   * @see uniq
   */
  uniq(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  uniq<T>(): LoDashImplicitArrayWrapper<T>;

  /**
   * @see uniq
   */
  uniq<T, TSort>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see uniq
   */
  uniq<TSort>(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see uniq
   */
  uniq<TSort>(): LoDashExplicitArrayWrapper<T>;

  /**
   * @see uniq
   */
  uniq(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see uniq
   */
  uniq<T>(): LoDashExplicitArrayWrapper<T>;

  /**
   * @see uniq
   */
  uniq<T, TSort>(): LoDashExplicitArrayWrapper<T>;
}

//uniqBy
interface LoDashStatic {
  /**
   * This method is like `uniq` except that it accepts `iteratee` which is
   * invoked for each element in `array` to generate the criterion by which
   * uniqueness is computed. The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function|Object|string} [iteratee=identity] The iteratee invoked per element.
   * @returns {Array} Returns the new duplicate free array.
   * @example
   *
   * uniqBy([2.1, 1.2, 2.3], Math.floor);
   * // => [2.1, 1.2]
   *
   * // using the `property` iteratee shorthand
   * uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
   * // => [{ 'x': 1 }, { 'x': 2 }]
   */
  uniqBy<T>(
    array: List<T>,
    iteratee: ListIterator<T, any>
  ): T[];

  /**
   * @see uniqBy
   */
  uniqBy<T, TSort>(
    array: List<T>,
    iteratee: ListIterator<T, TSort>
  ): T[];

  /**
   * @see uniqBy
   */
  uniqBy<T>(
    array: List<T>,
    iteratee: string
  ): T[];

  /**
   * @see uniqBy
   */
  uniqBy<T>(
    array: List<T>,
    iteratee: Object
  ): T[];

  /**
   * @see uniqBy
   */
  uniqBy<TWhere extends {}, T>(
    array: List<T>,
    iteratee: TWhere
  ): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see uniqBy
   */
  uniqBy<TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see uniqBy
   */
  uniqBy<TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy(
    iteratee: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<TWhere extends {}>(
    iteratee: TWhere
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see uniqBy
   */
  uniqBy<T>(
    iteratee: ListIterator<T, any>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<T, TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<T>(
    iteratee: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<T>(
    iteratee: Object
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<TWhere extends {}, T>(
    iteratee: TWhere
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see uniqBy
   */
  uniqBy<TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see uniqBy
   */
  uniqBy<TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy(
    iteratee: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<TWhere extends {}>(
    iteratee: TWhere
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see uniqBy
   */
  uniqBy<T>(
    iteratee: ListIterator<T, any>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<T, TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<T>(
    iteratee: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<T>(
    iteratee: Object
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see uniqBy
   */
  uniqBy<TWhere extends {}, T>(
    iteratee: TWhere
  ): LoDashExplicitArrayWrapper<T>;
}

//sortedUniq
interface LoDashStatic {
  /**
   * This method is like `uniq` except that it's designed and optimized
   * for sorted arrays.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to inspect.
   * @returns {Array} Returns the new duplicate free array.
   * @example
   *
   * sortedUniq([1, 1, 2]);
   * // => [1, 2]
   */
  sortedUniq<T>(
    array: List<T>
  ): T[];

  /**
   * @see sortedUniq
   */
  sortedUniq<T, TSort>(
    array: List<T>
  ): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see sortedUniq
   */
  sortedUniq<TSort>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sortedUniq
   */
  sortedUniq<TSort>(): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortedUniq
   */
  sortedUniq(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  sortedUniq<T>(): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortedUniq
   */
  sortedUniq<T, TSort>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see sortedUniq
   */
  sortedUniq<TSort>(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sortedUniq
   */
  sortedUniq<TSort>(): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortedUniq
   */
  sortedUniq(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sortedUniq
   */
  sortedUniq<T>(): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortedUniq
   */
  sortedUniq<T, TSort>(): LoDashExplicitArrayWrapper<T>;
}

//sortedUniqBy
interface LoDashStatic {
  /**
   * This method is like `uniqBy` except that it's designed and optimized
   * for sorted arrays.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @returns {Array} Returns the new duplicate free array.
   * @example
   *
   * sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
   * // => [1.1, 2.2]
   */
  sortedUniqBy<T>(
    array: List<T>,
    iteratee: ListIterator<T, any>
  ): T[];

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T, TSort>(
    array: List<T>,
    iteratee: ListIterator<T, TSort>
  ): T[];

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T>(
    array: List<T>,
    iteratee: string
  ): T[];

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T>(
    array: List<T>,
    iteratee: Object
  ): T[];

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<TWhere extends {}, T>(
    array: List<T>,
    iteratee: TWhere
  ): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy(
    iteratee: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<TWhere extends {}>(
    iteratee: TWhere
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T>(
    iteratee: ListIterator<T, any>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T, TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T>(
    iteratee: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T>(
    iteratee: Object
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<TWhere extends {}, T>(
    iteratee: TWhere
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy(
    iteratee: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<TWhere extends {}>(
    iteratee: TWhere
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T>(
    iteratee: ListIterator<T, any>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T, TSort>(
    iteratee: ListIterator<T, TSort>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T>(
    iteratee: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<T>(
    iteratee: Object
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortedUniqBy
   */
  sortedUniqBy<TWhere extends {}, T>(
    iteratee: TWhere
  ): LoDashExplicitArrayWrapper<T>;
}

//unionWith DUMMY
interface LoDashStatic {
  /**
   * This method is like `union` except that it accepts `comparator` which
   * is invoked to compare elements of `arrays`. The comparator is invoked
   * with two arguments: (arrVal, othVal).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of combined values.
   * @example
   *
   * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
   * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
   *
   * unionWith(objects, others, isEqual);
   * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
   */
  unionWith(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//uniqWith DUMMY
interface LoDashStatic {
  /**
   * This method is like `uniq` except that it accepts `comparator` which
   * is invoked to compare elements of `array`. The comparator is invoked with
   * two arguments: (arrVal, othVal).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new duplicate free array.
   * @example
   *
   * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 },  { 'x': 1, 'y': 2 }];
   *
   * uniqWith(objects, isEqual);
   * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
   */
  uniqWith(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//unzip
interface LoDashStatic {
  /**
   * This method is like zip except that it accepts an array of grouped elements and creates an array
   * regrouping the elements to their pre-zip configuration.
   *
   * @param array The array of grouped elements to process.
   * @return Returns the new array of regrouped elements.
   */
  unzip<T>(array: List<List<T>>): T[][];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see unzip
   */
  unzip<T>(): LoDashImplicitArrayWrapper<T[]>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see unzip
   */
  unzip<T>(): LoDashImplicitArrayWrapper<T[]>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see unzip
   */
  unzip<T>(): LoDashExplicitArrayWrapper<T[]>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see unzip
   */
  unzip<T>(): LoDashExplicitArrayWrapper<T[]>;
}

//unzipWith
interface LoDashStatic {
  /**
   * This method is like unzip except that it accepts an iteratee to specify how regrouped values should be
   * combined. The iteratee is bound to thisArg and invoked with four arguments: (accumulator, value, index,
   * group).
   *
   * @param array The array of grouped elements to process.
   * @param iteratee The function to combine regrouped values.
   * @param thisArg The this binding of iteratee.
   * @return Returns the new array of regrouped elements.
   */
  unzipWith<TArray, TResult>(
    array: List<List<TArray>>,
    iteratee?: MemoIterator<TArray, TResult>
  ): TResult[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see unzipWith
   */
  unzipWith<TArr, TResult>(
    iteratee?: MemoIterator<TArr, TResult>
  ): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see unzipWith
   */
  unzipWith<TArr, TResult>(
    iteratee?: MemoIterator<TArr, TResult>
  ): LoDashImplicitArrayWrapper<TResult>;
}

//without
interface LoDashStatic {
  /**
   * Creates an array excluding all provided values using SameValueZero for equality comparisons.
   *
   * @param array The array to filter.
   * @param values The values to exclude.
   * @return Returns the new array of filtered values.
   */
  without<T>(
    array: List<T>,
    ...values: T[]
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see without
   */
  without(...values: T[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see without
   */
  without<T>(...values: T[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see without
   */
  without(...values: T[]): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see without
   */
  without<T>(...values: T[]): LoDashExplicitArrayWrapper<T>;
}

//xor
interface LoDashStatic {
  /**
   * Creates an array of unique values that is the symmetric difference of the provided arrays.
   *
   * @param arrays The arrays to inspect.
   * @return Returns the new array of values.
   */
  xor<T>(...arrays: List<T>[]): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see xor
   */
  xor(...arrays: List<T>[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see xor
   */
  xor<T>(...arrays: List<T>[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see xor
   */
  xor(...arrays: List<T>[]): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see xor
   */
  xor<T>(...arrays: List<T>[]): LoDashExplicitArrayWrapper<T>;
}

//xorBy DUMMY
interface LoDashStatic {
  /**
   * This method is like `xor` except that it accepts `iteratee` which is
   * invoked for each element of each `arrays` to generate the criterion by which
   * uniqueness is computed. The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @param {Function|Object|string} [iteratee=identity] The iteratee invoked per element.
   * @returns {Array} Returns the new array of values.
   * @example
   *
   * xorBy([2.1, 1.2], [4.3, 2.4], Math.floor);
   * // => [1.2, 4.3]
   *
   * // using the `property` iteratee shorthand
   * xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
   * // => [{ 'x': 2 }]
   */
  xorBy(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//xorWith DUMMY
interface LoDashStatic {
  /**
   * This method is like `xor` except that it accepts `comparator` which is
   * invoked to compare elements of `arrays`. The comparator is invoked with
   * two arguments: (arrVal, othVal).
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of values.
   * @example
   *
   * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
   * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
   *
   * xorWith(objects, others, isEqual);
   * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
   */
  xorWith(
    array: any[]|List<any>,
    ...values: any[]
  ): any[];
}

//zip
interface LoDashStatic {
  /**
   * Creates an array of grouped elements, the first of which contains the first elements of the given arrays,
   * the second of which contains the second elements of the given arrays, and so on.
   *
   * @param arrays The arrays to process.
   * @return Returns the new array of grouped elements.
   */
  zip<T>(...arrays: List<T>[]): T[][];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see zip
   */
  zip<T>(...arrays: List<T>[]): LoDashImplicitArrayWrapper<T[]>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see zip
   */
  zip<T>(...arrays: List<T>[]): LoDashImplicitArrayWrapper<T[]>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see zip
   */
  zip<T>(...arrays: List<T>[]): LoDashExplicitArrayWrapper<T[]>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see zip
   */
  zip<T>(...arrays: List<T>[]): LoDashExplicitArrayWrapper<T[]>;
}

//zipObject
interface LoDashStatic {
  /**
   * The inverse of pairs; this method returns an object composed from arrays of property names and values.
   * Provide either a single two dimensional array, e.g. [[key1, value1], [key2, value2]] or two arrays, one of
   * property names and one of corresponding values.
   *
   * @param props The property names.
   * @param values The property values.
   * @return Returns the new object.
   */
  zipObject<TValues, TResult extends {}>(
    props: List<StringRepresentable>|List<List<any>>,
    values?: List<TValues>
  ): TResult;

  /**
   * @see zipObject
   */
  zipObject<TResult extends {}>(
    props: List<StringRepresentable>|List<List<any>>,
    values?: List<any>
  ): TResult;

  /**
   * @see zipObject
   */
  zipObject(
    props: List<StringRepresentable>|List<List<any>>,
    values?: List<any>
  ): Dictionary<any>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see zipObject
   */
  zipObject<TValues, TResult extends {}>(
    values?: List<TValues>
  ): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see zipObject
   */
  zipObject<TResult extends {}>(
    values?: List<any>
  ): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see zipObject
   */
  zipObject(
    values?: List<any>
  ): LoDashImplicitObjectWrapper<Dictionary<any>>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see zipObject
   */
  zipObject<TValues, TResult extends {}>(
    values?: List<TValues>
  ): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see zipObject
   */
  zipObject<TResult extends {}>(
    values?: List<any>
  ): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see zipObject
   */
  zipObject(
    values?: List<any>
  ): LoDashImplicitObjectWrapper<Dictionary<any>>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see zipObject
   */
  zipObject<TValues, TResult extends {}>(
    values?: List<TValues>
  ): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see zipObject
   */
  zipObject<TResult extends {}>(
    values?: List<any>
  ): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see zipObject
   */
  zipObject(
    values?: List<any>
  ): LoDashExplicitObjectWrapper<Dictionary<any>>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see zipObject
   */
  zipObject<TValues, TResult extends {}>(
    values?: List<TValues>
  ): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see zipObject
   */
  zipObject<TResult extends {}>(
    values?: List<any>
  ): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see zipObject
   */
  zipObject(
    values?: List<any>
  ): LoDashExplicitObjectWrapper<Dictionary<any>>;
}

//zipWith
interface LoDashStatic {
  /**
   * This method is like zip except that it accepts an iteratee to specify how grouped values should be
   * combined. The iteratee is bound to thisArg and invoked with four arguments: (accumulator, value, index,
   * group).
   * @param {...Array} [arrays] The arrays to process.
   * @param {Function} [iteratee] The function to combine grouped values.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @return Returns the new array of grouped elements.
   */
  zipWith<TResult>(...args: any[]): TResult[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see zipWith
   */
  zipWith<TResult>(...args: any[]): LoDashImplicitArrayWrapper<TResult>;
}

/*********
 * Chain *
 *********/

//chain
interface LoDashStatic {
  /**
   * Creates a lodash object that wraps value with explicit method chaining enabled.
   *
   * @param value The value to wrap.
   * @return Returns the new lodash wrapper instance.
   */
  chain(value: number): LoDashExplicitWrapper<number>;
  chain(value: string): LoDashExplicitWrapper<string>;
  chain(value: boolean): LoDashExplicitWrapper<boolean>;
  chain<T>(value: T[]): LoDashExplicitArrayWrapper<T>;
  chain<T extends {}>(value: T): LoDashExplicitObjectWrapper<T>;
  chain(value: any): LoDashExplicitWrapper<any>;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see chain
   */
  chain(): LoDashExplicitWrapper<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see chain
   */
  chain(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see chain
   */
  chain(): LoDashExplicitObjectWrapper<T>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see chain
   */
  chain(): TWrapper;
}

//tap
interface LoDashStatic {
  /**
   * This method invokes interceptor and returns value. The interceptor is bound to thisArg and invoked with one
   * argument; (value). The purpose of this method is to "tap into" a method chain in order to perform operations
   * on intermediate results within the chain.
   *
   * @param value The value to provide to interceptor.
   * @param interceptor The function to invoke.
   * @parem thisArg The this binding of interceptor.
   * @return Returns value.
   **/
  tap<T>(
    value: T,
    interceptor: (value: T) => void
  ): T;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see tap
   */
  tap(
    interceptor: (value: T) => void
  ): TWrapper;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see tap
   */
  tap(
    interceptor: (value: T) => void
  ): TWrapper;
}

//thru
interface LoDashStatic {
  /**
   * This method is like tap except that it returns the result of interceptor.
   *
   * @param value The value to provide to interceptor.
   * @param interceptor The function to invoke.
   * @param thisArg The this binding of interceptor.
   * @return Returns the result of interceptor.
   */
  thru<T, TResult>(
    value: T,
    interceptor: (value: T) => TResult
  ): TResult;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see thru
   */
  thru<TResult extends number>(
    interceptor: (value: T) => TResult): LoDashImplicitWrapper<TResult>;

  /**
   * @see thru
   */
  thru<TResult extends string>(
    interceptor: (value: T) => TResult): LoDashImplicitWrapper<TResult>;

  /**
   * @see thru
   */
  thru<TResult extends boolean>(
    interceptor: (value: T) => TResult): LoDashImplicitWrapper<TResult>;

  /**
   * @see thru
   */
  thru<TResult extends {}>(
    interceptor: (value: T) => TResult): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see thru
   */
  thru<TResult>(
    interceptor: (value: T) => TResult[]): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see thru
   */
  thru<TResult extends number>(
    interceptor: (value: T) => TResult
  ): LoDashExplicitWrapper<TResult>;

  /**
   * @see thru
   */
  thru<TResult extends string>(
    interceptor: (value: T) => TResult
  ): LoDashExplicitWrapper<TResult>;

  /**
   * @see thru
   */
  thru<TResult extends boolean>(
    interceptor: (value: T) => TResult
  ): LoDashExplicitWrapper<TResult>;

  /**
   * @see thru
   */
  thru<TResult extends {}>(
    interceptor: (value: T) => TResult
  ): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see thru
   */
  thru<TResult>(
    interceptor: (value: T) => TResult[]
  ): LoDashExplicitArrayWrapper<TResult>;
}

//prototype.commit
interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * Executes the chained sequence and returns the wrapped result.
   *
   * @return Returns the new lodash wrapper instance.
   */
  commit(): TWrapper;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see commit
   */
  commit(): TWrapper;
}

//prototype.concat
interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * Creates a new array joining a wrapped array with any additional arrays and/or values.
   *
   * @param items
   * @return Returns the new concatenated array.
   */
  concat<TItem>(...items: Array<TItem|Array<TItem>>): LoDashImplicitArrayWrapper<TItem>;

  /**
   * @see concat
   */
  concat(...items: Array<T|Array<T>>): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see concat
   */
  concat<TItem>(...items: Array<TItem|Array<TItem>>): LoDashExplicitArrayWrapper<TItem>;

  /**
   * @see concat
   */
  concat(...items: Array<T|Array<T>>): LoDashExplicitArrayWrapper<T>;
}

//prototype.plant
interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * Creates a clone of the chained sequence planting value as the wrapped value.
   * @param value The value to plant as the wrapped value.
   * @return Returns the new lodash wrapper instance.
   */
  plant(value: number): LoDashImplicitWrapper<number>;

  /**
   * @see plant
   */
  plant(value: string): LoDashImplicitStringWrapper;

  /**
   * @see plant
   */
  plant(value: boolean): LoDashImplicitWrapper<boolean>;

  /**
   * @see plant
   */
  plant(value: number[]): LoDashImplicitNumberArrayWrapper;

  /**
   * @see plant
   */
  plant<T>(value: T[]): LoDashImplicitArrayWrapper<T>;

  /**
   * @see plant
   */
  plant<T extends {}>(value: T): LoDashImplicitObjectWrapper<T>;

  /**
   * @see plant
   */
  plant(value: any): LoDashImplicitWrapper<any>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see plant
   */
  plant(value: number): LoDashExplicitWrapper<number>;

  /**
   * @see plant
   */
  plant(value: string): LoDashExplicitStringWrapper;

  /**
   * @see plant
   */
  plant(value: boolean): LoDashExplicitWrapper<boolean>;

  /**
   * @see plant
   */
  plant(value: number[]): LoDashExplicitNumberArrayWrapper;

  /**
   * @see plant
   */
  plant<T>(value: T[]): LoDashExplicitArrayWrapper<T>;

  /**
   * @see plant
   */
  plant<T extends {}>(value: T): LoDashExplicitObjectWrapper<T>;

  /**
   * @see plant
   */
  plant(value: any): LoDashExplicitWrapper<any>;
}

//prototype.reverse
interface LoDashImplicitArrayWrapper<T> {
  /**
   * Reverses the wrapped array so the first element becomes the last, the second element becomes the second to
   * last, and so on.
   *
   * Note: This method mutates the wrapped array.
   *
   * @return Returns the new reversed lodash wrapper instance.
   */
  reverse(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see reverse
   */
  reverse(): LoDashExplicitArrayWrapper<T>;
}

//prototype.toJSON
interface LoDashWrapperBase<T, TWrapper> {
  /**
   * @see value
   */
  toJSON(): T;
}

//prototype.toString
interface LoDashWrapperBase<T, TWrapper> {
  /**
   * Produces the result of coercing the unwrapped value to a string.
   *
   * @return Returns the coerced string value.
   */
  toString(): string;
}

//prototype.value
interface LoDashWrapperBase<T, TWrapper> {
  /**
   * Executes the chained sequence to extract the unwrapped value.
   *
   * @alias toJSON, valueOf
   *
   * @return Returns the resolved unwrapped value.
   */
  value(): T;
}

//valueOf
interface LoDashWrapperBase<T, TWrapper> {
  /**
   * @see value
   */
  valueOf(): T;
}

/**************
 * Collection *
 **************/

//at
interface LoDashStatic {
  /**
   * Creates an array of elements corresponding to the given keys, or indexes, of collection. Keys may be
   * specified as individual arguments or as arrays of keys.
   *
   * @param collection The collection to iterate over.
   * @param props The property names or indexes of elements to pick, specified individually or in arrays.
   * @return Returns the new array of picked elements.
   */
  at<T>(
    collection: List<T>|Dictionary<T>,
    ...props: (number|string|(number|string)[])[]
  ): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see at
   */
  at(...props: (number|string|(number|string)[])[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see at
   */
  at<T>(...props: (number|string|(number|string)[])[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see at
   */
  at(...props: (number|string|(number|string)[])[]): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see at
   */
  at<T>(...props: (number|string|(number|string)[])[]): LoDashExplicitArrayWrapper<T>;
}

//countBy
interface LoDashStatic {
  /**
   * Creates an object composed of keys generated from the results of running each element of collection through
   * iteratee. The corresponding value of each key is the number of times the key was returned by iteratee. The
   * iteratee is bound to thisArg and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for iteratee the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for iteratee the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param collection The collection to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   * @return Returns the composed aggregate object.
   */
  countBy<T>(
    collection: List<T>,
    iteratee?: ListIterator<T, any>
  ): Dictionary<number>;

  /**
   * @see countBy
   */
  countBy<T>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<number>;

  /**
   * @see countBy
   */
  countBy<T>(
    collection: NumericDictionary<T>,
    iteratee?: NumericDictionaryIterator<T, any>
  ): Dictionary<number>;

  /**
   * @see countBy
   */
  countBy<T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    iteratee?: string
  ): Dictionary<number>;

  /**
   * @see countBy
   */
  countBy<W, T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    iteratee?: W
  ): Dictionary<number>;

  /**
   * @see countBy
   */
  countBy<T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    iteratee?: Object
  ): Dictionary<number>;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see countBy
   */
  countBy(
    iteratee?: ListIterator<T, any>
  ): LoDashImplicitObjectWrapper<Dictionary<number>>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see countBy
   */
  countBy(
    iteratee?: ListIterator<T, any>
  ): LoDashImplicitObjectWrapper<Dictionary<number>>;

  /**
   * @see countBy
   */
  countBy(
    iteratee?: string
  ): LoDashImplicitObjectWrapper<Dictionary<number>>;

  /**
   * @see countBy
   */
  countBy<W>(
    iteratee?: W
  ): LoDashImplicitObjectWrapper<Dictionary<number>>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see countBy
   */
  countBy<T>(
    iteratee?: ListIterator<T, any>|DictionaryIterator<T, any>|NumericDictionaryIterator<T, any>
  ): LoDashImplicitObjectWrapper<Dictionary<number>>;

  /**
   * @see countBy
   */
  countBy(
    iteratee?: string
  ): LoDashImplicitObjectWrapper<Dictionary<number>>;

  /**
   * @see countBy
   */
  countBy<W>(
    iteratee?: W
  ): LoDashImplicitObjectWrapper<Dictionary<number>>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see countBy
   */
  countBy(
    iteratee?: ListIterator<T, any>
  ): LoDashExplicitObjectWrapper<Dictionary<number>>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see countBy
   */
  countBy(
    iteratee?: ListIterator<T, any>
  ): LoDashExplicitObjectWrapper<Dictionary<number>>;

  /**
   * @see countBy
   */
  countBy(
    iteratee?: string
  ): LoDashExplicitObjectWrapper<Dictionary<number>>;

  /**
   * @see countBy
   */
  countBy<W>(
    iteratee?: W
  ): LoDashExplicitObjectWrapper<Dictionary<number>>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see countBy
   */
  countBy<T>(
    iteratee?: ListIterator<T, any>|DictionaryIterator<T, any>|NumericDictionaryIterator<T, any>
  ): LoDashExplicitObjectWrapper<Dictionary<number>>;

  /**
   * @see countBy
   */
  countBy(
    iteratee?: string
  ): LoDashExplicitObjectWrapper<Dictionary<number>>;

  /**
   * @see countBy
   */
  countBy<W>(
    iteratee?: W
  ): LoDashExplicitObjectWrapper<Dictionary<number>>;
}

//each
interface LoDashStatic {
  /**
   * @see forEach
   */
  each<T>(
    collection: T[],
    iteratee?: ListIterator<T, any>
  ): T[];

  /**
   * @see forEach
   */
  each<T>(
    collection: List<T>,
    iteratee?: ListIterator<T, any>
  ): List<T>;

  /**
   * @see forEach
   */
  each<T>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see forEach
   */
  each<T extends {}>(
    collection: T,
    iteratee?: ObjectIterator<any, any>
  ): T;

  /**
   * @see forEach
   */
  each<T extends {}, TValue>(
    collection: T,
    iteratee?: ObjectIterator<TValue, any>
  ): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see forEach
   */
  each(
    iteratee: ListIterator<string, any>
  ): LoDashImplicitWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see forEach
   */
  each(
    iteratee: ListIterator<T, any>
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see forEach
   */
  each<TValue>(
    iteratee?: ListIterator<TValue, any>|DictionaryIterator<TValue, any>
  ): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see forEach
   */
  each(
    iteratee: ListIterator<string, any>
  ): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see forEach
   */
  each(
    iteratee: ListIterator<T, any>
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see forEach
   */
  each<TValue>(
    iteratee?: ListIterator<TValue, any>|DictionaryIterator<TValue, any>
  ): LoDashExplicitObjectWrapper<T>;
}

//eachRight
interface LoDashStatic {
  /**
   * @see forEachRight
   */
  eachRight<T>(
    collection: T[],
    iteratee?: ListIterator<T, any>
  ): T[];

  /**
   * @see forEachRight
   */
  eachRight<T>(
    collection: List<T>,
    iteratee?: ListIterator<T, any>
  ): List<T>;

  /**
   * @see forEachRight
   */
  eachRight<T>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see forEachRight
   */
  eachRight<T extends {}>(
    collection: T,
    iteratee?: ObjectIterator<any, any>
  ): T;

  /**
   * @see forEachRight
   */
  eachRight<T extends {}, TValue>(
    collection: T,
    iteratee?: ObjectIterator<TValue, any>
  ): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see forEachRight
   */
  eachRight(
    iteratee: ListIterator<string, any>
  ): LoDashImplicitWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see forEachRight
   */
  eachRight(
    iteratee: ListIterator<T, any>
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see forEachRight
   */
  eachRight<TValue>(
    iteratee?: ListIterator<TValue, any>|DictionaryIterator<TValue, any>
  ): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see forEachRight
   */
  eachRight(
    iteratee: ListIterator<string, any>
  ): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see forEachRight
   */
  eachRight(
    iteratee: ListIterator<T, any>
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see forEachRight
   */
  eachRight<TValue>(
    iteratee?: ListIterator<TValue, any>|DictionaryIterator<TValue, any>
  ): LoDashExplicitObjectWrapper<T>;
}

//every
interface LoDashStatic {
  /**
   * Checks if predicate returns truthy for all elements of collection. Iteration is stopped once predicate
   * returns falsey. The predicate is invoked with three arguments: (value, index|key, collection).
   *
   * @param collection The collection to iterate over.
   * @param predicate The function invoked per iteration.
   * @return Returns true if all elements pass the predicate check, else false.
   */
  every<T>(
    collection: List<T>,
    predicate?: ListIterator<T, boolean>
  ): boolean;

  /**
   * @see every
   */
  every<T>(
    collection: Dictionary<T>,
    predicate?: DictionaryIterator<T, boolean>
  ): boolean;

  /**
   * @see every
   */
  every<T>(
    collection: NumericDictionary<T>,
    predicate?: NumericDictionaryIterator<T, boolean>
  ): boolean;

  /**
   * @see every
   */
  every<T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    predicate?: string|any[]
  ): boolean;

  /**
   * @see every
   */
  every<TObject extends {}, T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    predicate?: TObject
  ): boolean;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see every
   */
  every(
    predicate?: ListIterator<T, boolean>|NumericDictionaryIterator<T, boolean>
  ): boolean;

  /**
   * @see every
   */
  every(
    predicate?: string|any[]
  ): boolean;

  /**
   * @see every
   */
  every<TObject extends {}>(
    predicate?: TObject
  ): boolean;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see every
   */
  every<TResult>(
    predicate?: ListIterator<TResult, boolean>|DictionaryIterator<TResult, boolean>|NumericDictionaryIterator<T, boolean>
  ): boolean;

  /**
   * @see every
   */
  every(
    predicate?: string|any[]
  ): boolean;

  /**
   * @see every
   */
  every<TObject extends {}>(
    predicate?: TObject
  ): boolean;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see every
   */
  every(
    predicate?: ListIterator<T, boolean>|NumericDictionaryIterator<T, boolean>
  ): LoDashExplicitWrapper<boolean>;

  /**
   * @see every
   */
  every(
    predicate?: string|any[]
  ): LoDashExplicitWrapper<boolean>;

  /**
   * @see every
   */
  every<TObject extends {}>(
    predicate?: TObject
  ): LoDashExplicitWrapper<boolean>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see every
   */
  every<TResult>(
    predicate?: ListIterator<TResult, boolean>|DictionaryIterator<TResult, boolean>|NumericDictionaryIterator<T, boolean>
  ): LoDashExplicitWrapper<boolean>;

  /**
   * @see every
   */
  every(
    predicate?: string|any[]
  ): LoDashExplicitWrapper<boolean>;

  /**
   * @see every
   */
  every<TObject extends {}>(
    predicate?: TObject
  ): LoDashExplicitWrapper<boolean>;
}

//filter
interface LoDashStatic {
  /**
   * Iterates over elements of collection, returning an array of all elements predicate returns truthy for. The
   * predicate is bound to thisArg and invoked with three arguments: (value, index|key, collection).
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param collection The collection to iterate over.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the new filtered array.
   */
  filter<T>(
    collection: List<T>,
    predicate?: ListIterator<T, boolean>
  ): T[];

  /**
   * @see filter
   */
  filter<T>(
    collection: Dictionary<T>,
    predicate?: DictionaryIterator<T, boolean>
  ): T[];

  /**
   * @see filter
   */
  filter(
    collection: string,
    predicate?: StringIterator<boolean>
  ): string[];

  /**
   * @see filter
   */
  filter<T>(
    collection: List<T>|Dictionary<T>,
    predicate: string
  ): T[];

  /**
   * @see filter
   */
  filter<W extends {}, T>(
    collection: List<T>|Dictionary<T>,
    predicate: W
  ): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see filter
   */
  filter(
    predicate?: StringIterator<boolean>
  ): LoDashImplicitArrayWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see filter
   */
  filter(
    predicate: ListIterator<T, boolean>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see filter
   */
  filter(
    predicate: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see filter
   */
  filter<W>(predicate: W): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see filter
   */
  filter<T>(
    predicate: ListIterator<T, boolean>|DictionaryIterator<T, boolean>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see filter
   */
  filter<T>(
    predicate: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see filter
   */
  filter<W, T>(predicate: W): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see filter
   */
  filter(
    predicate?: StringIterator<boolean>
  ): LoDashExplicitArrayWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see filter
   */
  filter(
    predicate: ListIterator<T, boolean>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see filter
   */
  filter(
    predicate: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see filter
   */
  filter<W>(predicate: W): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see filter
   */
  filter<T>(
    predicate: ListIterator<T, boolean>|DictionaryIterator<T, boolean>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see filter
   */
  filter<T>(
    predicate: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see filter
   */
  filter<W, T>(predicate: W): LoDashExplicitArrayWrapper<T>;
}

//find
interface LoDashStatic {
  /**
   * Iterates over elements of collection, returning the first element predicate returns truthy for.
   * The predicate is bound to thisArg and invoked with three arguments: (value, index|key, collection).
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param collection The collection to search.
   * @param predicate The function invoked per iteration.
   * @param fromIndex The index to search from.
   * @return Returns the matched element, else undefined.
   */
  find<T>(
    collection: List<T>,
    predicate?: ListIterator<T, boolean>,
    fromIndex?: number
  ): T;

  /**
   * @see find
   */
  find<T>(
    collection: Dictionary<T>,
    predicate?: DictionaryIterator<T, boolean>,
    fromIndex?: number
  ): T;

  /**
   * @see find
   */
  find<T>(
    collection: List<T>|Dictionary<T>,
    predicate?: string,
    fromIndex?: number
  ): T;

  /**
   * @see find
   */
  find<TObject extends {}, T>(
    collection: List<T>|Dictionary<T>,
    predicate?: TObject,
    fromIndex?: number
  ): T;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see find
   */
  find(
    predicate?: ListIterator<T, boolean>,
    fromIndex?: number
  ): T;

  /**
   * @see find
   */
  find(
    predicate?: string,
    fromIndex?: number
  ): T;

  /**
   * @see find
   */
  find<TObject extends {}>(
    predicate?: TObject,
    fromIndex?: number
  ): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see find
   */
  find<TResult>(
    predicate?: ListIterator<TResult, boolean>|DictionaryIterator<TResult, boolean>,
    fromIndex?: number
  ): TResult;

  /**
   * @see find
   */
  find<TResult>(
    predicate?: string,
    fromIndex?: number
  ): TResult;

  /**
   * @see find
   */
  find<TObject extends {}, TResult>(
    predicate?: TObject,
    fromIndex?: number
  ): TResult;
}

//findLast
interface LoDashStatic {
  /**
   * This method is like find except that it iterates over elements of a collection from
   * right to left.
   * @param collection Searches for a value in this list.
   * @param callback The function called per iteration.
   * @param thisArg The this binding of callback.
   * @return The found element, else undefined.
   **/
  findLast<T>(
    collection: Array<T>,
    callback: ListIterator<T, boolean>): T;

  /**
   * @see find
   **/
  findLast<T>(
    collection: List<T>,
    callback: ListIterator<T, boolean>): T;

  /**
   * @see find
   **/
  findLast<T>(
    collection: Dictionary<T>,
    callback: DictionaryIterator<T, boolean>): T;

  /**
   * @see find
   * @param pluck style callback
   **/
  findLast<W, T>(
    collection: Array<T>,
    whereValue: W): T;

  /**
   * @see find
   * @param pluck style callback
   **/
  findLast<W, T>(
    collection: List<T>,
    whereValue: W): T;

  /**
   * @see find
   * @param pluck style callback
   **/
  findLast<W, T>(
    collection: Dictionary<T>,
    whereValue: W): T;

  /**
   * @see find
   * @param where style callback
   **/
  findLast<T>(
    collection: Array<T>,
    pluckValue: string): T;

  /**
   * @see find
   * @param where style callback
   **/
  findLast<T>(
    collection: List<T>,
    pluckValue: string): T;

  /**
   * @see find
   * @param where style callback
   **/
  findLast<T>(
    collection: Dictionary<T>,
    pluckValue: string): T;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see findLast
   */
  findLast(
    callback: ListIterator<T, boolean>): T;
  /**
   * @see findLast
   * @param where style callback
   */
  findLast<W>(
    whereValue: W): T;

  /**
   * @see findLast
   * @param where style callback
   */
  findLast(
    pluckValue: string): T;
}

//flatMap
interface LoDashStatic {
  /**
   * Creates an array of flattened values by running each element in collection through iteratee
   * and concating its result to the other mapped values. The iteratee is invoked with three arguments:
   * (value, index|key, collection).
   *
   * @param collection The collection to iterate over.
   * @param iteratee The function invoked per iteration.
   * @return Returns the new flattened array.
   */
  flatMap<T, TResult>(
    collection: List<T>,
    iteratee?: ListIterator<T, TResult|TResult[]>
  ): TResult[];

  /**
   * @see flatMap
   */
  flatMap<TResult>(
    collection: List<any>,
    iteratee?: ListIterator<any, TResult|TResult[]>
  ): TResult[];

  /**
   * @see flatMap
   */
  flatMap<T, TResult>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, TResult|TResult[]>
  ): TResult[];

  /**
   * @see flatMap
   */
  flatMap<TResult>(
    collection: Dictionary<any>,
    iteratee?: DictionaryIterator<any, TResult|TResult[]>
  ): TResult[];

  /**
   * @see flatMap
   */
  flatMap<T, TResult>(
    collection: NumericDictionary<T>,
    iteratee?: NumericDictionaryIterator<T, TResult|TResult[]>
  ): TResult[];

  /**
   * @see flatMap
   */
  flatMap<TResult>(
    collection: NumericDictionary<any>,
    iteratee?: NumericDictionaryIterator<any, TResult|TResult[]>
  ): TResult[];

  /**
   * @see flatMap
   */
  flatMap<TObject extends Object, TResult>(
    collection: TObject,
    iteratee?: ObjectIterator<any, TResult|TResult[]>
  ): TResult[];

  /**
   * @see flatMap
   */
  flatMap<TResult>(
    collection: Object,
    iteratee?: ObjectIterator<any, TResult|TResult[]>
  ): TResult[];

  /**
   * @see flatMap
   */
  flatMap<TWhere extends Object, TObject extends Object>(
    collection: TObject,
    iteratee: TWhere
  ): boolean[];

  /**
   * @see flatMap
   */
  flatMap<TObject extends Object, TResult>(
    collection: TObject,
    iteratee: Object|string
  ): TResult[];

  /**
   * @see flatMap
   */
  flatMap<TObject extends Object>(
    collection: TObject,
    iteratee: [string, any]
  ): boolean[];

  /**
   * @see flatMap
   */
  flatMap<TResult>(
    collection: string
  ): string[];

  /**
   * @see flatMap
   */
  flatMap<TResult>(
    collection: Object,
    iteratee?: Object|string
  ): TResult[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see flatMap
   */
  flatMap<TResult>(
    iteratee: ListIterator<string, TResult|TResult[]>
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see flatMap
   */
  flatMap(): LoDashImplicitArrayWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see flatMap
   */
  flatMap<TResult>(
    iteratee: ListIterator<T, TResult|TResult[]>|string
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see flatMap
   */
  flatMap<TWhere extends Object>(
    iteratee: TWhere
  ): LoDashImplicitArrayWrapper<boolean>;

  /**
   * @see flatMap
   */
  flatMap(
    iteratee: [string, any]
  ): LoDashImplicitArrayWrapper<boolean>;

  /**
   * @see flatMap
   */
  flatMap<TResult>(): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see flatMap
   */
  flatMap<T, TResult>(
    iteratee: ListIterator<T, TResult|TResult[]>|DictionaryIterator<T, TResult|TResult[]>|NumericDictionaryIterator<T, TResult|TResult[]>
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see flatMap
   */
  flatMap<TResult>(
    iteratee: ObjectIterator<any, TResult|TResult[]>|string
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see flatMap
   */
  flatMap<TWhere extends Object>(
    iteratee: TWhere
  ): LoDashImplicitArrayWrapper<boolean>;

  /**
   * @see flatMap
   */
  flatMap(
    iteratee: [string, any]
  ): LoDashImplicitArrayWrapper<boolean>;

  /**
   * @see flatMap
   */
  flatMap<TResult>(): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see flatMap
   */
  flatMap<TResult>(
    iteratee: ListIterator<string, TResult|TResult[]>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see flatMap
   */
  flatMap(): LoDashExplicitArrayWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see flatMap
   */
  flatMap<TResult>(
    iteratee: ListIterator<T, TResult|TResult[]>|string
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see flatMap
   */
  flatMap<TWhere extends Object>(
    iteratee: TWhere
  ): LoDashExplicitArrayWrapper<boolean>;

  /**
   * @see flatMap
   */
  flatMap(
    iteratee: [string, any]
  ): LoDashExplicitArrayWrapper<boolean>;

  /**
   * @see flatMap
   */
  flatMap<TResult>(): LoDashExplicitArrayWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see flatMap
   */
  flatMap<T, TResult>(
    iteratee: ListIterator<T, TResult|TResult[]>|DictionaryIterator<T, TResult|TResult[]>|NumericDictionaryIterator<T, TResult|TResult[]>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see flatMap
   */
  flatMap<TResult>(
    iteratee: ObjectIterator<any, TResult|TResult[]>|string
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see flatMap
   */
  flatMap<TWhere extends Object>(
    iteratee: TWhere
  ): LoDashExplicitArrayWrapper<boolean>;

  /**
   * @see flatMap
   */
  flatMap(
    iteratee: [string, any]
  ): LoDashExplicitArrayWrapper<boolean>;

  /**
   * @see flatMap
   */
  flatMap<TResult>(): LoDashExplicitArrayWrapper<TResult>;
}

//forEach
interface LoDashStatic {
  /**
   * Iterates over elements of collection invoking iteratee for each element. The iteratee is bound to thisArg
   * and invoked with three arguments:
   * (value, index|key, collection). Iteratee functions may exit iteration early by explicitly returning false.
   *
   * Note: As with other "Collections" methods, objects with a "length" property are iterated like arrays. To
   * avoid this behavior forIn or forOwn may be used for object iteration.
   *
   * @alias each
   *
   * @param collection The collection to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   */
  forEach<T>(
    collection: T[],
    iteratee?: ListIterator<T, any>
  ): T[];

  /**
   * @see forEach
   */
  forEach<T>(
    collection: List<T>,
    iteratee?: ListIterator<T, any>
  ): List<T>;

  /**
   * @see forEach
   */
  forEach<T>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see forEach
   */
  forEach<T extends {}>(
    collection: T,
    iteratee?: ObjectIterator<any, any>
  ): T;

  /**
   * @see forEach
   */
  forEach<T extends {}, TValue>(
    collection: T,
    iteratee?: ObjectIterator<TValue, any>
  ): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see forEach
   */
  forEach(
    iteratee: ListIterator<string, any>
  ): LoDashImplicitWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see forEach
   */
  forEach(
    iteratee: ListIterator<T, any>
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see forEach
   */
  forEach<TValue>(
    iteratee?: ListIterator<TValue, any>|DictionaryIterator<TValue, any>
  ): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see forEach
   */
  forEach(
    iteratee: ListIterator<string, any>
  ): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see forEach
   */
  forEach(
    iteratee: ListIterator<T, any>
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see forEach
   */
  forEach<TValue>(
    iteratee?: ListIterator<TValue, any>|DictionaryIterator<TValue, any>
  ): LoDashExplicitObjectWrapper<T>;
}

//forEachRight
interface LoDashStatic {
  /**
   * This method is like forEach except that it iterates over elements of collection from right to left.
   *
   * @alias eachRight
   *
   * @param collection The collection to iterate over.
   * @param iteratee The function called per iteration.
   * @param thisArg The this binding of callback.
   */
  forEachRight<T>(
    collection: T[],
    iteratee?: ListIterator<T, any>
  ): T[];

  /**
   * @see forEachRight
   */
  forEachRight<T>(
    collection: List<T>,
    iteratee?: ListIterator<T, any>
  ): List<T>;

  /**
   * @see forEachRight
   */
  forEachRight<T>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see forEachRight
   */
  forEachRight<T extends {}>(
    collection: T,
    iteratee?: ObjectIterator<any, any>
  ): T;

  /**
   * @see forEachRight
   */
  forEachRight<T extends {}, TValue>(
    collection: T,
    iteratee?: ObjectIterator<TValue, any>
  ): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see forEachRight
   */
  forEachRight(
    iteratee: ListIterator<string, any>
  ): LoDashImplicitWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see forEachRight
   */
  forEachRight(
    iteratee: ListIterator<T, any>
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see forEachRight
   */
  forEachRight<TValue>(
    iteratee?: ListIterator<TValue, any>|DictionaryIterator<TValue, any>
  ): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see forEachRight
   */
  forEachRight(
    iteratee: ListIterator<string, any>
  ): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see forEachRight
   */
  forEachRight(
    iteratee: ListIterator<T, any>
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see forEachRight
   */
  forEachRight<TValue>(
    iteratee?: ListIterator<TValue, any>|DictionaryIterator<TValue, any>
  ): LoDashExplicitObjectWrapper<T>;
}

//groupBy
interface LoDashStatic {
  /**
   * Creates an object composed of keys generated from the results of running each element of collection through
   * iteratee. The corresponding value of each key is an array of the elements responsible for generating the
   * key. The iteratee is bound to thisArg and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for iteratee the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for iteratee the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param collection The collection to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   * @return Returns the composed aggregate object.
   */
  groupBy<T, TKey>(
    collection: List<T>,
    iteratee?: ListIterator<T, TKey>
  ): Dictionary<T[]>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    collection: List<any>,
    iteratee?: ListIterator<T, any>
  ): Dictionary<T[]>;

  /**
   * @see groupBy
   */
  groupBy<T, TKey>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, TKey>
  ): Dictionary<T[]>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    collection: Dictionary<any>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T[]>;

  /**
   * @see groupBy
   */
  groupBy<T, TValue>(
    collection: List<T>|Dictionary<T>,
    iteratee?: string
  ): Dictionary<T[]>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    collection: List<T>|Dictionary<T>,
    iteratee?: string
  ): Dictionary<T[]>;

  /**
   * @see groupBy
   */
  groupBy<TWhere, T>(
    collection: List<T>|Dictionary<T>,
    iteratee?: TWhere
  ): Dictionary<T[]>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    collection: List<T>|Dictionary<T>,
    iteratee?: Object
  ): Dictionary<T[]>;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see groupBy
   */
  groupBy<TKey>(
    iteratee?: ListIterator<T, TKey>
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see groupBy
   */
  groupBy<TKey>(
    iteratee?: ListIterator<T, TKey>
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<TValue>(
    iteratee?: string
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<TWhere>(
    iteratee?: TWhere
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see groupBy
   */
  groupBy<T, TKey>(
    iteratee?: ListIterator<T, TKey>|DictionaryIterator<T, TKey>
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    iteratee?: ListIterator<T, any>|DictionaryIterator<T, any>
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<T, TValue>(
    iteratee?: string
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    iteratee?: string
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<TWhere, T>(
    iteratee?: TWhere
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    iteratee?: Object
  ): LoDashImplicitObjectWrapper<Dictionary<T[]>>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see groupBy
   */
  groupBy<TKey>(
    iteratee?: ListIterator<T, TKey>
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see groupBy
   */
  groupBy<TKey>(
    iteratee?: ListIterator<T, TKey>
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<TValue>(
    iteratee?: string
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<TWhere>(
    iteratee?: TWhere
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see groupBy
   */
  groupBy<T, TKey>(
    iteratee?: ListIterator<T, TKey>|DictionaryIterator<T, TKey>
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    iteratee?: ListIterator<T, any>|DictionaryIterator<T, any>
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<T, TValue>(
    iteratee?: string
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    iteratee?: string
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<TWhere, T>(
    iteratee?: TWhere
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;

  /**
   * @see groupBy
   */
  groupBy<T>(
    iteratee?: Object
  ): LoDashExplicitObjectWrapper<Dictionary<T[]>>;
}

//includes
interface LoDashStatic {
  /**
   * Checks if target is in collection using SameValueZero for equality comparisons. If fromIndex is negative,
   * it’s used as the offset from the end of collection.
   *
   * @param collection The collection to search.
   * @param target The value to search for.
   * @param fromIndex The index to search from.
   * @return True if the target element is found, else false.
   */
  includes<T>(
    collection: List<T>|Dictionary<T>,
    target: T,
    fromIndex?: number
  ): boolean;

  /**
   * @see includes
   */
  includes(
    collection: string,
    target: string,
    fromIndex?: number
  ): boolean;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see includes
   */
  includes(
    target: T,
    fromIndex?: number
  ): boolean;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see includes
   */
  includes<TValue>(
    target: TValue,
    fromIndex?: number
  ): boolean;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see includes
   */
  includes(
    target: string,
    fromIndex?: number
  ): boolean;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see includes
   */
  includes(
    target: T,
    fromIndex?: number
  ): LoDashExplicitWrapper<boolean>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see includes
   */
  includes<TValue>(
    target: TValue,
    fromIndex?: number
  ): LoDashExplicitWrapper<boolean>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see includes
   */
  includes(
    target: string,
    fromIndex?: number
  ): LoDashExplicitWrapper<boolean>;
}

//keyBy
interface LoDashStatic {
  /**
   * Creates an object composed of keys generated from the results of running each element of collection through
   * iteratee. The corresponding value of each key is the last element responsible for generating the key. The
   * iteratee function is bound to thisArg and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for iteratee the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for iteratee the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param collection The collection to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   * @return Returns the composed aggregate object.
   */
  keyBy<T>(
    collection: List<T>,
    iteratee?: ListIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see keyBy
   */
  keyBy<T>(
    collection: NumericDictionary<T>,
    iteratee?: NumericDictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see keyBy
   */
  keyBy<T>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see keyBy
   */
  keyBy<T>(
    collection: List<T>|NumericDictionary<T>|Dictionary<T>,
    iteratee?: string
  ): Dictionary<T>;

  /**
   * @see keyBy
   */
  keyBy<W extends Object, T>(
    collection: List<T>|NumericDictionary<T>|Dictionary<T>,
    iteratee?: W
  ): Dictionary<T>;

  /**
   * @see keyBy
   */
  keyBy<T>(
    collection: List<T>|NumericDictionary<T>|Dictionary<T>,
    iteratee?: Object
  ): Dictionary<T>;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see keyBy
   */
  keyBy(
    iteratee?: ListIterator<T, any>
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see keyBy
   */
  keyBy(
    iteratee?: ListIterator<T, any>
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy(
    iteratee?: string
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy<W extends Object>(
    iteratee?: W
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see keyBy
   */
  keyBy<T>(
    iteratee?: ListIterator<T, any>|NumericDictionaryIterator<T, any>|DictionaryIterator<T, any>
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy<T>(
    iteratee?: string
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy<W extends Object, T>(
    iteratee?: W
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy<T>(
    iteratee?: Object
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see keyBy
   */
  keyBy(
    iteratee?: ListIterator<T, any>
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see keyBy
   */
  keyBy(
    iteratee?: ListIterator<T, any>
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy(
    iteratee?: string
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy<W extends Object>(
    iteratee?: W
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see keyBy
   */
  keyBy<T>(
    iteratee?: ListIterator<T, any>|NumericDictionaryIterator<T, any>|DictionaryIterator<T, any>
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy<T>(
    iteratee?: string
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy<W extends Object, T>(
    iteratee?: W
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see keyBy
   */
  keyBy<T>(
    iteratee?: Object
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;
}

//invoke
interface LoDashStatic {
  /**
   * Invokes the method at path of object.
   * @param object The object to query.
   * @param path The path of the method to invoke.
   * @param args The arguments to invoke the method with.
   **/
  invoke<TObject extends Object, TResult>(
    object: TObject,
    path: StringRepresentable|StringRepresentable[],
    ...args: any[]): TResult;

  /**
   * @see invoke
   **/
  invoke<TValue, TResult>(
    object: Dictionary<TValue>|TValue[],
    path: StringRepresentable|StringRepresentable[],
    ...args: any[]): TResult;

  /**
   * @see invoke
   **/
  invoke<TResult>(
    object: any,
    path: StringRepresentable|StringRepresentable[],
    ...args: any[]): TResult;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see invoke
   **/
  invoke<TResult>(
    path: StringRepresentable|StringRepresentable[],
    ...args: any[]): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see invoke
   **/
  invoke<TResult>(
    path: StringRepresentable|StringRepresentable[],
    ...args: any[]): TResult;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see invoke
   **/
  invoke<TResult>(
    path: StringRepresentable|StringRepresentable[],
    ...args: any[]): TResult;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see invoke
   **/
  invoke<TResult>(
    path: StringRepresentable|StringRepresentable[],
    ...args: any[]): TResult;
}

//invokeMap
interface LoDashStatic {
  /**
   * Invokes the method named by methodName on each element in the collection returning
   * an array of the results of each invoked method. Additional arguments will be provided
   * to each invoked method. If methodName is a function it will be invoked for, and this
   * bound to, each element in the collection.
   * @param collection The collection to iterate over.
   * @param methodName The name of the method to invoke.
   * @param args Arguments to invoke the method with.
   **/
  invokeMap<TValue extends {}, TResult>(
    collection: TValue[],
    methodName: string,
    ...args: any[]): TResult[];

  /**
   * @see invokeMap
   **/
  invokeMap<TValue extends {}, TResult>(
    collection: Dictionary<TValue>,
    methodName: string,
    ...args: any[]): TResult[];

  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    collection: {}[],
    methodName: string,
    ...args: any[]): TResult[];

  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    collection: Dictionary<{}>,
    methodName: string,
    ...args: any[]): TResult[];

  /**
   * @see invokeMap
   **/
  invokeMap<TValue extends {}, TResult>(
    collection: TValue[],
    method: (...args: any[]) => TResult,
    ...args: any[]): TResult[];

  /**
   * @see invokeMap
   **/
  invokeMap<TValue extends {}, TResult>(
    collection: Dictionary<TValue>,
    method: (...args: any[]) => TResult,
    ...args: any[]): TResult[];

  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    collection: {}[],
    method: (...args: any[]) => TResult,
    ...args: any[]): TResult[];

  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    collection: Dictionary<{}>,
    method: (...args: any[]) => TResult,
    ...args: any[]): TResult[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    methodName: string,
    ...args: any[]): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    method: (...args: any[]) => TResult,
    ...args: any[]): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    methodName: string,
    ...args: any[]): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    method: (...args: any[]) => TResult,
    ...args: any[]): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    methodName: string,
    ...args: any[]): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    method: (...args: any[]) => TResult,
    ...args: any[]): LoDashExplicitArrayWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    methodName: string,
    ...args: any[]): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see invokeMap
   **/
  invokeMap<TResult>(
    method: (...args: any[]) => TResult,
    ...args: any[]): LoDashExplicitArrayWrapper<TResult>;
}

//map
interface LoDashStatic {
  /**
   * Creates an array of values by running each element in collection through iteratee. The iteratee is bound to
   * thisArg and invoked with three arguments: (value, index|key, collection).
   *
   * If a property name is provided for iteratee the created property style callback returns the property value
   * of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for iteratee the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * Many lodash methods are guarded to work as iteratees for methods like every, filter, map, mapValues,
   * reject, and some.
   *
   * The guarded methods are:
   * ary, callback, chunk, clone, create, curry, curryRight, drop, dropRight, every, fill, flatten, invert, max,
   * min, parseInt, slice, sortBy, take, takeRight, template, trim, trimLeft, trimRight, trunc, random, range,
   * sample, some, sum, uniq, and words
   *
   * @param collection The collection to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   * @return Returns the new mapped array.
   */
  map<T, TResult>(
    collection: List<T>,
    iteratee?: ListIterator<T, TResult>
  ): TResult[];

  /**
   * @see map
   */
  map<T extends {}, TResult>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, TResult>
  ): TResult[];

  map<T extends {}, TResult>(
    collection: NumericDictionary<T>,
    iteratee?: NumericDictionaryIterator<T, TResult>
  ): TResult[];

  /**
   * @see map
   */
  map<T, TResult>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    iteratee?: string
  ): TResult[];

  /**
   * @see map
   */
  map<T, TObject extends {}>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    iteratee?: TObject
  ): boolean[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see map
   */
  map<TResult>(
    iteratee?: ListIterator<T, TResult>
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see map
   */
  map<TResult>(
    iteratee?: string
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see map
   */
  map<TObject extends {}>(
    iteratee?: TObject
  ): LoDashImplicitArrayWrapper<boolean>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see map
   */
  map<TValue, TResult>(
    iteratee?: ListIterator<TValue, TResult>|DictionaryIterator<TValue, TResult>
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see map
   */
  map<TValue, TResult>(
    iteratee?: string
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see map
   */
  map<TObject extends {}>(
    iteratee?: TObject
  ): LoDashImplicitArrayWrapper<boolean>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see map
   */
  map<TResult>(
    iteratee?: ListIterator<T, TResult>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see map
   */
  map<TResult>(
    iteratee?: string
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see map
   */
  map<TObject extends {}>(
    iteratee?: TObject
  ): LoDashExplicitArrayWrapper<boolean>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see map
   */
  map<TValue, TResult>(
    iteratee?: ListIterator<TValue, TResult>|DictionaryIterator<TValue, TResult>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see map
   */
  map<TValue, TResult>(
    iteratee?: string
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see map
   */
  map<TObject extends {}>(
    iteratee?: TObject
  ): LoDashExplicitArrayWrapper<boolean>;
}

//partition
interface LoDashStatic {
  /**
   * Creates an array of elements split into two groups, the first of which contains elements predicate returns truthy for,
   * while the second of which contains elements predicate returns falsey for.
   * The predicate is bound to thisArg and invoked with three arguments: (value, index|key, collection).
   *
   * If a property name is provided for predicate the created property style callback
   * returns the property value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback
   * returns true for elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns
   * true for elements that have the properties of the given object, else false.
   *
   * @param collection The collection to iterate over.
   * @param callback The function called per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the array of grouped elements.
   **/
  partition<T>(
    collection: List<T>,
    callback: ListIterator<T, boolean>): T[][];

  /**
   * @see partition
   **/
  partition<T>(
    collection: Dictionary<T>,
    callback: DictionaryIterator<T, boolean>): T[][];

  /**
   * @see partition
   **/
  partition<W, T>(
    collection: List<T>,
    whereValue: W): T[][];

  /**
   * @see partition
   **/
  partition<W, T>(
    collection: Dictionary<T>,
    whereValue: W): T[][];

  /**
   * @see partition
   **/
  partition<T>(
    collection: List<T>,
    path: string,
    srcValue: any): T[][];

  /**
   * @see partition
   **/
  partition<T>(
    collection: Dictionary<T>,
    path: string,
    srcValue: any): T[][];

  /**
   * @see partition
   **/
  partition<T>(
    collection: List<T>,
    pluckValue: string): T[][];

  /**
   * @see partition
   **/
  partition<T>(
    collection: Dictionary<T>,
    pluckValue: string): T[][];
}

interface LoDashImplicitStringWrapper {
  /**
   * @see partition
   */
  partition(
    callback: ListIterator<string, boolean>): LoDashImplicitArrayWrapper<string[]>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see partition
   */
  partition(
    callback: ListIterator<T, boolean>): LoDashImplicitArrayWrapper<T[]>;
  /**
   * @see partition
   */
  partition<W>(
    whereValue: W): LoDashImplicitArrayWrapper<T[]>;
  /**
   * @see partition
   */
  partition(
    path: string,
    srcValue: any): LoDashImplicitArrayWrapper<T[]>;
  /**
   * @see partition
   */
  partition(
    pluckValue: string): LoDashImplicitArrayWrapper<T[]>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see partition
   */
  partition<TResult>(
    callback: ListIterator<TResult, boolean>): LoDashImplicitArrayWrapper<TResult[]>;

  /**
   * @see partition
   */
  partition<TResult>(
    callback: DictionaryIterator<TResult, boolean>): LoDashImplicitArrayWrapper<TResult[]>;

  /**
   * @see partition
   */
  partition<W, TResult>(
    whereValue: W): LoDashImplicitArrayWrapper<TResult[]>;

  /**
   * @see partition
   */
  partition<TResult>(
    path: string,
    srcValue: any): LoDashImplicitArrayWrapper<TResult[]>;

  /**
   * @see partition
   */
  partition<TResult>(
    pluckValue: string): LoDashImplicitArrayWrapper<TResult[]>;
}

//reduce
interface LoDashStatic {
  /**
   * Reduces a collection to a value which is the accumulated result of running each
   * element in the collection through the callback, where each successive callback execution
   * consumes the return value of the previous execution. If accumulator is not provided the
   * first element of the collection will be used as the initial accumulator value. The callback
   * is bound to thisArg and invoked with four arguments; (accumulator, value, index|key, collection).
   * @param collection The collection to iterate over.
   * @param callback The function called per iteration.
   * @param accumulator Initial value of the accumulator.
   * @param thisArg The this binding of callback.
   * @return Returns the accumulated value.
   **/
  reduce<T, TResult>(
    collection: Array<T>,
    callback: MemoIterator<T, TResult>,
    accumulator: TResult): TResult;

  /**
   * @see reduce
   **/
  reduce<T, TResult>(
    collection: List<T>,
    callback: MemoIterator<T, TResult>,
    accumulator: TResult): TResult;

  /**
   * @see reduce
   **/
  reduce<T, TResult>(
    collection: Dictionary<T>,
    callback: MemoIterator<T, TResult>,
    accumulator: TResult): TResult;

  /**
   * @see reduce
   **/
  reduce<T, TResult>(
    collection: NumericDictionary<T>,
    callback: MemoIterator<T, TResult>,
    accumulator: TResult): TResult;

  /**
   * @see reduce
   **/
  reduce<T, TResult>(
    collection: Array<T>,
    callback: MemoIterator<T, TResult>): TResult;

  /**
   * @see reduce
   **/
  reduce<T, TResult>(
    collection: List<T>,
    callback: MemoIterator<T, TResult>): TResult;

  /**
   * @see reduce
   **/
  reduce<T, TResult>(
    collection: Dictionary<T>,
    callback: MemoIterator<T, TResult>): TResult;

  /**
   * @see reduce
   **/
  reduce<T, TResult>(
    collection: NumericDictionary<T>,
    callback: MemoIterator<T, TResult>): TResult;

}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see reduce
   **/
  reduce<TResult>(
    callback: MemoIterator<T, TResult>,
    accumulator: TResult): TResult;

  /**
   * @see reduce
   **/
  reduce<TResult>(
    callback: MemoIterator<T, TResult>): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see reduce
   **/
  reduce<TValue, TResult>(
    callback: MemoIterator<TValue, TResult>,
    accumulator: TResult): TResult;

  /**
   * @see reduce
   **/
  reduce<TValue, TResult>(
    callback: MemoIterator<TValue, TResult>): TResult;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see reduce
   **/
  reduce<TValue, TResult>(
    callback: MemoIterator<TValue, TResult>,
    accumulator: TResult): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see reduce
   **/
  reduce<TValue, TResult>(
    callback: MemoIterator<TValue, TResult>): LoDashExplicitObjectWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**LoDashExplicitWrapper
   * @see reduce
   */
  reduce<TResult>(
    callback: MemoIterator<T, TResult>,
    accumulator: TResult): LoDashExplicitWrapper<TResult>;

  /**
   * @see reduce
   */
  reduce<TResult>(
    callback: MemoIterator<T, TResult>): LoDashExplicitWrapper<TResult>;
}

//reduceRight
interface LoDashStatic {
  /**
   * This method is like reduce except that it iterates over elements of a collection from
   * right to left.
   * @param collection The collection to iterate over.
   * @param callback The function called per iteration.
   * @param accumulator Initial value of the accumulator.
   * @param thisArg The this binding of callback.
   * @return The accumulated value.
   **/
  reduceRight<T, TResult>(
    collection: Array<T>,
    callback: MemoIterator<T, TResult>,
    accumulator: TResult): TResult;

  /**
   * @see reduceRight
   **/
  reduceRight<T, TResult>(
    collection: List<T>,
    callback: MemoIterator<T, TResult>,
    accumulator: TResult): TResult;

  /**
   * @see reduceRight
   **/
  reduceRight<T, TResult>(
    collection: Dictionary<T>,
    callback: MemoIterator<T, TResult>,
    accumulator: TResult): TResult;

  /**
   * @see reduceRight
   **/
  reduceRight<T, TResult>(
    collection: Array<T>,
    callback: MemoIterator<T, TResult>): TResult;

  /**
   * @see reduceRight
   **/
  reduceRight<T, TResult>(
    collection: List<T>,
    callback: MemoIterator<T, TResult>): TResult;

  /**
   * @see reduceRight
   **/
  reduceRight<T, TResult>(
    collection: Dictionary<T>,
    callback: MemoIterator<T, TResult>): TResult;
}

//reject
interface LoDashStatic {
  /**
   * The opposite of filter; this method returns the elements of collection that predicate does not return
   * truthy for.
   *
   * @param collection The collection to iterate over.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the new filtered array.
   */
  reject<T>(
    collection: List<T>,
    predicate?: ListIterator<T, boolean>
  ): T[];

  /**
   * @see reject
   */
  reject<T>(
    collection: Dictionary<T>,
    predicate?: DictionaryIterator<T, boolean>
  ): T[];

  /**
   * @see reject
   */
  reject(
    collection: string,
    predicate?: StringIterator<boolean>
  ): string[];

  /**
   * @see reject
   */
  reject<T>(
    collection: List<T>|Dictionary<T>,
    predicate: string
  ): T[];

  /**
   * @see reject
   */
  reject<W extends {}, T>(
    collection: List<T>|Dictionary<T>,
    predicate: W
  ): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see reject
   */
  reject(
    predicate?: StringIterator<boolean>
  ): LoDashImplicitArrayWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see reject
   */
  reject(
    predicate: ListIterator<T, boolean>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see reject
   */
  reject(
    predicate: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see reject
   */
  reject<W>(predicate: W): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see reject
   */
  reject<T>(
    predicate: ListIterator<T, boolean>|DictionaryIterator<T, boolean>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see reject
   */
  reject<T>(
    predicate: string
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see reject
   */
  reject<W, T>(predicate: W): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see reject
   */
  reject(
    predicate?: StringIterator<boolean>
  ): LoDashExplicitArrayWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see reject
   */
  reject(
    predicate: ListIterator<T, boolean>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see reject
   */
  reject(
    predicate: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see reject
   */
  reject<W>(predicate: W): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see reject
   */
  reject<T>(
    predicate: ListIterator<T, boolean>|DictionaryIterator<T, boolean>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see reject
   */
  reject<T>(
    predicate: string
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see reject
   */
  reject<W, T>(predicate: W): LoDashExplicitArrayWrapper<T>;
}

//sample
interface LoDashStatic {
  /**
   * Gets a random element from collection.
   *
   * @param collection The collection to sample.
   * @return Returns the random element.
   */
  sample<T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>
  ): T;

  /**
   * @see sample
   */
  sample<O extends Object, T>(
    collection: O
  ): T;

  /**
   * @see sample
   */
  sample<T>(
    collection: Object
  ): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see sample
   */
  sample(): string;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sample
   */
  sample(): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sample
   */
  sample<T>(): T;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see sample
   */
  sample(): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sample
   */
  sample<TWrapper>(): TWrapper;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sample
   */
  sample<TWrapper>(): TWrapper;
}

//sampleSize
interface LoDashStatic {
  /**
   * Gets n random elements at unique keys from collection up to the size of collection.
   *
   * @param collection The collection to sample.
   * @param n The number of elements to sample.
   * @return Returns the random elements.
   */
  sampleSize<T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    n?: number
  ): T[];

  /**
   * @see sampleSize
   */
  sampleSize<O extends Object, T>(
    collection: O,
    n?: number
  ): T[];

  /**
   * @see sampleSize
   */
  sampleSize<T>(
    collection: Object,
    n?: number
  ): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see sampleSize
   */
  sampleSize(
    n?: number
  ): LoDashImplicitArrayWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sampleSize
   */
  sampleSize(
    n?: number
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sampleSize
   */
  sampleSize<T>(
    n?: number
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see sampleSize
   */
  sampleSize(
    n?: number
  ): LoDashExplicitArrayWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sampleSize
   */
  sampleSize(
    n?: number
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sampleSize
   */
  sampleSize<T>(
    n?: number
  ): LoDashExplicitArrayWrapper<T>;
}

//shuffle
interface LoDashStatic {
  /**
   * Creates an array of shuffled values, using a version of the Fisher-Yates shuffle.
   *
   * @param collection The collection to shuffle.
   * @return Returns the new shuffled array.
   */
  shuffle<T>(collection: List<T>|Dictionary<T>): T[];

  /**
   * @see shuffle
   */
  shuffle(collection: string): string[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see shuffle
   */
  shuffle(): LoDashImplicitArrayWrapper<string>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see shuffle
   */
  shuffle(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see shuffle
   */
  shuffle<T>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see shuffle
   */
  shuffle(): LoDashExplicitArrayWrapper<string>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see shuffle
   */
  shuffle(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see shuffle
   */
  shuffle<T>(): LoDashExplicitArrayWrapper<T>;
}

//size
interface LoDashStatic {
  /**
   * Gets the size of collection by returning its length for array-like values or the number of own enumerable
   * properties for objects.
   *
   * @param collection The collection to inspect.
   * @return Returns the size of collection.
   */
  size<T>(collection: List<T>|Dictionary<T>): number;

  /**
   * @see size
   */
  size(collection: string): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see size
   */
  size(): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see size
   */
  size(): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see size
   */
  size(): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see size
   */
  size(): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see size
   */
  size(): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see size
   */
  size(): LoDashExplicitWrapper<number>;
}

//some
interface LoDashStatic {
  /**
   * Checks if predicate returns truthy for any element of collection. Iteration is stopped once predicate
   * returns truthy. The predicate is invoked with three arguments: (value, index|key, collection).
   *
   * @param collection The collection to iterate over.
   * @param predicate The function invoked per iteration.
   * @return Returns true if any element passes the predicate check, else false.
   */
  some<T>(
    collection: List<T>,
    predicate?: ListIterator<T, boolean>
  ): boolean;

  /**
   * @see some
   */
  some<T>(
    collection: Dictionary<T>,
    predicate?: DictionaryIterator<T, boolean>
  ): boolean;

  /**
   * @see some
   */
  some<T>(
    collection: NumericDictionary<T>,
    predicate?: NumericDictionaryIterator<T, boolean>
  ): boolean;

  /**
   * @see some
   */
  some(
    collection: Object,
    predicate?: ObjectIterator<any, boolean>
  ): boolean;

  /**
   * @see some
   */
  some<T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    predicate?: string|[string, any]
  ): boolean;


  /**
   * @see some
   */
  some(
    collection: Object,
    predicate?: string|[string, any]
  ): boolean;

  /**
   * @see some
   */
  some<TObject extends {}, T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    predicate?: TObject
  ): boolean;

  /**
   * @see some
   */
  some<T>(
    collection: List<T>|Dictionary<T>|NumericDictionary<T>,
    predicate?: Object
  ): boolean;

  /**
   * @see some
   */
  some<TObject extends {}>(
    collection: Object,
    predicate?: TObject
  ): boolean;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see some
   */
  some(
    predicate?: ListIterator<T, boolean>|NumericDictionaryIterator<T, boolean>
  ): boolean;

  /**
   * @see some
   */
  some(
    predicate?: string|[string, any]
  ): boolean;

  /**
   * @see some
   */
  some<TObject extends {}>(
    predicate?: TObject
  ): boolean;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see some
   */
  some<TResult>(
    predicate?: ListIterator<TResult, boolean>|DictionaryIterator<TResult, boolean>|NumericDictionaryIterator<T, boolean>|ObjectIterator<any, boolean>
  ): boolean;

  /**
   * @see some
   */
  some(
    predicate?: string|[string, any]
  ): boolean;

  /**
   * @see some
   */
  some<TObject extends {}>(
    predicate?: TObject
  ): boolean;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see some
   */
  some(
    predicate?: ListIterator<T, boolean>|NumericDictionaryIterator<T, boolean>
  ): LoDashExplicitWrapper<boolean>;

  /**
   * @see some
   */
  some(
    predicate?: string|[string, any]
  ): LoDashExplicitWrapper<boolean>;

  /**
   * @see some
   */
  some<TObject extends {}>(
    predicate?: TObject
  ): LoDashExplicitWrapper<boolean>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see some
   */
  some<TResult>(
    predicate?: ListIterator<TResult, boolean>|DictionaryIterator<TResult, boolean>|NumericDictionaryIterator<T, boolean>|ObjectIterator<any, boolean>
  ): LoDashExplicitWrapper<boolean>;

  /**
   * @see some
   */
  some(
    predicate?: string|[string, any]
  ): LoDashExplicitWrapper<boolean>;

  /**
   * @see some
   */
  some<TObject extends {}>(
    predicate?: TObject
  ): LoDashExplicitWrapper<boolean>;
}

//sortBy
interface LoDashStatic {
  /**
   * Creates an array of elements, sorted in ascending order by the results of
   * running each element in a collection through each iteratee. This method
   * performs a stable sort, that is, it preserves the original sort order of
   * equal elements. The iteratees are invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {...(Function|Function[]|Object|Object[]|string|string[])} [iteratees=[identity]]
   *  The iteratees to sort by, specified individually or in arrays.
   * @returns {Array} Returns the new sorted array.
   * @example
   *
   * var users = [
   *   { 'user': 'fred',   'age': 48 },
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 42 },
   *   { 'user': 'barney', 'age': 34 }
   * ];
   *
   * sortBy(users, function(o) { return o.user; });
   * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
   *
   * sortBy(users, ['user', 'age']);
   * // => objects for [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
   *
   * sortBy(users, 'user', function(o) {
     *   return Math.floor(o.age / 10);
     * });
   * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
   */
  sortBy<T, TSort>(
    collection: List<T>,
    iteratee?: ListIterator<T, TSort>
  ): T[];

  /**
   * @see sortBy
   */
  sortBy<T, TSort>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, TSort>
  ): T[];

  /**
   * @see sortBy
   */
  sortBy<T>(
    collection: List<T>|Dictionary<T>,
    iteratee: string
  ): T[];

  /**
   * @see sortBy
   */
  sortBy<W extends {}, T>(
    collection: List<T>|Dictionary<T>,
    whereValue: W
  ): T[];

  /**
   * @see sortBy
   */
  sortBy<T>(
    collection: List<T>|Dictionary<T>
  ): T[];

  /**
   * @see sortBy
   */
  sortBy<T>(
    collection: (Array<T>|List<T>),
    iteratees: (ListIterator<T, any>|string|Object)[]): T[];

  /**
   * @see sortBy
   */
  sortBy<T>(
    collection: (Array<T>|List<T>),
    ...iteratees: (ListIterator<T, boolean>|Object|string)[]): T[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sortBy
   */
  sortBy<TSort>(
    iteratee?: ListIterator<T, TSort>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy(iteratee: string): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy<W extends {}>(whereValue: W): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy(): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy(...iteratees: (ListIterator<T, boolean>|Object|string)[]): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortBy
   **/
  sortBy(iteratees: (ListIterator<T, any>|string|Object)[]): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sortBy
   */
  sortBy<T, TSort>(
    iteratee?: ListIterator<T, TSort>|DictionaryIterator<T, TSort>
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy<T>(iteratee: string): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy<W extends {}, T>(whereValue: W): LoDashImplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy<T>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sortBy
   */
  sortBy<TSort>(
    iteratee?: ListIterator<T, TSort>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy(iteratee: string): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy<W extends {}>(whereValue: W): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sortBy
   */
  sortBy<T, TSort>(
    iteratee?: ListIterator<T, TSort>|DictionaryIterator<T, TSort>
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy<T>(iteratee: string): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy<W extends {}, T>(whereValue: W): LoDashExplicitArrayWrapper<T>;

  /**
   * @see sortBy
   */
  sortBy<T>(): LoDashExplicitArrayWrapper<T>;
}

//orderBy
interface LoDashStatic {
  /**
   * This method is like `sortBy` except that it allows specifying the sort
   * orders of the iteratees to sort by. If `orders` is unspecified, all values
   * are sorted in ascending order. Otherwise, specify an order of "desc" for
   * descending or "asc" for ascending sort order of corresponding values.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function[]|Object[]|string[]} [iteratees=[identity]] The iteratees to sort by.
   * @param {string[]} [orders] The sort orders of `iteratees`.
   * @param- {Object} [guard] Enables use as an iteratee for functions like `reduce`.
   * @returns {Array} Returns the new sorted array.
   * @example
   *
   * var users = [
   *   { 'user': 'fred',   'age': 48 },
   *   { 'user': 'barney', 'age': 34 },
   *   { 'user': 'fred',   'age': 42 },
   *   { 'user': 'barney', 'age': 36 }
   * ];
   *
   * // sort by `user` in ascending order and by `age` in descending order
   * orderBy(users, ['user', 'age'], ['asc', 'desc']);
   * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
   */
  orderBy<W extends Object, T>(
    collection: List<T>,
    iteratees: ListIterator<T, any>|string|W|(ListIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): T[];

  /**
   * @see orderBy
   */
  orderBy<T>(
    collection: List<T>,
    iteratees: ListIterator<T, any>|string|Object|(ListIterator<T, any>|string|Object)[],
    orders?: boolean|string|(boolean|string)[]
  ): T[];

  /**
   * @see orderBy
   */
  orderBy<W extends Object, T>(
    collection: NumericDictionary<T>,
    iteratees: NumericDictionaryIterator<T, any>|string|W|(NumericDictionaryIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): T[];

  /**
   * @see orderBy
   */
  orderBy<T>(
    collection: NumericDictionary<T>,
    iteratees: NumericDictionaryIterator<T, any>|string|Object|(NumericDictionaryIterator<T, any>|string|Object)[],
    orders?: boolean|string|(boolean|string)[]
  ): T[];

  /**
   * @see orderBy
   */
  orderBy<W extends Object, T>(
    collection: Dictionary<T>,
    iteratees: DictionaryIterator<T, any>|string|W|(DictionaryIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): T[];

  /**
   * @see orderBy
   */
  orderBy<T>(
    collection: Dictionary<T>,
    iteratees: DictionaryIterator<T, any>|string|Object|(DictionaryIterator<T, any>|string|Object)[],
    orders?: boolean|string|(boolean|string)[]
  ): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see orderBy
   */
  orderBy(
    iteratees: ListIterator<T, any>|string|(ListIterator<T, any>|string)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see orderBy
   */
  orderBy<W extends Object>(
    iteratees: ListIterator<T, any>|string|W|(ListIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see orderBy
   */
  orderBy<W extends Object, T>(
    iteratees: ListIterator<T, any>|string|W|(ListIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<T>(
    iteratees: ListIterator<T, any>|string|Object|(ListIterator<T, any>|string|Object)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<W extends Object, T>(
    iteratees: NumericDictionaryIterator<T, any>|string|W|(NumericDictionaryIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<T>(
    iteratees: NumericDictionaryIterator<T, any>|string|Object|(NumericDictionaryIterator<T, any>|string|Object)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<W extends Object, T>(
    iteratees: DictionaryIterator<T, any>|string|W|(DictionaryIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashImplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<T>(
    iteratees: DictionaryIterator<T, any>|string|Object|(DictionaryIterator<T, any>|string|Object)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see orderBy
   */
  orderBy(
    iteratees: ListIterator<T, any>|string|(ListIterator<T, any>|string)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see orderBy
   */
  orderBy<W extends Object>(
    iteratees: ListIterator<T, any>|string|W|(ListIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see orderBy
   */
  orderBy<W extends Object, T>(
    iteratees: ListIterator<T, any>|string|W|(ListIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<T>(
    iteratees: ListIterator<T, any>|string|Object|(ListIterator<T, any>|string|Object)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<W extends Object, T>(
    iteratees: NumericDictionaryIterator<T, any>|string|W|(NumericDictionaryIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<T>(
    iteratees: NumericDictionaryIterator<T, any>|string|Object|(NumericDictionaryIterator<T, any>|string|Object)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<W extends Object, T>(
    iteratees: DictionaryIterator<T, any>|string|W|(DictionaryIterator<T, any>|string|W)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashExplicitArrayWrapper<T>;

  /**
   * @see orderBy
   */
  orderBy<T>(
    iteratees: DictionaryIterator<T, any>|string|Object|(DictionaryIterator<T, any>|string|Object)[],
    orders?: boolean|string|(boolean|string)[]
  ): LoDashExplicitArrayWrapper<T>;
}

/********
 * Date *
 ********/

//now
interface LoDashStatic {
  /**
   * Gets the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).
   *
   * @return The number of milliseconds.
   */
  now(): number;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see now
   */
  now(): number;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see now
   */
  now(): LoDashExplicitWrapper<number>;
}

/*************
 * Functions *
 *************/

//after
interface LoDashStatic {
  /**
   * The opposite of before; this method creates a function that invokes func once it’s called n or more times.
   *
   * @param n The number of calls before func is invoked.
   * @param func The function to restrict.
   * @return Returns the new restricted function.
   */
  after<TFunc extends Function>(
    n: number,
    func: TFunc
  ): TFunc;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see after
   **/
  after<TFunc extends Function>(func: TFunc): LoDashImplicitObjectWrapper<TFunc>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see after
   **/
  after<TFunc extends Function>(func: TFunc): LoDashExplicitObjectWrapper<TFunc>;
}

//ary
interface LoDashStatic {
  /**
   * Creates a function that accepts up to n arguments ignoring any additional arguments.
   *
   * @param func The function to cap arguments for.
   * @param n The arity cap.
   * @returns Returns the new function.
   */
  ary<TResult extends Function>(
    func: Function,
    n?: number
  ): TResult;

  ary<T extends Function, TResult extends Function>(
    func: T,
    n?: number
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see ary
   */
  ary<TResult extends Function>(n?: number): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see ary
   */
  ary<TResult extends Function>(n?: number): LoDashExplicitObjectWrapper<TResult>;
}

//before
interface LoDashStatic {
  /**
   * Creates a function that invokes func, with the this binding and arguments of the created function, while
   * it’s called less than n times. Subsequent calls to the created function return the result of the last func
   * invocation.
   *
   * @param n The number of calls at which func is no longer invoked.
   * @param func The function to restrict.
   * @return Returns the new restricted function.
   */
  before<TFunc extends Function>(
    n: number,
    func: TFunc
  ): TFunc;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see before
   **/
  before<TFunc extends Function>(func: TFunc): LoDashImplicitObjectWrapper<TFunc>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see before
   **/
  before<TFunc extends Function>(func: TFunc): LoDashExplicitObjectWrapper<TFunc>;
}

//bind
interface FunctionBind {
  placeholder: any;

  <T extends Function, TResult extends Function>(
    func: T,
    thisArg: any,
    ...partials: any[]
  ): TResult;

  <TResult extends Function>(
    func: Function,
    thisArg: any,
    ...partials: any[]
  ): TResult;
}

interface LoDashStatic {
  /**
   * Creates a function that invokes func with the this binding of thisArg and prepends any additional bind
   * arguments to those provided to the bound function.
   *
   * The bind.placeholder value, which defaults to _ in monolithic builds, may be used as a placeholder for
   * partially applied arguments.
   *
   * Note: Unlike native Function#bind this method does not set the "length" property of bound functions.
   *
   * @param func The function to bind.
   * @param thisArg The this binding of func.
   * @param partials The arguments to be partially applied.
   * @return Returns the new bound function.
   */
  bind: FunctionBind;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see bind
   */
  bind<TResult extends Function>(
    thisArg: any,
    ...partials: any[]
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see bind
   */
  bind<TResult extends Function>(
    thisArg: any,
    ...partials: any[]
  ): LoDashExplicitObjectWrapper<TResult>;
}

//bindAll
interface LoDashStatic {
  /**
   * Binds methods of an object to the object itself, overwriting the existing method. Method names may be
   * specified as individual arguments or as arrays of method names. If no method names are provided all
   * enumerable function properties, own and inherited, of object are bound.
   *
   * Note: This method does not set the "length" property of bound functions.
   *
   * @param object The object to bind and assign the bound methods to.
   * @param methodNames The object method names to bind, specified as individual method names or arrays of
   * method names.
   * @return Returns object.
   */
  bindAll<T>(
    object: T,
    ...methodNames: (string|string[])[]
  ): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see bindAll
   */
  bindAll(...methodNames: (string|string[])[]): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see bindAll
   */
  bindAll(...methodNames: (string|string[])[]): LoDashExplicitObjectWrapper<T>;
}

//bindKey
interface FunctionBindKey {
  placeholder: any;

  <T extends Object, TResult extends Function>(
    object: T,
    key: any,
    ...partials: any[]
  ): TResult;

  <TResult extends Function>(
    object: Object,
    key: any,
    ...partials: any[]
  ): TResult;
}

interface LoDashStatic {
  /**
   * Creates a function that invokes the method at object[key] and prepends any additional bindKey arguments
   * to those provided to the bound function.
   *
   * This method differs from bind by allowing bound functions to reference methods that may be redefined
   * or don’t yet exist. See Peter Michaux’s article for more details.
   *
   * The bindKey.placeholder value, which defaults to _ in monolithic builds, may be used as a placeholder
   * for partially applied arguments.
   *
   * @param object The object the method belongs to.
   * @param key The key of the method.
   * @param partials The arguments to be partially applied.
   * @return Returns the new bound function.
   */
  bindKey: FunctionBindKey;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see bindKey
   */
  bindKey<TResult extends Function>(
    key: any,
    ...partials: any[]
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see bindKey
   */
  bindKey<TResult extends Function>(
    key: any,
    ...partials: any[]
  ): LoDashExplicitObjectWrapper<TResult>;
}

//createCallback
interface LoDashStatic {
  /**
   * Produces a callback bound to an optional thisArg. If func is a property name the created
   * callback will return the property value for a given element. If func is an object the created
   * callback will return true for elements that contain the equivalent object properties,
   * otherwise it will return false.
   * @param func The value to convert to a callback.
   * @param thisArg The this binding of the created callback.
   * @param argCount The number of arguments the callback accepts.
   * @return A callback function.
   **/
  createCallback(
    func: string,
    argCount?: number): () => any;

  /**
   * @see createCallback
   **/
  createCallback(
    func: Dictionary<any>,
    argCount?: number): () => boolean;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see createCallback
   **/
  createCallback(
    argCount?: number): LoDashImplicitObjectWrapper<() => any>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see createCallback
   **/
  createCallback(
    argCount?: number): LoDashImplicitObjectWrapper<() => any>;
}

//curry
interface LoDashStatic {
  /**
   * Creates a function that accepts one or more arguments of func that when called either invokes func returning
   * its result, if all func arguments have been provided, or returns a function that accepts one or more of the
   * remaining func arguments, and so on. The arity of func may be specified if func.length is not sufficient.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curry<T1, R>(func: (t1: T1) => R):
    CurriedFunction1<T1, R>;
  /**
   * Creates a function that accepts one or more arguments of func that when called either invokes func returning
   * its result, if all func arguments have been provided, or returns a function that accepts one or more of the
   * remaining func arguments, and so on. The arity of func may be specified if func.length is not sufficient.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curry<T1, T2, R>(func: (t1: T1, t2: T2) => R):
    CurriedFunction2<T1, T2, R>;
  /**
   * Creates a function that accepts one or more arguments of func that when called either invokes func returning
   * its result, if all func arguments have been provided, or returns a function that accepts one or more of the
   * remaining func arguments, and so on. The arity of func may be specified if func.length is not sufficient.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curry<T1, T2, T3, R>(func: (t1: T1, t2: T2, t3: T3) => R):
    CurriedFunction3<T1, T2, T3, R>;
  /**
   * Creates a function that accepts one or more arguments of func that when called either invokes func returning
   * its result, if all func arguments have been provided, or returns a function that accepts one or more of the
   * remaining func arguments, and so on. The arity of func may be specified if func.length is not sufficient.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curry<T1, T2, T3, T4, R>(func: (t1: T1, t2: T2, t3: T3, t4: T4) => R):
    CurriedFunction4<T1, T2, T3, T4, R>;
  /**
   * Creates a function that accepts one or more arguments of func that when called either invokes func returning
   * its result, if all func arguments have been provided, or returns a function that accepts one or more of the
   * remaining func arguments, and so on. The arity of func may be specified if func.length is not sufficient.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curry<T1, T2, T3, T4, T5, R>(func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R):
    CurriedFunction5<T1, T2, T3, T4, T5, R>;
  /**
   * Creates a function that accepts one or more arguments of func that when called either invokes func returning
   * its result, if all func arguments have been provided, or returns a function that accepts one or more of the
   * remaining func arguments, and so on. The arity of func may be specified if func.length is not sufficient.
   * @param func The function to curry.
   * @param arity The arity of func.
   * @return Returns the new curried function.
   */
  curry<TResult extends Function>(
    func: Function,
    arity?: number): TResult;
}

interface CurriedFunction1<T1, R> {
  (): CurriedFunction1<T1, R>;
  (t1: T1): R;
}

interface CurriedFunction2<T1, T2, R> {
  (): CurriedFunction2<T1, T2, R>;
  (t1: T1): CurriedFunction1<T2, R>;
  (t1: T1, t2: T2): R;
}

interface CurriedFunction3<T1, T2, T3, R> {
  (): CurriedFunction3<T1, T2, T3, R>;
  (t1: T1): CurriedFunction2<T2, T3, R>;
  (t1: T1, t2: T2): CurriedFunction1<T3, R>;
  (t1: T1, t2: T2, t3: T3): R;
}

interface CurriedFunction4<T1, T2, T3, T4, R> {
  (): CurriedFunction4<T1, T2, T3, T4, R>;
  (t1: T1): CurriedFunction3<T2, T3, T4, R>;
  (t1: T1, t2: T2): CurriedFunction2<T3, T4, R>;
  (t1: T1, t2: T2, t3: T3): CurriedFunction1<T4, R>;
  (t1: T1, t2: T2, t3: T3, t4: T4): R;
}

interface CurriedFunction5<T1, T2, T3, T4, T5, R> {
  (): CurriedFunction5<T1, T2, T3, T4, T5, R>;
  (t1: T1): CurriedFunction4<T2, T3, T4, T5, R>;
  (t1: T1, t2: T2): CurriedFunction3<T3, T4, T5, R>;
  (t1: T1, t2: T2, t3: T3): CurriedFunction2<T4, T5, R>;
  (t1: T1, t2: T2, t3: T3, t4: T4): CurriedFunction1<T5, R>;
  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see curry
   **/
  curry<TResult extends Function>(arity?: number): LoDashImplicitObjectWrapper<TResult>;
}

//curryRight
interface LoDashStatic {
  /**
   * This method is like curry except that arguments are applied to func in the manner of partialRight
   * instead of partial.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curryRight<T1, R>(func: (t1: T1) => R):
    CurriedFunction1<T1, R>;
  /**
   * This method is like curry except that arguments are applied to func in the manner of partialRight
   * instead of partial.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curryRight<T1, T2, R>(func: (t1: T1, t2: T2) => R):
    CurriedFunction2<T2, T1, R>;
  /**
   * This method is like curry except that arguments are applied to func in the manner of partialRight
   * instead of partial.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curryRight<T1, T2, T3, R>(func: (t1: T1, t2: T2, t3: T3) => R):
    CurriedFunction3<T3, T2, T1, R>;
  /**
   * This method is like curry except that arguments are applied to func in the manner of partialRight
   * instead of partial.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curryRight<T1, T2, T3, T4, R>(func: (t1: T1, t2: T2, t3: T3, t4: T4) => R):
    CurriedFunction4<T4, T3, T2, T1, R>;
  /**
   * This method is like curry except that arguments are applied to func in the manner of partialRight
   * instead of partial.
   * @param func The function to curry.
   * @return Returns the new curried function.
   */
  curryRight<T1, T2, T3, T4, T5, R>(func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R):
    CurriedFunction5<T5, T4, T3, T2, T1, R>;
  /**
   * This method is like curry except that arguments are applied to func in the manner of partialRight
   * instead of partial.
   * @param func The function to curry.
   * @param arity The arity of func.
   * @return Returns the new curried function.
   */
  curryRight<TResult extends Function>(
    func: Function,
    arity?: number): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see curryRight
   **/
  curryRight<TResult extends Function>(arity?: number): LoDashImplicitObjectWrapper<TResult>;
}

//debounce
interface DebounceSettings {
  /**
   * Specify invoking on the leading edge of the timeout.
   */
  leading?: boolean;

  /**
   * The maximum time func is allowed to be delayed before it’s invoked.
   */
  maxWait?: number;

  /**
   * Specify invoking on the trailing edge of the timeout.
   */
  trailing?: boolean;
}

interface LoDashStatic {
  /**
   * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since
   * the last time the debounced function was invoked. The debounced function comes with a cancel method to
   * cancel delayed invocations and a flush method to immediately invoke them. Provide an options object to
   * indicate that func should be invoked on the leading and/or trailing edge of the wait timeout. Subsequent
   * calls to the debounced function return the result of the last func invocation.
   *
   * Note: If leading and trailing options are true, func is invoked on the trailing edge of the timeout only
   * if the the debounced function is invoked more than once during the wait timeout.
   *
   * See David Corbacho’s article for details over the differences between debounce and throttle.
   *
   * @param func The function to debounce.
   * @param wait The number of milliseconds to delay.
   * @param options The options object.
   * @param options.leading Specify invoking on the leading edge of the timeout.
   * @param options.maxWait The maximum time func is allowed to be delayed before it’s invoked.
   * @param options.trailing Specify invoking on the trailing edge of the timeout.
   * @return Returns the new debounced function.
   */
  debounce<T extends Function>(
    func: T,
    wait?: number,
    options?: DebounceSettings
  ): T & Cancelable;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see debounce
   */
  debounce(
    wait?: number,
    options?: DebounceSettings
  ): LoDashImplicitObjectWrapper<T & Cancelable>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see debounce
   */
  debounce(
    wait?: number,
    options?: DebounceSettings
  ): LoDashExplicitObjectWrapper<T & Cancelable>;
}

//defer
interface LoDashStatic {
  /**
   * Defers invoking the func until the current call stack has cleared. Any additional arguments are provided to
   * func when it’s invoked.
   *
   * @param func The function to defer.
   * @param args The arguments to invoke the function with.
   * @return Returns the timer id.
   */
  defer<T extends Function>(
    func: T,
    ...args: any[]
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see defer
   */
  defer(...args: any[]): LoDashImplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see defer
   */
  defer(...args: any[]): LoDashExplicitWrapper<number>;
}

//delay
interface LoDashStatic {
  /**
   * Invokes func after wait milliseconds. Any additional arguments are provided to func when it’s invoked.
   *
   * @param func The function to delay.
   * @param wait The number of milliseconds to delay invocation.
   * @param args The arguments to invoke the function with.
   * @return Returns the timer id.
   */
  delay<T extends Function>(
    func: T,
    wait: number,
    ...args: any[]
  ): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see delay
   */
  delay(
    wait: number,
    ...args: any[]
  ): LoDashImplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see delay
   */
  delay(
    wait: number,
    ...args: any[]
  ): LoDashExplicitWrapper<number>;
}

interface LoDashStatic {
  /**
   * Creates a function that invokes `func` with arguments reversed.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to flip arguments for.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var flipped = flip(function() {
     *   return toArray(arguments);
     * });
   *
   * flipped('a', 'b', 'c', 'd');
   * // => ['d', 'c', 'b', 'a']
   */
  flip<T extends Function>(func: T): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see flip
   */
  flip(): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see flip
   */
  flip(): LoDashExplicitObjectWrapper<T>;
}

//flow
interface LoDashStatic {
  /**
   * Creates a function that returns the result of invoking the provided functions with the this binding of the
   * created function, where each successive invocation is supplied the return value of the previous.
   *
   * @param funcs Functions to invoke.
   * @return Returns the new function.
   */
  // 1-argument first function
  flow<A1, R1, R2>(f1: (a1: A1) => R1, f2: (a: R1) => R2): (a1: A1) => R2;
  flow<A1, R1, R2, R3>(f1: (a1: A1) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3): (a1: A1) => R3;
  flow<A1, R1, R2, R3, R4>(f1: (a1: A1) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4): (a1: A1) => R4;
  flow<A1, R1, R2, R3, R4, R5>(f1: (a1: A1) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5): (a1: A1) => R5;
  flow<A1, R1, R2, R3, R4, R5, R6>(f1: (a1: A1) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6): (a1: A1) => R6;
  flow<A1, R1, R2, R3, R4, R5, R6, R7>(f1: (a1: A1) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6, f7: (a: R6) => R7): (a1: A1) => R7;
  // 2-argument first function
  flow<A1, A2, R1, R2>(f1: (a1: A1, a2: A2) => R1, f2: (a: R1) => R2): (a1: A1, a2: A2) => R2;
  flow<A1, A2, R1, R2, R3>(f1: (a1: A1, a2: A2) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3): (a1: A1, a2: A2) => R3;
  flow<A1, A2, R1, R2, R3, R4>(f1: (a1: A1, a2: A2) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4): (a1: A1, a2: A2) => R4;
  flow<A1, A2, R1, R2, R3, R4, R5>(f1: (a1: A1, a2: A2) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5): (a1: A1, a2: A2) => R5;
  flow<A1, A2, R1, R2, R3, R4, R5, R6>(f1: (a1: A1, a2: A2) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6): (a1: A1, a2: A2) => R6;
  flow<A1, A2, R1, R2, R3, R4, R5, R6, R7>(f1: (a1: A1, a2: A2) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6, f7: (a: R6) => R7): (a1: A1, a2: A2) => R7;
  // 3-argument first function
  flow<A1, A2, A3, R1, R2>(f1: (a1: A1, a2: A2, a3: A3) => R1, f2: (a: R1) => R2): (a1: A1, a2: A2, a3: A3) => R2;
  flow<A1, A2, A3, R1, R2, R3>(f1: (a1: A1, a2: A2, a3: A3) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3): (a1: A1, a2: A2, a3: A3) => R3;
  flow<A1, A2, A3, R1, R2, R3, R4>(f1: (a1: A1, a2: A2, a3: A3) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4): (a1: A1, a2: A2, a3: A3) => R4;
  flow<A1, A2, A3, R1, R2, R3, R4, R5>(f1: (a1: A1, a2: A2, a3: A3) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5): (a1: A1, a2: A2, a3: A3) => R5;
  flow<A1, A2, A3, R1, R2, R3, R4, R5, R6>(f1: (a1: A1, a2: A2, a3: A3) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6): (a1: A1, a2: A2, a3: A3) => R6;
  flow<A1, A2, A3, R1, R2, R3, R4, R5, R6, R7>(f1: (a1: A1, a2: A2, a3: A3) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6, f7: (a: R6) => R7): (a1: A1, a2: A2, a3: A3) => R7;
  // 4-argument first function
  flow<A1, A2, A3, A4, R1, R2>(f1: (a1: A1, a2: A2, a3: A3, a4: A4) => R1, f2: (a: R1) => R2): (a1: A1, a2: A2, a3: A3, a4: A4) => R2;
  flow<A1, A2, A3, A4, R1, R2, R3>(f1: (a1: A1, a2: A2, a3: A3, a4: A4) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3): (a1: A1, a2: A2, a3: A3, a4: A4) => R3;
  flow<A1, A2, A3, A4, R1, R2, R3, R4>(f1: (a1: A1, a2: A2, a3: A3, a4: A4) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4): (a1: A1, a2: A2, a3: A3, a4: A4) => R4;
  flow<A1, A2, A3, A4, R1, R2, R3, R4, R5>(f1: (a1: A1, a2: A2, a3: A3, a4: A4) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5): (a1: A1, a2: A2, a3: A3, a4: A4) => R5;
  flow<A1, A2, A3, A4, R1, R2, R3, R4, R5, R6>(f1: (a1: A1, a2: A2, a3: A3, a4: A4) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6): (a1: A1, a2: A2, a3: A3, a4: A4) => R6;
  flow<A1, A2, A3, A4, R1, R2, R3, R4, R5, R6, R7>(f1: (a1: A1, a2: A2, a3: A3, a4: A4) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6, f7: (a: R6) => R7): (a1: A1, a2: A2, a3: A3, a4: A4) => R7;
  // generic function
  flow<TResult extends Function>(...funcs: Function[]): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see flow
   */
  flow<TResult extends Function>(...funcs: Function[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see flow
   */
  flow<TResult extends Function>(...funcs: Function[]): LoDashExplicitObjectWrapper<TResult>;
}

//flowRight
interface LoDashStatic {
  /**
   * This method is like flow except that it creates a function that invokes the provided functions from right
   * to left.
   *
   * @param funcs Functions to invoke.
   * @return Returns the new function.
   */
  flowRight<TResult extends Function>(...funcs: Function[]): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see flowRight
   */
  flowRight<TResult extends Function>(...funcs: Function[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see flowRight
   */
  flowRight<TResult extends Function>(...funcs: Function[]): LoDashExplicitObjectWrapper<TResult>;
}


//memoize
interface MemoizedFunction extends Function {
  cache: MapCache;
}

interface LoDashStatic {
  /**
   * Creates a function that memoizes the result of func. If resolver is provided it determines the cache key for
   * storing the result based on the arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is coerced to a string and used as the cache key. The func is invoked with
   * the this binding of the memoized function.
   *
   * @param func The function to have its output memoized.
   * @param resolver The function to resolve the cache key.
   * @return Returns the new memoizing function.
   */
  memoize: {
    <T extends Function>(func: T, resolver?: Function): T & MemoizedFunction;
    Cache: MapCacheConstructor;
  }
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see memoize
   */
  memoize(resolver?: Function): LoDashImplicitObjectWrapper<T & MemoizedFunction>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see memoize
   */
  memoize(resolver?: Function): LoDashExplicitObjectWrapper<T & MemoizedFunction>;
}

//overArgs (was modArgs)
interface LoDashStatic {
  /**
   * Creates a function that runs each argument through a corresponding transform function.
   *
   * @param func The function to wrap.
   * @param transforms The functions to transform arguments, specified as individual functions or arrays
   * of functions.
   * @return Returns the new function.
   */
  overArgs<T extends Function, TResult extends Function>(
    func: T,
    ...transforms: Function[]
  ): TResult;

  /**
   * @see overArgs
   */
  overArgs<T extends Function, TResult extends Function>(
    func: T,
    transforms: Function[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see overArgs
   */
  overArgs<TResult extends Function>(...transforms: Function[]): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see overArgs
   */
  overArgs<TResult extends Function>(transforms: Function[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see overArgs
   */
  overArgs<TResult extends Function>(...transforms: Function[]): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see overArgs
   */
  overArgs<TResult extends Function>(transforms: Function[]): LoDashExplicitObjectWrapper<TResult>;
}

//negate
interface LoDashStatic {
  /**
   * Creates a function that negates the result of the predicate func. The func predicate is invoked with
   * the this binding and arguments of the created function.
   *
   * @param predicate The predicate to negate.
   * @return Returns the new function.
   */
  negate<T extends Function>(predicate: T): (...args: any[]) => boolean;

  /**
   * @see negate
   */
  negate<T extends Function, TResult extends Function>(predicate: T): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see negate
   */
  negate(): LoDashImplicitObjectWrapper<(...args: any[]) => boolean>;

  /**
   * @see negate
   */
  negate<TResult extends Function>(): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see negate
   */
  negate(): LoDashExplicitObjectWrapper<(...args: any[]) => boolean>;

  /**
   * @see negate
   */
  negate<TResult extends Function>(): LoDashExplicitObjectWrapper<TResult>;
}

//once
interface LoDashStatic {
  /**
   * Creates a function that is restricted to invoking func once. Repeat calls to the function return the value
   * of the first call. The func is invoked with the this binding and arguments of the created function.
   *
   * @param func The function to restrict.
   * @return Returns the new restricted function.
   */
  once<T extends Function>(func: T): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see once
   */
  once(): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see once
   */
  once(): LoDashExplicitObjectWrapper<T>;
}

//partial
interface LoDashStatic {
  /**
   * Creates a function that, when called, invokes func with any additional partial arguments
   * prepended to those provided to the new function. This method is similar to bind except
   * it does not alter the this binding.
   * @param func The function to partially apply arguments to.
   * @param args Arguments to be partially applied.
   * @return The new partially applied function.
   **/
  partial: Partial;
}

type PH = LoDashStatic;

interface Function0<R> {
  (): R;
}
interface Function1<T1, R> {
  (t1: T1): R;
}
interface Function2<T1, T2, R> {
  (t1: T1, t2: T2): R;
}
interface Function3<T1, T2, T3, R> {
  (t1: T1, t2: T2, t3: T3): R;
}
interface Function4<T1, T2, T3, T4, R> {
  (t1: T1, t2: T2, t3: T3, t4: T4): R;
}

interface Partial {
  // arity 0
  <R>(func: Function0<R>): Function0<R>;
  // arity 1
  <T1, R>(func: Function1<T1, R>): Function1<T1, R>;
  <T1, R>(func: Function1<T1, R>, arg1: T1): Function0<R>;
  // arity 2
  <T1, T2, R>(func: Function2<T1, T2, R>):                      Function2<T1, T2, R>;
  <T1, T2, R>(func: Function2<T1, T2, R>, arg1: T1):            Function1<    T2, R>;
  <T1, T2, R>(func: Function2<T1, T2, R>, plc1: PH, arg2: T2):  Function1<T1,     R>;
  <T1, T2, R>(func: Function2<T1, T2, R>, arg1: T1, arg2: T2):  Function0<        R>;
  // arity 3
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>):                                Function3<T1, T2, T3, R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, arg1: T1):                      Function2<    T2, T3, R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, plc1: PH, arg2: T2):            Function2<T1,     T3, R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, arg1: T1, arg2: T2):            Function1<        T3, R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, plc1: PH, plc2: PH, arg3: T3):  Function2<T1, T2,     R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, arg1: T1, plc2: PH, arg3: T3):  Function1<    T2,     R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, plc1: PH, arg2: T2, arg3: T3):  Function1<T1,         R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, arg1: T1, arg2: T2, arg3: T3):  Function0<            R>;
  // arity 4
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>):                                          Function4<T1, T2, T3, T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1):                                Function3<    T2, T3, T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, plc1: PH, arg2: T2):                      Function3<T1,     T3, T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, arg2: T2):                      Function2<        T3, T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, plc1: PH, plc2: PH, arg3: T3):            Function3<T1, T2,     T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, plc2: PH, arg3: T3):            Function2<    T2,     T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, plc1: PH, arg2: T2, arg3: T3):            Function2<T1,         T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, arg2: T2, arg3: T3):            Function1<            T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, plc1: PH, plc2: PH, plc3: PH, arg4: T4):  Function3<T1, T2, T3,     R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, plc2: PH, plc3: PH, arg4: T4):  Function2<    T2, T3,     R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, plc1: PH, arg2: T2, plc3: PH, arg4: T4):  Function2<T1,     T3,     R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, arg2: T2, plc3: PH, arg4: T4):  Function1<        T3,     R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, plc1: PH, plc2: PH, arg3: T3, arg4: T4):  Function2<T1, T2,         R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, plc2: PH, arg3: T3, arg4: T4):  Function1<    T2,         R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, plc1: PH, arg2: T2, arg3: T3, arg4: T4):  Function1<T1,             R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, arg2: T2, arg3: T3, arg4: T4):  Function0<                R>;
  // catch-all
  (func: Function, ...args: any[]): Function;
}

//partialRight
interface LoDashStatic {
  /**
   * This method is like partial except that partial arguments are appended to those provided
   * to the new function.
   * @param func The function to partially apply arguments to.
   * @param args Arguments to be partially applied.
   * @return The new partially applied function.
   **/
  partialRight: PartialRight
}

interface PartialRight {
  // arity 0
  <R>(func: Function0<R>): Function0<R>;
  // arity 1
  <T1, R>(func: Function1<T1, R>): Function1<T1, R>;
  <T1, R>(func: Function1<T1, R>, arg1: T1): Function0<R>;
  // arity 2
  <T1, T2, R>(func: Function2<T1, T2, R>):                      Function2<T1, T2, R>;
  <T1, T2, R>(func: Function2<T1, T2, R>, arg1: T1, plc2: PH):  Function1<    T2, R>;
  <T1, T2, R>(func: Function2<T1, T2, R>,           arg2: T2):  Function1<T1,     R>;
  <T1, T2, R>(func: Function2<T1, T2, R>, arg1: T1, arg2: T2):  Function0<        R>;
  // arity 3
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>):                                Function3<T1, T2, T3, R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, arg1: T1, plc2: PH, plc3: PH):  Function2<    T2, T3, R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>,           arg2: T2, plc3: PH):  Function2<T1,     T3, R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, arg1: T1, arg2: T2, plc3: PH):  Function1<        T3, R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>,                     arg3: T3):  Function2<T1, T2,     R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, arg1: T1, plc2: PH, arg3: T3):  Function1<    T2,     R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>,           arg2: T2, arg3: T3):  Function1<T1,         R>;
  <T1, T2, T3, R>(func: Function3<T1, T2, T3, R>, arg1: T1, arg2: T2, arg3: T3):  Function0<            R>;
  // arity 4
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>):                                          Function4<T1, T2, T3, T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, plc2: PH, plc3: PH, plc4: PH):  Function3<    T2, T3, T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>,           arg2: T2, plc3: PH, plc4: PH):  Function3<T1,     T3, T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, arg2: T2, plc3: PH, plc4: PH):  Function2<        T3, T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>,                     arg3: T3, plc4: PH):  Function3<T1, T2,     T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, plc2: PH, arg3: T3, plc4: PH):  Function2<    T2,     T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>,           arg2: T2, arg3: T3, plc4: PH):  Function2<T1,         T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, arg2: T2, arg3: T3, plc4: PH):  Function1<            T4, R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>,                               arg4: T4):  Function3<T1, T2, T3,     R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, plc2: PH, plc3: PH, arg4: T4):  Function2<    T2, T3,     R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>,           arg2: T2, plc3: PH, arg4: T4):  Function2<T1,     T3,     R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, arg2: T2, plc3: PH, arg4: T4):  Function1<        T3,     R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>,                     arg3: T3, arg4: T4):  Function2<T1, T2,         R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, plc2: PH, arg3: T3, arg4: T4):  Function1<    T2,         R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>,           arg2: T2, arg3: T3, arg4: T4):  Function1<T1,             R>;
  <T1, T2, T3, T4, R>(func: Function4<T1, T2, T3, T4, R>, arg1: T1, arg2: T2, arg3: T3, arg4: T4):  Function0<                R>;
  // catch-all
  (func: Function, ...args: any[]): Function;
}

//rearg
interface LoDashStatic {
  /**
   * Creates a function that invokes func with arguments arranged according to the specified indexes where the
   * argument value at the first index is provided as the first argument, the argument value at the second index
   * is provided as the second argument, and so on.
   * @param func The function to rearrange arguments for.
   * @param indexes The arranged argument indexes, specified as individual indexes or arrays of indexes.
   * @return Returns the new function.
   */
  rearg<TResult extends Function>(func: Function, indexes: number[]): TResult;

  /**
   * @see rearg
   */
  rearg<TResult extends Function>(func: Function, ...indexes: number[]): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see rearg
   */
  rearg<TResult extends Function>(indexes: number[]): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see rearg
   */
  rearg<TResult extends Function>(...indexes: number[]): LoDashImplicitObjectWrapper<TResult>;
}

//rest
interface LoDashStatic {
  /**
   * Creates a function that invokes func with the this binding of the created function and arguments from start
   * and beyond provided as an array.
   *
   * Note: This method is based on the rest parameter.
   *
   * @param func The function to apply a rest parameter to.
   * @param start The start position of the rest parameter.
   * @return Returns the new function.
   */
  rest<TResult extends Function>(
    func: Function,
    start?: number
  ): TResult;

  /**
   * @see rest
   */
  rest<TResult extends Function, TFunc extends Function>(
    func: TFunc,
    start?: number
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see rest
   */
  rest<TResult extends Function>(start?: number): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see rest
   */
  rest<TResult extends Function>(start?: number): LoDashExplicitObjectWrapper<TResult>;
}

//spread
interface LoDashStatic {
  /**
   * Creates a function that invokes func with the this binding of the created function and an array of arguments
   * much like Function#apply.
   *
   * Note: This method is based on the spread operator.
   *
   * @param func The function to spread arguments over.
   * @return Returns the new function.
   */
  spread<F extends Function, T extends Function>(func: F): T;

  /**
   * @see spread
   */
  spread<T extends Function>(func: Function): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see spread
   */
  spread<T extends Function>(): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see spread
   */
  spread<T extends Function>(): LoDashExplicitObjectWrapper<T>;
}

//throttle
interface ThrottleSettings {
  /**
   * If you'd like to disable the leading-edge call, pass this as false.
   */
  leading?: boolean;

  /**
   * If you'd like to disable the execution on the trailing-edge, pass false.
   */
  trailing?: boolean;
}

interface LoDashStatic {
  /**
   * Creates a throttled function that only invokes func at most once per every wait milliseconds. The throttled
   * function comes with a cancel method to cancel delayed invocations and a flush method to immediately invoke
   * them. Provide an options object to indicate that func should be invoked on the leading and/or trailing edge
   * of the wait timeout. Subsequent calls to the throttled function return the result of the last func call.
   *
   * Note: If leading and trailing options are true, func is invoked on the trailing edge of the timeout only if
   * the the throttled function is invoked more than once during the wait timeout.
   *
   * @param func The function to throttle.
   * @param wait The number of milliseconds to throttle invocations to.
   * @param options The options object.
   * @param options.leading Specify invoking on the leading edge of the timeout.
   * @param options.trailing Specify invoking on the trailing edge of the timeout.
   * @return Returns the new throttled function.
   */
  throttle<T extends Function>(
    func: T,
    wait?: number,
    options?: ThrottleSettings
  ): T & Cancelable;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see throttle
   */
  throttle(
    wait?: number,
    options?: ThrottleSettings
  ): LoDashImplicitObjectWrapper<T & Cancelable>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see throttle
   */
  throttle(
    wait?: number,
    options?: ThrottleSettings
  ): LoDashExplicitObjectWrapper<T & Cancelable>;
}

//unary
interface LoDashStatic {
  /**
   * Creates a function that accepts up to one argument, ignoring any
   * additional arguments.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new function.
   * @example
   *
   * map(['6', '8', '10'], unary(parseInt));
   * // => [6, 8, 10]
   */
  unary<T extends Function>(func: T): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see unary
   */
  unary(): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see unary
   */
  unary(): LoDashExplicitObjectWrapper<T>;
}

//wrap
interface LoDashStatic {
  /**
   * Creates a function that provides value to the wrapper function as its first argument. Any additional
   * arguments provided to the function are appended to those provided to the wrapper function. The wrapper is
   * invoked with the this binding of the created function.
   *
   * @param value The value to wrap.
   * @param wrapper The wrapper function.
   * @return Returns the new function.
   */
  wrap<V, W extends Function, R extends Function>(
    value: V,
    wrapper: W
  ): R;

  /**
   * @see wrap
   */
  wrap<V, R extends Function>(
    value: V,
    wrapper: Function
  ): R;

  /**
   * @see wrap
   */
  wrap<R extends Function>(
    value: any,
    wrapper: Function
  ): R;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see wrap
   */
  wrap<W extends Function, R extends Function>(wrapper: W): LoDashImplicitObjectWrapper<R>;

  /**
   * @see wrap
   */
  wrap<R extends Function>(wrapper: Function): LoDashImplicitObjectWrapper<R>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see wrap
   */
  wrap<W extends Function, R extends Function>(wrapper: W): LoDashImplicitObjectWrapper<R>;

  /**
   * @see wrap
   */
  wrap<R extends Function>(wrapper: Function): LoDashImplicitObjectWrapper<R>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see wrap
   */
  wrap<W extends Function, R extends Function>(wrapper: W): LoDashImplicitObjectWrapper<R>;

  /**
   * @see wrap
   */
  wrap<R extends Function>(wrapper: Function): LoDashImplicitObjectWrapper<R>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see wrap
   */
  wrap<W extends Function, R extends Function>(wrapper: W): LoDashExplicitObjectWrapper<R>;

  /**
   * @see wrap
   */
  wrap<R extends Function>(wrapper: Function): LoDashExplicitObjectWrapper<R>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see wrap
   */
  wrap<W extends Function, R extends Function>(wrapper: W): LoDashExplicitObjectWrapper<R>;

  /**
   * @see wrap
   */
  wrap<R extends Function>(wrapper: Function): LoDashExplicitObjectWrapper<R>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see wrap
   */
  wrap<W extends Function, R extends Function>(wrapper: W): LoDashExplicitObjectWrapper<R>;

  /**
   * @see wrap
   */
  wrap<R extends Function>(wrapper: Function): LoDashExplicitObjectWrapper<R>;
}

/********
 * Lang *
 ********/

//castArray
interface LoDashStatic {
  /**
   * Casts value as an array if it’s not one.
   *
   * @param value The value to inspect.
   * @return Returns the cast array.
   */
  castArray<T>(value: T): T[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see castArray
   */
  castArray(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see castArray
   */
  castArray(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see castArray
   */
  castArray(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see castArray
   */
  castArray(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see castArray
   */
  castArray(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see castArray
   */
  castArray(): LoDashExplicitArrayWrapper<T>;
}

//clone
interface LoDashStatic {
  /**
   * Creates a shallow clone of value.
   *
   * Note: This method is loosely based on the structured clone algorithm and supports cloning arrays,
   * array buffers, booleans, date objects, maps, numbers, Object objects, regexes, sets, strings, symbols,
   * and typed arrays. The own enumerable properties of arguments objects are cloned as plain objects. An empty
   * object is returned for uncloneable values such as error objects, functions, DOM nodes, and WeakMaps.
   *
   * @param value The value to clone.
   * @return Returns the cloned value.
   */
  clone<T>(value: T): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see clone
   */
  clone(): T;
}

interface LoDashImplicitArrayWrapper<T> {

  /**
   * @see clone
   */
  clone(): T[];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see clone
   */
  clone(): T;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see clone
   */
  clone(): LoDashExplicitWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {

  /**
   * @see clone
   */
  clone(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see clone
   */
  clone(): LoDashExplicitObjectWrapper<T>;
}

//cloneDeep
interface LoDashStatic {
  /**
   * This method is like clone except that it recursively clones value.
   *
   * @param value The value to recursively clone.
   * @return Returns the deep cloned value.
   */
  cloneDeep<T>(value: T): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see cloneDeep
   */
  cloneDeep(): T;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see cloneDeep
   */
  cloneDeep(): T[];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see cloneDeep
   */
  cloneDeep(): T;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see cloneDeep
   */
  cloneDeep(): LoDashExplicitWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see cloneDeep
   */
  cloneDeep(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see cloneDeep
   */
  cloneDeep(): LoDashExplicitObjectWrapper<T>;
}

//cloneDeepWith
interface CloneDeepWithCustomizer<TValue, TResult> {
  (value: TValue): TResult;
}

interface LoDashStatic {
  /**
   * This method is like cloneWith except that it recursively clones value.
   *
   * @param value The value to recursively clone.
   * @param customizer The function to customize cloning.
   * @return Returns the deep cloned value.
   */
  cloneDeepWith<TResult>(
    value: any,
    customizer?: CloneDeepWithCustomizer<any, TResult>
  ): TResult;

  /**
   * @see clonDeepeWith
   */
  cloneDeepWith<T, TResult>(
    value: T,
    customizer?: CloneDeepWithCustomizer<T, TResult>
  ): TResult;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult>(
    customizer?: CloneDeepWithCustomizer<T, TResult>
  ): TResult;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult>(
    customizer?: CloneDeepWithCustomizer<T[], TResult>
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult>(
    customizer?: CloneDeepWithCustomizer<T, TResult>
  ): TResult;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult extends (number|string|boolean)>(
    customizer?: CloneDeepWithCustomizer<T, TResult>
  ): LoDashExplicitWrapper<TResult>;

  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult>(
    customizer?: CloneDeepWithCustomizer<T, TResult[]>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult extends Object>(
    customizer?: CloneDeepWithCustomizer<T, TResult>
  ): LoDashExplicitObjectWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult extends (number|string|boolean)>(
    customizer?: CloneDeepWithCustomizer<T[], TResult>
  ): LoDashExplicitWrapper<TResult>;

  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult>(
    customizer?: CloneDeepWithCustomizer<T[], TResult[]>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult extends Object>(
    customizer?: CloneDeepWithCustomizer<T[], TResult>
  ): LoDashExplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult extends (number|string|boolean)>(
    customizer?: CloneDeepWithCustomizer<T, TResult>
  ): LoDashExplicitWrapper<TResult>;

  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult>(
    customizer?: CloneDeepWithCustomizer<T, TResult[]>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see cloneDeepWith
   */
  cloneDeepWith<TResult extends Object>(
    customizer?: CloneDeepWithCustomizer<T, TResult>
  ): LoDashExplicitObjectWrapper<TResult>;
}

//cloneWith
interface CloneWithCustomizer<TValue, TResult> {
  (value: TValue): TResult;
}

interface LoDashStatic {
  /**
   * This method is like clone except that it accepts customizer which is invoked to produce the cloned value.
   * If customizer returns undefined cloning is handled by the method instead.
   *
   * @param value The value to clone.
   * @param customizer The function to customize cloning.
   * @return Returns the cloned value.
   */
  cloneWith<TResult>(
    value: any,
    customizer?: CloneWithCustomizer<any, TResult>
  ): TResult;

  /**
   * @see cloneWith
   */
  cloneWith<T, TResult>(
    value: T,
    customizer?: CloneWithCustomizer<T, TResult>
  ): TResult;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see cloneWith
   */
  cloneWith<TResult>(
    customizer?: CloneWithCustomizer<T, TResult>
  ): TResult;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see cloneWith
   */
  cloneWith<TResult>(
    customizer?: CloneWithCustomizer<T[], TResult>
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see cloneWith
   */
  cloneWith<TResult>(
    customizer?: CloneWithCustomizer<T, TResult>
  ): TResult;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see cloneWith
   */
  cloneWith<TResult extends (number|string|boolean)>(
    customizer?: CloneWithCustomizer<T, TResult>
  ): LoDashExplicitWrapper<TResult>;

  /**
   * @see cloneWith
   */
  cloneWith<TResult>(
    customizer?: CloneWithCustomizer<T, TResult[]>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see cloneWith
   */
  cloneWith<TResult extends Object>(
    customizer?: CloneWithCustomizer<T, TResult>
  ): LoDashExplicitObjectWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see cloneWith
   */
  cloneWith<TResult extends (number|string|boolean)>(
    customizer?: CloneWithCustomizer<T[], TResult>
  ): LoDashExplicitWrapper<TResult>;

  /**
   * @see cloneWith
   */
  cloneWith<TResult>(
    customizer?: CloneWithCustomizer<T[], TResult[]>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see cloneWith
   */
  cloneWith<TResult extends Object>(
    customizer?: CloneWithCustomizer<T[], TResult>
  ): LoDashExplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see cloneWith
   */
  cloneWith<TResult extends (number|string|boolean)>(
    customizer?: CloneWithCustomizer<T, TResult>
  ): LoDashExplicitWrapper<TResult>;

  /**
   * @see cloneWith
   */
  cloneWith<TResult>(
    customizer?: CloneWithCustomizer<T, TResult[]>
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see cloneWith
   */
  cloneWith<TResult extends Object>(
    customizer?: CloneWithCustomizer<T, TResult>
  ): LoDashExplicitObjectWrapper<TResult>;
}

//eq
interface LoDashStatic {
  /**
   * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'user': 'fred' };
   * var other = { 'user': 'fred' };
   *
   * eq(object, object);
   * // => true
   *
   * eq(object, other);
   * // => false
   *
   * eq('a', 'a');
   * // => true
   *
   * eq('a', Object('a'));
   * // => false
   *
   * eq(NaN, NaN);
   * // => true
   */
  eq(
    value: any,
    other: any
  ): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isEqual
   */
  eq(
    other: any
  ): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isEqual
   */
  eq(
    other: any
  ): LoDashExplicitWrapper<boolean>;
}

//gt
interface LoDashStatic {
  /**
   * Checks if value is greater than other.
   *
   * @param value The value to compare.
   * @param other The other value to compare.
   * @return Returns true if value is greater than other, else false.
   */
  gt(
    value: any,
    other: any
  ): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see gt
   */
  gt(other: any): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see gt
   */
  gt(other: any): LoDashExplicitWrapper<boolean>;
}

//gte
interface LoDashStatic {
  /**
   * Checks if value is greater than or equal to other.
   *
   * @param value The value to compare.
   * @param other The other value to compare.
   * @return Returns true if value is greater than or equal to other, else false.
   */
  gte(
    value: any,
    other: any
  ): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see gte
   */
  gte(other: any): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see gte
   */
  gte(other: any): LoDashExplicitWrapper<boolean>;
}

//isArguments
interface LoDashStatic {
  /**
   * Checks if value is classified as an arguments object.
   *
   * @param value The value to check.
   * @return Returns true if value is correctly classified, else false.
   */
  isArguments(value?: any): value is IArguments;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isArguments
   */
  isArguments(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isArguments
   */
  isArguments(): LoDashExplicitWrapper<boolean>;
}

//isArray
interface LoDashStatic {
  /**
   * Checks if value is classified as an Array object.
   * @param value The value to check.
   *
   * @return Returns true if value is correctly classified, else false.
   */
  isArray<T>(value?: any): value is T[];
}

interface LoDashImplicitWrapperBase<T,TWrapper> {
  /**
   * @see isArray
   */
  isArray(): boolean;
}

interface LoDashExplicitWrapperBase<T,TWrapper> {
  /**
   * @see isArray
   */
  isArray(): LoDashExplicitWrapper<boolean>;
}

//isArrayBuffer
interface LoDashStatic {
  /**
   * Checks if value is classified as an ArrayBuffer object.
   *
   * @param value The value to check.
   * @return Returns true if value is correctly classified, else false.
   */
  isArrayBuffer(value?: any): value is ArrayBuffer;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isArrayBuffer
   */
  isArrayBuffer(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isArrayBuffer
   */
  isArrayBuffer(): LoDashExplicitWrapper<boolean>;
}

//isArrayLike
interface LoDashStatic {
  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * isArrayLike([1, 2, 3]);
   * // => true
   *
   * isArrayLike(document.body.children);
   * // => true
   *
   * isArrayLike('abc');
   * // => true
   *
   * isArrayLike(noop);
   * // => false
   */
  isArrayLike<T>(value?: any): value is T[];
}

interface LoDashImplicitWrapperBase<T,TWrapper> {
  /**
   * @see isArrayLike
   */
  isArrayLike(): boolean;
}

interface LoDashExplicitWrapperBase<T,TWrapper> {
  /**
   * @see isArrayLike
   */
  isArrayLike(): LoDashExplicitWrapper<boolean>;
}

//isArrayLikeObject
interface LoDashStatic {
  /**
   * This method is like `isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
   * @example
   *
   * isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * isArrayLikeObject(document.body.children);
   * // => true
   *
   * isArrayLikeObject('abc');
   * // => false
   *
   * isArrayLikeObject(noop);
   * // => false
   */
  isArrayLikeObject<T>(value?: any): value is T[];
}

interface LoDashImplicitWrapperBase<T,TWrapper> {
  /**
   * @see isArrayLikeObject
   */
  isArrayLikeObject(): boolean;
}

interface LoDashExplicitWrapperBase<T,TWrapper> {
  /**
   * @see isArrayLikeObject
   */
  isArrayLikeObject(): LoDashExplicitWrapper<boolean>;
}

//isBoolean
interface LoDashStatic {
  /**
   * Checks if value is classified as a boolean primitive or object.
   *
   * @param value The value to check.
   * @return Returns true if value is correctly classified, else false.
   */
  isBoolean(value?: any): value is boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isBoolean
   */
  isBoolean(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isBoolean
   */
  isBoolean(): LoDashExplicitWrapper<boolean>;
}

//isBuffer
interface LoDashStatic {
  /**
   * Checks if value is a buffer.
   *
   * @param value The value to check.
   * @return Returns true if value is a buffer, else false.
   */
  isBuffer(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isBuffer
   */
  isBuffer(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isBuffer
   */
  isBuffer(): LoDashExplicitWrapper<boolean>;
}

//isDate
interface LoDashStatic {
  /**
   * Checks if value is classified as a Date object.
   * @param value The value to check.
   *
   * @return Returns true if value is correctly classified, else false.
   */
  isDate(value?: any): value is Date;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isDate
   */
  isDate(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isDate
   */
  isDate(): LoDashExplicitWrapper<boolean>;
}

//isElement
interface LoDashStatic {
  /**
   * Checks if value is a DOM element.
   *
   * @param value The value to check.
   * @return Returns true if value is a DOM element, else false.
   */
  isElement(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isElement
   */
  isElement(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isElement
   */
  isElement(): LoDashExplicitWrapper<boolean>;
}

//isEmpty
interface LoDashStatic {
  /**
   * Checks if value is empty. A value is considered empty unless it’s an arguments object, array, string, or
   * jQuery-like collection with a length greater than 0 or an object with own enumerable properties.
   *
   * @param value The value to inspect.
   * @return Returns true if value is empty, else false.
   */
  isEmpty(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isEmpty
   */
  isEmpty(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isEmpty
   */
  isEmpty(): LoDashExplicitWrapper<boolean>;
}

//isEqual
interface LoDashStatic {
  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent.
   *
   * **Note:** This method supports comparing arrays, array buffers, booleans,
   * date objects, error objects, maps, numbers, `Object` objects, regexes,
   * sets, strings, symbols, and typed arrays. `Object` objects are compared
   * by their own, not inherited, enumerable properties. Functions and DOM
   * nodes are **not** supported.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'user': 'fred' };
   * var other = { 'user': 'fred' };
   *
   * isEqual(object, other);
   * // => true
   *
   * object === other;
   * // => false
   */
  isEqual(
    value: any,
    other: any
  ): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isEqual
   */
  isEqual(
    other: any
  ): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isEqual
   */
  isEqual(
    other: any
  ): LoDashExplicitWrapper<boolean>;
}

// isEqualWith
interface IsEqualCustomizer {
  (value: any, other: any, indexOrKey?: number|string): boolean;
}

interface LoDashStatic {
  /**
   * This method is like `isEqual` except that it accepts `customizer` which is
   * invoked to compare values. If `customizer` returns `undefined` comparisons are
   * handled by the method instead. The `customizer` is invoked with up to seven arguments:
   * (objValue, othValue [, index|key, object, other, stack]).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
   *
   * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
   *
   * var array = ['hello', 'goodbye'];
   * var other = ['hi', 'goodbye'];
   *
   * isEqualWith(array, other, customizer);
   * // => true
   */
  isEqualWith(
    value: any,
    other: any,
    customizer: IsEqualCustomizer
  ): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isEqualWith
   */
  isEqualWith(
    other: any,
    customizer: IsEqualCustomizer
  ): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isEqualWith
   */
  isEqualWith(
    other: any,
    customizer: IsEqualCustomizer
  ): LoDashExplicitWrapper<boolean>;
}

//isError
interface LoDashStatic {
  /**
   * Checks if value is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError
   * object.
   *
   * @param value The value to check.
   * @return Returns true if value is an error object, else false.
   */
  isError(value: any): value is Error;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isError
   */
  isError(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isError
   */
  isError(): LoDashExplicitWrapper<boolean>;
}

//isFinite
interface LoDashStatic {
  /**
   * Checks if value is a finite primitive number.
   *
   * Note: This method is based on Number.isFinite.
   *
   * @param value The value to check.
   * @return Returns true if value is a finite number, else false.
   */
  isFinite(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isFinite
   */
  isFinite(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isFinite
   */
  isFinite(): LoDashExplicitWrapper<boolean>;
}

//isFunction
interface LoDashStatic {
  /**
   * Checks if value is classified as a Function object.
   *
   * @param value The value to check.
   * @return Returns true if value is correctly classified, else false.
   */
  isFunction(value?: any): value is Function;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isFunction
   */
  isFunction(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isFunction
   */
  isFunction(): LoDashExplicitWrapper<boolean>;
}

//isInteger
interface LoDashStatic {
  /**
   * Checks if `value` is an integer.
   *
   * **Note:** This method is based on [`Number.isInteger`](https://mdn.io/Number/isInteger).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
   * @example
   *
   * isInteger(3);
   * // => true
   *
   * isInteger(Number.MIN_VALUE);
   * // => false
   *
   * isInteger(Infinity);
   * // => false
   *
   * isInteger('3');
   * // => false
   */
  isInteger(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isInteger
   */
  isInteger(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isInteger
   */
  isInteger(): LoDashExplicitWrapper<boolean>;
}

//isLength
interface LoDashStatic {
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * isLength(3);
   * // => true
   *
   * isLength(Number.MIN_VALUE);
   * // => false
   *
   * isLength(Infinity);
   * // => false
   *
   * isLength('3');
   * // => false
   */
  isLength(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isLength
   */
  isLength(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isLength
   */
  isLength(): LoDashExplicitWrapper<boolean>;
}

//isMap
interface LoDashStatic {
  /**
   * Checks if value is classified as a Map object.
   *
   * @param value The value to check.
   * @returns Returns true if value is correctly classified, else false.
   */
  isMap<K, V>(value?: any): value is Map<K, V>;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isMap
   */
  isMap(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isMap
   */
  isMap(): LoDashExplicitWrapper<boolean>;
}

//isMatch
interface isMatchCustomizer {
  (value: any, other: any, indexOrKey?: number|string): boolean;
}

interface LoDashStatic {
  /**
   * Performs a deep comparison between `object` and `source` to determine if
   * `object` contains equivalent property values.
   *
   * **Note:** This method supports comparing the same values as `isEqual`.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   * @example
   *
   * var object = { 'user': 'fred', 'age': 40 };
   *
   * isMatch(object, { 'age': 40 });
   * // => true
   *
   * isMatch(object, { 'age': 36 });
   * // => false
   */
  isMatch(object: Object, source: Object): boolean;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see isMatch
   */
  isMatch(source: Object): boolean;
}

//isMatchWith
interface isMatchWithCustomizer {
  (value: any, other: any, indexOrKey?: number|string): boolean;
}

interface LoDashStatic {
  /**
   * This method is like `isMatch` except that it accepts `customizer` which
   * is invoked to compare values. If `customizer` returns `undefined` comparisons
   * are handled by the method instead. The `customizer` is invoked with three
   * arguments: (objValue, srcValue, index|key, object, source).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   * @example
   *
   * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
   *
   * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
   *
   * var object = { 'greeting': 'hello' };
   * var source = { 'greeting': 'hi' };
   *
   * isMatchWith(object, source, customizer);
   * // => true
   */
  isMatchWith(object: Object, source: Object, customizer: isMatchWithCustomizer): boolean;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see isMatchWith
   */
  isMatchWith(source: Object, customizer: isMatchWithCustomizer): boolean;
}

//isNaN
interface LoDashStatic {
  /**
   * Checks if value is NaN.
   *
   * Note: This method is not the same as isNaN which returns true for undefined and other non-numeric values.
   *
   * @param value The value to check.
   * @return Returns true if value is NaN, else false.
   */
  isNaN(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isNaN
   */
  isNaN(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isNaN
   */
  isNaN(): LoDashExplicitWrapper<boolean>;
}

//isNative
interface LoDashStatic {
  /**
   * Checks if value is a native function.
   * @param value The value to check.
   *
   * @retrun Returns true if value is a native function, else false.
   */
  isNative(value: any): value is Function;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isNative
   */
  isNative(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isNative
   */
  isNative(): LoDashExplicitWrapper<boolean>;
}

//isNil
interface LoDashStatic {
  /**
   * Checks if `value` is `null` or `undefined`.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
   * @example
   *
   * isNil(null);
   * // => true
   *
   * isNil(void 0);
   * // => true
   *
   * isNil(NaN);
   * // => false
   */
  isNil(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isNil
   */
  isNil(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isNil
   */
  isNil(): LoDashExplicitWrapper<boolean>;
}

//isNull
interface LoDashStatic {
  /**
   * Checks if value is null.
   *
   * @param value The value to check.
   * @return Returns true if value is null, else false.
   */
  isNull(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isNull
   */
  isNull(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isNull
   */
  isNull(): LoDashExplicitWrapper<boolean>;
}

//isNumber
interface LoDashStatic {
  /**
   * Checks if value is classified as a Number primitive or object.
   *
   * Note: To exclude Infinity, -Infinity, and NaN, which are classified as numbers, use the isFinite method.
   *
   * @param value The value to check.
   * @return Returns true if value is correctly classified, else false.
   */
  isNumber(value?: any): value is number;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isNumber
   */
  isNumber(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isNumber
   */
  isNumber(): LoDashExplicitWrapper<boolean>;
}

//isObject
interface LoDashStatic {
  /**
   * Checks if value is the language type of Object. (e.g. arrays, functions, objects, regexes, new Number(0),
   * and new String(''))
   *
   * @param value The value to check.
   * @return Returns true if value is an object, else false.
   */
  isObject(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isObject
   */
  isObject(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isObject
   */
  isObject(): LoDashExplicitWrapper<boolean>;
}

//isObjectLike
interface LoDashStatic {
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * isObjectLike({});
   * // => true
   *
   * isObjectLike([1, 2, 3]);
   * // => true
   *
   * isObjectLike(noop);
   * // => false
   *
   * isObjectLike(null);
   * // => false
   */
  isObjectLike(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isObjectLike
   */
  isObjectLike(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isObjectLike
   */
  isObjectLike(): LoDashExplicitWrapper<boolean>;
}

//isPlainObject
interface LoDashStatic {
  /**
   * Checks if value is a plain object, that is, an object created by the Object constructor or one with a
   * [[Prototype]] of null.
   *
   * Note: This method assumes objects created by the Object constructor have no inherited enumerable properties.
   *
   * @param value The value to check.
   * @return Returns true if value is a plain object, else false.
   */
  isPlainObject(value?: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isPlainObject
   */
  isPlainObject(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isPlainObject
   */
  isPlainObject(): LoDashExplicitWrapper<boolean>;
}

//isRegExp
interface LoDashStatic {
  /**
   * Checks if value is classified as a RegExp object.
   * @param value The value to check.
   *
   * @return Returns true if value is correctly classified, else false.
   */
  isRegExp(value?: any): value is RegExp;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isRegExp
   */
  isRegExp(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isRegExp
   */
  isRegExp(): LoDashExplicitWrapper<boolean>;
}

//isSafeInteger
interface LoDashStatic {
  /**
   * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
   * double precision number which isn't the result of a rounded unsafe integer.
   *
   * **Note:** This method is based on [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
   * @example
   *
   * isSafeInteger(3);
   * // => true
   *
   * isSafeInteger(Number.MIN_VALUE);
   * // => false
   *
   * isSafeInteger(Infinity);
   * // => false
   *
   * isSafeInteger('3');
   * // => false
   */
  isSafeInteger(value: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isSafeInteger
   */
  isSafeInteger(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isSafeInteger
   */
  isSafeInteger(): LoDashExplicitWrapper<boolean>;
}

//isSet
interface LoDashStatic {
  /**
   * Checks if value is classified as a Set object.
   *
   * @param value The value to check.
   * @returns Returns true if value is correctly classified, else false.
   */
  isSet<T>(value?: any): value is Set<T>;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isSet
   */
  isSet(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isSet
   */
  isSet(): LoDashExplicitWrapper<boolean>;
}

//isString
interface LoDashStatic {
  /**
   * Checks if value is classified as a String primitive or object.
   *
   * @param value The value to check.
   * @return Returns true if value is correctly classified, else false.
   */
  isString(value?: any): value is string;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isString
   */
  isString(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isString
   */
  isString(): LoDashExplicitWrapper<boolean>;
}

//isSymbol
interface LoDashStatic {
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * isSymbol(Symbol.iterator);
   * // => true
   *
   * isSymbol('abc');
   * // => false
   */
  isSymbol(value: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isSymbol
   */
  isSymbol(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isSymbol
   */
  isSymbol(): LoDashExplicitWrapper<boolean>;
}

//isTypedArray
interface LoDashStatic {
  /**
   * Checks if value is classified as a typed array.
   *
   * @param value The value to check.
   * @return Returns true if value is correctly classified, else false.
   */
  isTypedArray(value: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isTypedArray
   */
  isTypedArray(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isTypedArray
   */
  isTypedArray(): LoDashExplicitWrapper<boolean>;
}

//isUndefined
interface LoDashStatic {
  /**
   * Checks if value is undefined.
   *
   * @param value The value to check.
   * @return Returns true if value is undefined, else false.
   */
  isUndefined(value: any): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * see isUndefined
   */
  isUndefined(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * see isUndefined
   */
  isUndefined(): LoDashExplicitWrapper<boolean>;
}

//isWeakMap
interface LoDashStatic {
  /**
   * Checks if value is classified as a WeakMap object.
   *
   * @param value The value to check.
   * @returns Returns true if value is correctly classified, else false.
   */
  isWeakMap<K, V>(value?: any): value is WeakMap<K, V>;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isSet
   */
  isWeakMap(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isSet
   */
  isWeakMap(): LoDashExplicitWrapper<boolean>;
}

//isWeakSet
interface LoDashStatic {
  /**
   * Checks if value is classified as a WeakSet object.
   *
   * @param value The value to check.
   * @returns Returns true if value is correctly classified, else false.
   */
  isWeakSet<T>(value?: any): value is WeakSet<T>;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see isWeakSet
   */
  isWeakSet(): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see isWeakSet
   */
  isWeakSet(): LoDashExplicitWrapper<boolean>;
}

//lt
interface LoDashStatic {
  /**
   * Checks if value is less than other.
   *
   * @param value The value to compare.
   * @param other The other value to compare.
   * @return Returns true if value is less than other, else false.
   */
  lt(
    value: any,
    other: any
  ): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see lt
   */
  lt(other: any): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see lt
   */
  lt(other: any): LoDashExplicitWrapper<boolean>;
}

//lte
interface LoDashStatic {
  /**
   * Checks if value is less than or equal to other.
   *
   * @param value The value to compare.
   * @param other The other value to compare.
   * @return Returns true if value is less than or equal to other, else false.
   */
  lte(
    value: any,
    other: any
  ): boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see lte
   */
  lte(other: any): boolean;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see lte
   */
  lte(other: any): LoDashExplicitWrapper<boolean>;
}

//toArray
interface LoDashStatic {
  /**
   * Converts value to an array.
   *
   * @param value The value to convert.
   * @return Returns the converted array.
   */
  toArray<T>(value: List<T>|Dictionary<T>|NumericDictionary<T>): T[];

  /**
   * @see toArray
   */
  toArray<TValue, TResult>(value: TValue): TResult[];

  /**
   * @see toArray
   */
  toArray<TResult>(value?: any): TResult[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see toArray
   */
  toArray<TResult>(): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see toArray
   */
  toArray(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see toArray
   */
  toArray<TResult>(): LoDashImplicitArrayWrapper<TResult>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see toArray
   */
  toArray<TResult>(): LoDashExplicitArrayWrapper<TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see toArray
   */
  toArray(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see toArray
   */
  toArray<TResult>(): LoDashExplicitArrayWrapper<TResult>;
}

//toPlainObject
interface LoDashStatic {
  /**
   * Converts value to a plain object flattening inherited enumerable properties of value to own properties
   * of the plain object.
   *
   * @param value The value to convert.
   * @return Returns the converted plain object.
   */
  toPlainObject<TResult extends {}>(value?: any): TResult;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see toPlainObject
   */
  toPlainObject<TResult extends {}>(): LoDashImplicitObjectWrapper<TResult>;
}

//toInteger
interface LoDashStatic {
  /**
   * Converts `value` to an integer.
   *
   * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * toInteger(3);
   * // => 3
   *
   * toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * toInteger('3');
   * // => 3
   */
  toInteger(value: any): number;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see toInteger
   */
  toInteger(): LoDashImplicitWrapper<number>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see toInteger
   */
  toInteger(): LoDashExplicitWrapper<number>;
}

//toLength
interface LoDashStatic {
  /**
   * Converts `value` to an integer suitable for use as the length of an
   * array-like object.
   *
   * **Note:** This method is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @return {number} Returns the converted integer.
   * @example
   *
   * toLength(3);
   * // => 3
   *
   * toLength(Number.MIN_VALUE);
   * // => 0
   *
   * toLength(Infinity);
   * // => 4294967295
   *
   * toLength('3');
   * // => 3
   */
  toLength(value: any): number;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see toLength
   */
  toLength(): LoDashImplicitWrapper<number>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see toLength
   */
  toLength(): LoDashExplicitWrapper<number>;
}

//toNumber
interface LoDashStatic {
  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * toNumber(3);
   * // => 3
   *
   * toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * toNumber(Infinity);
   * // => Infinity
   *
   * toNumber('3');
   * // => 3
   */
  toNumber(value: any): number;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see toNumber
   */
  toNumber(): LoDashImplicitWrapper<number>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see toNumber
   */
  toNumber(): LoDashExplicitWrapper<number>;
}

//toSafeInteger
interface LoDashStatic {
  /**
   * Converts `value` to a safe integer. A safe integer can be compared and
   * represented correctly.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * toSafeInteger(3);
   * // => 3
   *
   * toSafeInteger(Number.MIN_VALUE);
   * // => 0
   *
   * toSafeInteger(Infinity);
   * // => 9007199254740991
   *
   * toSafeInteger('3');
   * // => 3
   */
  toSafeInteger(value: any): number;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see toSafeInteger
   */
  toSafeInteger(): LoDashImplicitWrapper<number>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see toSafeInteger
   */
  toSafeInteger(): LoDashExplicitWrapper<number>;
}

//toString DUMMY
interface LoDashStatic {
  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * toString(null);
   * // => ''
   *
   * toString(-0);
   * // => '-0'
   *
   * toString([1, 2, 3]);
   * // => '1,2,3'
   */
  toString(value: any): string;
}

/********
 * Math *
 ********/

//add
interface LoDashStatic {
  /**
   * Adds two numbers.
   *
   * @param augend The first number to add.
   * @param addend The second number to add.
   * @return Returns the sum.
   */
  add(
    augend: number,
    addend: number
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see add
   */
  add(addend: number): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see add
   */
  add(addend: number): LoDashExplicitWrapper<number>;
}

//ceil
interface LoDashStatic {
  /**
   * Calculates n rounded up to precision.
   *
   * @param n The number to round up.
   * @param precision The precision to round up to.
   * @return Returns the rounded up number.
   */
  ceil(
    n: number,
    precision?: number
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see ceil
   */
  ceil(precision?: number): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see ceil
   */
  ceil(precision?: number): LoDashExplicitWrapper<number>;
}

//floor
interface LoDashStatic {
  /**
   * Calculates n rounded down to precision.
   *
   * @param n The number to round down.
   * @param precision The precision to round down to.
   * @return Returns the rounded down number.
   */
  floor(
    n: number,
    precision?: number
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see floor
   */
  floor(precision?: number): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see floor
   */
  floor(precision?: number): LoDashExplicitWrapper<number>;
}

//max
interface LoDashStatic {
  /**
   * Computes the maximum value of `array`. If `array` is empty or falsey
   * `undefined` is returned.
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the maximum value.
   */
  max<T>(
    collection: List<T>
  ): T;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see max
   */
  max(): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see max
   */
  max<T>(): T;
}

//maxBy
interface LoDashStatic {
  /**
   * This method is like `max` except that it accepts `iteratee` which is
   * invoked for each element in `array` to generate the criterion by which
   * the value is ranked. The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @param {Function|Object|string} [iteratee=identity] The iteratee invoked per element.
   * @returns {*} Returns the maximum value.
   * @example
   *
   * var objects = [{ 'n': 1 }, { 'n': 2 }];
   *
   * maxBy(objects, function(o) { return o.a; });
   * // => { 'n': 2 }
   *
   * // using the `property` iteratee shorthand
   * maxBy(objects, 'n');
   * // => { 'n': 2 }
   */
  maxBy<T>(
    collection: List<T>,
    iteratee?: ListIterator<T, any>
  ): T;

  /**
   * @see maxBy
   */
  maxBy<T>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): T;

  /**
   * @see maxBy
   */
  maxBy<T>(
    collection: List<T>|Dictionary<T>,
    iteratee?: string
  ): T;

  /**
   * @see maxBy
   */
  maxBy<TObject extends {}, T>(
    collection: List<T>|Dictionary<T>,
    whereValue?: TObject
  ): T;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see maxBy
   */
  maxBy(
    iteratee?: ListIterator<T, any>
  ): T;

  /**
   * @see maxBy
   */
  maxBy(
    iteratee?: string
  ): T;

  /**
   * @see maxBy
   */
  maxBy<TObject extends {}>(
    whereValue?: TObject
  ): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see maxBy
   */
  maxBy<T>(
    iteratee?: ListIterator<T, any>|DictionaryIterator<T, any>
  ): T;

  /**
   * @see maxBy
   */
  maxBy<T>(
    iteratee?: string
  ): T;

  /**
   * @see maxBy
   */
  maxBy<TObject extends {}, T>(
    whereValue?: TObject
  ): T;
}

//mean
interface LoDashStatic {
  /**
   * Computes the mean of the values in `array`.
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {number} Returns the mean.
   * @example
   *
   * mean([4, 2, 8, 6]);
   * // => 5
   */
  mean<T>(
    collection: List<T>
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see mean
   */
  mean<T>(): number;

  /**
   * @see mean
   */
  mean(): number;
}

//min
interface LoDashStatic {
  /**
   * Computes the minimum value of `array`. If `array` is empty or falsey
   * `undefined` is returned.
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the minimum value.
   */
  min<T>(
    collection: List<T>
  ): T;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see min
   */
  min(): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see min
   */
  min<T>(): T;
}

//minBy
interface LoDashStatic {
  /**
   * This method is like `min` except that it accepts `iteratee` which is
   * invoked for each element in `array` to generate the criterion by which
   * the value is ranked. The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @param {Function|Object|string} [iteratee=identity] The iteratee invoked per element.
   * @returns {*} Returns the minimum value.
   * @example
   *
   * var objects = [{ 'n': 1 }, { 'n': 2 }];
   *
   * minBy(objects, function(o) { return o.a; });
   * // => { 'n': 1 }
   *
   * // using the `property` iteratee shorthand
   * minBy(objects, 'n');
   * // => { 'n': 1 }
   */
  minBy<T>(
    collection: List<T>,
    iteratee?: ListIterator<T, any>
  ): T;

  /**
   * @see minBy
   */
  minBy<T>(
    collection: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): T;

  /**
   * @see minBy
   */
  minBy<T>(
    collection: List<T>|Dictionary<T>,
    iteratee?: string
  ): T;

  /**
   * @see minBy
   */
  minBy<TObject extends {}, T>(
    collection: List<T>|Dictionary<T>,
    whereValue?: TObject
  ): T;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see minBy
   */
  minBy(
    iteratee?: ListIterator<T, any>
  ): T;

  /**
   * @see minBy
   */
  minBy(
    iteratee?: string
  ): T;

  /**
   * @see minBy
   */
  minBy<TObject extends {}>(
    whereValue?: TObject
  ): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see minBy
   */
  minBy<T>(
    iteratee?: ListIterator<T, any>|DictionaryIterator<T, any>
  ): T;

  /**
   * @see minBy
   */
  minBy<T>(
    iteratee?: string
  ): T;

  /**
   * @see minBy
   */
  minBy<TObject extends {}, T>(
    whereValue?: TObject
  ): T;
}

//round
interface LoDashStatic {
  /**
   * Calculates n rounded to precision.
   *
   * @param n The number to round.
   * @param precision The precision to round to.
   * @return Returns the rounded number.
   */
  round(
    n: number,
    precision?: number
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see round
   */
  round(precision?: number): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see round
   */
  round(precision?: number): LoDashExplicitWrapper<number>;
}

//sum
interface LoDashStatic {
  /**
   * Computes the sum of the values in `array`.
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {number} Returns the sum.
   * @example
   *
   * sum([4, 2, 8, 6]);
   * // => 20
   */
  sum<T>(collection: List<T>): number;

  /**
   * @see sum
   */
  sum(collection: List<number>|Dictionary<number>): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sum
   */
  sum(): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sum
   **/
  sum<TValue>(): number;

  /**
   * @see sum
   */
  sum(): number;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sum
   */
  sum(): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sum
   */
  sum<TValue>(): LoDashExplicitWrapper<number>;

  /**
   * @see sum
   */
  sum(): LoDashExplicitWrapper<number>;
}

//sumBy
interface LoDashStatic {
  /**
   * This method is like `sum` except that it accepts `iteratee` which is
   * invoked for each element in `array` to generate the value to be summed.
   * The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @param {Function|Object|string} [iteratee=identity] The iteratee invoked per element.
   * @returns {number} Returns the sum.
   * @example
   *
   * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
   *
   * sumBy(objects, function(o) { return o.n; });
   * // => 20
   *
   * // using the `property` iteratee shorthand
   * sumBy(objects, 'n');
   * // => 20
   */
  sumBy<T>(
    collection: List<T>,
    iteratee: ListIterator<T, number>
  ): number;

  /**
   * @see sumBy
   */
  sumBy(
    collection: List<{}>,
    iteratee: string
  ): number;

  /**
   * @see sumBy
   */
  sumBy(
    collection: List<number>
  ): number;

  /**
   * @see sumBy
   */
  sumBy(
    collection: List<{}>,
    iteratee: Dictionary<{}>
  ): number;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see sumBy
   */
  sumBy(
    iteratee: ListIterator<T, number>
  ): number;

  /**
   * @see sumBy
   */
  sumBy(iteratee: string): number;

  /**
   * @see sumBy
   */
  sumBy(iteratee: Dictionary<{}>): number;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see sumBy
   */
  sumBy(
    iteratee: ListIterator<{}, number>
  ): number;

  /**
   * @see sumBy
   */
  sumBy(iteratee: string): number;

  /**
   * @see sumBy
   */
  sumBy(iteratee: Dictionary<{}>): number;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see sumBy
   */
  sumBy(
    iteratee: ListIterator<T, number>
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sumBy
   */
  sumBy(iteratee: string): LoDashExplicitWrapper<number>;

  /**
   * @see sumBy
   */
  sumBy(): LoDashExplicitWrapper<number>;

  /**
   * @see sumBy
   */
  sumBy(iteratee: Dictionary<{}>): LoDashExplicitWrapper<number>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see sumBy
   */
  sumBy(
    iteratee: ListIterator<{}, number>
  ): LoDashExplicitWrapper<number>;

  /**
   * @see sumBy
   */
  sumBy(iteratee: string): LoDashExplicitWrapper<number>;

  /**
   * @see sumBy
   */
  sumBy(iteratee: Dictionary<{}>): LoDashExplicitWrapper<number>;
}

/**********
 * Number *
 **********/

//subtract
interface LoDashStatic {
  /**
   * Subtract two numbers.
   *
   * @static
   * @memberOf _
   * @category Math
   * @param {number} minuend The first number in a subtraction.
   * @param {number} subtrahend The second number in a subtraction.
   * @returns {number} Returns the difference.
   * @example
   *
   * subtract(6, 4);
   * // => 2
   */
  subtract(
    minuend: number,
    subtrahend: number
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see subtract
   */
  subtract(
    subtrahend: number
  ): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see subtract
   */
  subtract(
    subtrahend: number
  ): LoDashExplicitWrapper<number>;
}

//clamp
interface LoDashStatic {
  /**
   * Clamps `number` within the inclusive `lower` and `upper` bounds.
   *
   * @static
   * @memberOf _
   * @category Number
   * @param {number} number The number to clamp.
   * @param {number} [lower] The lower bound.
   * @param {number} upper The upper bound.
   * @returns {number} Returns the clamped number.
   * @example
   *
   * clamp(-10, -5, 5);
   * // => -5
   *
   * clamp(10, -5, 5);
   * // => 5
   */
  clamp(
    number: number,
    lower: number,
    upper: number
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see clamp
   */
  clamp(
    lower: number,
    upper: number
  ): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see clamp
   */
  clamp(
    lower: number,
    upper: number
  ): LoDashExplicitWrapper<number>;
}

//inRange
interface LoDashStatic {
  /**
   * Checks if n is between start and up to but not including, end. If end is not specified it’s set to start
   * with start then set to 0.
   *
   * @param n The number to check.
   * @param start The start of the range.
   * @param end The end of the range.
   * @return Returns true if n is in the range, else false.
   */
  inRange(
    n: number,
    start: number,
    end: number
  ): boolean;


  /**
   * @see inRange
   */
  inRange(
    n: number,
    end: number
  ): boolean;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see inRange
   */
  inRange(
    start: number,
    end: number
  ): boolean;

  /**
   * @see inRange
   */
  inRange(end: number): boolean;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see inRange
   */
  inRange(
    start: number,
    end: number
  ): LoDashExplicitWrapper<boolean>;

  /**
   * @see inRange
   */
  inRange(end: number): LoDashExplicitWrapper<boolean>;
}

//random
interface LoDashStatic {
  /**
   * Produces a random number between min and max (inclusive). If only one argument is provided a number between
   * 0 and the given number is returned. If floating is true, or either min or max are floats, a floating-point
   * number is returned instead of an integer.
   *
   * @param min The minimum possible value.
   * @param max The maximum possible value.
   * @param floating Specify returning a floating-point number.
   * @return Returns the random number.
   */
  random(
    min?: number,
    max?: number,
    floating?: boolean
  ): number;

  /**
   * @see random
   */
  random(
    min?: number,
    floating?: boolean
  ): number;

  /**
   * @see random
   */
  random(floating?: boolean): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see random
   */
  random(
    max?: number,
    floating?: boolean
  ): number;

  /**
   * @see random
   */
  random(floating?: boolean): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see random
   */
  random(
    max?: number,
    floating?: boolean
  ): LoDashExplicitWrapper<number>;

  /**
   * @see random
   */
  random(floating?: boolean): LoDashExplicitWrapper<number>;
}

/**********
 * Object *
 **********/

//assign
interface LoDashStatic {
  /**
   * Assigns own enumerable properties of source objects to the destination
   * object. Source objects are applied from left to right. Subsequent sources
   * overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object` and is loosely based on
   * [`Object.assign`](https://mdn.io/Object/assign).
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Foo() {
     *   this.c = 3;
     * }
   *
   * function Bar() {
     *   this.e = 5;
     * }
   *
   * Foo.prototype.d = 4;
   * Bar.prototype.f = 6;
   *
   * assign({ 'a': 1 }, new Foo, new Bar);
   * // => { 'a': 1, 'c': 3, 'e': 5 }
   */
  assign<TObject, TSource>(
    object: TObject,
    source: TSource
  ): TObject & TSource;

  /**
   * @see assign
   */
  assign<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2
  ): TObject & TSource1 & TSource2;

  /**
   * @see assign
   */
  assign<TObject, TSource1, TSource2, TSource3>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): TObject & TSource1 & TSource2 & TSource3;

  /**
   * @see assign
   */
  assign<TObject, TSource1, TSource2, TSource3, TSource4>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): TObject & TSource1 & TSource2 & TSource3 & TSource4;

  /**
   * @see assign
   */
  assign<TObject>(object: TObject): TObject;

  /**
   * @see assign
   */
  assign<TResult>(
    object: any,
    ...otherArgs: any[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see assign
   */
  assign<TSource>(
    source: TSource
  ): LoDashImplicitObjectWrapper<T & TSource>;

  /**
   * @see assign
   */
  assign<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assign
   */
  assign<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assign
   */
  assign<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assign
   */
  assign(): LoDashImplicitObjectWrapper<T>;

  /**
   * @see assign
   */
  assign<TResult>(...otherArgs: any[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see assign
   */
  assign<TSource>(
    source: TSource
  ): LoDashExplicitObjectWrapper<T & TSource>;

  /**
   * @see assign
   */
  assign<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assign
   */
  assign<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assign
   */
  assign<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assign
   */
  assign(): LoDashExplicitObjectWrapper<T>;

  /**
   * @see assign
   */
  assign<TResult>(...otherArgs: any[]): LoDashExplicitObjectWrapper<TResult>;
}

//assignWith
interface AssignCustomizer {
  (objectValue: any, sourceValue: any, key?: string, object?: {}, source?: {}): any;
}

interface LoDashStatic {
  /**
   * This method is like `assign` except that it accepts `customizer` which
   * is invoked to produce the assigned values. If `customizer` returns `undefined`
   * assignment is handled by the method instead. The `customizer` is invoked
   * with five arguments: (objValue, srcValue, key, object, source).
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} sources The source objects.
   * @param {Function} [customizer] The function to customize assigned values.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function customizer(objValue, srcValue) {
     *   return isUndefined(objValue) ? srcValue : objValue;
     * }
   *
   * var defaults = partialRight(assignWith, customizer);
   *
   * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
   * // => { 'a': 1, 'b': 2 }
   */
  assignWith<TObject, TSource>(
    object: TObject,
    source: TSource,
    customizer: AssignCustomizer
  ): TObject & TSource;

  /**
   * @see assignWith
   */
  assignWith<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    customizer: AssignCustomizer
  ): TObject & TSource1 & TSource2;

  /**
   * @see assignWith
   */
  assignWith<TObject, TSource1, TSource2, TSource3>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: AssignCustomizer
  ): TObject & TSource1 & TSource2 & TSource3;

  /**
   * @see assignWith
   */
  assignWith<TObject, TSource1, TSource2, TSource3, TSource4>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: AssignCustomizer
  ): TObject & TSource1 & TSource2 & TSource3 & TSource4;

  /**
   * @see assignWith
   */
  assignWith<TObject>(object: TObject): TObject;

  /**
   * @see assignWith
   */
  assignWith<TResult>(
    object: any,
    ...otherArgs: any[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see assignWith
   */
  assignWith<TSource>(
    source: TSource,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource>;

  /**
   * @see assignWith
   */
  assignWith<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignWith
   */
  assignWith<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignWith
   */
  assignWith<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignWith
   */
  assignWith(): LoDashImplicitObjectWrapper<T>;

  /**
   * @see assignWith
   */
  assignWith<TResult>(...otherArgs: any[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see assignWith
   */
  assignWith<TSource>(
    source: TSource,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource>;

  /**
   * @see assignWith
   */
  assignWith<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignWith
   */
  assignWith<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignWith
   */
  assignWith<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignWith
   */
  assignWith(): LoDashExplicitObjectWrapper<T>;

  /**
   * @see assignWith
   */
  assignWith<TResult>(...otherArgs: any[]): LoDashExplicitObjectWrapper<TResult>;
}

//assignIn
interface LoDashStatic {
  /**
   * This method is like `assign` except that it iterates over own and
   * inherited source properties.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @alias extend
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Foo() {
     *   this.b = 2;
     * }
   *
   * function Bar() {
     *   this.d = 4;
     * }
   *
   * Foo.prototype.c = 3;
   * Bar.prototype.e = 5;
   *
   * assignIn({ 'a': 1 }, new Foo, new Bar);
   * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 }
   */
  assignIn<TObject, TSource>(
    object: TObject,
    source: TSource
  ): TObject & TSource;

  /**
   * @see assignIn
   */
  assignIn<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2
  ): TObject & TSource1 & TSource2;

  /**
   * @see assignIn
   */
  assignIn<TObject, TSource1, TSource2, TSource3>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): TObject & TSource1 & TSource2 & TSource3;

  /**
   * @see assignIn
   */
  assignIn<TObject, TSource1, TSource2, TSource3, TSource4>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): TObject & TSource1 & TSource2 & TSource3 & TSource4;

  /**
   * @see assignIn
   */
  assignIn<TObject>(object: TObject): TObject;

  /**
   * @see assignIn
   */
  assignIn<TResult>(
    object: any,
    ...otherArgs: any[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see assignIn
   */
  assignIn<TSource>(
    source: TSource
  ): LoDashImplicitObjectWrapper<T & TSource>;

  /**
   * @see assignIn
   */
  assignIn<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignIn
   */
  assignIn<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignIn
   */
  assignIn<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignIn
   */
  assignIn(): LoDashImplicitObjectWrapper<T>;

  /**
   * @see assignIn
   */
  assignIn<TResult>(...otherArgs: any[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see assignIn
   */
  assignIn<TSource>(
    source: TSource
  ): LoDashExplicitObjectWrapper<T & TSource>;

  /**
   * @see assignIn
   */
  assignIn<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignIn
   */
  assignIn<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignIn
   */
  assignIn<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignIn
   */
  assignIn(): LoDashExplicitObjectWrapper<T>;

  /**
   * @see assignIn
   */
  assignIn<TResult>(...otherArgs: any[]): LoDashExplicitObjectWrapper<TResult>;
}

//assignInWith
interface AssignCustomizer {
  (objectValue: any, sourceValue: any, key?: string, object?: {}, source?: {}): any;
}

interface LoDashStatic {
  /**
   * This method is like `assignIn` except that it accepts `customizer` which
   * is invoked to produce the assigned values. If `customizer` returns `undefined`
   * assignment is handled by the method instead. The `customizer` is invoked
   * with five arguments: (objValue, srcValue, key, object, source).
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @alias extendWith
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} sources The source objects.
   * @param {Function} [customizer] The function to customize assigned values.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function customizer(objValue, srcValue) {
     *   return isUndefined(objValue) ? srcValue : objValue;
     * }
   *
   * var defaults = partialRight(assignInWith, customizer);
   *
   * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
   * // => { 'a': 1, 'b': 2 }
   */
  assignInWith<TObject, TSource>(
    object: TObject,
    source: TSource,
    customizer: AssignCustomizer
  ): TObject & TSource;

  /**
   * @see assignInWith
   */
  assignInWith<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    customizer: AssignCustomizer
  ): TObject & TSource1 & TSource2;

  /**
   * @see assignInWith
   */
  assignInWith<TObject, TSource1, TSource2, TSource3>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: AssignCustomizer
  ): TObject & TSource1 & TSource2 & TSource3;

  /**
   * @see assignInWith
   */
  assignInWith<TObject, TSource1, TSource2, TSource3, TSource4>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: AssignCustomizer
  ): TObject & TSource1 & TSource2 & TSource3 & TSource4;

  /**
   * @see assignInWith
   */
  assignInWith<TObject>(object: TObject): TObject;

  /**
   * @see assignInWith
   */
  assignInWith<TResult>(
    object: any,
    ...otherArgs: any[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see assignInWith
   */
  assignInWith<TSource>(
    source: TSource,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource>;

  /**
   * @see assignInWith
   */
  assignInWith<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignInWith
   */
  assignInWith<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignInWith
   */
  assignInWith<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignInWith
   */
  assignInWith(): LoDashImplicitObjectWrapper<T>;

  /**
   * @see assignInWith
   */
  assignInWith<TResult>(...otherArgs: any[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see assignInWith
   */
  assignInWith<TSource>(
    source: TSource,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource>;

  /**
   * @see assignInWith
   */
  assignInWith<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignInWith
   */
  assignInWith<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignInWith
   */
  assignInWith<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignInWith
   */
  assignInWith(): LoDashExplicitObjectWrapper<T>;

  /**
   * @see assignInWith
   */
  assignInWith<TResult>(...otherArgs: any[]): LoDashExplicitObjectWrapper<TResult>;
}

//create
interface LoDashStatic {
  /**
   * Creates an object that inherits from the given prototype object. If a properties object is provided its own
   * enumerable properties are assigned to the created object.
   *
   * @param prototype The object to inherit from.
   * @param properties The properties to assign to the object.
   * @return Returns the new object.
   */
  create<T extends Object, U extends Object>(
    prototype: T,
    properties?: U
  ): T & U;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see create
   */
  create<U extends Object>(properties?: U): LoDashImplicitObjectWrapper<T & U>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see create
   */
  create<U extends Object>(properties?: U): LoDashExplicitObjectWrapper<T & U>;
}


//defaults
interface LoDashStatic {
  /**
   * Assigns own enumerable properties of source object(s) to the destination object for all destination
   * properties that resolve to undefined. Once a property is set, additional values of the same property are
   * ignored.
   *
   * Note: This method mutates object.
   *
   * @param object The destination object.
   * @param sources The source objects.
   * @return The destination object.
   */
  defaults<TObject, TSource>(
    object: TObject,
    source: TSource
  ): TSource & TObject;

  /**
   * @see defaults
   */
  defaults<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2
  ): TSource2 & TSource1 & TObject;

  /**
   * @see defaults
   */
  defaults<TObject, TSource1, TSource2, TSource3>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): TSource3 & TSource2 & TSource1 & TObject;

  /**
   * @see defaults
   */
  defaults<TObject, TSource1, TSource2, TSource3, TSource4>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): TSource4 & TSource3 & TSource2 & TSource1 & TObject;

  /**
   * @see defaults
   */
  defaults<TObject>(object: TObject): TObject;

  /**
   * @see defaults
   */
  defaults<TResult>(
    object: any,
    ...sources: any[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see defaults
   */
  defaults<TSource>(
    source: TSource
  ): LoDashImplicitObjectWrapper<TSource & T>;

  /**
   * @see defaults
   */
  defaults<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashImplicitObjectWrapper<TSource2 & TSource1 & T>;

  /**
   * @see defaults
   */
  defaults<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashImplicitObjectWrapper<TSource3 & TSource2 & TSource1 & T>;

  /**
   * @see defaults
   */
  defaults<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): LoDashImplicitObjectWrapper<TSource4 & TSource3 & TSource2 & TSource1 & T>;

  /**
   * @see defaults
   */
  defaults(): LoDashImplicitObjectWrapper<T>;

  /**
   * @see defaults
   */
  defaults<TResult>(...sources: any[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see defaults
   */
  defaults<TSource>(
    source: TSource
  ): LoDashExplicitObjectWrapper<TSource & T>;

  /**
   * @see defaults
   */
  defaults<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashExplicitObjectWrapper<TSource2 & TSource1 & T>;

  /**
   * @see defaults
   */
  defaults<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashExplicitObjectWrapper<TSource3 & TSource2 & TSource1 & T>;

  /**
   * @see defaults
   */
  defaults<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): LoDashExplicitObjectWrapper<TSource4 & TSource3 & TSource2 & TSource1 & T>;

  /**
   * @see defaults
   */
  defaults(): LoDashExplicitObjectWrapper<T>;

  /**
   * @see defaults
   */
  defaults<TResult>(...sources: any[]): LoDashExplicitObjectWrapper<TResult>;
}

//defaultsDeep
interface LoDashStatic {
  /**
   * This method is like defaults except that it recursively assigns default properties.
   * @param object The destination object.
   * @param sources The source objects.
   * @return Returns object.
   **/
  defaultsDeep<T, TResult>(
    object: T,
    ...sources: any[]): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see defaultsDeep
   **/
  defaultsDeep<TResult>(...sources: any[]): LoDashImplicitObjectWrapper<TResult>
}

// extend
interface LoDashStatic {
  /**
   * @see assignIn
   */
  extend<TObject, TSource>(
    object: TObject,
    source: TSource
  ): TObject & TSource;

  /**
   * @see assignIn
   */
  extend<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2
  ): TObject & TSource1 & TSource2;

  /**
   * @see assignIn
   */
  extend<TObject, TSource1, TSource2, TSource3>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): TObject & TSource1 & TSource2 & TSource3;

  /**
   * @see assignIn
   */
  extend<TObject, TSource1, TSource2, TSource3, TSource4>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): TObject & TSource1 & TSource2 & TSource3 & TSource4;

  /**
   * @see assignIn
   */
  extend<TObject>(object: TObject): TObject;

  /**
   * @see assignIn
   */
  extend<TResult>(
    object: any,
    ...otherArgs: any[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see assignIn
   */
  extend<TSource>(
    source: TSource
  ): LoDashImplicitObjectWrapper<T & TSource>;

  /**
   * @see assignIn
   */
  extend<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignIn
   */
  extend<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignIn
   */
  extend<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignIn
   */
  extend(): LoDashImplicitObjectWrapper<T>;

  /**
   * @see assignIn
   */
  extend<TResult>(...otherArgs: any[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see assignIn
   */
  extend<TSource>(
    source: TSource
  ): LoDashExplicitObjectWrapper<T & TSource>;

  /**
   * @see assignIn
   */
  extend<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignIn
   */
  extend<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignIn
   */
  extend<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignIn
   */
  extend(): LoDashExplicitObjectWrapper<T>;

  /**
   * @see assignIn
   */
  extend<TResult>(...otherArgs: any[]): LoDashExplicitObjectWrapper<TResult>;
}

interface LoDashStatic {
  /**
   * @see assignInWith
   */
  extendWith<TObject, TSource>(
    object: TObject,
    source: TSource,
    customizer: AssignCustomizer
  ): TObject & TSource;

  /**
   * @see assignInWith
   */
  extendWith<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    customizer: AssignCustomizer
  ): TObject & TSource1 & TSource2;

  /**
   * @see assignInWith
   */
  extendWith<TObject, TSource1, TSource2, TSource3>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: AssignCustomizer
  ): TObject & TSource1 & TSource2 & TSource3;

  /**
   * @see assignInWith
   */
  extendWith<TObject, TSource1, TSource2, TSource3, TSource4>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: AssignCustomizer
  ): TObject & TSource1 & TSource2 & TSource3 & TSource4;

  /**
   * @see assignInWith
   */
  extendWith<TObject>(object: TObject): TObject;

  /**
   * @see assignInWith
   */
  extendWith<TResult>(
    object: any,
    ...otherArgs: any[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see assignInWith
   */
  extendWith<TSource>(
    source: TSource,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource>;

  /**
   * @see assignInWith
   */
  extendWith<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignInWith
   */
  extendWith<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignInWith
   */
  extendWith<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: AssignCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignInWith
   */
  extendWith(): LoDashImplicitObjectWrapper<T>;

  /**
   * @see assignInWith
   */
  extendWith<TResult>(...otherArgs: any[]): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see assignInWith
   */
  extendWith<TSource>(
    source: TSource,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource>;

  /**
   * @see assignInWith
   */
  extendWith<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see assignInWith
   */
  extendWith<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see assignInWith
   */
  extendWith<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: AssignCustomizer
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see assignInWith
   */
  extendWith(): LoDashExplicitObjectWrapper<T>;

  /**
   * @see assignInWith
   */
  extendWith<TResult>(...otherArgs: any[]): LoDashExplicitObjectWrapper<TResult>;
}

//findKey
interface LoDashStatic {
  /**
   * This method is like find except that it returns the key of the first element predicate returns truthy for
   * instead of the element itself.
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param object The object to search.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the key of the matched element, else undefined.
   */
  findKey<TValues, TObject>(
    object: TObject,
    predicate?: DictionaryIterator<TValues, boolean>
  ): string;

  /**
   * @see findKey
   */
  findKey<TObject>(
    object: TObject,
    predicate?: ObjectIterator<any, boolean>
  ): string;

  /**
   * @see findKey
   */
  findKey<TObject>(
    object: TObject,
    predicate?: string
  ): string;

  /**
   * @see findKey
   */
  findKey<TWhere extends Dictionary<any>, TObject>(
    object: TObject,
    predicate?: TWhere
  ): string;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see findKey
   */
  findKey<TValues>(
    predicate?: DictionaryIterator<TValues, boolean>
  ): string;

  /**
   * @see findKey
   */
  findKey(
    predicate?: ObjectIterator<any, boolean>
  ): string;

  /**
   * @see findKey
   */
  findKey(
    predicate?: string
  ): string;

  /**
   * @see findKey
   */
  findKey<TWhere extends Dictionary<any>>(
    predicate?: TWhere
  ): string;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see findKey
   */
  findKey<TValues>(
    predicate?: DictionaryIterator<TValues, boolean>
  ): LoDashExplicitWrapper<string>;

  /**
   * @see findKey
   */
  findKey(
    predicate?: ObjectIterator<any, boolean>
  ): LoDashExplicitWrapper<string>;

  /**
   * @see findKey
   */
  findKey(
    predicate?: string
  ): LoDashExplicitWrapper<string>;

  /**
   * @see findKey
   */
  findKey<TWhere extends Dictionary<any>>(
    predicate?: TWhere
  ): LoDashExplicitWrapper<string>;
}

//findLastKey
interface LoDashStatic {
  /**
   * This method is like findKey except that it iterates over elements of a collection in the opposite order.
   *
   * If a property name is provided for predicate the created property style callback returns the property
   * value of the given element.
   *
   * If a value is also provided for thisArg the created matchesProperty style callback returns true for
   * elements that have a matching property value, else false.
   *
   * If an object is provided for predicate the created matches style callback returns true for elements that
   * have the properties of the given object, else false.
   *
   * @param object The object to search.
   * @param predicate The function invoked per iteration.
   * @param thisArg The this binding of predicate.
   * @return Returns the key of the matched element, else undefined.
   */
  findLastKey<TValues, TObject>(
    object: TObject,
    predicate?: DictionaryIterator<TValues, boolean>
  ): string;

  /**
   * @see findLastKey
   */
  findLastKey<TObject>(
    object: TObject,
    predicate?: ObjectIterator<any, boolean>
  ): string;

  /**
   * @see findLastKey
   */
  findLastKey<TObject>(
    object: TObject,
    predicate?: string
  ): string;

  /**
   * @see findLastKey
   */
  findLastKey<TWhere extends Dictionary<any>, TObject>(
    object: TObject,
    predicate?: TWhere
  ): string;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see findLastKey
   */
  findLastKey<TValues>(
    predicate?: DictionaryIterator<TValues, boolean>
  ): string;

  /**
   * @see findLastKey
   */
  findLastKey(
    predicate?: ObjectIterator<any, boolean>
  ): string;

  /**
   * @see findLastKey
   */
  findLastKey(
    predicate?: string
  ): string;

  /**
   * @see findLastKey
   */
  findLastKey<TWhere extends Dictionary<any>>(
    predicate?: TWhere
  ): string;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see findLastKey
   */
  findLastKey<TValues>(
    predicate?: DictionaryIterator<TValues, boolean>
  ): LoDashExplicitWrapper<string>;

  /**
   * @see findLastKey
   */
  findLastKey(
    predicate?: ObjectIterator<any, boolean>
  ): LoDashExplicitWrapper<string>;

  /**
   * @see findLastKey
   */
  findLastKey(
    predicate?: string
  ): LoDashExplicitWrapper<string>;

  /**
   * @see findLastKey
   */
  findLastKey<TWhere extends Dictionary<any>>(
    predicate?: TWhere
  ): LoDashExplicitWrapper<string>;
}

//forIn
interface LoDashStatic {
  /**
   * Iterates over own and inherited enumerable properties of an object invoking iteratee for each property. The
   * iteratee is bound to thisArg and invoked with three arguments: (value, key, object). Iteratee functions may
   * exit iteration early by explicitly returning false.
   *
   * @param object The object to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   * @return Returns object.
   */
  forIn<T>(
    object: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see forIn
   */
  forIn<T extends {}>(
    object: T,
    iteratee?: ObjectIterator<any, any>
  ): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see forIn
   */
  forIn<TValue>(
    iteratee?: DictionaryIterator<TValue, any>
  ): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see forIn
   */
  forIn<TValue>(
    iteratee?: DictionaryIterator<TValue, any>
  ): LoDashExplicitObjectWrapper<T>;
}

//forInRight
interface LoDashStatic {
  /**
   * This method is like forIn except that it iterates over properties of object in the opposite order.
   *
   * @param object The object to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   * @return Returns object.
   */
  forInRight<T>(
    object: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see forInRight
   */
  forInRight<T extends {}>(
    object: T,
    iteratee?: ObjectIterator<any, any>
  ): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see forInRight
   */
  forInRight<TValue>(
    iteratee?: DictionaryIterator<TValue, any>
  ): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see forInRight
   */
  forInRight<TValue>(
    iteratee?: DictionaryIterator<TValue, any>
  ): LoDashExplicitObjectWrapper<T>;
}

//forOwn
interface LoDashStatic {
  /**
   * Iterates over own enumerable properties of an object invoking iteratee for each property. The iteratee is
   * bound to thisArg and invoked with three arguments: (value, key, object). Iteratee functions may exit
   * iteration early by explicitly returning false.
   *
   * @param object The object to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   * @return Returns object.
   */
  forOwn<T>(
    object: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see forOwn
   */
  forOwn<T extends {}>(
    object: T,
    iteratee?: ObjectIterator<any, any>
  ): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see forOwn
   */
  forOwn<TValue>(
    iteratee?: DictionaryIterator<TValue, any>
  ): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see forOwn
   */
  forOwn<TValue>(
    iteratee?: DictionaryIterator<TValue, any>
  ): LoDashExplicitObjectWrapper<T>;
}

//forOwnRight
interface LoDashStatic {
  /**
   * This method is like forOwn except that it iterates over properties of object in the opposite order.
   *
   * @param object The object to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   * @return Returns object.
   */
  forOwnRight<T>(
    object: Dictionary<T>,
    iteratee?: DictionaryIterator<T, any>
  ): Dictionary<T>;

  /**
   * @see forOwnRight
   */
  forOwnRight<T extends {}>(
    object: T,
    iteratee?: ObjectIterator<any, any>
  ): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see forOwnRight
   */
  forOwnRight<TValue>(
    iteratee?: DictionaryIterator<TValue, any>
  ): LoDashImplicitObjectWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see forOwnRight
   */
  forOwnRight<TValue>(
    iteratee?: DictionaryIterator<TValue, any>
  ): LoDashExplicitObjectWrapper<T>;
}

//functions
interface LoDashStatic {
  /**
   * Creates an array of function property names from own enumerable properties
   * of `object`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the new array of property names.
   * @example
   *
   * function Foo() {
     *   this.a = constant('a');
     *   this.b = constant('b');
     * }
   *
   * Foo.prototype.c = constant('c');
   *
   * functions(new Foo);
   * // => ['a', 'b']
   */
  functions<T extends {}>(object: any): string[];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see functions
   */
  functions(): LoDashImplicitArrayWrapper<string>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see functions
   */
  functions(): LoDashExplicitArrayWrapper<string>;
}

//functionsIn
interface LoDashStatic {
  /**
   * Creates an array of function property names from own and inherited
   * enumerable properties of `object`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the new array of property names.
   * @example
   *
   * function Foo() {
     *   this.a = constant('a');
     *   this.b = constant('b');
     * }
   *
   * Foo.prototype.c = constant('c');
   *
   * functionsIn(new Foo);
   * // => ['a', 'b', 'c']
   */
  functionsIn<T extends {}>(object: any): string[];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see functionsIn
   */
  functionsIn(): LoDashImplicitArrayWrapper<string>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see functionsIn
   */
  functionsIn(): LoDashExplicitArrayWrapper<string>;
}

//get
interface LoDashStatic {
  /**
   * Gets the property value at path of object. If the resolved value is undefined the defaultValue is used
   * in its place.
   *
   * @param object The object to query.
   * @param path The path of the property to get.
   * @param defaultValue The value returned if the resolved value is undefined.
   * @return Returns the resolved value.
   */
  get<TObject, TResult>(
    object: TObject,
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult
  ): TResult;

  /**
   * @see get
   */
  get<TResult>(
    object: any,
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult
  ): TResult;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see get
   */
  get<TResult>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult
  ): TResult;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see get
   */
  get<TResult>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see get
   */
  get<TResult>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult
  ): TResult;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see get
   */
  get<TResultWrapper>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: any
  ): TResultWrapper;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see get
   */
  get<TResultWrapper>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: any
  ): TResultWrapper;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see get
   */
  get<TResultWrapper>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: any
  ): TResultWrapper;
}

//has
interface LoDashStatic {
  /**
   * Checks if `path` is a direct property of `object`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = { 'a': { 'b': { 'c': 3 } } };
   * var other = create({ 'a': create({ 'b': create({ 'c': 3 }) }) });
   *
   * has(object, 'a');
   * // => true
   *
   * has(object, 'a.b.c');
   * // => true
   *
   * has(object, ['a', 'b', 'c']);
   * // => true
   *
   * has(other, 'a');
   * // => false
   */
  has<T extends {}>(
    object: T,
    path: StringRepresentable|StringRepresentable[]
  ): boolean;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see has
   */
  has(path: StringRepresentable|StringRepresentable[]): boolean;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see has
   */
  has(path: StringRepresentable|StringRepresentable[]): LoDashExplicitWrapper<boolean>;
}

//hasIn
interface LoDashStatic {
  /**
   * Checks if `path` is a direct or inherited property of `object`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = create({ 'a': create({ 'b': create({ 'c': 3 }) }) });
   *
   * hasIn(object, 'a');
   * // => true
   *
   * hasIn(object, 'a.b.c');
   * // => true
   *
   * hasIn(object, ['a', 'b', 'c']);
   * // => true
   *
   * hasIn(object, 'b');
   * // => false
   */
  hasIn<T extends {}>(
    object: T,
    path: StringRepresentable|StringRepresentable[]
  ): boolean;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see hasIn
   */
  hasIn(path: StringRepresentable|StringRepresentable[]): boolean;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see hasIn
   */
  hasIn(path: StringRepresentable|StringRepresentable[]): LoDashExplicitWrapper<boolean>;
}

//invert
interface LoDashStatic {
  /**
   * Creates an object composed of the inverted keys and values of object. If object contains duplicate values,
   * subsequent values overwrite property assignments of previous values unless multiValue is true.
   *
   * @param object The object to invert.
   * @param multiValue Allow multiple values per key.
   * @return Returns the new inverted object.
   */
  invert<T extends {}, TResult extends {}>(
    object: T,
    multiValue?: boolean
  ): TResult;

  /**
   * @see invert
   */
  invert<TResult extends {}>(
    object: Object,
    multiValue?: boolean
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see invert
   */
  invert<TResult extends {}>(multiValue?: boolean): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see invert
   */
  invert<TResult extends {}>(multiValue?: boolean): LoDashExplicitObjectWrapper<TResult>;
}

//inverBy
interface InvertByIterator<T> {
  (value: T): any;
}

interface LoDashStatic {
  /**
   * This method is like invert except that the inverted object is generated from the results of running each
   * element of object through iteratee. The corresponding inverted value of each inverted key is an array of
   * keys responsible for generating the inverted value. The iteratee is invoked with one argument: (value).
   *
   * @param object The object to invert.
   * @param interatee The iteratee invoked per element.
   * @return Returns the new inverted object.
   */
  invertBy(
    object: Object,
    interatee?: InvertByIterator<any>|string
  ): Dictionary<string[]>;

  /**
   * @see invertBy
   */
  invertBy<T>(
    object: Dictionary<T>|NumericDictionary<T>,
    interatee?: InvertByIterator<T>|string
  ): Dictionary<string[]>;

  /**
   * @see invertBy
   */
  invertBy<W>(
    object: Object,
    interatee?: W
  ): Dictionary<string[]>;

  /**
   * @see invertBy
   */
  invertBy<T, W>(
    object: Dictionary<T>,
    interatee?: W
  ): Dictionary<string[]>;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see invertBy
   */
  invertBy(
    interatee?: InvertByIterator<any>
  ): LoDashImplicitObjectWrapper<Dictionary<string[]>>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see invertBy
   */
  invertBy(
    interatee?: InvertByIterator<T>|string
  ): LoDashImplicitObjectWrapper<Dictionary<string[]>>;

  /**
   * @see invertBy
   */
  invertBy<W>(
    interatee?: W
  ): LoDashImplicitObjectWrapper<Dictionary<string[]>>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see invertBy
   */
  invertBy(
    interatee?: InvertByIterator<any>|string
  ): LoDashImplicitObjectWrapper<Dictionary<string[]>>;

  /**
   * @see invertBy
   */
  invertBy<W>(
    interatee?: W
  ): LoDashImplicitObjectWrapper<Dictionary<string[]>>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see invertBy
   */
  invertBy(
    interatee?: InvertByIterator<any>
  ): LoDashExplicitObjectWrapper<Dictionary<string[]>>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see invertBy
   */
  invertBy(
    interatee?: InvertByIterator<T>|string
  ): LoDashExplicitObjectWrapper<Dictionary<string[]>>;

  /**
   * @see invertBy
   */
  invertBy<W>(
    interatee?: W
  ): LoDashExplicitObjectWrapper<Dictionary<string[]>>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see invertBy
   */
  invertBy(
    interatee?: InvertByIterator<any>|string
  ): LoDashExplicitObjectWrapper<Dictionary<string[]>>;

  /**
   * @see invertBy
   */
  invertBy<W>(
    interatee?: W
  ): LoDashExplicitObjectWrapper<Dictionary<string[]>>;
}

//keys
interface LoDashStatic {
  /**
   * Creates an array of the own enumerable property names of object.
   *
   * Note: Non-object values are coerced to objects. See the ES spec for more details.
   *
   * @param object The object to query.
   * @return Returns the array of property names.
   */
  keys(object?: any): string[];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see keys
   */
  keys(): LoDashImplicitArrayWrapper<string>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see keys
   */
  keys(): LoDashExplicitArrayWrapper<string>;
}

//keysIn
interface LoDashStatic {
  /**
   * Creates an array of the own and inherited enumerable property names of object.
   *
   * Note: Non-object values are coerced to objects.
   *
   * @param object The object to query.
   * @return An array of property names.
   */
  keysIn(object?: any): string[];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see keysIn
   */
  keysIn(): LoDashImplicitArrayWrapper<string>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see keysIn
   */
  keysIn(): LoDashExplicitArrayWrapper<string>;
}

//mapKeys
interface LoDashStatic {
  /**
   * The opposite of mapValues; this method creates an object with the same values as object and keys generated
   * by running each own enumerable property of object through iteratee.
   *
   * @param object The object to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param thisArg The this binding of iteratee.
   * @return Returns the new mapped object.
   */
  mapKeys<T, TKey>(
    object: List<T>,
    iteratee?: ListIterator<T, TKey>
  ): Dictionary<T>;

  /**
   * @see mapKeys
   */
  mapKeys<T, TKey>(
    object: Dictionary<T>,
    iteratee?: DictionaryIterator<T, TKey>
  ): Dictionary<T>;

  /**
   * @see mapKeys
   */
  mapKeys<T, TObject extends {}>(
    object: List<T>|Dictionary<T>,
    iteratee?: TObject
  ): Dictionary<T>;

  /**
   * @see mapKeys
   */
  mapKeys<T>(
    object: List<T>|Dictionary<T>,
    iteratee?: string
  ): Dictionary<T>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see mapKeys
   */
  mapKeys<TKey>(
    iteratee?: ListIterator<T, TKey>
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see mapKeys
   */
  mapKeys<TObject extends {}>(
    iteratee?: TObject
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see mapKeys
   */
  mapKeys(
    iteratee?: string
  ): LoDashImplicitObjectWrapper<Dictionary<T>>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see mapKeys
   */
  mapKeys<TResult, TKey>(
    iteratee?: ListIterator<TResult, TKey>|DictionaryIterator<TResult, TKey>
  ): LoDashImplicitObjectWrapper<Dictionary<TResult>>;

  /**
   * @see mapKeys
   */
  mapKeys<TResult, TObject extends {}>(
    iteratee?: TObject
  ): LoDashImplicitObjectWrapper<Dictionary<TResult>>;

  /**
   * @see mapKeys
   */
  mapKeys<TResult>(
    iteratee?: string
  ): LoDashImplicitObjectWrapper<Dictionary<TResult>>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see mapKeys
   */
  mapKeys<TKey>(
    iteratee?: ListIterator<T, TKey>
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see mapKeys
   */
  mapKeys<TObject extends {}>(
    iteratee?: TObject
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;

  /**
   * @see mapKeys
   */
  mapKeys(
    iteratee?: string
  ): LoDashExplicitObjectWrapper<Dictionary<T>>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see mapKeys
   */
  mapKeys<TResult, TKey>(
    iteratee?: ListIterator<TResult, TKey>|DictionaryIterator<TResult, TKey>
  ): LoDashExplicitObjectWrapper<Dictionary<TResult>>;

  /**
   * @see mapKeys
   */
  mapKeys<TResult, TObject extends {}>(
    iteratee?: TObject
  ): LoDashExplicitObjectWrapper<Dictionary<TResult>>;

  /**
   * @see mapKeys
   */
  mapKeys<TResult>(
    iteratee?: string
  ): LoDashExplicitObjectWrapper<Dictionary<TResult>>;
}

//mapValues
interface LoDashStatic {
  /**
   * Creates an object with the same keys as object and values generated by running each own
   * enumerable property of object through iteratee. The iteratee function is bound to thisArg
   * and invoked with three arguments: (value, key, object).
   *
   * If a property name is provided iteratee the created "property" style callback returns
   * the property value of the given element.
   *
   * If a value is also provided for thisArg the creted "matchesProperty" style callback returns
   * true for elements that have a matching property value, else false;.
   *
   * If an object is provided for iteratee the created "matches" style callback returns true
   * for elements that have the properties of the given object, else false.
   *
   * @param {Object} object The object to iterate over.
   * @param {Function|Object|string} [iteratee=identity]  The function invoked per iteration.
   * @param {Object} [thisArg] The `this` binding of `iteratee`.
   * @return {Object} Returns the new mapped object.
   */
  mapValues<T, TResult>(obj: Dictionary<T>, callback: ObjectIterator<T, TResult>): Dictionary<TResult>;
  mapValues<T>(obj: Dictionary<T>, where: Dictionary<T>): Dictionary<boolean>;
  mapValues<T, TMapped>(obj: T, pluck: string): TMapped;
  mapValues<T>(obj: T, callback: ObjectIterator<any, any>): T;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see mapValues
   * TValue is the type of the property values of T.
   * TResult is the type output by the ObjectIterator function
   */
  mapValues<TValue, TResult>(callback: ObjectIterator<TValue, TResult>): LoDashImplicitObjectWrapper<Dictionary<TResult>>;

  /**
   * @see mapValues
   * TResult is the type of the property specified by pluck.
   * T should be a Dictionary<Dictionary<TResult>>
   */
  mapValues<TResult>(pluck: string): LoDashImplicitObjectWrapper<Dictionary<TResult>>;

  /**
   * @see mapValues
   * TResult is the type of the properties of each object in the values of T
   * T should be a Dictionary<Dictionary<TResult>>
   */
  mapValues<TResult>(where: Dictionary<TResult>): LoDashImplicitArrayWrapper<boolean>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see mapValues
   * TValue is the type of the property values of T.
   * TResult is the type output by the ObjectIterator function
   */
  mapValues<TValue, TResult>(callback: ObjectIterator<TValue, TResult>): LoDashExplicitObjectWrapper<Dictionary<TResult>>;

  /**
   * @see mapValues
   * TResult is the type of the property specified by pluck.
   * T should be a Dictionary<Dictionary<TResult>>
   */
  mapValues<TResult>(pluck: string): LoDashExplicitObjectWrapper<Dictionary<TResult>>;

  /**
   * @see mapValues
   * TResult is the type of the properties of each object in the values of T
   * T should be a Dictionary<Dictionary<TResult>>
   */
  mapValues<TResult>(where: Dictionary<TResult>): LoDashExplicitObjectWrapper<boolean>;
}

//merge
interface LoDashStatic {
  /**
   * Recursively merges own and inherited enumerable properties of source
   * objects into the destination object, skipping source properties that resolve
   * to `undefined`. Array and plain object properties are merged recursively.
   * Other objects and value types are overridden by assignment. Source objects
   * are applied from left to right. Subsequent sources overwrite property
   * assignments of previous sources.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
   *
   * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
   *
   * merge(users, ages);
   * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
   */
  merge<TObject, TSource>(
    object: TObject,
    source: TSource
  ): TObject & TSource;

  /**
   * @see merge
   */
  merge<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2
  ): TObject & TSource1 & TSource2;

  /**
   * @see merge
   */
  merge<TObject, TSource1, TSource2, TSource3>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): TObject & TSource1 & TSource2 & TSource3;

  /**
   * @see merge
   */
  merge<TObject, TSource1, TSource2, TSource3, TSource4>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): TObject & TSource1 & TSource2 & TSource3 & TSource4;

  /**
   * @see merge
   */
  merge<TResult>(
    object: any,
    ...otherArgs: any[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see merge
   */
  merge<TSource>(
    source: TSource
  ): LoDashImplicitObjectWrapper<T & TSource>;

  /**
   * @see merge
   */
  merge<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see merge
   */
  merge<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see merge
   */
  merge<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see merge
   */
  merge<TResult>(
    ...otherArgs: any[]
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see merge
   */
  merge<TSource>(
    source: TSource
  ): LoDashExplicitObjectWrapper<T & TSource>;

  /**
   * @see merge
   */
  merge<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see merge
   */
  merge<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see merge
   */
  merge<TSource1, TSource2, TSource3, TSource4>(
  ): LoDashExplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see merge
   */
  merge<TResult>(
    ...otherArgs: any[]
  ): LoDashExplicitObjectWrapper<TResult>;
}

//mergeWith
interface MergeWithCustomizer {
  (value: any, srcValue: any, key?: string, object?: Object, source?: Object): any;
}

interface LoDashStatic {
  /**
   * This method is like `merge` except that it accepts `customizer` which
   * is invoked to produce the merged values of the destination and source
   * properties. If `customizer` returns `undefined` merging is handled by the
   * method instead. The `customizer` is invoked with seven arguments:
   * (objValue, srcValue, key, object, source, stack).
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} sources The source objects.
   * @param {Function} customizer The function to customize assigned values.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function customizer(objValue, srcValue) {
     *   if (isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
   *
   * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
   *
   * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
   *
   * merge(object, other, customizer);
   * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
   */
  mergeWith<TObject, TSource>(
    object: TObject,
    source: TSource,
    customizer: MergeWithCustomizer
  ): TObject & TSource;

  /**
   * @see mergeWith
   */
  mergeWith<TObject, TSource1, TSource2>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    customizer: MergeWithCustomizer
  ): TObject & TSource1 & TSource2;

  /**
   * @see mergeWith
   */
  mergeWith<TObject, TSource1, TSource2, TSource3>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: MergeWithCustomizer
  ): TObject & TSource1 & TSource2 & TSource3;

  /**
   * @see mergeWith
   */
  mergeWith<TObject, TSource1, TSource2, TSource3, TSource4>(
    object: TObject,
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: MergeWithCustomizer
  ): TObject & TSource1 & TSource2 & TSource3 & TSource4;

  /**
   * @see mergeWith
   */
  mergeWith<TResult>(
    object: any,
    ...otherArgs: any[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see mergeWith
   */
  mergeWith<TSource>(
    source: TSource,
    customizer: MergeWithCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource>;

  /**
   * @see mergeWith
   */
  mergeWith<TSource1, TSource2>(
    source1: TSource1,
    source2: TSource2,
    customizer: MergeWithCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2>;

  /**
   * @see mergeWith
   */
  mergeWith<TSource1, TSource2, TSource3>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    customizer: MergeWithCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3>;

  /**
   * @see mergeWith
   */
  mergeWith<TSource1, TSource2, TSource3, TSource4>(
    source1: TSource1,
    source2: TSource2,
    source3: TSource3,
    source4: TSource4,
    customizer: MergeWithCustomizer
  ): LoDashImplicitObjectWrapper<T & TSource1 & TSource2 & TSource3 & TSource4>;

  /**
   * @see mergeWith
   */
  mergeWith<TResult>(
    ...otherArgs: any[]
  ): LoDashImplicitObjectWrapper<TResult>;
}

//omit
interface LoDashStatic {
  /**
   * The opposite of `pick`; this method creates an object composed of the
   * own and inherited enumerable properties of `object` that are not omitted.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The source object.
   * @param {...(string|string[])} [props] The property names to omit, specified
   *  individually or in arrays..
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * omit(object, ['a', 'c']);
   * // => { 'b': '2' }
   */

  omit<TResult extends {}, T extends {}>(
    object: T,
    ...predicate: (StringRepresentable|StringRepresentable[])[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {

  /**
   * @see omit
   */
  omit<TResult extends {}>(
    ...predicate: (StringRepresentable|StringRepresentable[])[]
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {

  /**
   * @see omit
   */
  omit<TResult extends {}>(
    ...predicate: (StringRepresentable|StringRepresentable[])[]
  ): LoDashExplicitObjectWrapper<TResult>;
}

//omitBy
interface LoDashStatic {
  /**
   * The opposite of `pickBy`; this method creates an object composed of the
   * own and inherited enumerable properties of `object` that `predicate`
   * doesn't return truthy for.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The source object.
   * @param {Function|Object|string} [predicate=identity] The function invoked per property.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * omitBy(object, isNumber);
   * // => { 'b': '2' }
   */
  omitBy<TResult extends {}, T extends {}>(
    object: T,
    predicate: ObjectIterator<any, boolean>
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see omitBy
   */
  omitBy<TResult extends {}>(
    predicate: ObjectIterator<any, boolean>
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see omitBy
   */
  omitBy<TResult extends {}>(
    predicate: ObjectIterator<any, boolean>
  ): LoDashExplicitObjectWrapper<TResult>;
}

//pick
interface LoDashStatic {
  /**
   * Creates an object composed of the picked `object` properties.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The source object.
   * @param {...(string|string[])} [props] The property names to pick, specified
   *  individually or in arrays.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * pick(object, ['a', 'c']);
   * // => { 'a': 1, 'c': 3 }
   */
  pick<TResult extends {}, T extends {}>(
    object: T,
    ...predicate: (StringRepresentable|StringRepresentable[])[]
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see pick
   */
  pick<TResult extends {}>(
    ...predicate: (StringRepresentable|StringRepresentable[])[]
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see pick
   */
  pick<TResult extends {}>(
    ...predicate: (StringRepresentable|StringRepresentable[])[]
  ): LoDashExplicitObjectWrapper<TResult>;
}

//pickBy
interface LoDashStatic {
  /**
   * Creates an object composed of the `object` properties `predicate` returns
   * truthy for. The predicate is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The source object.
   * @param {Function|Object|string} [predicate=identity] The function invoked per property.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * pickBy(object, isNumber);
   * // => { 'a': 1, 'c': 3 }
   */
  pickBy<TResult extends {}, T extends {}>(
    object: T,
    predicate?: ObjectIterator<any, boolean>
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see pickBy
   */
  pickBy<TResult extends {}>(
    predicate?: ObjectIterator<any, boolean>
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see pickBy
   */
  pickBy<TResult extends {}>(
    predicate?: ObjectIterator<any, boolean>
  ): LoDashExplicitObjectWrapper<TResult>;
}

//result
interface LoDashStatic {
  /**
   * This method is like get except that if the resolved value is a function it’s invoked with the this binding
   * of its parent object and its result is returned.
   *
   * @param object The object to query.
   * @param path The path of the property to resolve.
   * @param defaultValue The value returned if the resolved value is undefined.
   * @return Returns the resolved value.
   */
  result<TObject, TResult>(
    object: TObject,
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult|((...args: any[]) => TResult)
  ): TResult;

  /**
   * @see result
   */
  result<TResult>(
    object: any,
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult|((...args: any[]) => TResult)
  ): TResult;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see result
   */
  result<TResult>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult|((...args: any[]) => TResult)
  ): TResult;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see result
   */
  result<TResult>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult|((...args: any[]) => TResult)
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see result
   */
  result<TResult>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: TResult|((...args: any[]) => TResult)
  ): TResult;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see result
   */
  result<TResultWrapper>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: any
  ): TResultWrapper;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see result
   */
  result<TResultWrapper>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: any
  ): TResultWrapper;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see result
   */
  result<TResultWrapper>(
    path: StringRepresentable|StringRepresentable[],
    defaultValue?: any
  ): TResultWrapper;
}

//set
interface LoDashStatic {
  /**
   * Sets the value at path of object. If a portion of path doesn’t exist it’s created. Arrays are created for
   * missing index properties while objects are created for all other missing properties. Use setWith to
   * customize path creation.
   *
   * @param object The object to modify.
   * @param path The path of the property to set.
   * @param value The value to set.
   * @return Returns object.
   */
  set<TResult>(
    object: Object,
    path: StringRepresentable|StringRepresentable[],
    value: any
  ): TResult;

  /**
   * @see set
   */
  set<V, TResult>(
    object: Object,
    path: StringRepresentable|StringRepresentable[],
    value: V
  ): TResult;

  /**
   * @see set
   */
  set<O, V, TResult>(
    object: O,
    path: StringRepresentable|StringRepresentable[],
    value: V
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see set
   */
  set<TResult>(
    path: StringRepresentable|StringRepresentable[],
    value: any
  ): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see set
   */
  set<V, TResult>(
    path: StringRepresentable|StringRepresentable[],
    value: V
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see set
   */
  set<TResult>(
    path: StringRepresentable|StringRepresentable[],
    value: any
  ): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see set
   */
  set<V, TResult>(
    path: StringRepresentable|StringRepresentable[],
    value: V
  ): LoDashExplicitObjectWrapper<TResult>;
}

//setWith
interface SetWithCustomizer<T> {
  (nsValue: any, key: string, nsObject: T): any;
}

interface LoDashStatic {
  /**
   * This method is like set except that it accepts customizer which is invoked to produce the objects of
   * path. If customizer returns undefined path creation is handled by the method instead. The customizer is
   * invoked with three arguments: (nsValue, key, nsObject).
   *
   * @param object The object to modify.
   * @param path The path of the property to set.
   * @param value The value to set.
   * @parem customizer The function to customize assigned values.
   * @return Returns object.
   */
  setWith<TResult>(
    object: Object,
    path: StringRepresentable|StringRepresentable[],
    value: any,
    customizer?: SetWithCustomizer<Object>
  ): TResult;

  /**
   * @see setWith
   */
  setWith<V, TResult>(
    object: Object,
    path: StringRepresentable|StringRepresentable[],
    value: V,
    customizer?: SetWithCustomizer<Object>
  ): TResult;

  /**
   * @see setWith
   */
  setWith<O, V, TResult>(
    object: O,
    path: StringRepresentable|StringRepresentable[],
    value: V,
    customizer?: SetWithCustomizer<O>
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see setWith
   */
  setWith<TResult>(
    path: StringRepresentable|StringRepresentable[],
    value: any,
    customizer?: SetWithCustomizer<T>
  ): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see setWith
   */
  setWith<V, TResult>(
    path: StringRepresentable|StringRepresentable[],
    value: V,
    customizer?: SetWithCustomizer<T>
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see setWith
   */
  setWith<TResult>(
    path: StringRepresentable|StringRepresentable[],
    value: any,
    customizer?: SetWithCustomizer<T>
  ): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see setWith
   */
  setWith<V, TResult>(
    path: StringRepresentable|StringRepresentable[],
    value: V,
    customizer?: SetWithCustomizer<T>
  ): LoDashExplicitObjectWrapper<TResult>;
}

//toPairs
interface LoDashStatic {
  /**
   * Creates an array of own enumerable key-value pairs for object.
   *
   * @param object The object to query.
   * @return Returns the new array of key-value pairs.
   */
  toPairs<T extends {}>(object?: T): any[][];

  toPairs<T extends {}, TResult>(object?: T): TResult[][];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see toPairs
   */
  toPairs<TResult>(): LoDashImplicitArrayWrapper<TResult[]>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see toPairs
   */
  toPairs<TResult>(): LoDashExplicitArrayWrapper<TResult[]>;
}

//toPairsIn
interface LoDashStatic {
  /**
   * Creates an array of own and inherited enumerable key-value pairs for object.
   *
   * @param object The object to query.
   * @return Returns the new array of key-value pairs.
   */
  toPairsIn<T extends {}>(object?: T): any[][];

  toPairsIn<T extends {}, TResult>(object?: T): TResult[][];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see toPairsIn
   */
  toPairsIn<TResult>(): LoDashImplicitArrayWrapper<TResult[]>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see toPairsIn
   */
  toPairsIn<TResult>(): LoDashExplicitArrayWrapper<TResult[]>;
}

//transform
interface LoDashStatic {
  /**
   * An alternative to reduce; this method transforms object to a new accumulator object which is the result of
   * running each of its own enumerable properties through iteratee, with each invocation potentially mutating
   * the accumulator object. The iteratee is bound to thisArg and invoked with four arguments: (accumulator,
   * value, key, object). Iteratee functions may exit iteration early by explicitly returning false.
   *
   * @param object The object to iterate over.
   * @param iteratee The function invoked per iteration.
   * @param accumulator The custom accumulator value.
   * @param thisArg The this binding of iteratee.
   * @return Returns the accumulated value.
   */
  transform<T, TResult>(
    object: T[],
    iteratee?: MemoVoidArrayIterator<T, TResult[]>,
    accumulator?: TResult[]
  ): TResult[];

  /**
   * @see transform
   */
  transform<T, TResult>(
    object: T[],
    iteratee?: MemoVoidArrayIterator<T, Dictionary<TResult>>,
    accumulator?: Dictionary<TResult>
  ): Dictionary<TResult>;

  /**
   * @see transform
   */
  transform<T, TResult>(
    object: Dictionary<T>,
    iteratee?: MemoVoidDictionaryIterator<T, Dictionary<TResult>>,
    accumulator?: Dictionary<TResult>
  ): Dictionary<TResult>;

  /**
   * @see transform
   */
  transform<T, TResult>(
    object: Dictionary<T>,
    iteratee?: MemoVoidDictionaryIterator<T, TResult[]>,
    accumulator?: TResult[]
  ): TResult[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see transform
   */
  transform<TResult>(
    iteratee?: MemoVoidArrayIterator<T, TResult[]>,
    accumulator?: TResult[]
  ): LoDashImplicitArrayWrapper<TResult>;

  /**
   * @see transform
   */
  transform<TResult>(
    iteratee?: MemoVoidArrayIterator<T, Dictionary<TResult>>,
    accumulator?: Dictionary<TResult>
  ): LoDashImplicitObjectWrapper<Dictionary<TResult>>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see transform
   */
  transform<T, TResult>(
    iteratee?: MemoVoidDictionaryIterator<T, Dictionary<TResult>>,
    accumulator?: Dictionary<TResult>
  ): LoDashImplicitObjectWrapper<Dictionary<TResult>>;

  /**
   * @see transform
   */
  transform<T, TResult>(
    iteratee?: MemoVoidDictionaryIterator<T, TResult[]>,
    accumulator?: TResult[]
  ): LoDashImplicitArrayWrapper<TResult>;
}

//unset
interface LoDashStatic {
  /**
   * Removes the property at path of object.
   *
   * Note: This method mutates object.
   *
   * @param object The object to modify.
   * @param path The path of the property to unset.
   * @return Returns true if the property is deleted, else false.
   */
  unset<T>(
    object: T,
    path: StringRepresentable|StringRepresentable[]
  ): boolean;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see unset
   */
  unset(path: StringRepresentable|StringRepresentable[]): LoDashImplicitWrapper<boolean>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see unset
   */
  unset(path: StringRepresentable|StringRepresentable[]): LoDashExplicitWrapper<boolean>;
}

//update
interface LoDashStatic {
  /**
   * This method is like set except that accepts updater to produce the value to set. Use updateWith to
   * customize path creation. The updater is invoked with one argument: (value).
   *
   * @param object The object to modify.
   * @param path The path of the property to set.
   * @param updater The function to produce the updated value.
   * @return Returns object.
   */
  update<TResult>(
    object: Object,
    path: StringRepresentable|StringRepresentable[],
    updater: Function
  ): TResult;

  /**
   * @see update
   */
  update<U extends Function, TResult>(
    object: Object,
    path: StringRepresentable|StringRepresentable[],
    updater: U
  ): TResult;

  /**
   * @see update
   */
  update<O extends {}, TResult>(
    object: O,
    path: StringRepresentable|StringRepresentable[],
    updater: Function
  ): TResult;

  /**
   * @see update
   */
  update<O, U extends Function, TResult>(
    object: O,
    path: StringRepresentable|StringRepresentable[],
    updater: U
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see update
   */
  update<TResult>(
    path: StringRepresentable|StringRepresentable[],
    updater: any
  ): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see update
   */
  update<U extends Function, TResult>(
    path: StringRepresentable|StringRepresentable[],
    updater: U
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see update
   */
  update<TResult>(
    path: StringRepresentable|StringRepresentable[],
    updater: any
  ): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see update
   */
  update<U extends Function, TResult>(
    path: StringRepresentable|StringRepresentable[],
    updater: U
  ): LoDashExplicitObjectWrapper<TResult>;
}

//values
interface LoDashStatic {
  /**
   * Creates an array of the own enumerable property values of object.
   *
   * @param object The object to query.
   * @return Returns an array of property values.
   */
  values<T>(object?: Dictionary<T>): T[];

  /**
   * @see values
   */
  values<T>(object?: any): T[];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see values
   */
  values<T>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see values
   */
  values<T>(): LoDashExplicitArrayWrapper<T>;
}

//valuesIn
interface LoDashStatic {
  /**
   * Creates an array of the own and inherited enumerable property values of object.
   *
   * @param object The object to query.
   * @return Returns the array of property values.
   */
  valuesIn<T>(object?: Dictionary<T>): T[];

  /**
   * @see valuesIn
   */
  valuesIn<T>(object?: any): T[];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see valuesIn
   */
  valuesIn<T>(): LoDashImplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see valuesIn
   */
  valuesIn<T>(): LoDashExplicitArrayWrapper<T>;
}

/**********
 * String *
 **********/

//camelCase
interface LoDashStatic {
  /**
   * Converts string to camel case.
   *
   * @param string The string to convert.
   * @return Returns the camel cased string.
   */
  camelCase(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see camelCase
   */
  camelCase(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see camelCase
   */
  camelCase(): LoDashExplicitWrapper<string>;
}

//capitalize
interface LoDashStatic {
  /**
   * Converts the first character of string to upper case and the remaining to lower case.
   *
   * @param string The string to capitalize.
   * @return Returns the capitalized string.
   */
  capitalize(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see capitalize
   */
  capitalize(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see capitalize
   */
  capitalize(): LoDashExplicitWrapper<string>;
}

//deburr
interface LoDashStatic {
  /**
   * Deburrs string by converting latin-1 supplementary letters to basic latin letters and removing combining
   * diacritical marks.
   *
   * @param string The string to deburr.
   * @return Returns the deburred string.
   */
  deburr(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see deburr
   */
  deburr(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see deburr
   */
  deburr(): LoDashExplicitWrapper<string>;
}

//endsWith
interface LoDashStatic {
  /**
   * Checks if string ends with the given target string.
   *
   * @param string The string to search.
   * @param target The string to search for.
   * @param position The position to search from.
   * @return Returns true if string ends with target, else false.
   */
  endsWith(
    string?: string,
    target?: string,
    position?: number
  ): boolean;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see endsWith
   */
  endsWith(
    target?: string,
    position?: number
  ): boolean;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see endsWith
   */
  endsWith(
    target?: string,
    position?: number
  ): LoDashExplicitWrapper<boolean>;
}

// escape
interface LoDashStatic {
  /**
   * Converts the characters "&", "<", ">", '"', "'", and "`" in string to their corresponding HTML entities.
   *
   * Note: No other characters are escaped. To escape additional characters use a third-party library like he.
   *
   * hough the ">" character is escaped for symmetry, characters like ">" and "/" don’t need escaping in HTML
   * and have no special meaning unless they're part of a tag or unquoted attribute value. See Mathias Bynens’s
   * article (under "semi-related fun fact") for more details.
   *
   * Backticks are escaped because in IE < 9, they can break out of attribute values or HTML comments. See #59,
   * #102, #108, and #133 of the HTML5 Security Cheatsheet for more details.
   *
   * When working with HTML you should always quote attribute values to reduce XSS vectors.
   *
   * @param string The string to escape.
   * @return Returns the escaped string.
   */
  escape(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see escape
   */
  escape(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see escape
   */
  escape(): LoDashExplicitWrapper<string>;
}

// escapeRegExp
interface LoDashStatic {
  /**
   * Escapes the RegExp special characters "^", "$", "\", ".", "*", "+", "?", "(", ")", "[", "]",
   * "{", "}", and "|" in string.
   *
   * @param string The string to escape.
   * @return Returns the escaped string.
   */
  escapeRegExp(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see escapeRegExp
   */
  escapeRegExp(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see escapeRegExp
   */
  escapeRegExp(): LoDashExplicitWrapper<string>;
}

//kebabCase
interface LoDashStatic {
  /**
   * Converts string to kebab case.
   *
   * @param string The string to convert.
   * @return Returns the kebab cased string.
   */
  kebabCase(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see kebabCase
   */
  kebabCase(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see kebabCase
   */
  kebabCase(): LoDashExplicitWrapper<string>;
}

//lowerCase
interface LoDashStatic {
  /**
   * Converts `string`, as space separated words, to lower case.
   *
   * @param string The string to convert.
   * @return Returns the lower cased string.
   */
  lowerCase(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see lowerCase
   */
  lowerCase(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see lowerCase
   */
  lowerCase(): LoDashExplicitWrapper<string>;
}

//lowerFirst
interface LoDashStatic {
  /**
   * Converts the first character of `string` to lower case.
   *
   * @param string The string to convert.
   * @return Returns the converted string.
   */
  lowerFirst(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see lowerFirst
   */
  lowerFirst(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see lowerFirst
   */
  lowerFirst(): LoDashExplicitWrapper<string>;
}

//pad
interface LoDashStatic {
  /**
   * Pads string on the left and right sides if it’s shorter than length. Padding characters are truncated if
   * they can’t be evenly divided by length.
   *
   * @param string The string to pad.
   * @param length The padding length.
   * @param chars The string used as padding.
   * @return Returns the padded string.
   */
  pad(
    string?: string,
    length?: number,
    chars?: string
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see pad
   */
  pad(
    length?: number,
    chars?: string
  ): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see pad
   */
  pad(
    length?: number,
    chars?: string
  ): LoDashExplicitWrapper<string>;
}

//padEnd
interface LoDashStatic {
  /**
   * Pads string on the right side if it’s shorter than length. Padding characters are truncated if they exceed
   * length.
   *
   * @param string The string to pad.
   * @param length The padding length.
   * @param chars The string used as padding.
   * @return Returns the padded string.
   */
  padEnd(
    string?: string,
    length?: number,
    chars?: string
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see padEnd
   */
  padEnd(
    length?: number,
    chars?: string
  ): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see padEnd
   */
  padEnd(
    length?: number,
    chars?: string
  ): LoDashExplicitWrapper<string>;
}

//padStart
interface LoDashStatic {
  /**
   * Pads string on the left side if it’s shorter than length. Padding characters are truncated if they exceed
   * length.
   *
   * @param string The string to pad.
   * @param length The padding length.
   * @param chars The string used as padding.
   * @return Returns the padded string.
   */
  padStart(
    string?: string,
    length?: number,
    chars?: string
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see padStart
   */
  padStart(
    length?: number,
    chars?: string
  ): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see padStart
   */
  padStart(
    length?: number,
    chars?: string
  ): LoDashExplicitWrapper<string>;
}

//parseInt
interface LoDashStatic {
  /**
   * Converts string to an integer of the specified radix. If radix is undefined or 0, a radix of 10 is used
   * unless value is a hexadecimal, in which case a radix of 16 is used.
   *
   * Note: This method aligns with the ES5 implementation of parseInt.
   *
   * @param string The string to convert.
   * @param radix The radix to interpret value by.
   * @return Returns the converted integer.
   */
  parseInt(
    string: string,
    radix?: number
  ): number;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see parseInt
   */
  parseInt(radix?: number): number;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see parseInt
   */
  parseInt(radix?: number): LoDashExplicitWrapper<number>;
}

//repeat
interface LoDashStatic {
  /**
   * Repeats the given string n times.
   *
   * @param string The string to repeat.
   * @param n The number of times to repeat the string.
   * @return Returns the repeated string.
   */
  repeat(
    string?: string,
    n?: number
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see repeat
   */
  repeat(n?: number): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see repeat
   */
  repeat(n?: number): LoDashExplicitWrapper<string>;
}

//replace
interface LoDashStatic {
  /**
   * Replaces matches for pattern in string with replacement.
   *
   * Note: This method is based on String#replace.
   *
   * @param string
   * @param pattern
   * @param replacement
   * @return Returns the modified string.
   */
  replace(
    string: string,
    pattern: RegExp|string,
    replacement: Function|string
  ): string;

  /**
   * @see replace
   */
  replace(
    pattern?: RegExp|string,
    replacement?: Function|string
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see replace
   */
  replace(
    pattern?: RegExp|string,
    replacement?: Function|string
  ): string;

  /**
   * @see replace
   */
  replace(
    replacement?: Function|string
  ): string;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see replace
   */
  replace(
    pattern?: RegExp|string,
    replacement?: Function|string
  ): string;

  /**
   * @see replace
   */
  replace(
    replacement?: Function|string
  ): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see replace
   */
  replace(
    pattern?: RegExp|string,
    replacement?: Function|string
  ): LoDashExplicitWrapper<string>;

  /**
   * @see replace
   */
  replace(
    replacement?: Function|string
  ): LoDashExplicitWrapper<string>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see replace
   */
  replace(
    pattern?: RegExp|string,
    replacement?: Function|string
  ): LoDashExplicitWrapper<string>;

  /**
   * @see replace
   */
  replace(
    replacement?: Function|string
  ): LoDashExplicitWrapper<string>;
}

//snakeCase
interface LoDashStatic {
  /**
   * Converts string to snake case.
   *
   * @param string The string to convert.
   * @return Returns the snake cased string.
   */
  snakeCase(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see snakeCase
   */
  snakeCase(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see snakeCase
   */
  snakeCase(): LoDashExplicitWrapper<string>;
}

//split
interface LoDashStatic {
  /**
   * Splits string by separator.
   *
   * Note: This method is based on String#split.
   *
   * @param string
   * @param separator
   * @param limit
   * @return Returns the new array of string segments.
   */
  split(
    string: string,
    separator?: RegExp|string,
    limit?: number
  ): string[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see split
   */
  split(
    separator?: RegExp|string,
    limit?: number
  ): LoDashImplicitArrayWrapper<string>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see split
   */
  split(
    separator?: RegExp|string,
    limit?: number
  ): LoDashExplicitArrayWrapper<string>;
}

//startCase
interface LoDashStatic {
  /**
   * Converts string to start case.
   *
   * @param string The string to convert.
   * @return Returns the start cased string.
   */
  startCase(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see startCase
   */
  startCase(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see startCase
   */
  startCase(): LoDashExplicitWrapper<string>;
}

//startsWith
interface LoDashStatic {
  /**
   * Checks if string starts with the given target string.
   *
   * @param string The string to search.
   * @param target The string to search for.
   * @param position The position to search from.
   * @return Returns true if string starts with target, else false.
   */
  startsWith(
    string?: string,
    target?: string,
    position?: number
  ): boolean;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see startsWith
   */
  startsWith(
    target?: string,
    position?: number
  ): boolean;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see startsWith
   */
  startsWith(
    target?: string,
    position?: number
  ): LoDashExplicitWrapper<boolean>;
}

//template
interface TemplateOptions extends TemplateSettings {
  /**
   * The sourceURL of the template's compiled source.
   */
  sourceURL?: string;
}

interface TemplateExecutor {
  (data?: Object): string;
  source: string;
}

interface LoDashStatic {
  /**
   * Creates a compiled template function that can interpolate data properties in "interpolate" delimiters,
   * HTML-escape interpolated data properties in "escape" delimiters, and execute JavaScript in "evaluate"
   * delimiters. Data properties may be accessed as free variables in the template. If a setting object is
   * provided it takes precedence over templateSettings values.
   *
   * Note: In the development build template utilizes
   * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl) for easier
   * debugging.
   *
   * For more information on precompiling templates see
   * [lodash's custom builds documentation](https://lodash.com/custom-builds).
   *
   * For more information on Chrome extension sandboxes see
   * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
   *
   * @param string The template string.
   * @param options The options object.
   * @param options.escape The HTML "escape" delimiter.
   * @param options.evaluate The "evaluate" delimiter.
   * @param options.imports An object to import into the template as free variables.
   * @param options.interpolate The "interpolate" delimiter.
   * @param options.sourceURL The sourceURL of the template's compiled source.
   * @param options.variable The data object variable name.
   * @return Returns the compiled template function.
   */
  template(
    string: string,
    options?: TemplateOptions
  ): TemplateExecutor;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see template
   */
  template(options?: TemplateOptions): TemplateExecutor;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see template
   */
  template(options?: TemplateOptions): LoDashExplicitObjectWrapper<TemplateExecutor>;
}

//toLower
interface LoDashStatic {
  /**
   * Converts `string`, as a whole, to lower case.
   *
   * @param string The string to convert.
   * @return Returns the lower cased string.
   */
  toLower(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see toLower
   */
  toLower(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see toLower
   */
  toLower(): LoDashExplicitWrapper<string>;
}

//toUpper
interface LoDashStatic {
  /**
   * Converts `string`, as a whole, to upper case.
   *
   * @param string The string to convert.
   * @return Returns the upper cased string.
   */
  toUpper(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see toUpper
   */
  toUpper(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see toUpper
   */
  toUpper(): LoDashExplicitWrapper<string>;
}

//trim
interface LoDashStatic {
  /**
   * Removes leading and trailing whitespace or specified characters from string.
   *
   * @param string The string to trim.
   * @param chars The characters to trim.
   * @return Returns the trimmed string.
   */
  trim(
    string?: string,
    chars?: string
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see trim
   */
  trim(chars?: string): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see trim
   */
  trim(chars?: string): LoDashExplicitWrapper<string>;
}

//trimEnd
interface LoDashStatic {
  /**
   * Removes trailing whitespace or specified characters from string.
   *
   * @param string The string to trim.
   * @param chars The characters to trim.
   * @return Returns the trimmed string.
   */
  trimEnd(
    string?: string,
    chars?: string
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see trimEnd
   */
  trimEnd(chars?: string): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see trimEnd
   */
  trimEnd(chars?: string): LoDashExplicitWrapper<string>;
}

//trimStart
interface LoDashStatic {
  /**
   * Removes leading whitespace or specified characters from string.
   *
   * @param string The string to trim.
   * @param chars The characters to trim.
   * @return Returns the trimmed string.
   */
  trimStart(
    string?: string,
    chars?: string
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see trimStart
   */
  trimStart(chars?: string): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see trimStart
   */
  trimStart(chars?: string): LoDashExplicitWrapper<string>;
}

//truncate
interface TruncateOptions {
  /** The maximum string length. */
  length?: number;
  /** The string to indicate text is omitted. */
  omission?: string;
  /** The separator pattern to truncate to. */
  separator?: string|RegExp;
}

interface LoDashStatic {
  /**
   * Truncates string if it’s longer than the given maximum string length. The last characters of the truncated
   * string are replaced with the omission string which defaults to "…".
   *
   * @param string The string to truncate.
   * @param options The options object or maximum string length.
   * @return Returns the truncated string.
   */
  truncate(
    string?: string,
    options?: TruncateOptions
  ): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see truncate
   */
  truncate(options?: TruncateOptions): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see truncate
   */
  truncate(options?: TruncateOptions): LoDashExplicitWrapper<string>;
}

//unescape
interface LoDashStatic {
  /**
   * The inverse of escape; this method converts the HTML entities &amp;, &lt;, &gt;, &quot;, &#39;, and &#96;
   * in string to their corresponding characters.
   *
   * Note: No other HTML entities are unescaped. To unescape additional HTML entities use a third-party library
   * like he.
   *
   * @param string The string to unescape.
   * @return Returns the unescaped string.
   */
  unescape(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see unescape
   */
  unescape(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see unescape
   */
  unescape(): LoDashExplicitWrapper<string>;
}

//upperCase
interface LoDashStatic {
  /**
   * Converts `string`, as space separated words, to upper case.
   *
   * @param string The string to convert.
   * @return Returns the upper cased string.
   */
  upperCase(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see upperCase
   */
  upperCase(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see upperCase
   */
  upperCase(): LoDashExplicitWrapper<string>;
}

//upperFirst
interface LoDashStatic {
  /**
   * Converts the first character of `string` to upper case.
   *
   * @param string The string to convert.
   * @return Returns the converted string.
   */
  upperFirst(string?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see upperFirst
   */
  upperFirst(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see upperFirst
   */
  upperFirst(): LoDashExplicitWrapper<string>;
}

//words
interface LoDashStatic {
  /**
   * Splits `string` into an array of its words.
   *
   * @param string The string to inspect.
   * @param pattern The pattern to match words.
   * @return Returns the words of `string`.
   */
  words(
    string?: string,
    pattern?: string|RegExp
  ): string[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see words
   */
  words(pattern?: string|RegExp): string[];
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see words
   */
  words(pattern?: string|RegExp): LoDashExplicitArrayWrapper<string>;
}

/***********
 * Utility *
 ***********/

//attempt
interface LoDashStatic {
  /**
   * Attempts to invoke func, returning either the result or the caught error object. Any additional arguments
   * are provided to func when it’s invoked.
   *
   * @param func The function to attempt.
   * @return Returns the func result or error object.
   */
  attempt<TResult>(func: (...args: any[]) => TResult, ...args: any[]): TResult|Error;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see attempt
   */
  attempt<TResult>(...args: any[]): TResult|Error;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see attempt
   */
  attempt<TResult>(...args: any[]): LoDashExplicitObjectWrapper<TResult|Error>;
}

//constant
interface LoDashStatic {
  /**
   * Creates a function that returns value.
   *
   * @param value The value to return from the new function.
   * @return Returns the new function.
   */
  constant<T>(value: T): () => T;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see constant
   */
  constant<TResult>(): LoDashImplicitObjectWrapper<() => TResult>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see constant
   */
  constant<TResult>(): LoDashExplicitObjectWrapper<() => TResult>;
}

//identity
interface LoDashStatic {
  /**
   * This method returns the first argument provided to it.
   *
   * @param value Any value.
   * @return Returns value.
   */
  identity<T>(value?: T): T;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see identity
   */
  identity(): T;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see identity
   */
  identity(): T[];
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see identity
   */
  identity(): T;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see identity
   */
  identity(): LoDashExplicitWrapper<T>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see identity
   */
  identity(): LoDashExplicitArrayWrapper<T>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see identity
   */
  identity(): LoDashExplicitObjectWrapper<T>;
}

//iteratee
interface LoDashStatic {
  /**
   * Creates a function that invokes `func` with the arguments of the created
   * function. If `func` is a property name the created callback returns the
   * property value for a given element. If `func` is an object the created
   * callback returns `true` for elements that contain the equivalent object properties, otherwise it returns `false`.
   *
   * @static
   * @memberOf _
   * @category Util
   * @param {*} [func=identity] The value to convert to a callback.
   * @returns {Function} Returns the callback.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * // create custom iteratee shorthands
   * iteratee = wrap(iteratee, function(callback, func) {
     *   var p = /^(\S+)\s*([<>])\s*(\S+)$/.exec(func);
     *   return !p ? callback(func) : function(object) {
     *     return (p[2] == '>' ? object[p[1]] > p[3] : object[p[1]] < p[3]);
     *   };
     * });
   *
   * filter(users, 'age > 36');
   * // => [{ 'user': 'fred', 'age': 40 }]
   */
  iteratee<TResult>(
    func: Function
  ): (...args: any[]) => TResult;

  /**
   * @see iteratee
   */
  iteratee<TResult>(
    func: string
  ): (object: any) => TResult;

  /**
   * @see iteratee
   */
  iteratee(
    func: Object
  ): (object: any) => boolean;

  /**
   * @see iteratee
   */
  iteratee<TResult>(): (value: TResult) => TResult;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see iteratee
   */
  iteratee<TResult>(): LoDashImplicitObjectWrapper<(object: any) => TResult>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see iteratee
   */
  iteratee(): LoDashImplicitObjectWrapper<(object: any) => boolean>;

  /**
   * @see iteratee
   */
  iteratee<TResult>(): LoDashImplicitObjectWrapper<(...args: any[]) => TResult>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see iteratee
   */
  iteratee<TResult>(): LoDashExplicitObjectWrapper<(object: any) => TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see iteratee
   */
  iteratee(): LoDashExplicitObjectWrapper<(object: any) => boolean>;

  /**
   * @see iteratee
   */
  iteratee<TResult>(): LoDashExplicitObjectWrapper<(...args: any[]) => TResult>;
}

//matches
interface LoDashStatic {
  /**
   * Creates a function that performs a deep comparison between a given object and source, returning true if the
   * given object has equivalent property values, else false.
   *
   * Note: This method supports comparing arrays, booleans, Date objects, numbers, Object objects, regexes, and
   * strings. Objects are compared by their own, not inherited, enumerable properties. For comparing a single own
   * or inherited property value see matchesProperty.
   *
   * @param source The object of property values to match.
   * @return Returns the new function.
   */
  matches<T>(source: T): (value: any) => boolean;

  /**
   * @see matches
   */
  matches<T, V>(source: T): (value: V) => boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see matches
   */
  matches<V>(): LoDashImplicitObjectWrapper<(value: V) => boolean>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see matches
   */
  matches<V>(): LoDashExplicitObjectWrapper<(value: V) => boolean>;
}

//matchesProperty
interface LoDashStatic {
  /**
   * Creates a function that compares the property value of path on a given object to value.
   *
   * Note: This method supports comparing arrays, booleans, Date objects, numbers, Object objects, regexes, and
   * strings. Objects are compared by their own, not inherited, enumerable properties.
   *
   * @param path The path of the property to get.
   * @param srcValue The value to match.
   * @return Returns the new function.
   */
  matchesProperty<T>(
    path: StringRepresentable|StringRepresentable[],
    srcValue: T
  ): (value: any) => boolean;

  /**
   * @see matchesProperty
   */
  matchesProperty<T, V>(
    path: StringRepresentable|StringRepresentable[],
    srcValue: T
  ): (value: V) => boolean;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see matchesProperty
   */
  matchesProperty<SrcValue>(
    srcValue: SrcValue
  ): LoDashImplicitObjectWrapper<(value: any) => boolean>;

  /**
   * @see matchesProperty
   */
  matchesProperty<SrcValue, Value>(
    srcValue: SrcValue
  ): LoDashImplicitObjectWrapper<(value: Value) => boolean>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see matchesProperty
   */
  matchesProperty<SrcValue>(
    srcValue: SrcValue
  ): LoDashExplicitObjectWrapper<(value: any) => boolean>;

  /**
   * @see matchesProperty
   */
  matchesProperty<SrcValue, Value>(
    srcValue: SrcValue
  ): LoDashExplicitObjectWrapper<(value: Value) => boolean>;
}

//method
interface LoDashStatic {
  /**
   * Creates a function that invokes the method at path on a given object. Any additional arguments are provided
   * to the invoked method.
   *
   * @param path The path of the method to invoke.
   * @param args The arguments to invoke the method with.
   * @return Returns the new function.
   */
  method<TObject, TResult>(
    path: string|StringRepresentable[],
    ...args: any[]
  ): (object: TObject) => TResult;

  /**
   * @see method
   */
  method<TResult>(
    path: string|StringRepresentable[],
    ...args: any[]
  ): (object: any) => TResult;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see method
   */
  method<TObject, TResult>(...args: any[]): LoDashImplicitObjectWrapper<(object: TObject) => TResult>;

  /**
   * @see method
   */
  method<TResult>(...args: any[]): LoDashImplicitObjectWrapper<(object: any) => TResult>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see method
   */
  method<TObject, TResult>(...args: any[]): LoDashImplicitObjectWrapper<(object: TObject) => TResult>;

  /**
   * @see method
   */
  method<TResult>(...args: any[]): LoDashImplicitObjectWrapper<(object: any) => TResult>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see method
   */
  method<TObject, TResult>(...args: any[]): LoDashExplicitObjectWrapper<(object: TObject) => TResult>;

  /**
   * @see method
   */
  method<TResult>(...args: any[]): LoDashExplicitObjectWrapper<(object: any) => TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see method
   */
  method<TObject, TResult>(...args: any[]): LoDashExplicitObjectWrapper<(object: TObject) => TResult>;

  /**
   * @see method
   */
  method<TResult>(...args: any[]): LoDashExplicitObjectWrapper<(object: any) => TResult>;
}

//methodOf
interface LoDashStatic {
  /**
   * The opposite of method; this method creates a function that invokes the method at a given path on object.
   * Any additional arguments are provided to the invoked method.
   *
   * @param object The object to query.
   * @param args The arguments to invoke the method with.
   * @return Returns the new function.
   */
  methodOf<TObject extends {}, TResult>(
    object: TObject,
    ...args: any[]
  ): (path: StringRepresentable|StringRepresentable[]) => TResult;

  /**
   * @see methodOf
   */
  methodOf<TResult>(
    object: {},
    ...args: any[]
  ): (path: StringRepresentable|StringRepresentable[]) => TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see methodOf
   */
  methodOf<TResult>(
    ...args: any[]
  ): LoDashImplicitObjectWrapper<(path: StringRepresentable|StringRepresentable[]) => TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see methodOf
   */
  methodOf<TResult>(
    ...args: any[]
  ): LoDashExplicitObjectWrapper<(path: StringRepresentable|StringRepresentable[]) => TResult>;
}

//mixin
interface MixinOptions {
  chain?: boolean;
}

interface LoDashStatic {
  /**
   * Adds all own enumerable function properties of a source object to the destination object. If object is a
   * function then methods are added to its prototype as well.
   *
   * Note: Use runInContext to create a pristine lodash function to avoid conflicts caused by modifying
   * the original.
   *
   * @param object The destination object.
   * @param source The object of functions to add.
   * @param options The options object.
   * @param options.chain Specify whether the functions added are chainable.
   * @return Returns object.
   */
  mixin<TResult, TObject>(
    object: TObject,
    source: Dictionary<Function>,
    options?: MixinOptions
  ): TResult;

  /**
   * @see mixin
   */
  mixin<TResult>(
    source: Dictionary<Function>,
    options?: MixinOptions
  ): TResult;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see mixin
   */
  mixin<TResult>(
    source: Dictionary<Function>,
    options?: MixinOptions
  ): LoDashImplicitObjectWrapper<TResult>;

  /**
   * @see mixin
   */
  mixin<TResult>(
    options?: MixinOptions
  ): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see mixin
   */
  mixin<TResult>(
    source: Dictionary<Function>,
    options?: MixinOptions
  ): LoDashExplicitObjectWrapper<TResult>;

  /**
   * @see mixin
   */
  mixin<TResult>(
    options?: MixinOptions
  ): LoDashExplicitObjectWrapper<TResult>;
}

//noConflict
interface LoDashStatic {
  /**
   * Reverts the _ variable to its previous value and returns a reference to the lodash function.
   *
   * @return Returns the lodash function.
   */
  noConflict(): typeof _;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see noConflict
   */
  noConflict(): typeof _;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see noConflict
   */
  noConflict(): LoDashExplicitObjectWrapper<typeof _>;
}

//noop
interface LoDashStatic {
  /**
   * A no-operation function that returns undefined regardless of the arguments it receives.
   *
   * @return undefined
   */
  noop(...args: any[]): void;
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see noop
   */
  noop(...args: any[]): void;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see noop
   */
  noop(...args: any[]): LoDashExplicitWrapper<void>;
}

//nthArg
interface LoDashStatic {
  /**
   * Creates a function that returns its nth argument.
   *
   * @param n The index of the argument to return.
   * @return Returns the new function.
   */
  nthArg<TResult extends Function>(n?: number): TResult;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see nthArg
   */
  nthArg<TResult extends Function>(): LoDashImplicitObjectWrapper<TResult>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see nthArg
   */
  nthArg<TResult extends Function>(): LoDashExplicitObjectWrapper<TResult>;
}

//over
interface LoDashStatic {
  /**
   * Creates a function that invokes iteratees with the arguments provided to the created function and returns
   * their results.
   *
   * @param iteratees The iteratees to invoke.
   * @return Returns the new function.
   */
  over<TResult>(...iteratees: (Function|Function[])[]): (...args: any[]) => TResult[];
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see over
   */
  over<TResult>(...iteratees: (Function|Function[])[]): LoDashImplicitObjectWrapper<(...args: any[]) => TResult[]>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see over
   */
  over<TResult>(...iteratees: (Function|Function[])[]): LoDashImplicitObjectWrapper<(...args: any[]) => TResult[]>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see over
   */
  over<TResult>(...iteratees: (Function|Function[])[]): LoDashExplicitObjectWrapper<(...args: any[]) => TResult[]>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see over
   */
  over<TResult>(...iteratees: (Function|Function[])[]): LoDashExplicitObjectWrapper<(...args: any[]) => TResult[]>;
}

//overEvery
interface LoDashStatic {
  /**
   * Creates a function that checks if all of the predicates return truthy when invoked with the arguments
   * provided to the created function.
   *
   * @param predicates The predicates to check.
   * @return Returns the new function.
   */
  overEvery(...predicates: (Function|Function[])[]): (...args: any[]) => boolean;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see overEvery
   */
  overEvery(...predicates: (Function|Function[])[]): LoDashImplicitObjectWrapper<(...args: any[]) => boolean>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see overEvery
   */
  overEvery(...predicates: (Function|Function[])[]): LoDashImplicitObjectWrapper<(...args: any[]) => boolean>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see overEvery
   */
  overEvery(...predicates: (Function|Function[])[]): LoDashExplicitObjectWrapper<(...args: any[]) => boolean>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see overEvery
   */
  overEvery(...predicates: (Function|Function[])[]): LoDashExplicitObjectWrapper<(...args: any[]) => boolean>;
}

//overSome
interface LoDashStatic {
  /**
   * Creates a function that checks if any of the predicates return truthy when invoked with the arguments
   * provided to the created function.
   *
   * @param predicates The predicates to check.
   * @return Returns the new function.
   */
  overSome(...predicates: (Function|Function[])[]): (...args: any[]) => boolean;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see overSome
   */
  overSome(...predicates: (Function|Function[])[]): LoDashImplicitObjectWrapper<(...args: any[]) => boolean>;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see overSome
   */
  overSome(...predicates: (Function|Function[])[]): LoDashImplicitObjectWrapper<(...args: any[]) => boolean>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see overSome
   */
  overSome(...predicates: (Function|Function[])[]): LoDashExplicitObjectWrapper<(...args: any[]) => boolean>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see overSome
   */
  overSome(...predicates: (Function|Function[])[]): LoDashExplicitObjectWrapper<(...args: any[]) => boolean>;
}

//property
interface LoDashStatic {
  /**
   * Creates a function that returns the property value at path on a given object.
   *
   * @param path The path of the property to get.
   * @return Returns the new function.
   */
  property<TObj, TResult>(path: StringRepresentable|StringRepresentable[]): (obj: TObj) => TResult;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see property
   */
  property<TObj, TResult>(): LoDashImplicitObjectWrapper<(obj: TObj) => TResult>;
}

interface LoDashImplicitArrayWrapper<T> {
  /**
   * @see property
   */
  property<TObj, TResult>(): LoDashImplicitObjectWrapper<(obj: TObj) => TResult>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see property
   */
  property<TObj, TResult>(): LoDashExplicitObjectWrapper<(obj: TObj) => TResult>;
}

interface LoDashExplicitArrayWrapper<T> {
  /**
   * @see property
   */
  property<TObj, TResult>(): LoDashExplicitObjectWrapper<(obj: TObj) => TResult>;
}

//propertyOf
interface LoDashStatic {
  /**
   * The opposite of property; this method creates a function that returns the property value at a given path
   * on object.
   *
   * @param object The object to query.
   * @return Returns the new function.
   */
  propertyOf<T extends {}>(object: T): (path: string|string[]) => any;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see propertyOf
   */
  propertyOf(): LoDashImplicitObjectWrapper<(path: string|string[]) => any>;
}

interface LoDashExplicitObjectWrapper<T> {
  /**
   * @see propertyOf
   */
  propertyOf(): LoDashExplicitObjectWrapper<(path: string|string[]) => any>;
}

//range
interface LoDashStatic {
  /**
   * Creates an array of numbers (positive and/or negative) progressing from start up to, but not including, end.
   * If end is not specified it’s set to start with start then set to 0. If end is less than start a zero-length
   * range is created unless a negative step is specified.
   *
   * @param start The start of the range.
   * @param end The end of the range.
   * @param step The value to increment or decrement by.
   * @return Returns a new range array.
   */
  range(
    start: number,
    end: number,
    step?: number
  ): number[];

  /**
   * @see range
   */
  range(
    end: number,
    step?: number
  ): number[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see range
   */
  range(
    end?: number,
    step?: number
  ): LoDashImplicitArrayWrapper<number>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see range
   */
  range(
    end?: number,
    step?: number
  ): LoDashExplicitArrayWrapper<number>;
}

//rangeRight
interface LoDashStatic {
  /**
   * This method is like `range` except that it populates values in
   * descending order.
   *
   * @static
   * @memberOf _
   * @category Util
   * @param {number} [start=0] The start of the range.
   * @param {number} end The end of the range.
   * @param {number} [step=1] The value to increment or decrement by.
   * @returns {Array} Returns the new array of numbers.
   * @example
   *
   * rangeRight(4);
   * // => [3, 2, 1, 0]
   *
   * rangeRight(-4);
   * // => [-3, -2, -1, 0]
   *
   * rangeRight(1, 5);
   * // => [4, 3, 2, 1]
   *
   * rangeRight(0, 20, 5);
   * // => [15, 10, 5, 0]
   *
   * rangeRight(0, -4, -1);
   * // => [-3, -2, -1, 0]
   *
   * rangeRight(1, 4, 0);
   * // => [1, 1, 1]
   *
   * rangeRight(0);
   * // => []
   */
  rangeRight(
    start: number,
    end: number,
    step?: number
  ): number[];

  /**
   * @see rangeRight
   */
  rangeRight(
    end: number,
    step?: number
  ): number[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see rangeRight
   */
  rangeRight(
    end?: number,
    step?: number
  ): LoDashImplicitArrayWrapper<number>;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see rangeRight
   */
  rangeRight(
    end?: number,
    step?: number
  ): LoDashExplicitArrayWrapper<number>;
}

//runInContext
interface LoDashStatic {
  /**
   * Create a new pristine lodash function using the given context object.
   *
   * @param context The context object.
   * @return Returns a new lodash function.
   */
  runInContext(context?: Object): typeof _;
}

interface LoDashImplicitObjectWrapper<T> {
  /**
   * @see runInContext
   */
  runInContext(): typeof _;
}

//times
interface LoDashStatic {
  /**
   * Invokes the iteratee function n times, returning an array of the results of each invocation. The iteratee
   * is invoked with one argument; (index).
   *
   * @param n The number of times to invoke iteratee.
   * @param iteratee The function invoked per iteration.
   * @return Returns the array of results.
   */
  times<TResult>(
    n: number,
    iteratee: (num: number) => TResult
  ): TResult[];

  /**
   * @see times
   */
  times(n: number): number[];
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see times
   */
  times<TResult>(
    iteratee: (num: number) => TResult
  ): TResult[];

  /**
   * @see times
   */
  times(): number[];
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see times
   */
  times<TResult>(
    iteratee: (num: number) => TResult
  ): LoDashExplicitArrayWrapper<TResult>;

  /**
   * @see times
   */
  times(): LoDashExplicitArrayWrapper<number>;
}

//toPath
interface LoDashStatic {
  /**
   * Converts `value` to a property path array.
   *
   * @static
   * @memberOf _
   * @category Util
   * @param {*} value The value to convert.
   * @returns {Array} Returns the new property path array.
   * @example
   *
   * toPath('a.b.c');
   * // => ['a', 'b', 'c']
   *
   * toPath('a[0].b.c');
   * // => ['a', '0', 'b', 'c']
   *
   * var path = ['a', 'b', 'c'],
   *     newPath = toPath(path);
   *
   * console.log(newPath);
   * // => ['a', 'b', 'c']
   *
   * console.log(path === newPath);
   * // => false
   */
  toPath(value: any): string[];
}

interface LoDashImplicitWrapperBase<T, TWrapper> {
  /**
   * @see toPath
   */
  toPath(): LoDashImplicitWrapper<string[]>;
}

interface LoDashExplicitWrapperBase<T, TWrapper> {
  /**
   * @see toPath
   */
  toPath(): LoDashExplicitWrapper<string[]>;
}

//uniqueId
interface LoDashStatic {
  /**
   * Generates a unique ID. If prefix is provided the ID is appended to it.
   *
   * @param prefix The value to prefix the ID with.
   * @return Returns the unique ID.
   */
  uniqueId(prefix?: string): string;
}

interface LoDashImplicitWrapper<T> {
  /**
   * @see uniqueId
   */
  uniqueId(): string;
}

interface LoDashExplicitWrapper<T> {
  /**
   * @see uniqueId
   */
  uniqueId(): LoDashExplicitWrapper<string>;
}

interface ListIterator<T, TResult> {
  (value: T, index: number, collection: List<T>): TResult;
}

interface DictionaryIterator<T, TResult> {
  (value: T, key?: string, collection?: Dictionary<T>): TResult;
}

interface NumericDictionaryIterator<T, TResult> {
  (value: T, key?: number, collection?: Dictionary<T>): TResult;
}

interface ObjectIterator<T, TResult> {
  (element: T, key?: string, collection?: any): TResult;
}

interface StringIterator<TResult> {
  (char: string, index?: number, string?: string): TResult;
}

interface MemoVoidIterator<T, TResult> {
  (prev: TResult, curr: T, indexOrKey?: any, list?: T[]): void;
}
interface MemoIterator<T, TResult> {
  (prev: TResult, curr: T, indexOrKey?: any, list?: T[]): TResult;
}

interface MemoVoidArrayIterator<T, TResult> {
  (acc: TResult, curr: T, index?: number, arr?: T[]): void;
}
interface MemoVoidDictionaryIterator<T, TResult> {
  (acc: TResult, curr: T, key?: string, dict?: Dictionary<T>): void;
}

//interface Collection<T> {}

// Common interface between Arrays and jQuery objects
interface List<T> {
  [index: number]: T;
  length: number;
}

interface Dictionary<T> {
  [index: string]: T;
}

interface NumericDictionary<T> {
  [index: number]: T;
}

interface StringRepresentable {
  toString(): string;
}

interface Cancelable {
  cancel(): void;
  flush(): void;
}

declare module "_" {
  export = LoDashStatic;
}

declare var _: LoDashStatic;
