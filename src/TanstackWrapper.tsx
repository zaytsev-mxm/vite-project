import {type ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

type Props = {
    children?: ReactNode;
};

const queryClient = new QueryClient()

export const TanstackWrapper = (props: Props) => {
    const { children } = props;

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
};