import { useState, useEffect, useRef, useCallback } from 'react'

export function useWebRTC(roomCode, isHost) {
    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [connectionStatus, setConnectionStatus] = useState('initializing') // initializing, waiting, connecting, connected, error
    const [error, setError] = useState(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(false)

    const peerRef = useRef(null)
    const currentCallRef = useRef(null)
    const localStreamRef = useRef(null)

    // Initialize media stream
    const initializeMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: true
            })
            localStreamRef.current = stream
            setLocalStream(stream)
            return stream
        } catch (err) {
            console.error('Error accessing media devices:', err)
            setError('Camera/microphone access denied. Please allow permissions.')
            setConnectionStatus('error')
            return null
        }
    }, [])

    // Initialize PeerJS
    useEffect(() => {
        let mounted = true

        const init = async () => {
            const stream = await initializeMedia()
            if (!stream || !mounted) return

            // Dynamically import PeerJS
            const { Peer } = await import('peerjs')

            const peerId = isHost ? `room-${roomCode}` : `guest-${roomCode}-${Date.now()}`

            const peer = new Peer(peerId, {
                debug: 1
            })

            peerRef.current = peer

            peer.on('open', (id) => {
                console.log('Peer connected with ID:', id)
                if (isHost) {
                    setConnectionStatus('waiting')
                } else {
                    // Join existing room
                    setConnectionStatus('connecting')
                    const call = peer.call(`room-${roomCode}`, stream)
                    setupCallHandlers(call)
                }
            })

            peer.on('call', (call) => {
                console.log('Receiving call...')
                setConnectionStatus('connecting')
                call.answer(localStreamRef.current)
                setupCallHandlers(call)
            })

            peer.on('error', (err) => {
                console.error('Peer error:', err)
                if (err.type === 'peer-unavailable') {
                    setError('Room not found. Please check the room code.')
                } else if (err.type === 'unavailable-id') {
                    setError('Room already exists. Try joining instead.')
                } else {
                    setError(`Connection error: ${err.message}`)
                }
                setConnectionStatus('error')
            })

            peer.on('disconnected', () => {
                console.log('Peer disconnected')
                if (mounted) {
                    setConnectionStatus('waiting')
                }
            })
        }

        const setupCallHandlers = (call) => {
            currentCallRef.current = call

            call.on('stream', (stream) => {
                console.log('Received remote stream')
                setRemoteStream(stream)
                setConnectionStatus('connected')
            })

            call.on('close', () => {
                console.log('Call closed')
                setRemoteStream(null)
                if (isHost) {
                    setConnectionStatus('waiting')
                } else {
                    setConnectionStatus('error')
                    setError('Call ended by host')
                }
            })

            call.on('error', (err) => {
                console.error('Call error:', err)
                setError('Call failed. Please try again.')
                setConnectionStatus('error')
            })
        }

        init()

        return () => {
            mounted = false
            cleanup()
        }
    }, [roomCode, isHost, initializeMedia])

    const cleanup = useCallback(() => {
        if (currentCallRef.current) {
            currentCallRef.current.close()
            currentCallRef.current = null
        }

        if (peerRef.current) {
            peerRef.current.destroy()
            peerRef.current = null
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
            localStreamRef.current = null
        }
    }, [])

    const toggleMute = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsMuted(!audioTrack.enabled)
            }
        }
    }, [])

    const toggleCamera = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                setIsCameraOff(!videoTrack.enabled)
            }
        }
    }, [])

    const endCall = useCallback(() => {
        cleanup()
    }, [cleanup])

    return {
        localStream,
        remoteStream,
        connectionStatus,
        error,
        isMuted,
        isCameraOff,
        toggleMute,
        toggleCamera,
        endCall
    }
}
