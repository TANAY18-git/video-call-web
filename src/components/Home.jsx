import './Home.css'

function Home({ onCreateRoom, onJoinClick }) {
    return (
        <div className="home">
            <div className="home-content">
                <div className="home-logo animate-float">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15.6 11.6L22 7v10l-6.4-4.6v-1zM4 5h10a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
                        </svg>
                    </div>
                </div>

                <h1 className="home-title">
                    <span className="gradient-text">Video Call</span>
                </h1>
                <p className="home-subtitle">Connect instantly with room codes</p>

                <div className="home-actions">
                    <button className="btn btn-primary" onClick={onCreateRoom}>
                        <span className="btn-icon-left">📹</span>
                        Create Room
                    </button>

                    <button className="btn btn-secondary" onClick={onJoinClick}>
                        <span className="btn-icon-left">🔗</span>
                        Join Room
                    </button>
                </div>

                <div className="home-features">
                    <div className="feature">
                        <span className="feature-icon">🔒</span>
                        <span className="feature-text">Secure P2P</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">⚡</span>
                        <span className="feature-text">Instant Connect</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">📱</span>
                        <span className="feature-text">Mobile Ready</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
