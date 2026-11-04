import { ALLOWED_DOMAIN, RESTRICTED_DOMAIN_ERROR_MESSAGE } from '../constants/config';
import { DomainValidationResult } from '../types';

/**
 * Validates whether an email belongs to the strictly allowed domain
 * and whether the email has been verified by the identity provider.
 *
 * Rules:
 * 1. Email must not be empty or malformed.
 * 2. Email verification (email_verified) must be strictly true.
 * 3. The email must contain exactly one '@' character.
 * 4. The local part before '@' must not be empty.
 * 5. The full domain part after the '@' must exactly match the allowed domain.
 *    This prevents lookalike domains such as:
 *    - evilhbplus.fit (prefix lookalike)
 *    - hbplus.fit.evil.com (subdomain lookalike)
 * 6. Comparison is case-insensitive.
 *
 * @param email - The user's email address
 * @param emailVerified - Whether the identity provider verified the email
 * @param allowedDomain - Optional override of allowed domain (defaults to env ALLOWED_DOMAIN)
 */
export function validateUserDomain(
  email: string | null | undefined,
  emailVerified: boolean | undefined | null,
  allowedDomain: string = ALLOWED_DOMAIN
): DomainValidationResult {
  // 1. Check for missing or empty email
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return {
      isValid: false,
      errorMessage: RESTRICTED_DOMAIN_ERROR_MESSAGE,
    };
  }

  const trimmedEmail = email.trim();

  // 2. Check email verified flag (Must be strictly true)
  if (emailVerified !== true) {
    return {
      isValid: false,
      errorMessage: RESTRICTED_DOMAIN_ERROR_MESSAGE,
    };
  }

  // 3. Count '@' characters - must have exactly one '@'
  const atMatches = trimmedEmail.match(/@/g);
  if (!atMatches || atMatches.length !== 1) {
    return {
      isValid: false,
      errorMessage: RESTRICTED_DOMAIN_ERROR_MESSAGE,
    };
  }

  const atIndex = trimmedEmail.lastIndexOf('@');

  // Must have local-part (atIndex > 0) and domain-part (atIndex < trimmedEmail.length - 1)
  if (atIndex <= 0 || atIndex >= trimmedEmail.length - 1) {
    return {
      isValid: false,
      errorMessage: RESTRICTED_DOMAIN_ERROR_MESSAGE,
    };
  }

  const localPart = trimmedEmail.slice(0, atIndex);
  if (!localPart || localPart.trim() === '') {
    return {
      isValid: false,
      errorMessage: RESTRICTED_DOMAIN_ERROR_MESSAGE,
    };
  }

  // 4. Extract domain strictly after the '@'
  const domainPart = trimmedEmail.slice(atIndex + 1).toLowerCase();
  const normalizedAllowedDomain = allowedDomain.trim().toLowerCase();

  // 5. Exact domain match check (must equal allowed domain, NOT just endWith without '@')
  if (domainPart !== normalizedAllowedDomain) {
    return {
      isValid: false,
      errorMessage: RESTRICTED_DOMAIN_ERROR_MESSAGE,
      extractedDomain: domainPart,
    };
  }

  return {
    isValid: true,
    extractedDomain: domainPart,
  };
}

/**
 * Helper to safely extract domain name from an email address
 */
export function extractEmailDomain(email: string | null | undefined): string | null {
  if (!email || typeof email !== 'string') return null;
  const trimmed = email.trim();
  const atMatches = trimmed.match(/@/g);
  if (!atMatches || atMatches.length !== 1) return null;
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex <= 0 || atIndex >= trimmed.length - 1) return null;
  return trimmed.slice(atIndex + 1).toLowerCase();
}
