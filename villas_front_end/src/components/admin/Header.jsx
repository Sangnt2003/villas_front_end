

const Header = () => {
    return (
        <nav className="navbar navbar-light px-3 d-flex justify-content-end" style={{ background: '#0082BB' }}>
            <div>
                <button className="btn btn-primary">Notifications</button>
                <button className="btn btn-secondary ms-2">Profile</button>
            </div>
        </nav>
    );
};

export default Header;
