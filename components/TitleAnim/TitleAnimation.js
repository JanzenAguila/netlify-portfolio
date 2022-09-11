function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function animateTitle(str) {
    document.title = '';
    for (let i = 0; i < str.length; i++) {
        if (str[i] == " ")
            document.title += '\xa0';
        document.title += str[i];
        await sleep(250);
    }
}