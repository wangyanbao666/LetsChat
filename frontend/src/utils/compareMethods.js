export function compareByDatetime(a, b){
    return new Date(a.datetime) - new Date(b.datetime);
}

export function compareByName(a, b){
    return a.localeCompare(b);
}
