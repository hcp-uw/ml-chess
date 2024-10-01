import React from 'react';

export function NavigationBar(props) {

    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-light bg-white px-0 py-3">
                <div className="container-xl header">
                    {/* <!-- Logo --> */}
                    <a className="navbar-brand" href="#">
                    <img src="/img/Logo.png" className="h-8 logo" alt="..."/>
                    </a>
                    {/* <!-- Navbar toggle --> */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon header"></span>
                    </button>
                    {/* <!-- Collapse --> */}
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                    {/* <!-- Nav --> */}
                    <div className="navbar-nav ms-auto header">
                        <a className="nav-item nav-link active" href="#" aria-current="page">Home</a>
                        <a className="nav-item nav-link" href="#">Learn</a>
                        <a className="nav-item nav-link" href="#">Features</a>
                        <a className="nav-item nav-link" href="#">Contact</a>
                    </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}