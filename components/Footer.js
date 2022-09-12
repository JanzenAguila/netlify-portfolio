import styles from './Footer.module.css';
import ReactTooltip from 'react-tooltip';

import { FaMailBulk, FaGithub, FaLinkedinIn, FaSkype, FaFacebookF } from 'react-icons/fa';
const contactInfo = require('components/JSONFiles/ContactInfo.json');

export default function Footer() {
    const iconPicker = (icon, size) => {
        if (icon === "FaMailBulk")
            return <FaMailBulk size={size} />
        else if (icon === "FaGithub")
            return <FaGithub size={size} />
        else if (icon === "FaLinkedinIn")
            return <FaLinkedinIn size={size} />
        else if (icon === "FaSkype")
            return <FaSkype size={size} />
        else if (icon === "FaFacebookF")
            return <FaFacebookF size={size} />
    }

    const enumContactInfo = (item) => {
        return (
            <span>
                <a className={styles.contactLink} href={item.url} target="_blank" data-tip={item.description}>{iconPicker(item.icon, 25)}</a>
                <ReactTooltip place="top" type="dark" effect="solid" />
            </span>
        );
    }

    return (
        <>
            <footer className={styles.footer}>
                Made with <img src="/netliheart.svg" alt="Netlify Logo" className={styles.logo} /> for you
                {
                    contactInfo.length > 0 ?
                        <div className={`${styles.menu} ${styles.alignRight}`}>
                            { contactInfo.map((item) => enumContactInfo(item)) }
                        </div>
                        : ''
                }
            </footer>
        </>
    );
}
