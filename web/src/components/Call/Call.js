import React, { useEffect } from 'react';

function StandBy() {
  return <div>Waiting for participants</div>
}

function Settings() {
  return <div>Camera/mic settings</div>
}

function Call() {
  useEffect(() => {
    const unload = () => true;
    window.addEventListener('unload', unload);
    return () => window.removeEventListener('unload', unload);
  }, []);
  return <div />
}

export default Call;