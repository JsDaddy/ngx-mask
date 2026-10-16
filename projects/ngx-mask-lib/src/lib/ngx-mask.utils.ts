/** Escapes every character that has a special meaning in a regular expression. */
export function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');
}
