import React, { forwardRef } from 'react';
import './style/popup.css';

const Popup = forwardRef(({ imgRefs }, ref) => {
  return (
    <div className='popup' ref={ref}>
      <div className="img" ref={imgRefs[0]}>
        <img src="./assets/game.png" height={200} width={400} alt="Image 1" />
      </div>
      <div className="img" ref={imgRefs[1]}>
        <img src="./assets/ML.png" height={200} width={400} alt="Image 2" />
      </div>
      <div className="img" ref={imgRefs[2]}>
        <img src="./assets/store.png" height={200} width={400} alt="Image 3" />
      </div>
      <div className="img" ref={imgRefs[3]}>
        <img src="./assets/port.png" height={200} width={400} alt="Image 4" />
      </div>
    </div>
  );
});

export default Popup;
