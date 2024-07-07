import { useRef } from 'react';

type ValueCache<Value> = {
  value: Value;
  prev: Value | undefined;
};

/** Returns the previous value without causing additional updates. */
export const usePrevious = <Value>(value: Value): Value | undefined => {
  const ref = useRef<ValueCache<Value>>({
    value,
    prev: undefined,
  });

  const current = ref.current.value;

  if (value !== current) {
    ref.current = {
      value,
      prev: current,
    };
  }

  return ref.current.prev;
};
