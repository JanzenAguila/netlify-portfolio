import Head from 'next/head';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Experience from 'components/Experience/Experience';
import Education from 'components/Education/Education';

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
            <div class="image-cropper">
                <img src="/profile.jpg" />
            </div>
            Hello! I am <Header title="Janzen Christian Aguila" subtitle="and welcome to my portfolio" />
            <p className="description">
                Get started by editing <code>pages/index.js</code>
            </p>
          </main>
          <Experience />
          <Education />
          {/* <button onClick={() => toggleDarkMode()}>Toggle</button> */}

          <Footer />
       </div>
    )
}
