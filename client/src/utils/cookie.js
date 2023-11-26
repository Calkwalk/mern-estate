const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
};

const getCookie = (name) => {
    const matchs = document.cookie.match(
        new RegExp(
            `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1")}=([^;]*)`
        )
    );

    return matchs ? decodeURIComponent(matchs[1]) : undefined;
};

const deleteCookie = (name) => {
    setCookie(name, '', -1);
}

export { setCookie, getCookie, deleteCookie }