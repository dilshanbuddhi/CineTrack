export interface Movie{
    id: string;
    title: string;
    genre: string;
    releaseYear: number;
    status: string;
    type: string;
    posterUrl: string;
    description?: string;
    createdAt?: string;
}