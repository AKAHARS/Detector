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

        <div className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-6">
            <div className=' grid grid-cols-1 xl:grid-col-3 gap-4 sm:gap-6 p-2 sm:p-4'>
            
            <div className='xl:col-span-2'>
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">                               
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Live Video Feed</h2>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${model ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                                    <span className=" text-xs sm:text-sm text-gray-600">
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
                    className='w-full h-auto max-w-full border-2 border-gray-200 rounded-lg shadow-inner'
                    style={{aspectRatio: '4/3'}}
                    />    

                    {detected && (
                                    <div className="absolute top-4 sm:top-4 left-4 bg-red-500 text-white px-2 sm:px-4 py-1 sm:py-2  rounded-lg shadow-lg animate-pulse">
                                        <div className="flex items-center gap-2 sm:gap-2">
                                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="font-semibold text-xs sm:text-base">🚨 Harassment Detected!</span>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black bg-opacity-75 text-white px-2 sm:px-3  py-1 rounded-full text-sm">
                                    {isDetecting ? (
                                        <div className="flex items-center gap-1 sm:gap-2">
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
                className={`flex items-center gap-2 sm:gap-3 border bg-green-400 border-green-500 px-4 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg transition-all transform hover:scale-105 shadow-lg${
                    isDetecting ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } text-white font-bold py-2 px-4 rounded shadow mt-4`}
                onClick={handleToggle}
                >
                {isDetecting ? <Square className=' w-5 h-5 sm:w-6 sm:h-6' />  :<Play className="w-6 h-6" />}
                {isDetecting ? 'Stop Detection' : 'Start Detection'}
                </button>
                </div>
                </div>
            </div>

            <div className='space-y-3 sm:space-y-6'>
                <div className='bg-white rounded-2xl shadow-lg p-4 sm:p-6'>
                    <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3'>
                        <Eye className='w-8 h-9 sm:w-8 sm:h-9'/>
                        System Status
                    </h3>
                    <div className='space-y-3 sm:space-y-6'>
                        <div className=' flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg'>
                            <span className='text-gray-600 font-medium text-sm sm:text-base'>
                                AI Model
                            </span>
                            <div className='flex items-center gap-2'>
                                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${model ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <span className="text-xs sm:text-sm font-semibold">{model ? 'Loaded' : 'Loading...'}</span>

                            </div>
                        </div>

                        <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium text-sm sm:text-base">Detection</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${isDetecting ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                        <span className="text-xs sm:text-sm font-semibold">{isDetecting ? 'Active' : 'Inactive'}</span>
                                    </div>
                        </div>
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium text-sm sm:text-base">Alerts</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${detected ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                        <span className="text-xs sm:text-sm font-semibold">{detected ? 'ALERT!' : 'Clear'}</span>
                                    </div>
                        </div>

                    </div>
                </div>
                <div className='bg-white rounded-2xl shadow-lg p-4 sm:p-6'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0'>
                        <h3 className='flex gap-2 text-base sm:text-lg font-semibold text-gray-800 items-center'>
                            <AlertTriangle className='w-6 sm:w-8 h-6 sm:h-8 bold' />
                            Detection Logs
                        </h3>
                        <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium'>
                            {logs.length} events
                        </span>
                    </div>
                    <div className='max-h-48 sm:max-h-64 overflow-y-auto'>
                        {logs.length > 0 ?(
                            <ul className='space-y-1 sm:space-y-2'>
                                {logs.map((log,index) => (
                                    <li key={index} className='text-xs sm:text-sm p-2 bg-red-50 rounded border-l-4 border-red-400'>{log}</li>
                                ))}
                            </ul>
                        ):(
                            <div className="text-center py-6 sm:py-8 text-gray-500">
                                        <EyeOff className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-80" />
                                        <p className="font-medium text-sm sm:text-base">No detections yet</p>
                            </div>
                        )
                    }
                    </div>
                </div>
            </div>
            
            {detected && (
                    <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-red-500 text-white p-3 s:p-4 rounded-lg shadow-2xl animate-pulse z-50">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-lg">
                            <AlertTriangle className=" w-5 h-5 sm:w-6 sm:h-6" />
                            🚨 HARASSMENT DETECTED! 🚨
                        </div>
                    </div>
                )}

        </div>
        </div>


    );
}
