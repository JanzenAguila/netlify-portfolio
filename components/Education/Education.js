import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';

import styles from './Education.module.css';
const education = require('components/JSONFiles/Education.json');

export default function Education() {
    const [currentEduc, setCurrentEduc] = useState(education[0]);

    const enumerateEduc = (education) => {
        let educEnd = "present";
        if (education.end !== null) {
            educEnd = `${education.end.month} ${education.end.year}`;
        }
        return (
            <>
                <div className={ styles.educationLogo }><a href={education.url} target="_blank"><img className={ styles.logo } src={ `/${ education.logo }` }/></a></div>
                <h3>{ `${education.degree}` }</h3>
                <h6>{ `${education.start.month} ${education.start.year} - ${educEnd}` }</h6>
            </>
        );
    }

    return (
        <>
            <div>
                <h1>My Education</h1>
                <div className={styles.educationContainer}>
                    {
                        education.length > 0 ?
                            <>
                                <Nav variant="pills" className="flex-column" defaultActiveKey={education[0].id }>
                                {
                                    education.map((item) => 
                                        <Nav.Item>
                                            <Nav.Link href={ item.id } onClick={ () => setCurrentEduc(item) }>{ item.name }</Nav.Link>
                                        </Nav.Item>
                                )}
                                </Nav>
                                <div className={styles.educationDescription}>
                                    { enumerateEduc(currentEduc) }
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
