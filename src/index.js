import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'; // Make sure this line is added to import Tailwind CSS

import AuthProvider from './context/AuthContext'; // Import AuthProvider

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
