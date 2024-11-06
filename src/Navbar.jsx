import React from 'react';

function Navbar({ onFormChange }) {
  return (
    <nav>
      <button onClick={() => onFormChange('formA')}>Formulário A</button>
      <button onClick={() => onFormChange('formB')}>Formulário B</button>
    </nav>
  );
}

export default Navbar;
