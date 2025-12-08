import { useState, useCallback } from 'react';

/**
 * Custom hook for managing loading and error states
 * Eliminates duplicate loading state management across components
 * 
 * @returns {Object} { loading, error, withLoading, setError, resetError }
 */
export const useLoadingState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Wraps an async function with loading and error handling
   * @param {Function} asyncFn - The async function to execute
   * @param {Object} options - Configuration options
   * @param {Function} options.onSuccess - Callback when function succeeds
   * @param {Function} options.onError - Callback when function fails
   * @param {string} options.successMessage - Success message to return
   * @returns {Promise} Result of the async function
   */
  const withLoading = useCallback(async (asyncFn, options = {}) => {
    const { onSuccess, onError, successMessage } = options;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFn();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      if (successMessage) {
        console.log(successMessage);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err?.message || 'An error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      } else {
        console.error('Error:', errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    withLoading,
    setError,
    resetError,
    resetState,
    isLoading: loading,
    hasError: !!error
  };
};

/**
 * Example usage:
 * 
 * const MyComponent = () => {
 *   const { loading, error, withLoading } = useLoadingState();
 * 
 *   const handleSubmit = async () => {
 *     await withLoading(
 *       async () => {
 *         // Your async operation
 *         return await someApiCall();
 *       },
 *       {
 *         successMessage: 'Operation completed!',
 *         onError: (err) => {
 *           alert('Failed: ' + err.message);
 *         }
 *       }
 *     );
 *   };
 * 
 *   return (
 *     <div>
 *       {loading && <Spinner />}
 *       {error && <ErrorMessage error={error} />}
 *       <button onClick={handleSubmit}>Submit</button>
 *     </div>
 *   );
 * };
 */
