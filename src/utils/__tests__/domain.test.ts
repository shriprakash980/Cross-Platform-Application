import { validateUserDomain, extractEmailDomain } from '../domain';
import { RESTRICTED_DOMAIN_ERROR_MESSAGE } from '../../constants/config';

describe('validateUserDomain', () => {
  const allowedDomain = 'hbplus.fit';

  describe('Valid domain scenarios', () => {
    it('accepts valid email with the exact allowed domain', () => {
      const result = validateUserDomain('alex@hbplus.fit', true, allowedDomain);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
      expect(result.extractedDomain).toBe('hbplus.fit');
    });

    it('accepts uppercase and mixed-case email addresses', () => {
      const result = validateUserDomain('SARAH.CONNOR@HBPLUS.FIT', true, allowedDomain);
      expect(result.isValid).toBe(true);
      expect(result.extractedDomain).toBe('hbplus.fit');

      const mixed = validateUserDomain('John.Doe+security@HbPlus.Fit', true, allowedDomain);
      expect(mixed.isValid).toBe(true);
      expect(mixed.extractedDomain).toBe('hbplus.fit');
    });
  });

  describe('Unauthorized domains', () => {
    it('rejects standard public providers like gmail.com', () => {
      const result = validateUserDomain('intruder@gmail.com', true, allowedDomain);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR_MESSAGE);
      expect(result.extractedDomain).toBe('gmail.com');
    });

    it('rejects prefix lookalike domains (e.g. evilhbplus.fit)', () => {
      const result = validateUserDomain('attacker@evilhbplus.fit', true, allowedDomain);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR_MESSAGE);
      expect(result.extractedDomain).toBe('evilhbplus.fit');
    });

    it('rejects subdomain lookalike domains (e.g. hbplus.fit.evil.com)', () => {
      const result = validateUserDomain('attacker@hbplus.fit.evil.com', true, allowedDomain);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR_MESSAGE);
      expect(result.extractedDomain).toBe('hbplus.fit.evil.com');
    });

    it('rejects domain as a subdomain of allowed domain (e.g. evil.hbplus.fit unless explicitly allowed)', () => {
      const result = validateUserDomain('attacker@sub.hbplus.fit', true, allowedDomain);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR_MESSAGE);
    });
  });

  describe('Email verification requirements', () => {
    it('rejects legitimate email if email_verified is false', () => {
      const result = validateUserDomain('alex@hbplus.fit', false, allowedDomain);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR_MESSAGE);
    });

    it('rejects legitimate email if email_verified is null or undefined', () => {
      const resNull = validateUserDomain('alex@hbplus.fit', null as any, allowedDomain);
      expect(resNull.isValid).toBe(false);
      expect(resNull.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR_MESSAGE);

      const resUndef = validateUserDomain('alex@hbplus.fit', undefined, allowedDomain);
      expect(resUndef.isValid).toBe(false);
      expect(resUndef.errorMessage).toBe(RESTRICTED_DOMAIN_ERROR_MESSAGE);
    });
  });

  describe('Empty and malformed input handling', () => {
    it('rejects empty string, whitespace, null, and undefined', () => {
      expect(validateUserDomain('', true, allowedDomain).isValid).toBe(false);
      expect(validateUserDomain('   ', true, allowedDomain).isValid).toBe(false);
      expect(validateUserDomain(null, true, allowedDomain).isValid).toBe(false);
      expect(validateUserDomain(undefined, true, allowedDomain).isValid).toBe(false);
    });

    it('rejects malformed email formats missing @ or domain', () => {
      expect(validateUserDomain('hbplus.fit', true, allowedDomain).isValid).toBe(false);
      expect(validateUserDomain('alex@', true, allowedDomain).isValid).toBe(false);
      expect(validateUserDomain('@hbplus.fit', true, allowedDomain).isValid).toBe(false);
      expect(validateUserDomain('alex@@hbplus.fit', true, allowedDomain).isValid).toBe(false);
    });
  });

  describe('Exact error message compliance', () => {
    it('guarantees the exact required error string on any validation failure', () => {
      const result = validateUserDomain('test@yahoo.com', true, allowedDomain);
      expect(result.errorMessage).toBe('Access restricted. Please login using your official domain email.');
    });
  });
});

describe('extractEmailDomain', () => {
  it('correctly extracts lowercase domain', () => {
    expect(extractEmailDomain('user@hbplus.fit')).toBe('hbplus.fit');
    expect(extractEmailDomain('USER@DOMAIN.COM')).toBe('domain.com');
  });

  it('returns null for invalid inputs', () => {
    expect(extractEmailDomain(null)).toBeNull();
    expect(extractEmailDomain('')).toBeNull();
    expect(extractEmailDomain('notanemail')).toBeNull();
  });
});
