// redux/features/video/videoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseUrlApi } from "../../api/baseUrlApi";

export interface Video {
  id?: string;
  title: string;
  trainer: string;
  preview: string;
  videoUrl?: string;
}

interface VideoState {
  videos: Video[];
}

const initialState: VideoState = {
  videos: [],
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos = action.payload;
    },
    addVideo: (state, action: PayloadAction<Video>) => {
      state.videos.push(action.payload);
    },
  },
});

export const { setVideos, addVideo } = videoSlice.actions;
export default videoSlice.reducer;

// 🔹 RTK Query endpoints for video
export const videoApi = baseUrlApi.injectEndpoints({
  endpoints: (build) => ({
    fetchVideos: build.query<Video[], void>({
      query: () => ({
        url: "/video",
        method: "GET",
      }),
    }),
    uploadVideo: build.mutation<Video, FormData>({
      query: (formData) => ({
        url: "/video/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useFetchVideosQuery,
  useUploadVideoMutation,
} = videoApi;
