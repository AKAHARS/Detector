import React from 'react'
import { AlertTriangle, Play, Square, Eye, EyeOff, Camera } from 'lucide-react';


function Header() {
  return (
    <div className="text-center mb-6 mb:mb-8">
<div className="text-center mb-6 md:mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 md:mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Object Detection System</h1>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4">Real-time harassment detection and monitoring</p>
                </div>
        </div>
  )
}

export default Header