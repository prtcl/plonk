import { useRef } from 'react';

type ValueCache<Value> = {
  value: Value;
  prev: Value | undefined;
};

const usePrevious = <Value>(value: Value): Value | undefined => {
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

export default usePrevious;
