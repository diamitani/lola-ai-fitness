import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  url: string;
}

/**
 * Search YouTube for exercise tutorial videos
 * Falls back to URL-based search if API key not configured
 */
export async function searchExerciseVideo(exerciseName: string): Promise<YouTubeVideo | null> {
  try {
    // If no API key, return a search URL instead
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_youtube_api_key') {
      const searchQuery = encodeURIComponent(`${exerciseName} exercise tutorial form`);
      return {
        videoId: '',
        title: `Search: ${exerciseName} Tutorial`,
        thumbnail: '',
        channelTitle: 'YouTube',
        url: `https://www.youtube.com/results?search_query=${searchQuery}`,
      };
    }

    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: 'snippet',
        q: `${exerciseName} exercise tutorial proper form`,
        type: 'video',
        maxResults: 1,
        key: YOUTUBE_API_KEY,
        videoDuration: 'short', // Prefer shorter tutorial videos
        relevanceLanguage: 'en',
        safeSearch: 'strict',
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0];
      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
        channelTitle: video.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      };
    }

    return null;
  } catch (error) {
    console.error('YouTube search error:', error);
    // Fallback to search URL
    const searchQuery = encodeURIComponent(`${exerciseName} exercise tutorial`);
    return {
      videoId: '',
      title: `${exerciseName} Tutorial`,
      thumbnail: '',
      channelTitle: 'YouTube',
      url: `https://www.youtube.com/results?search_query=${searchQuery}`,
    };
  }
}

/**
 * Batch search for multiple exercises (with rate limiting)
 */
export async function searchExerciseVideos(
  exerciseNames: string[]
): Promise<Record<string, YouTubeVideo | null>> {
  const results: Record<string, YouTubeVideo | null> = {};

  for (const name of exerciseNames) {
    results[name] = await searchExerciseVideo(name);
    // Rate limiting: wait 100ms between requests
    if (YOUTUBE_API_KEY && YOUTUBE_API_KEY !== 'your_youtube_api_key') {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}
