import { createSelector } from "reselect";

export const getMostPopularVideos = createSelector(
  state => state.videos.byId,
  state => state.videos.mostPopular,
  (videosById, mostPopular) => {
    if (!mostPopular || !mostPopular.items) {
      return [];
    }
    return mostPopular.items.map(videoId => videosById[videoId]);
  }
);
