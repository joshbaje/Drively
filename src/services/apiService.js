const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:scA8Isc8';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async handleResponse(response) {
    if (response.ok) {
      return await response.json();
    }
    
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  // Authentication endpoints
  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async register(userData) {
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    return this.handleResponse(response);
  }

  async resetPasswordRequest(email) {
    const response = await fetch(`${this.baseUrl}/auth/reset-password-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    return this.handleResponse(response);
  }

  async resetPassword(token, newPassword) {
    const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: newPassword })
    });
    
    return this.handleResponse(response);
  }

  async updateUserProfile(profileData) {
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    
    return this.handleResponse(response);
  }

  // Vehicle endpoints
  async getVehicles(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/vehicles${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async getVehicleById(id) {
    const response = await fetch(`${this.baseUrl}/vehicles/${id}`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  // Booking endpoints
  async createBooking(bookingData) {
    const response = await fetch(`${this.baseUrl}/bookings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    
    return this.handleResponse(response);
  }

  async getUserBookings() {
    const response = await fetch(`${this.baseUrl}/bookings/user`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async getOwnerVehicleBookings() {
    const response = await fetch(`${this.baseUrl}/bookings/owner`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  // Add more API methods as needed
}

export default new ApiService();