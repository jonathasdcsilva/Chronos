import { useState, useEffect } from 'react';
import { RouterLink } from '../RouterLink';

import { HistoryIcon, HouseIcon, MoonIcon, SettingsIcon, SunIcon } from 'lucide-react';
import styles from './styles.module.css';

type AvailableThemes = 'dark' | 'light';

export function Menu() {

    const [theme, setTheme] = useState<AvailableThemes>(() => {
        const storageTheme = (localStorage.getItem('theme') as AvailableThemes) || 'dark';
        return storageTheme;
    });

    const nextThemeIcon = {
        dark: <SunIcon />,
        light: <MoonIcon />
    };

    function handleThemeChange(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,) {
        event.preventDefault();
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    }

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    },[theme]);

    return (
        <nav className={styles.menu}>
            <RouterLink className={styles.menuLink} href='/' aria-label='Ir para a Home' title='Ir para a Home'>
                <HouseIcon />
            </RouterLink>
            <RouterLink className={styles.menuLink} href='/history/' aria-label='Ver o histórico' title='Ver o histórico'>
                <HistoryIcon />
            </RouterLink>
            <RouterLink className={styles.menuLink} href='/settings/' aria-label='Ir para a página de configurações' title='Ir para a página de configurações'>
                <SettingsIcon />
            </RouterLink>
            <a className={styles.menuLink} href='#' aria-label='Mudar o Tema' title='Mudar o Tema' onClick={handleThemeChange}>
                {nextThemeIcon[theme]}
            </a>
        </nav>
    );
};