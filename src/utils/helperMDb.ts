const apiURL = "https://api.themoviedb.org/3";
const apiKey = `?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits,videos,watch/providers`;

export function getTVUrl(id: string, seasonId?: number): string {
  if (seasonId && seasonId !== -1) {
    return `${apiURL}/tv/${id}/season/${seasonId}${apiKey}`;
  }
  return `${apiURL}/tv/${id}${apiKey}`;
}

export function getMovieUrl(id: string): string {
  return `${apiURL}/movie/${encodeURIComponent(id)}${apiKey}`;
}
