export function getCode(length: number, without: string[] = []): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code: string;

    do {
        code = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    } while (without.includes(code));

    return code;
}