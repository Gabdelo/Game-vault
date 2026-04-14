export const cardStyles = `
  /* ── Base card ── */
  .cp-card {
    background: linear-gradient(160deg, #0d0d14 0%, #110d1a 60%, #0a0d18 100%);
    border: 1px solid rgba(247, 255, 0, 0.15);
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    width: 19rem;
    min-width: 10rem;
    max-width: 20rem;
    height: 420px;
    margin: 0.5rem;
    
  }

  /* Línea de acento superior */
  .cp-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(247, 255, 0, 0.8), rgba(0, 252, 255, 0.8), transparent);
    opacity: 0;
    transition: opacity 0.35s;
    z-index: 10;
  }

  /* Brillo esquina inferior derecha */
  .cp-card::after {
    content: '';
    position: absolute;
    bottom: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(0, 252, 255, 0.12) 0%, transparent 70%);
    transition: opacity 0.35s;
    pointer-events: none;
  }

  .cp-card:hover {
    border-color: rgba(247, 255, 0, 0.6);
    transform: translateY(-6px);
    box-shadow:
      0 0 0 1px rgba(247, 255, 0, 0.15),
      0 8px 32px rgba(0,0,0,0.6),
      0 0 40px rgba(247, 255, 0, 0.12);
  }

  .cp-card:hover::before {
    opacity: 1;
  }

  .cp-card:hover .cp-card__img-overlay {
    opacity: 1;
  }

  .cp-card:hover .cp-card__img {
    transform: scale(1.06);
    filter: saturate(1.15) brightness(1.05);
  }

  /* ── Image ── */
  .cp-card__img-wrap {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
    background: #080810;
  }

  .cp-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), filter 0.5s;
    filter: saturate(0.85) brightness(0.9);
  }

  /* Gradiente sobre imagen hacia el body */
  .cp-card__img-wrap::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to bottom, transparent, #0d0d14);
    pointer-events: none;
  }

  .cp-card__img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(247, 255, 0, 0.08) 0%,
      transparent 40%,
      rgba(0, 252, 255, 0.06) 100%
    );
    opacity: 0;
    transition: opacity 0.35s;
    pointer-events: none;
    z-index: 1;
  }

  .cp-card__img-scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.06) 3px,
      rgba(0,0,0,0.06) 4px
    );
    pointer-events: none;
    opacity: 0.4;
    z-index: 2;
  }

  /* ── Rating badge ── */
  .cp-card__rating {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 13px;
    font-weight: 800;
    color: #fff;
    background: rgba(10, 8, 18, 0.85);
    border: 1px solid rgba(247, 255, 0, 0.5);
    padding: 4px 10px;
    border-radius: 6px;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    gap: 5px;
    z-index: 3;
    letter-spacing: 0.5px;
  }

  .cp-card__rating::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(247, 255, 0, 0.8);
    box-shadow: 0 0 6px rgba(247, 255, 0, 0.8);
  }

  /* ── Corner accent ── */
  .cp-card__corner-accent {
    display: none;
  }

  /* ── Body ── */
  .cp-card__body {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
  }

  .cp-card__title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.4px;
    color: rgba(247, 255, 0, 0.9);
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── Genres ── */
  .cp-card__genres {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  .cp-card__genre-tag {
    padding: 2px 9px;
    background: rgba(0, 252, 255, 0.08);
    border: 1px solid rgba(0, 252, 255, 0.22);
    color: rgba(0, 252, 255, 0.8);
    border-radius: 4px;
    font-size: 10px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    font-weight: 500;
  }

  /* ── Meta ── */
  .cp-card__meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .cp-card__meta-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .cp-card__meta-key {
    font-size: 9px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(0, 252, 255, 0.4);
  }

  .cp-card__meta-val {
    font-size: 11px;
    font-weight: 600;
    color: rgba(0, 252, 255, 0.9);
    letter-spacing: 0.3px;
  }

  /* ── Divider ── */
  .cp-card__divider {
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(247, 255, 0, 0.3) 30%,
      rgba(0, 252, 255, 0.2) 70%,
      transparent
    );
  }

  /* ── Footer ── */
  .cp-card__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: auto;
  }

  .cp-card__add-btn {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 8px 18px;
    background: transparent;
    border: 1px solid rgba(247, 255, 0, 0.45);
    color: rgba(0, 252, 255, 0.9);
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-weight: 700;
    position: relative;
    overflow: hidden;
  }

  .cp-card__add-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(247, 255, 0, 0.15), rgba(0, 252, 255, 0.08));
    opacity: 0;
    transition: opacity 0.2s;
  }

  .cp-card__add-btn:hover::before {
    opacity: 1;
  }

  .cp-card__add-btn:hover {
    border-color: rgba(247, 255, 0, 0.8);
    color: rgba(247, 255, 0, 0.9);
    box-shadow: 0 0 16px rgba(247, 255, 0, 0.2);
  }

  .cp-card__add-btn:active {
    transform: scale(0.97);
  }

  /* ── Responsive Sizes ── */
  @media (max-width: 840px) {
    .cp-card {
      width: 100%;
      max-width: 100%;
      height: 280px;
    }
    
    .cp-card__title {
      font-size: 0.95rem;
      line-height: 1.3;
    }

    .cp-card__description {
      font-size: 0.8rem;
      max-height: 2em;
    }

    .cp-card__meta {
      font-size: 0.75rem;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .cp-card {
      width: 100%;
      max-width: 100%;
      height: 350px;
    }

    .cp-card__title {
      font-size: 1rem;
    }

    .cp-card__description {
      font-size: 0.85rem;
      max-height: 2.5em;
    }
  }

  @media (min-width: 1025px) {
    .cp-card {
      width: 14rem;
      max-width: 18rem;
      height: 420px;
    }

    .cp-card__title {
      font-size: 1.1rem;
    }

    .cp-card__description {
      font-size: 0.9rem;
    }
  }

  @media (min-width: 1530px) {
    .cp-card {
      width: 20rem;
      max-width: 20rem;
    }
  }
`