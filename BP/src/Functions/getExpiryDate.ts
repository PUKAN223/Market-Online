export function getRemainingTime(releaseTime: number) {
    const releaseDate = new Date(releaseTime);
    const expiryDate = new Date(releaseDate);
    expiryDate.setHours(expiryDate.getHours() + 3);

    const now = new Date();
    const remainingTimeMs = expiryDate.getTime() - now.getTime();

    if (remainingTimeMs <= 0) {
        return null;
    }

    const hours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
}