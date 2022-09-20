import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';

import styles from './Affiliations.module.css';
const affiliations = require('components/JSONFiles/Affiliations.json');

export default function Affiliations() {
    const [currentAffiliation, setCurrentAffiliation] = useState(affiliations[0]);

    const enumerateAffiliation = (affiliation) => {
        /*let affiliationEnd = "present";
        if (affiliation.end !== null) {
            educEnd = `${education.end.month} ${education.end.year}`;
        }*/
        return (
            <>
                <div className={styles.affiliationLogo}><a href={affiliation.url} target="_blank"><img className={styles.logo} src={`/${affiliation.logo}`} /></a></div>
                {/* <h3>{`${affiliation.degree}`}</h3>
                <h6>{`${education.start.month} ${education.start.year} - ${educEnd}`}</h6> */}
            </>
        );
    }

    return (
        <>
            <div className="align-self-start">
                <h1>My Affiliations</h1>
                <div className={styles.affiliationContainer}>
                    {
                        affiliations.length > 0 ?
                            <>
                                <Nav variant="pills" className="flex-column" defaultActiveKey={affiliations[0].id}>
                                    {
                                        affiliations.map((item) =>
                                            <Nav.Item>
                                                <Nav.Link href={item.id} onClick={() => setCurrentAffiliation(item)}>{item.name}</Nav.Link>
                                            </Nav.Item>
                                        )}
                                </Nav>
                                <div className={styles.affiliationDescription}>
                                    {enumerateAffiliation(currentAffiliation)}
                                </div>
                            </>
                            :
                            ''
                    }
                </div>
            </div>
        </>
    );
}
