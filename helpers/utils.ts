function parseCookie(cookieString: string): { [key: string]: string } {
    const cookieObj: { [key: string]: string } = {};
    cookieString.split(';').forEach(cookie => {
        const [key, value] = cookie.split('=').map(part => part.trim());
        cookieObj[key] = decodeURIComponent(value);
    });
    return cookieObj;
}

function stringifyCookie(cookieObj: { [key: string]: string }): string {
    const cookieArray: string[] = [];
    for (const key in cookieObj) {
        if (cookieObj.hasOwnProperty(key)) {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(cookieObj[key]);
            cookieArray.push(`${encodedKey}=${encodedValue}`);
        }
    }
    return cookieArray.join('; ');
}

/**
 * compairs param_1 and other params and return the one that is not equal to it.
 */
export function other(param_1: any, param_2: any, param_3: any): string {
    return param_1 === param_2 ? param_3 : param_2;

}

export { parseCookie, stringifyCookie }