import React from "react";
import PropTypes from "prop-types";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "var(--bg-page)",
            color: "var(--text-primary)",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h2>Something went wrong in StadiaIQ.</h2>
          <p
            style={{
              color: "var(--text-secondary)",
              maxWidth: "600px",
              marginTop: "1rem",
            }}
          >
            We've caught an unexpected error. Please refresh the page to restore
            your session.
          </p>
          <button
            className="btn btn--primary"
            style={{ marginTop: "2rem" }}
            onClick={() => window.location.reload()}
          >
            Refresh Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
