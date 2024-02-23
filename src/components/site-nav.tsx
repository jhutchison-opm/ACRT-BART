const navItems = [{ label: "Home", href: "/" },
{ label: "Instructions", href: "/instructions" },
{ label: "Create Report", href: "/create-report" },
{ label: "View Report", href: "/view-report" },
{ label: "License", href: "/license" },
];

export default function SiteNav() {
  return (
    <div>
      <div className="usa-overlay"></div>
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <div className="usa-logo">
              <em className="usa-logo__text">
                <a href="/" >ICT Testing Tool</a>
              </em>
            </div>
            <button type="button" className="usa-menu-btn">Menu</button>
          </div>
          <nav aria-label="Primary navigation" className="usa-nav">
            <button type="button" className="usa-nav__close">
              <img src="/assets/img/usa-icons/close.svg" role="img" alt="Close" />
            </button>
            <ul className="usa-nav__primary usa-accordion">
              {navItems.map((item, idx) => (
                <li className="usa-nav__primary-item" key={idx}>
                  <a href={item.href} className="usa-nav-link">
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}


