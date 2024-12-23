export function calPage(number: number): number {
    const maxPage = 27;
    if (number == 0) return 1;
    return Math.floor((number - 1) / maxPage) + 1;
}