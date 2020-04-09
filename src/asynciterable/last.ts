import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
import { OptionalFindOptions, OptionalFindSubclassedOptions } from './findoptions';

/**
 * Returns the last element of an async-iterable sequence that satisfies the condition in the predicate if given
 * otherwise the last item in the sequence, or a default value if no such element exists.
 *
 * @export
 * @template T The type of elements in the source sequence.
 * @template S The return type from the selector that is truthy or falsy.
 * @param {AsyncIterable<T>} source The source async-iterable sequence.
 * @param {OptionalFindSubclassedOptions<T, S>} [options] The options which include an optional predicate for filtering,
 * thirArg for binding, and abort signal for cancellation
 * @returns {(Promise<S | undefined>)} A promise containing the last value that matches the optional predicate or last item, otherwise undefined.
 */
export async function last<T, S extends T>(
  source: AsyncIterable<T>,
  options?: OptionalFindSubclassedOptions<T, S>
): Promise<S | undefined>;
/**
 * Returns the last element of an async-iterable sequence that satisfies the condition in the predicate if given
 * otherwise the last item in the sequence, or a default value if no such element exists.
 *
 * @export
 * @template T The type of elements in the source sequence.
 * @param {AsyncIterable<T>} source The source async-iterable sequence.
 * @param {OptionalFindSubclassedOptions<T, S>} [options] The options which include an optional predicate for filtering,
 * thirArg for binding, and abort signal for cancellation
 * @returns {(Promise<S | undefined>)} A promise containing the last value that matches the optional predicate or last item, otherwise undefined.
 */
export async function last<T>(
  source: AsyncIterable<T>,
  options?: OptionalFindOptions<T>
): Promise<T | undefined> {
  const opts = options || ({ ['predicate']: async () => true } as OptionalFindOptions<T>);
  const { ['signal']: signal, ['thisArg']: thisArg, ['predicate']: predicate } = opts;
  throwIfAborted(signal);
  let i = 0;
  let result: T | undefined;
  for await (const item of wrapWithAbort(source, signal)) {
    if (await predicate!.call(thisArg, item, i++, signal)) {
      result = item;
    }
  }

  return result;
}
