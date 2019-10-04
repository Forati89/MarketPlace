import * as React from 'react';
import NavigationItem from './NavigationItem';
import styles from '../NavigationItems.module.scss';


const navigationItems = () => (
    <ul className={styles.NavigationItems}>
        <NavigationItem url='/' >Home</NavigationItem>
        <NavigationItem url='/annonser'>Annonser</NavigationItem>
        <NavigationItem url='/login'>Login</NavigationItem>
    </ul>
);

export default navigationItems;