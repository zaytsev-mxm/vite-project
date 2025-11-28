import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

/**
 * @ref https://restful-api.dev/
 */
const API_BASE = 'https://api.restful-api.dev';

type ObjectType = {
  id?: string;
  name?: string;
  data?: {
    Color?: string;
    Capacity?: string;
    Generation?: string;
    Price?: string;
  };
};

type Payload = {
  variant?: number;
  count?: number;
};

type Props = {
  payload: Payload;
};

export const TanstackQueryDemo = ({ payload: passedPayload }: Props) => {
  const [localVariant, setLocalVariant] = useState<Payload['variant']>();
  const payload = useMemo(() => {
    if (typeof localVariant !== 'undefined') {
      return {
        ...passedPayload,
        variant: localVariant,
      };
    } else {
      return passedPayload;
    }
  }, [localVariant, passedPayload]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['objects', payload],
    queryFn: async (context): Promise<ObjectType[]> => {
      const url = new URL(API_BASE);
      url.pathname = context.queryKey[0] as string;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    },
  });

  useEffect(() => {
    if (data?.length && data?.length > 5) {
      setLocalVariant(2);
    }
  }, [data]);

  const handleClick = () => {
    refetch().then((newData) => {
      console.log({ newData });
    });
  };

  const renderData = () => {
    if (data) {
      return <div>{JSON.stringify(data)}</div>;
    }

    if (isLoading) {
      return <div>loading...</div>;
    }

    if (error) {
      return <div>Error: {JSON.stringify(error)}</div>;
    }

    return <div>unexpected render</div>;
  };

  return (
    <div>
      <button onClick={handleClick}>refetch</button>
      <div>{renderData()}</div>
    </div>
  );
};
