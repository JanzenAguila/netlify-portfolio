import Head from 'next/head';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Affiliations from 'components/Affiliations/Affiliations';
import Education from 'components/Education/Education';
import Experience from 'components/Experience/Experience';

import { useEffect } from 'react';
import animateTitle from 'components/TitleAnim/TitleAnimation';
import toggleDarkMode from 'components/DarkMode/DarkMode';

export default function Home() {
    useEffect(() => {
        const startAnimation = async () => {
            if (document)
                await animateTitle("Janzen - Home");
        }
        startAnimation();
    }, []);

    return (
      <div className="container">
          <main>
            <div className="image-cropper">
                <img src="/profile.jpg" />
            </div>
            <div className="d-flex flex-column align-items-center">
                Hello! I am <Header title="Janzen Christian Aguila" subtitle="and welcome to my portfolio" />
            </div>
          </main>
          <Experience />
          <Education />
          <Affiliations />
          {/* <button onClick={() => toggleDarkMode()}>Toggle</button> */}

          <Footer />
       </div>
    )
}
