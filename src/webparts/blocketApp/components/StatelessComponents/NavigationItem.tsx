import * as React from 'react';

import styles from './NavigationItem.module.scss';

export interface NavigationItemProps {
    url: string;
    children: React.ReactNode;
}

const navigationItem = (props:NavigationItemProps) => (
    <li className={styles.NavigationItem}>
        <a 
            href={'#' + props.url}
            >{props.children}</a>
        
    </li>
);

export default navigationItem;