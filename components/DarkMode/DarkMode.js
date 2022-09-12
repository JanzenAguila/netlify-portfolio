import { useLayoutEffect } from 'react';

export default function toggleDarkMode() {
    let initialMode = "light";
    let prefersColorSchemeDark = window.matchMedia("(prefers-color-scheme: dark)");
    console.log(prefersColorSchemeDark);

    if (prefersColorSchemeDark.matches) {
        initialMode = "dark";
    }

    if (localStorage.getItem("initialMode") == null) {
        localStorage.setItem("initialMode", initialMode);
    }

    if (localStorage.getItem("currentMode") == null) {
        localStorage.setItem("currentMode", initialMode);
    } else {
        let currentMode = localStorage.getItem("currentMode");
        if (currentMode == "dark" && currentMode != initialMode) {
            document.body.classList.add("dark-mode");
        } else if (currentMode == "light" && currentMode != initialMode) {
            document.body.classList.add("light-mode");
        }
    }

    initialMode = localStorage.getItem("initialMode");
    let currentMode = localStorage.getItem("currentMode");

    if ( currentMode == "dark" && currentMode == initialMode ) {
        document.body.classList.add("light-mode");
        localStorage.setItem("currentMode", "light");
    } else if ( currentMode == "light" && currentMode == initialMode ) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("currentMode", "dark");
    } else if ( currentMode != initialMode ) {
        document.body.removeAttribute("class");
        if( currentMode == "dark" ) {
            localStorage.setItem("currentMode", "light");
        } else {
            localStorage.setItem("currentMode", "dark");
        }
    }
}