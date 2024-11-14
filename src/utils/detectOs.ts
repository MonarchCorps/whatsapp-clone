export const detectOS = (): string => {
    const userAgent = navigator.userAgent;
    let os;
    if (/Windows/i.test(userAgent)) {
        os = "Windows";
    } else if (/Mac/i.test(userAgent)) {
        os = "Mac";
    } else if (/Linux/i.test(userAgent)) {
        os = "Linux";
    } else {
        os = "Device";
    }
    return os as string

}
