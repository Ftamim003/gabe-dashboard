// redux/features/audio/audioSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseUrlApi } from "../../api/baseUrlApi";

export interface Audio {
  id?: string;
  title: string;
  trainer: string;
  preview: string;
  audioUrl?: string;
}

interface AudioState {
  audios: Audio[];
}

const initialState: AudioState = {
  audios: [],
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setAudios: (state, action: PayloadAction<Audio[]>) => {
      state.audios = action.payload;
    },
    addAudio: (state, action: PayloadAction<Audio>) => {
      state.audios.push(action.payload);
    },
  },
});

export const { setAudios, addAudio } = audioSlice.actions;
export default audioSlice.reducer;

// 🔹 RTK Query endpoints for audio
export const audioApi = baseUrlApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAudios: build.query<Audio[], void>({
      query: () => ({
        url: "/audio",
        method: "GET",
      }),
    }),
    uploadAudio: build.mutation<Audio, FormData>({
      query: (formData) => ({
        url: "/audio/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useFetchAudiosQuery,
  useUploadAudioMutation,
} = audioApi;
