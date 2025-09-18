import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import logic from './Logic';
import { AlertTriangle, Play, Square, Eye, EyeOff, Camera } from 'lucide-react';


export default function SimpleObjectDetector() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [model, setModel] = useState(null);

    const [detected, setDetected] = useState(false);
    const[logs,setLogs] = useState([]);
    const [isDetecting, setIsDetecting] = useState(false);

    const handleToggle = () => {
        setIsDetecting(prev => !prev);
    };

    useEffect(() => {
        cocoSsd.load().then((loadedModel) => {
            setModel(loadedModel);
            console.log('Model Loaded');
        });

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch((err) => console.error('Webcam Error:', err));
    }, []);

    useEffect(() => {
        const drawVideo = () => {
            if (!canvasRef.current || !videoRef.current) return;

            const ctx = canvasRef.current.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, 640, 480);

            requestAnimationFrame(drawVideo);
        };

        if (videoRef.current) {
            drawVideo(); 
        }

        const detect = async () => {
            if (!isDetecting || !model) return;

            const predictions = await model.detect(videoRef.current);
            const ctx = canvasRef.current.getContext('2d');

            
            predictions.forEach(prediction => {
                const [x, y, width, height] = prediction.bbox;

                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, width, height);

                ctx.fillStyle = 'red';
                ctx.font = '16px Arial';
                ctx.fillText(`${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`, x + 5, y + 20);
            });

            const isDetectedNow = logic(predictions);
            setDetected(isDetectedNow);

            if(isDetectedNow){
                setLogs(prev => [
                    `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Detected !` ,...prev,
                ]);
            }

            requestAnimationFrame(detect); 
        };

        if (model && isDetecting) {
            detect(); 
        }
    }, [model, isDetecting]);

    useEffect(() => {
        if (detected) {
            console.warn('🚨 Harassment Detected!');
        }
    }, [detected]);

    return (

        <div className=' grid lg: grid-cols-3 gap-6'>
            
            <div className='lg:col-span-2'>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Live Video Feed</h2>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${model ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                                    <span className="text-sm text-gray-600">
                                        {model ? 'Model Ready' : 'Loading Model...'}
                                    </span>
                                </div>
                            </div>
                <video
                    ref={videoRef}
                    width="640"
                    height="480"
                    style={{ display: 'none' }}
                />

                <div className='relative bg-gray-500 rounded-lg overflow-hidden mb-4'>
                    <canvas ref={canvasRef} width="640" height="480"
                    className='w-full h-auto border-2 border-gray-200 rounded-lg shadow-inner'
                    />    

                    {detected && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span className="font-semibold">🚨 Harassment Detected!</span>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                                    {isDetecting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            <span>DETECTING</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <span>Detection is off</span>
                                        </div>
                                    )}
                                </div>

                </div>

                <div className='flex items-center justify-center gap-4'>
                <button
                className={` flex items-center gap-3 border bg-green-400 border-green-500 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg${
                    isDetecting ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } text-white font-bold py-2 px-4 rounded shadow mt-4`}
                onClick={handleToggle}
                >
                {isDetecting ? <Square className=' w-6 h-6' />  :<Play className="w-6 h-6" />}
                {isDetecting ? 'Stop Detection' : 'Start Detection'}
                </button>
                </div>
                </div>
            </div>

            <div className='space-y-6'>
                <div className='bg-white rounded-2xl shadow-lg p-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3'>
                        <Eye className='w-8 h-9'/>
                        System Status
                    </h3>
                    <div className='space-y-6'>
                        <div className=' flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                            <span className='text-gray-600 font-medium'>
                                AI Model
                            </span>
                            <div className='flex items-center gap-2'>
                                <div className={`w-5 h-5 rounded-full ${model ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <span className="text-sm font-semibold">{model ? 'Loaded' : 'Loading...'}</span>

                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Detection</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-5 h-5 rounded-full ${isDetecting ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                        <span className="text-sm font-semibold">{isDetecting ? 'Active' : 'Inactive'}</span>
                                    </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Alerts</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-5 h-5 rounded-full ${detected ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                        <span className="text-sm font-semibold">{detected ? 'ALERT!' : 'Clear'}</span>
                                    </div>
                        </div>

                    </div>
                </div>
                <div className='bg-white rounded-2xl shadow-lg p-6'>
                    <div className='flex items-center justify-between'>
                        <h3 className='flex gap-2 text-lg font-semibold text-gray-800 items-center'>
                            <AlertTriangle className='w-8 h-8 bold' />
                            Detection Logs
                        </h3>
                        <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium'>
                            {logs.length} events
                        </span>
                    </div>
                    <div>
                        {logs.length > 0 ?(
                            logs.map((log,index) => (
                        <li key = {index}>{log}</li>
                    ))
                        ):(
                            <div className="text-center py-8 text-gray-500">
                                        <EyeOff className="w-12 h-12 mx-auto mb-3 opacity-80" />
                                        <p className="font-medium">No detections yet</p>
                            </div>
                        )
                    }
                    </div>
                </div>
            </div>
            
            {detected && (
                    <div className="fixed bottom-6 left-6 right-6 bg-red-500 text-white p-4 rounded-lg shadow-2xl animate-pulse z-50">
                        <div className="flex items-center justify-center gap-3 font-bold text-lg">
                            <AlertTriangle className="w-6 h-6" />
                            🚨 HARASSMENT DETECTED! 🚨
                        </div>
                    </div>
                )}

        </div>
    );
}
