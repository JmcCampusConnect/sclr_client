import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

function Toast({ type, message, onClose }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'error':
                return <XCircle className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
            default:
                return <Info className="w-6 h-6 text-blue-600" />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-400 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-400 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-400 text-yellow-800';
            default:
                return 'bg-blue-50 border-blue-400 text-blue-800';
        }
    };

    const getCloseButtonColor = () => {
        switch (type) {
            case 'success':
                return 'hover:text-green-800 text-green-600';
            case 'error':
                return 'hover:text-red-800 text-red-600';
            case 'warning':
                return 'hover:text-yellow-800 text-yellow-600';
            default:
                return 'hover:text-blue-800 text-blue-600';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
            <div className={`px-6 py-4 rounded-lg border-2 shadow-lg max-w-md ${getColor()}`}>
                <div className="flex items-center gap-3">
                    <span className="flex-shrink-0">{getIcon()}</span>
                    <p className="font-medium flex-1">{message}</p>
                </div>
            </div>
        </div>
    );
}

export default Toast;