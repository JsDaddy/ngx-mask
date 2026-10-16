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

/** A thousandSeparator holding a digit is ignored (becomes empty); any other value passes through. */
export function ignoreDigitSeparator<T extends string | null | undefined>(separator: T): T | '' {
    return separator && digitsOf(separator).length ? '' : separator;
}
