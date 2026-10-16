/**
 * Escapes every character that has a special meaning in a regular expression. An unset
 * (null/undefined) value, e.g. from an unset dynamic config, escapes to the empty string.
 */
export function escapeRegExp(value: string | null | undefined): string {
    return (value ?? '').replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');
}

/** Returns the decimal digits of `value`, in order. */
export function digitsOf(value: string): string[] {
    return value.match(/\d/g) ?? [];
}
