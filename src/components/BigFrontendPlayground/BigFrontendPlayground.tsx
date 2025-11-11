import { useEffect, useRef, useState } from 'react';
import { useTimeout } from '../../bigfrontend/react/2-use-timeout.ts';
import { useIsFirstRender } from '../../bigfrontend/react/3-use-is-first-render.ts';

const SEC = 1_000;

function makeHandler(num: number) {
  return function newHandler() {
    console.log('[[[[[[[[[ num: ]]]]]]]]]', num);
  };
}

export const BigFrontendPlayground = () => {
  const callbackCounterRef = useRef(1);
  const delayCounterRef = useRef(10);
  const timerRef = useRef(0);
  const [callback, setCallback] = useState<() => void>(() =>
    makeHandler(callbackCounterRef.current),
  );
  const [delay, setDelay] = useState(delayCounterRef.current * SEC);

  useTimeout(callback, delay);
  const isFirstRender = useIsFirstRender();

  console.log('isFirstRender: ', isFirstRender);

  useEffect(() => {
    const interval = setInterval(() => {
      timerRef.current++;
      console.log('count sec: ', timerRef.current);
    }, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  const handleClick1 = () => {
    delayCounterRef.current++;
    setDelay(delayCounterRef.current * SEC);
  };

  const handleClick2 = () => {
    callbackCounterRef.current++;
    setCallback(() => makeHandler(callbackCounterRef.current));
  };

  return (
    <>
      <p>delay: {delay}</p>
      <p>callback: {String(callback)}</p>
      <button onClick={handleClick1}>click 1</button>
      <button onClick={handleClick2}>click 2</button>
    </>
  );
};
