import { SERVER_URL } from "consts"

export default async (titleId:number) => await fetch(`${SERVER_URL}/tmdbTvDetails/${titleId}`).then(response => response.json())
