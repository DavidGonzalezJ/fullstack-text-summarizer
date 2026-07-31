export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return null;
}

export function validateUsername(username: string): string | null {
  if (!username.trim()) return 'Username is required';
  if (username.length < 3) return 'Must be at least 3 characters';
  if (username.length > 50) return 'Must be at most 50 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Only letters, numbers and underscores allowed';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Must be at least 8 characters';
  return null;
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return null;
}
