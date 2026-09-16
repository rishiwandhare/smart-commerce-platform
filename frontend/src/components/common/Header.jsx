import React from 'react';

function Header({ query, onQueryChange, onSearch, currentPage, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'results', label: 'Search' },
    { id: 'details', label: 'Product' },
    { id: 'customer', label: 'Customer' },
    { id: 'shopkeeper', label: 'Shopkeeper' },
    { id: 'admin', label: 'Admin' }
  ];

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="brand-block" onClick={() => onNavigate('home')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('home'); }}>
          <div className="brand-mark">P</div>
          <div>
            <div className="brand-name">PricePilot</div>
            <div className="brand-subtitle">Smart price comparison</div>
          </div>
        </div>

        <div className="header-search">
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch();
            }}
          />
          <button className="btn btn-primary" onClick={onSearch}>Search</button>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
