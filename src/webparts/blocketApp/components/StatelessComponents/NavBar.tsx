import * as React from 'react';
import MenuBar from './MenuBar';
import styles from './NavigationItem.module.scss';


const NavBar = (props:any) => (
    <div>
        <div className={styles.NavigationItem}>Here is where the top nav will be</div>
        <MenuBar />
        <main>
            {props.children}
        </main>
    </div>
);

export default NavBar;