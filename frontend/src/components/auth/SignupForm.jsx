// TODO: Signup form component
import React from 'react';

export default function SignupForm({ onSignup }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSignup && onSignup(); }}>
      <div>
        <label>Email</label>
        <input name="email" type="email" />
      </div>
      <div>
        <label>Password</label>
        <input name="password" type="password" />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}
