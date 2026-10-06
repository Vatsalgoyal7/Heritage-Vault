const API_BASE_URL = typeof window !== 'undefined'
  ? '' // relative URL — works on any port automatically
  : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

// Simple local storage for demo without Firebase
const isLocalMode = true;

export interface VaultItem {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  content?: string;
  originalFileName?: string;
  mimeType?: string;
  fileSize?: number;
  cloudinaryUrl?: string;
  notes?: string;
  tags: string[];
  assignedNominees: string[];
  createdAt: string;
}

export interface Nominee {
  id: string;
  name: string;
  email: string;
  relation: string;
  phone?: string;
  isVerified: boolean;
  assignedCategories: string[];
  accessLevel: 'view' | 'download';
  hasEmergencyAccess: boolean;
  accessExpiresAt?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  trustScore?: number;
  lastActive?: string;
  isNewDevice?: boolean;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('heritage_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('heritage_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('heritage_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth APIs
  async register(data: { name: string; email: string; password: string }) {
    const response = await this.request<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(data: { email: string; password: string }) {
    if (isLocalMode) {
      const response = await this.request<{ message: string; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      this.setToken(response.token);
      return response;
    }
    const response = await this.request<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async verifyOtp(data: { email: string; otp: string }) {
    return this.request<{ message: string; token: string; user: User }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Vault APIs
  async getVaultItems(category?: string): Promise<{ items: VaultItem[] }> {
    if (isLocalMode) {
      const params = category ? `?category=${category}` : '';
      return this.request<{ items: VaultItem[] }>(`/vault${params}`);
    }
    const params = category ? `?category=${category}` : '';
    return this.request<{ items: VaultItem[] }>(`/vault${params}`);
  }

  async createVaultItem(data: {
    title: string;
    category: string;
    subCategory?: string;
    content: string;
    notes?: string;
    tags?: string[];
    assignedNominees?: string[];
  }) {
    if (isLocalMode) {
      return this.request<{ message: string; item: VaultItem }>('/vault', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
    return this.request<{ message: string; item: VaultItem }>('/vault', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async uploadFile(formData: FormData) {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  // Nominee APIs
  async getNominees(): Promise<{ nominees: Nominee[] }> {
    if (isLocalMode) {
      return this.request<{ nominees: Nominee[] }>('/nominees');
    }
    return this.request<{ nominees: Nominee[] }>('/nominees');
  }

  async addNominee(data: {
    name: string;
    email: string;
    relation: string;
    phone?: string;
    assignedCategories?: string[];
    accessLevel?: 'view' | 'download';
  }) {
    if (isLocalMode) {
      return this.request<{ message: string; nominee: Nominee }>('/nominees', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
    return this.request<{ message: string; nominee: Nominee }>('/nominees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteNominee(id: string) {
    if (isLocalMode) {
      return this.request<{ message: string }>(`/nominees?id=${id}`, {
        method: 'DELETE',
      });
    }
    return this.request<{ message: string }>(`/nominees?id=${id}`, {
      method: 'DELETE',
    });
  }

  async verifyNominee(data: { email: string; otp: string }) {
    return this.request<{ message: string; nominee: Nominee }>('/nominees/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Emergency Access APIs
  async requestEmergencyAccess(data: { reason: string }) {
    return this.request<{ message: string; request: any }>('/emergency', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmergencyRequests() {
    return this.request<{ requests: any[] }>('/emergency');
  }

  async approveEmergencyRequest(data: { requestId: string; action: 'approve' | 'reject' }) {
    return this.request<{ message: string; access?: any }>('/emergency/approve', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Will Generator API
  async generateWill(data: { residence: string; assets: any[] }) {
    return this.request<{ message: string; willText: string; will?: string }>('/will/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();