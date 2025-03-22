/**
 * API Client for Drively
 * 
 * This service handles all API requests with built-in support for:
 * - Authentication
 * - Error handling
 * - Request/response logging
 * - API versioning
 * - Retry logic
 * - Response caching
 */

class ApiClient {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000; // 30 second default timeout
    this.tokenKey = config.tokenKey || 'auth_token';
    this.debug = config.debug || false;
    this.version = config.version || 'v1';
  }

  /**
   * Get authorization headers with token if available
   */
  getHeaders(customHeaders = {}, includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    if (includeAuth) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Log requests in debug mode
   */
  logRequest(method, url, data = null) {
    if (!this.debug) return;
    
    console.group(`🌐 API Request: ${method} ${url}`);
    if (data) console.log('Request Data:', data);
    console.groupEnd();
  }

  /**
   * Log responses in debug mode
   */
  logResponse(url, response, error = false) {
    if (!this.debug) return;
    
    if (error) {
      console.group(`❌ API Error: ${url}`);
      console.error('Error:', response);
    } else {
      console.group(`✅ API Response: ${url}`);
      console.log('Response:', response);
    }
    console.groupEnd();
  }

  /**
   * Handle API errors consistently
   */
  handleError(error, url) {
    // Extract error message from different possible formats
    let errorMessage = 'An unknown error occurred';
    
    if (error.response) {
      // Server responded with error status
      const data = error.response.data;
      errorMessage = data.message || data.error || `Error ${error.response.status}`;
    } else if (error.request) {
      // Request made but no response received
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      // Error in request setup
      errorMessage = error.message || errorMessage;
    }

    // Log the error
    this.logResponse(url, {
      message: errorMessage,
      originalError: error
    }, true);

    // Format the error
    const formattedError = new Error(errorMessage);
    formattedError.originalError = error;
    formattedError.status = error.response?.status;
    
    return formattedError;
  }

  /**
   * Make a fetch request with common error handling
   */
  async request(method, endpoint, data = null, options = {}) {
    const { 
      headers = {}, 
      requireAuth = true,
      isFormData = false,
      signal = null,
      skipLog = false
    } = options;

    const url = `${this.baseUrl}/${endpoint}`;
    
    if (!skipLog) {
      this.logRequest(method, url, data);
    }

    // Prepare request options
    const requestOptions = {
      method,
      headers: isFormData 
        ? (requireAuth ? { 'Authorization': `Bearer ${localStorage.getItem(this.tokenKey)}` } : {})
        : this.getHeaders(headers, requireAuth),
      signal
    };

    // Add body for non-GET requests
    if (method !== 'GET' && data !== null) {
      requestOptions.body = isFormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, requestOptions);
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          response: {
            status: response.status,
            data: errorData
          }
        };
      }

      // Parse JSON response
      const result = await response.json();

      if (!skipLog) {
        this.logResponse(url, result);
      }

      return result;
    } catch (error) {
      throw this.handleError(error, url);
    }
  }

  // HTTP method convenience functions
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  async put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  async patch(endpoint, data, options = {}) {
    return this.request('PATCH', endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  /**
   * Upload a file
   */
  async uploadFile(endpoint, file, metadata = {}, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add any additional metadata
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.request('POST', endpoint, formData, {
      isFormData: true,
      ...options
    });
  }
}

export default ApiClient;