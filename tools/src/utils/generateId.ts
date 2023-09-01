/**
 * Generate unique id with specified prefix
 */
export default function generateId(prefix: string, blocks?: number): string {
    const mask = new Array(blocks ?? 4).fill('xxxx').join('-');
    const dict = 'abcdefghijklmmnopqrstuvwxyz01234567890';
    return prefix + '-' + mask.replaceAll(/x/g, () => {
        return dict.charAt(Math.floor(Math.random() * dict.length));
    });
}
