import { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: any) => void;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCustomer, setIsCustomer] = useState(true);
  const [isProvider, setIsProvider] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type === 'login') {
        await onSubmit({ email, password });
      } else {
        await onSubmit({ name, email, password, isCustomer, isProvider });
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      {type === 'signup' && (
        <>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="input-field"
          />

          <div className="flex flex-col space-y-2 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isCustomer}
                onChange={e => setIsCustomer(e.target.checked)}
                className="form-checkbox"
              />
              <span>I want to be a Customer</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isProvider}
                onChange={e => setIsProvider(e.target.checked)}
                className="form-checkbox"
              />
              <span>I want to be a Service Provider</span>
            </label>
          </div>
        </>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="input-field"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
}
