import React, { useEffect, useState } from 'react';
import Loader from '@/components/Loader'
import './starter.scss'

function Starter() {
  return (
    <div className='starter-container'>
        <Loader />
        <div className='starter-message'>
        <span>En attente de l'ouverture de League of Legends...</span>
        </div>
    </div>
  )
}

export default Starter
