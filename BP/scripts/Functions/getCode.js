export function getCode(length, without = []) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code;
    do {
        code = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    } while (without.includes(code));
    return code;
}
