export function containsOnlySize(array) {
    return array.every(entry => entry.toLowerCase() === 'size')
}