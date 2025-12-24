import { useState } from 'react'
import './JoinRoom.css'

function JoinRoom({ onJoin, onBack }) {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
        if (value.length <= 6) {
            setCode(value)
            setError('')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (code.length !== 6) {
            setError('Please enter a 6-character room code')
            return
        }
        onJoin(code)
    }

    return (
        <div className="join-room">
            <button className="back-button" onClick={onBack}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>

            <div className="join-content">
                <h2 className="join-title">Join Room</h2>
                <p className="join-subtitle">Enter the 6-character room code</p>

                <form onSubmit={handleSubmit} className="join-form">
                    <div className="code-input-wrapper">
                        <input
                            type="text"
                            className={`input code-input ${error ? 'input-error' : ''}`}
                            value={code}
                            onChange={handleChange}
                            placeholder="XXXXXX"
                            autoFocus
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                        <div className="code-underline">
                            {[...Array(6)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`underline-segment ${i < code.length ? 'filled' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary join-btn"
                        disabled={code.length !== 6}
                    >
                        Join Call
                    </button>
                </form>
            </div>
        </div>
    )
}

export default JoinRoom
