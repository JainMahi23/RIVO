import React from "react";

// Catches render errors in a subtree so one broken module (e.g. the AI
// Assistant panel) can't take down the whole app. Very cheap to add now,
// painful to retrofit later — kept minimal on purpose.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // TODO: wire to real logging/monitoring later
    console.error("RIVO UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-sm text-red-600">
          Something went wrong loading this section.
        </div>
      );
    }
    return this.props.children;
  }
}
