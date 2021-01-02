import { SERVER_URL } from "consts"

export default async (title:string) => await fetch(`${SERVER_URL}/tmdbSearchTv/${title}`).then(response => response.json())
