import React from "react";
import "./index.css";
import Detector from ".//Component/Detector";
import Header from ".//Component/Header";
import { AlertTriangle, Play, Square, Eye, EyeOff, Camera } from 'lucide-react';
import { div } from "@tensorflow/tfjs";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Header/>
        <Detector/>
      </div>
    </div>
  );
}

export default App;

