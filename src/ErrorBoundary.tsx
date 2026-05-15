import React, { Component, ErrorInfo, ReactNode } from 'react';
import NotFound from './pages/NotFound';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // In case of crash, we show our maintenance/not found page
      return <NotFound />;
    }

    return this.children;
  }
}

export default ErrorBoundary;
