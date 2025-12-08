import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-green-50 flex items-center justify-center p-4">
          <div className="card max-w-2xl w-full p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Oops! Đã xảy ra lỗi
            </h1>
            
            <p className="text-gray-600 mb-8">
              Ứng dụng đã gặp phải một lỗi không mong muốn. 
              Chúng tôi đã ghi nhận và sẽ khắc phục sớm nhất.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="font-mono text-sm text-red-700 mb-2">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-600 font-semibold">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-red-600 mt-2 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Tải lại trang
              </button>
              
              <ErrorBoundaryHomeButton />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper to use hooks
const ErrorBoundaryHomeButton = () => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate('/')}
      className="btn btn-secondary flex items-center justify-center gap-2"
    >
      <Home className="w-5 h-5" />
      Về trang chủ
    </button>
  );
};

export default ErrorBoundary;
