/**
 * Human-First Error Formatter
 * Translates technical HTTP/Axios exceptions into clear, non-technical optical retail language.
 */

export interface FormattedError {
  title: string;
  message: string;
  isRateLimit: boolean;
  retryAfterSeconds?: number;
}

export function formatAuthError(error: any): FormattedError {
  if (!error) {
    return {
      title: 'Sign In Unsuccessful',
      message: 'An unexpected error occurred. Please try again.',
      isRateLimit: false,
    };
  }

  const status = error.response?.status;
  const rawDetail = error.response?.data?.detail;
  const rawMessage = error.message || '';

  // 1. Rate Limit (HTTP 429)
  if (status === 429 || rawMessage.includes('429') || (typeof rawDetail === 'string' && rawDetail.toLowerCase().includes('too many'))) {
    // Attempt to extract seconds if provided in header or message
    let retryAfter = 30;
    const headerVal = error.response?.headers?.['retry-after'];
    if (headerVal && !isNaN(Number(headerVal))) {
      retryAfter = Math.min(Math.max(Number(headerVal), 5), 120);
    }

    return {
      title: 'Temporarily Paused',
      message: 'Too many sign-in attempts. For your store’s security, please wait a few moments before trying again.',
      isRateLimit: true,
      retryAfterSeconds: retryAfter,
    };
  }

  // 2. Network / Offline Error
  if (error.code === 'ERR_NETWORK' || rawMessage.toLowerCase().includes('network') || !error.response) {
    return {
      title: 'Connection Issue',
      message: 'Unable to reach the store server. Please check your internet connection or verify the server is running.',
      isRateLimit: false,
    };
  }

  const detailStr = (
    typeof rawDetail === 'string'
      ? rawDetail
      : Array.isArray(rawDetail)
        ? rawDetail.map((d: any) => d.msg || d.detail || '').join(' ')
        : ''
  ).toLowerCase();

  // 3. Duplicate Account / Already Registered (HTTP 400 or detail match)
  if (
    detailStr.includes('already registered') ||
    detailStr.includes('already exists') ||
    detailStr.includes('already in use')
  ) {
    if (detailStr.includes('phone')) {
      return {
        title: 'Phone Number In Use',
        message: 'This mobile number is already linked to an existing store account. Please use a different number or sign in.',
        isRateLimit: false,
      };
    }
    return {
      title: 'Account Already Exists',
      message: 'An optical store account with this email address already exists. Please sign in to your store instead, or use a different email.',
      isRateLimit: false,
    };
  }

  // 4. OTP Verification Failures
  if (
    detailStr.includes('otp') ||
    detailStr.includes('verification code') ||
    detailStr.includes('verification token')
  ) {
    if (detailStr.includes('expired')) {
      return {
        title: 'Code Expired',
        message: 'Your verification code has expired. Please click Resend Code to receive a new 6-digit code.',
        isRateLimit: false,
      };
    }
    return {
      title: 'Invalid Verification Code',
      message: 'The 6-digit verification code you entered is incorrect. Please check your email and try again.',
      isRateLimit: false,
    };
  }

  // 5. Inactive Account
  if (detailStr.includes('inactive') || detailStr.includes('deactivated')) {
    return {
      title: 'Account Inactive',
      message: 'This account has been deactivated. Please contact your store owner to restore access.',
      isRateLimit: false,
    };
  }

  // 6. Unauthorized / Invalid Credentials (HTTP 401 strictly for login)
  if (status === 401) {
    return {
      title: 'Incorrect Credentials',
      message: 'Incorrect email, password, or selected role. Please check your credentials and try again.',
      isRateLimit: false,
    };
  }

  // 7. General Validation / Bad Request (HTTP 400)
  if (status === 400) {
    if (typeof rawDetail === 'string' && rawDetail.trim().length > 0 && !rawDetail.includes('{') && !rawDetail.includes('Traceback')) {
      return {
        title: 'Registration Notice',
        message: rawDetail.charAt(0).toUpperCase() + rawDetail.slice(1),
        isRateLimit: false,
      };
    }
    return {
      title: 'Check Your Details',
      message: 'Please review your entered details and try again.',
      isRateLimit: false,
    };
  }

  // 8. Forbidden (HTTP 403)
  if (status === 403) {
    return {
      title: 'Access Restricted',
      message: 'You do not have permission to access this store role. Please contact your store owner.',
      isRateLimit: false,
    };
  }

  // 9. Account Not Found (HTTP 404)
  if (status === 404) {
    return {
      title: 'Account Not Found',
      message: 'No optical store account found with this email. Please check your spelling or register a new store.',
      isRateLimit: false,
    };
  }

  // 10. Server Errors (HTTP 500, 502, 503)
  if (status >= 500) {
    return {
      title: 'Server Notice',
      message: 'The optical store service is temporarily unavailable. Please try again in a few moments.',
      isRateLimit: false,
    };
  }

  // 11. Fallback
  return {
    title: 'Sign In Notice',
    message: 'Unable to proceed with the provided details. Please verify your information or contact your store owner.',
    isRateLimit: false,
  };
}
