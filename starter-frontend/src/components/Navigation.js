import React from 'react';


export function NavigationBar(props) {

    // const linkArray = navBarLinks.map((navLink) => {
    //     const transformed = <Link key={navLink.linkName} to={navLink.linkTo} className='nav__link'>{navLink.linkName}</Link>;
    //     return transformed;
    // });

    // const liArray = <li className='{nav__item}'>{linkArray}</li>;

    return (
        <header className='header'>
            <nav className='nav container'>
                HOME
            </nav>
        </header>
    );


}