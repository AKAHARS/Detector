import React from 'react'
import { AlertTriangle, Play, Square, Eye, EyeOff, Camera } from 'lucide-react';


function Header() {
  return (
    <div className="text-center mb-12">
          <div className=' text-center mb-8'>
                  <div className='flex items-center justify-center gap-3 mb-4'>
                      <div className=' p-2 bg-blue-100 rounded-lg'>
                          <Camera className='w-8 h-8 text-blue-600' />
                      </div>
                      <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight"> Harassment-Detector</h1>
                  </div>
                  <p className="text-gray-600 text-lg">
          Real-time object Detection System</p>
          </div>
        </div>
  )
}

export default Header