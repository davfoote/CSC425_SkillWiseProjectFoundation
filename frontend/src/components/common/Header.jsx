// TODO: Flesh out header styles and responsive behavior
import React from 'react';
import Navigation from './Navigation';

const Header = ({ title = 'SkillWise' }) => {
  return (
    <header className="app-header">
      <div className="container">
        <h1 className="app-title">{title}</h1>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
