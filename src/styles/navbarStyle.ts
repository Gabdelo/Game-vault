export const navbarStyles = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap');

                .nav-cyber {
               
                    background: rgba(0, 0, 0, 0.5);
                    border-bottom: 1px solid rgba(168, 50, 255, 0.25);
                    position: relative;
                    overflow: visible;
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 252, 0, 0.8);

                }
                @keyframes scanTop {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                /* Logo */
                .nav-logo-img {
                    border: 1px solid rgba(255, 252, 0, 0.8);
                    box-shadow: 0 0 5px rgba(255, 252, 0, 0.8), 0 0 5px ;
                    border-radius: 6px !important;
                    transition: box-shadow 0.3s;
                }
                .nav-logo-img:hover {
                    box-shadow: 0 0 16px rgba(247, 255, 0, 0.8), 0 0 32px rgba(247, 255, 0, 0.8);
                }
                /* Buscador */
                
                /* Dropdown de resultados */
                .nav-results-dropdown {
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(168, 50, 255, 0.35);
                    border-top: 1px solid rgba(255, 255, 0);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(168, 50, 255, 0.1);
                    clip-path: polygon(0% 0%, 100% 0%, calc(100% - 8px) 100%, 8px 100%);
                }

                .nav-results-item {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                    transition: background 0.15s;
                }
                .nav-results-item:hover {
                    background: rgba(168, 50, 255, 0.12) !important;
                }
                .nav-results-item p:first-child {
                    color: rgba(247, 255, 0) !important;
                    font-family: 'Rajdhani', sans-serif !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.5px;
                }
                .nav-results-item p:last-child {
                    color: rgba(0, 252, 255, 0.8) !important;
                    font-family: 'Rajdhani', sans-serif !important;
                    letter-spacing: 1px;
                }

                /* Botones auth */
                .nav-auth-link {
                  
                    font-size: 12px !important;
                    font-weight: 700 !important;
                    letter-spacing: 2px !important;
                    text-transform: uppercase;
                    color: rgba(255,255,0.4) !important;
                    text-decoration: none;
                    border-bottom: 1px solid rgba(100, 150, 255, 0.3);
                    padding: 2px 4px;
                    transition: color 0.2s, border-color 0.2s;
                }
                .nav-auth-link:hover {
                    color: rgba(140, 200, 255, 1) !important;
                    border-color: rgba(100, 200, 255, 0.7);
                }

                
              
                /* Separador */
                .nav-sep {
                    width: 1px;
                    height: 24px;
                    background: linear-gradient(180deg, transparent, rgba(168, 50, 255, 0.35), transparent);
                }

                /* Texto "Cargando" y "No encontrado" */
                .nav-empty-text {
                    color: rgba(160, 110, 220, 0.5) !important;
            
                    font-size: 12px !important;
                    font-weight: 600 !important;
                    letter-spacing: 2px !important;
                    text-transform: uppercase;
                }
`