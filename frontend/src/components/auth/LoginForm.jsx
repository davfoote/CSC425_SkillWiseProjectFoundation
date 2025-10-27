// TODO: Login form component
import React from 'react';

export default function LoginForm({ onLogin }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onLogin && onLogin(); }}>
      <div>
        <label>Email</label>
        <input name="email" type="email" />
      </div>
      <div>
        <label>Password</label>
        <input name="password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
