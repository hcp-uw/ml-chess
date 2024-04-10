import React from 'react';


export function NavigationBar(props) {

    // const linkArray = navBarLinks.map((navLink) => {
    //     const transformed = <Link key={navLink.linkName} to={navLink.linkTo} className='nav__link'>{navLink.linkName}</Link>;
    //     return transformed;
    // });

    // const liArray = <li className='{nav__item}'>{linkArray}</li>;

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-white px-0 py-3">
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
                    <div className="navbar-nav mx-lg-auto header">
                        <a className="nav-item nav-link active" href="#" aria-current="page">Home</a>
                        <a className="nav-item nav-link" href="#">Learn</a>
                        <a className="nav-item nav-link" href="#">Features</a>
                        <a className="nav-item nav-link" href="#">Contact</a>
                    </div>
                    {/* <!-- Right navigation --> */}
                    <div className="navbar-nav ms-lg-4">
                        <a className="nav-item nav-link" href="#">Sign in</a>
                    </div>
                    {/* <!-- Action --> */}
                    <div className="d-flex align-items-lg-center mt-3 mt-lg-0">
                        <a href="#" className="btn btn-sm btn-primary w-full w-lg-auto">
                        Register
                        </a>
                    </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}