export const filterStyles = `

                /* ── Panel base ── */
                .sb-panel {
            
                    background: rgba(0, 0, 0, 0.9);
                    border: 1px solid rgba(168, 50, 255, 0);
                    border-radius: 4px;
                    padding: 16px;
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(12px);
                }

                /* Esquina decorativa top-left */
                .sb-panel::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 24px; height: 24px;
                    border-top: 1.5px solid rgba(242, 255, 0, 0.8);
                    border-left: 1.5px solid rgba(242, 255, 0, 0.8);
                    pointer-events: none;
                }

                /* Esquina decorativa bottom-right */
                .sb-panel::after {
                    content: '';
                    position: absolute;
                    bottom: 0; right: 0;
                    width: 24px; height: 24px;
                    border-bottom: 1.5px solid rgba(242, 255, 0, 0.8);
                    border-right: 1.5px solid rgba(242, 255, 0, 0.8);
                    pointer-events: none;
                }

                /* ── Título de sección ── */
                .sb-heading {
            
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: rgba(255, 252, 0, 0.8);
                    margin-bottom: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .sb-heading::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, rgba(242, 255, 0, 0.8), transparent);
                }

                /* ── Botón filtro ── */
                .sb-filter-btn {
                    width: 100%;
                    text-align: left;
                    padding: 8px 12px;
                
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.06);
                    color: rgba(0, 252, 255, 0.8);
                    cursor: pointer;
                    transition: all 0.15s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
                    position: relative;
                }
                .sb-filter-btn:hover {
                    background: rgba(247, 255, 0, 0.1);
                    border-color: rgba(247, 255, 0, 0.35);
                    color: rgba(220, 255, 0, 0.95);
                    box-shadow: inset 2px 0 0 rgba(247, 255, 0, 0.7);
                }
                .sb-filter-btn.active {
                    background: rgba(247, 255, 0, 0.18);
                    border-color: rgba(247, 255, 0, 0.6);
                    color: rgba(220, 255, 0, 1);
                    box-shadow: inset 2px 0 0 rgba(247, 255, 0, 1), 0 0 12px rgba(247, 255, 0, 0.12);
                }
                .sb-filter-btn.active .sb-btn-icon {
                    color: #f7ff00;
                    text-shadow: 0 0 8px rgba(247, 255, 0, 0.8);
                }
                .sb-btn-icon {
                    font-size: 14px;
                    color: rgba(0, 252, 255, 0.8);
                    flex-shrink: 0;
                    transition: color 0.15s, text-shadow 0.15s;
                }

                /* Indicador activo (punto + línea derecha) */
                .sb-filter-btn.active::after {
                    content: '';
                    position: absolute;
                    right: 10px; top: 50%;
                    transform: translateY(-50%);
                    width: 4px; height: 4px;
                    background: rgba(247, 255, 0, 0.8);
                    border-radius: 50%;
                    box-shadow: 0 0 6px #b040ff;
                }

                /* ── Botón género ── */
                .sb-genre-btn {
                    width: 100%;
                    text-align: left;
                    padding: 6px 10px;
                   
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    background: transparent;
                    border: 1px solid transparent;
                    color: rgba(0, 252, 255, 0.8);
                    cursor: pointer;
                    transition: all 0.15s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border-radius: 2px;
                }
                .sb-genre-btn::before {
                    content: '//';
                    font-size: 9px;
                    color: rgba(0, 252, 255, 0.8);
                    letter-spacing: -1px;
                    flex-shrink: 0;
                    transition: color 0.15s;
                }
                .sb-genre-btn:hover {
                    background: rgba(247, 255, 0, 0.07);
                    border-color: rgba(247, 255, 0, 0.2);
                    color: rgba(255, 255, 0, 0.9);
                }
                .sb-genre-btn:hover::before {
                    color: rgba(247, 255, 0, 0.8);
                }
                .sb-genre-btn.active {
                    background: rgba(247, 255, 0, 0.15);
                    border-color: rgba(247, 255, 0, 0.5);
                    color: rgba(220, 255, 0, 1);
                    box-shadow: inset 2px 0 0 rgba(247, 255, 0, 0.9);
                }
                .sb-genre-btn.active::before {
                    content: '▶';
                    font-size: 8px;
                    color: #f7ff00;
                    text-shadow: 0 0 6px rgba(247, 255, 0, 0.8);
                }

                /* ── Scrollbar géneros ── */
                .sb-genre-list {
                    max-height: 340px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    padding-right: 4px;
                }
                .sb-genre-list::-webkit-scrollbar { width: 3px; }
                .sb-genre-list::-webkit-scrollbar-track { background: transparent; }
                .sb-genre-list::-webkit-scrollbar-thumb {
                    background: rgba(242, 255, 0, 0.8);
                    border-radius: 2px;
                }

                /* ── Botón limpiar ── */
                .sb-clear-btn {
                    width: 100%;
                    padding: 8px 16px;
                   
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    background: rgba(255, 60, 100, 0.06);
                    border: 1px solid rgba(255, 60, 100, 0.25);
                    color: rgba(255, 120, 140, 0.7);
                    cursor: pointer;
                    transition: all 0.2s;
                    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .sb-clear-btn:hover {
                    background: rgba(255, 60, 100, 0.14);
                    border-color: rgba(255, 60, 100, 0.55);
                    color: rgba(255, 160, 175, 1);
                    box-shadow: 0 0 12px rgba(255,60,100,0.15);
                }
            `