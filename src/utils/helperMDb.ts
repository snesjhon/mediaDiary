export function getTVUrl(id: string, seasonId?: number): string {
  if (seasonId && seasonId !== -1) {
    return `https://api.themoviedb.org/3/tv/${id}/season/${seasonId}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits,videos`;
  }
  return `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits,videos`;
}

export function getMovieUrl(id: string): string {
  return `https://api.themoviedb.org/3/movie/${encodeURIComponent(
    id
  )}?api_key=${
    process.env.NEXT_PUBLIC_MDBKEY
  }&append_to_response=credits,videos`;
}
