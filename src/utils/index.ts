import { getEpisodes } from 'horriblesubs-node';

interface Anime {
  title: string;
  episode: number;
  releaseDate: string;
  resolutions: string;
  url: string;
  slug: string;
}

interface Source {
  [key: string]: string;
}

interface Resolution {
  resolution: string;
  sources: Source[];
}

interface Episode {
  chapter: Anime;
  resolutions: Resolution[];
}

const getEpisodesEdges = (episodes: string): number[] =>
  episodes.split('-').map(index => parseInt(index, 10));

export const getHBSEpisodes = async (
  name: string,
  episodes: string
): Promise<Episode | Episode[]> => {
  const slug = name.split(' ').join('-');
  const [start, end] = getEpisodesEdges(episodes);
  const latestEpisodesAvailable = (await getEpisodes({ slug })) as Episode[];
  const latestEpisode = latestEpisodesAvailable[0].chapter.episode;
  const pagesNeeded = Math.ceil((latestEpisode - start + 1) / 12) - 1;
  const inRangeEpisodes = (await getEpisodes(
    { slug },
    {
      page: pagesNeeded,
      combinePages: true,
    }
  )) as Episode[];
  const olderEpisodeIndex = inRangeEpisodes.length - 1;
  const olderEpisode = inRangeEpisodes[olderEpisodeIndex].chapter.episode;
  const endIndex =
    olderEpisode <= start
      ? olderEpisodeIndex - (start - olderEpisode)
      : olderEpisodeIndex;

  if (end) {
    const startIndex =
      latestEpisode <= end ? latestEpisode : latestEpisode - end;

    return inRangeEpisodes.slice(startIndex, endIndex);
  }

  return inRangeEpisodes[endIndex];
};
