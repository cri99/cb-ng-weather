

export interface Country {
    code: string;
    code3: string;
    number: string;
    name: string;
}

export interface CountryResult extends Country {
    matchName: string;
    remainingName: string;
}