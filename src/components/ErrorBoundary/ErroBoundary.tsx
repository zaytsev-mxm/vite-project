import * as React from 'react';
import {type ErrorInfo} from "react";

type Props = {
    fallback?: React.ReactNode;
    children?: React.ReactNode;
};

type State = {
    hasError?: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromError(_error: Error) {
        // Update the state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        logErrorToMyService(
            error,
            // Example "componentStack":
            //   in ComponentThatThrows (created by App)
            //   in ErrorBoundary (created by App)
            //   in div (created by App)
            //   in App
            info.componentStack,
            // Warning: `captureOwnerStack` is not available in production.
            React.captureOwnerStack(),
        );
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}

function logErrorToMyService(...args: unknown[]) {
    console.log({ args });
}