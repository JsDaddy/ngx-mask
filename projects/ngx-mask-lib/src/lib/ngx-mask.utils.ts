/** Escapes every character that has a special meaning in a regular expression. */
export function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');
}

/** Returns the decimal digits of `value`, in order. */
export function digitsOf(value: string): string[] {
    return value.match(/\d/g) ?? [];
}
