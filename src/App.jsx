import { useState } from 'react'
import Home from './components/Home'
import JoinRoom from './components/JoinRoom'
import VideoRoom from './components/VideoRoom'
import './App.css'

function App() {
    const [screen, setScreen] = useState('home') // 'home', 'join', 'room'
    const [roomCode, setRoomCode] = useState('')
    const [isHost, setIsHost] = useState(false)

    const generateRoomCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        let code = ''
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }

    const handleCreateRoom = () => {
        const code = generateRoomCode()
        setRoomCode(code)
        setIsHost(true)
        setScreen('room')
    }

    const handleJoinClick = () => {
        setScreen('join')
    }

    const handleJoinRoom = (code) => {
        setRoomCode(code.toUpperCase())
        setIsHost(false)
        setScreen('room')
    }

    const handleBack = () => {
        setScreen('home')
        setRoomCode('')
    }

    const handleEndCall = () => {
        setScreen('home')
        setRoomCode('')
        setIsHost(false)
    }

    return (
        <div className="app">
            {screen === 'home' && (
                <Home
                    onCreateRoom={handleCreateRoom}
                    onJoinClick={handleJoinClick}
                />
            )}
            {screen === 'join' && (
                <JoinRoom
                    onJoin={handleJoinRoom}
                    onBack={handleBack}
                />
            )}
            {screen === 'room' && (
                <VideoRoom
                    roomCode={roomCode}
                    isHost={isHost}
                    onEndCall={handleEndCall}
                />
            )}
        </div>
    )
}

export default App
