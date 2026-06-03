export function parseUserAgent(ua) {
    if (!ua || ua === "-") return "Unknown Device";
    
    let browser = "Browser";
    let os = "OS";

    if (/chrome|crios/i.test(ua) && !/edge|opr/i.test(ua)) {
        browser = "Chrome";
    } else if (/firefox|fxios/i.test(ua)) {
        browser = "Firefox";
    } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
        browser = "Safari";
    } else if (/edge|edg/i.test(ua)) {
        browser = "Edge";
    } else if (/opr/i.test(ua)) {
        browser = "Opera";
    }

    if (/windows/i.test(ua)) {
        os = "Windows";
    } else if (/android/i.test(ua)) {
        os = "Android";
    } else if (/iphone|ipad|ipod/i.test(ua)) {
        os = "iOS";
    } else if (/macintosh|mac os x/i.test(ua)) {
        os = "macOS";
    } else if (/linux/i.test(ua)) {
        os = "Linux";
    }

    return `${browser} on ${os}`;
}
