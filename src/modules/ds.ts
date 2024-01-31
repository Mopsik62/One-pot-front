
export interface User {
    UUID: string,
    Role: string,
    Name: string,
    Pass: string

}

export interface Syntheses {
    ID:              number
    Name:                  string
    Additional_conditions: string
    Status:                string
    Date_created?:   string
    Date_processed?: string
    Date_finished?:  string
    Moderator?:             string
    User_name?:             string
}

export interface Substance {
    ID: number,
    Title: string,
    Class: string,
    Formula: string,
    Image: string,
    Status: string
}

export interface SynthesisWithSubstances {
    ID:              number
    Name:                  string
    Additional_conditions: string
    Status:                string
    Date_created:   string
    Date_processed: string
    Date_finished:  string
    Moderator:             string
    User_name:             string
    Substances: Substance[];
}