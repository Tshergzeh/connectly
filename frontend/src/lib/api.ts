export async function loginUser(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  let data;

  try {
    data = await res.json();
  } catch (error) {
    data = {};
  }

  if (!res.ok) {
    const message = data?.message || data?.error || 'Invalid credentials';
    throw new Error(message);
  }

  return data;
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
  is_customer: boolean,
  is_provider: boolean,
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, is_customer, is_provider }),
  });

  if (!res.ok) {
    throw new Error('Signup failed');
  }

  return res.json();
}
