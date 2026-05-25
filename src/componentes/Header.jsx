import './Header.css'

function Header({ nomeUsuario, cargoUsuario, avatarSrc, onPerfilClick }) {
  return (
    <header className="app-header">
      <div className="app-header__right">
        <button
          type="button"
          className="app-header__bell"
          aria-label="Notificacoes"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M15 17H9C7.34 17 6 15.66 6 14V11C6 8.24 8.24 6 11 6H13C15.76 6 18 8.24 18 11V14C18 15.66 16.66 17 15 17Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 19C10.53 19.61 11.23 20 12 20C12.77 20 13.47 19.61 14 19"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <img
          className="app-header__avatar"
          src={avatarSrc}
          alt={`Avatar de ${nomeUsuario}`}
          style={{ cursor: 'pointer' }}
          onClick={onPerfilClick}
        />

        <div className="app-header__user" style={{ cursor: 'pointer' }} onClick={onPerfilClick}>
          <strong className="app-header__name">{nomeUsuario}</strong>
          <span className="app-header__role">{cargoUsuario}</span>
        </div>
      </div>
    </header>
  )
}

export default Header
