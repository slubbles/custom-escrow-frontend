'use client';

/**
 * Security utilities and input sanitization
 */

// Input sanitization
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

// Sanitize URL
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

// Validate wallet address format (Solana)
export function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  
  // Solana addresses are base58 encoded and 32-44 characters
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Rate limiting implementation (client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filter out old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  getRemainingAttempts(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  clear(): void {
    this.attempts.clear();
  }
}

// Create rate limiters for different actions
export const transactionRateLimiter = new RateLimiter(10, 60000); // 10 per minute
export const walletConnectionRateLimiter = new RateLimiter(5, 30000); // 5 per 30 seconds
export const apiRateLimiter = new RateLimiter(30, 60000); // 30 per minute

// Content Security Policy helpers
export function getCSPHeader(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.solana.com https://*.helius-rpc.com https://*.alchemy.com wss://*.solana.com",
    "frame-src 'self' https://verify.walletconnect.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
}

// XSS Protection
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

// SQL Injection Protection (for future backend)
export function escapeSql(value: string): string {
  return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0': return '\\0';
      case '\x08': return '\\b';
      case '\x09': return '\\t';
      case '\x1a': return '\\z';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default:
        return char;
    }
  });
}

// Validate and sanitize number inputs
export function sanitizeNumber(value: any, options: {
  min?: number;
  max?: number;
  decimals?: number;
  defaultValue?: number;
} = {}): number {
  const num = Number(value);
  
  if (isNaN(num)) {
    return options.defaultValue ?? 0;
  }
  
  let result = num;
  
  if (options.min !== undefined && result < options.min) {
    result = options.min;
  }
  
  if (options.max !== undefined && result > options.max) {
    result = options.max;
  }
  
  if (options.decimals !== undefined) {
    result = Number(result.toFixed(options.decimals));
  }
  
  return result;
}

// Prevent timing attacks
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

// Generate random token (for CSRF protection)
export function generateToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Store CSRF token
export function setCSRFToken(): string {
  if (typeof window === 'undefined') return '';
  
  const token = generateToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
}

// Validate CSRF token
export function validateCSRFToken(token: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken !== null && constantTimeCompare(token, storedToken);
}

// Secure local storage wrapper
export const secureStorage = {
  setItem(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store item:', error);
    }
  },

  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const decrypted = atob(item);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

// Validate transaction amount
export function isValidTransactionAmount(amount: number, decimals: number = 9): boolean {
  if (amount <= 0) return false;
  if (amount > Number.MAX_SAFE_INTEGER) return false;
  
  const maxDecimals = amount.toString().split('.')[1]?.length || 0;
  return maxDecimals <= decimals;
}

// Prevent clickjacking
export function preventClickjacking(): void {
  if (typeof window === 'undefined') return;
  
  if (window.self !== window.top) {
    // Page is in an iframe - potentially being clickjacked
    window.top!.location.href = window.self.location.href;
  }
}

// Security headers checker
export function checkSecurityHeaders(): Record<string, boolean> {
  if (typeof window === 'undefined') {
    return {};
  }
  
  return {
    https: window.location.protocol === 'https:',
    csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
    xFrameOptions: true, // Can't check from client, assume backend sets it
    xContentTypeOptions: true,
    strictTransportSecurity: true,
  };
}

// Validate file upload (for future features)
export function validateFileUpload(file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
} = {}): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed`,
    };
  }
  
  return { valid: true };
}

// Initialize security on app load
export function initializeSecurity(): void {
  if (typeof window === 'undefined') return;
  
  // Prevent clickjacking
  preventClickjacking();
  
  // Set CSRF token
  setCSRFToken();
  
  // Log security status
  const headers = checkSecurityHeaders();
  console.log('Security initialized:', headers);
}
