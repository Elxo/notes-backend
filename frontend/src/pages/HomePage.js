import React from 'react';
import notesIcon  from '../images/notes.svg';
import secureIcon from '../images/secure.svg';
import browseIcon from '../images/browse.svg';

export default function HomePage() {
  return (
    <>
      <section className="features">
        <h2>Everything You Need</h2>
        <div className="feature-list">
          <div className="feature-item">
            <img src={notesIcon}  alt="Create Your Notes" />
            <p>Create Your Notes</p>
          </div>
          <div className="feature-item">
            <img src={secureIcon} alt="Keep them secure" />
            <p>Keep them secure</p>
          </div>
          <div className="feature-item">
            <img src={browseIcon} alt="Easy to Browse" />
            <p>Easy to Browse</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Creator: Emils Zvirbulis</p>
        <p>Contact: <a href="mailto:loteemils@gmail.com">loteemils@gmail.com</a></p>
      </footer>
    </>
  );
}
