import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

export default function Join() {  
  return (
    <div>  <Link to={`/room`}> <Button variant="primary">Go somewhere</Button></Link>  </div>
  )
}

