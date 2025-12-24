import { useEffect, useRef, useState } from 'react'
import { useWebRTC } from '../hooks/useWebRTC'
import './VideoRoom.css'

function VideoRoom({ roomCode, isHost, onEndCall }) {
    const {
        localStream,
        remoteStream,
        connectionStatus,
        error,
        isMuted,
        isCameraOff,
        toggleMute,
        toggleCamera,
        endCall
    } = useWebRTC(roomCode, isHost)

    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const [copied, setCopied] = useState(false)
    const [showLocalVideo, setShowLocalVideo] = useState(true)

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream
        }
    }, [localStream])

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream
        }
    }, [remoteStream])

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(roomCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleEndCall = () => {
        endCall()
        onEndCall()
    }

    const getStatusMessage = () => {
        switch (connectionStatus) {
            case 'initializing':
                return 'Starting camera...'
            case 'waiting':
                return 'Waiting for someone to join...'
            case 'connecting':
                return 'Connecting...'
            case 'connected':
                return 'Connected'
            case 'error':
                return error || 'Connection failed'
            default:
                return ''
        }
    }

    const getStatusClass = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'status-connected'
            case 'error':
                return 'status-error'
            default:
                return 'status-pending'
        }
    }

    return (
        <div className="video-room">
            {/* Room Code Header */}
            <div className="room-header">
                <div className="room-code-display" onClick={handleCopyCode}>
                    <span className="room-code-label">Room Code</span>
                    <span className="room-code-value">{roomCode}</span>
                    <span className={`copy-indicator ${copied ? 'copied' : ''}`}>
                        {copied ? '✓ Copied!' : '📋 Tap to copy'}
                    </span>
                </div>
            </div>

            {/* Status Bar */}
            <div className={`connection-status ${getStatusClass()}`}>
                <span className="status-dot"></span>
                <span className="status-text">{getStatusMessage()}</span>
            </div>

            {/* Video Container */}
            <div className="video-container">
                {/* Remote Video (Main) */}
                <div className="remote-video-wrapper">
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="remote-video"
                        />
                    ) : (
                        <div className="waiting-overlay">
                            <div className="waiting-content">
                                <div className="waiting-icon animate-pulse">👤</div>
                                <p className="waiting-text">
                                    {isHost
                                        ? 'Share the room code to start the call'
                                        : 'Connecting to host...'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Local Video (Picture-in-Picture) */}
                {showLocalVideo && (
                    <div
                        className={`local-video-wrapper ${isCameraOff ? 'camera-off' : ''}`}
                        onClick={() => setShowLocalVideo(prev => !prev)}
                    >
                        {isCameraOff ? (
                            <div className="camera-off-indicator">
                                <span>📵</span>
                            </div>
                        ) : (
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="local-video"
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="video-controls">
                <button
                    className={`btn btn-icon control-btn ${isMuted ? 'muted' : ''}`}
                    onClick={toggleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? '🔇' : '🎤'}
                </button>

                <button
                    className="btn btn-icon control-btn end-call"
                    onClick={handleEndCall}
                    title="End Call"
                >
                    📞
                </button>

                <button
                    className={`btn btn-icon control-btn ${isCameraOff ? 'muted' : ''}`}
                    onClick={toggleCamera}
                    title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
                >
                    {isCameraOff ? '📷' : '📹'}
                </button>
            </div>
        </div>
    )
}

export default VideoRoom
