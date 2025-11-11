import {useQuery} from "@tanstack/react-query";

const API_BASE = 'https://api.restful-api.dev';

type ObjectType = {
    id?: string,
    name?: string,
    data?: {
        Color?: string,
        Capacity?: string,
        Generation?: string,
        Price?: string;
    }
}

export const TanstackQueryDemo = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['objects'],
        queryFn: async (context): Promise<ObjectType[]> => {
            const url = new URL(API_BASE);
            url.pathname = context.queryKey[0];
            const response = await fetch(url);
            const data = await response.json();
            return data;
        },
    });

    console.log({ data });

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
            return <div>loading...</div>
        }

        if (error) {
            return <div>Error: {JSON.stringify(error)}</div>
        }

        return <div>unexpected render</div>
    };

    return (
        <div>
            <button onClick={handleClick}>refetch</button>
            <div>
                {renderData()}
            </div>
        </div>
    );
};