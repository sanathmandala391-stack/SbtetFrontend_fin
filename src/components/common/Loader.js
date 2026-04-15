import React from 'react';
import './Loader.css'; // We will create this next

const Loader = () => {
  return (
  <div class="loader-wrapper">
  <svg class="loader" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="40" cy="40" r="37"
      fill="none"
      stroke="#2a79b1ff"
      stroke-width="1.0"
      stroke-linecap="round"
      stroke-dasharray="150 50"
      stroke-dashoffset="100"
    />
  </svg>
</div>
  );
};

export default Loader;