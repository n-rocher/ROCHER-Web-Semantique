export function getIRI(uri) {
    return uri.substring(uri.lastIndexOf('/') + 1)
}