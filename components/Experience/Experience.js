import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';

import styles from './Experience.module.css';
const experiences = require('components/JSONFiles/Experience.json');

export default function Experience() {
    const [currentExp, setCurrentExp] = useState(experiences[0]);

    const enumerateExp = (experience) => {
        let expEnd = "present";
        if (experience.end !== null) {
            expEnd = `${experience.end.month} ${experience.end.year}`;
        }
        return (
            <>
                <div className={ styles.experienceLogo }><a href={experience.url} target="_blank"><img src={ `/${ experience.logo }` }/></a></div>
                <h3>{ `${experience.role}` }</h3>
                <h6>{ `${experience.start.month} ${experience.start.year} - ${expEnd}` }</h6>
                <ul>
                    {
                        experience.description.map((description) =>
                            <li>
                                <span dangerouslySetInnerHTML={{ __html: description }}/>
                            </li>
                        )}
                    <li>Technologies used: {experience.technologies.map(function (val) { return val }).join(', ') }</li>
                </ul>
            </>
        );
    }

    return (
        <>
            <div>
                <h1>My Experiences</h1>
                <div className={styles.experienceContainer}>
                    {
                        experiences.length > 0 ?
                            <>
                                <Nav variant="pills" className="flex-column" defaultActiveKey={ experiences[0].id }>
                                {
                                    experiences.map((item) => 
                                        <Nav.Item>
                                            <Nav.Link href={ item.id } onClick={ () => setCurrentExp(item) }>{ item.name }</Nav.Link>
                                        </Nav.Item>
                                )}
                                </Nav>
                                <div className={styles.experienceDescription}>
                                    { enumerateExp(currentExp) }
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
