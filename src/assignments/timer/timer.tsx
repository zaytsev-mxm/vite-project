import React from 'react';
import { format, getFormattedString } from './utils.ts';

type Props = {
  end?: Date;
};

// 5 min
const dateInTheFuture = new Date();
dateInTheFuture.setTime(dateInTheFuture.getTime() + 1000 * 60 * 5);

export const Timer = (props: Props) => {
  const { end = dateInTheFuture } = props;
  const [diff, setDiff] = React.useState<number>(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDiff(end.getTime() - now.getTime());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [end]);

  const formatted = format(diff);

  const formattedString = React.useMemo(() => {
    return getFormattedString(formatted, {
      hours: true,
      minutes: true,
      seconds: true,
    });
  }, [formatted]);

  return (
    <div>
      <div>{formattedString}</div>
    </div>
  );
};
