"use client";

import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUploadVideoMutation } from "@/redux/features/video/videoSlice";

type UploadFormValues = {
  video: FileList;
  title: string;
  trainer: string;
  preview: string;
};

export default function UploadVideoPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UploadFormValues>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();

  const onSubmit = async (data: UploadFormValues) => {
    if (!data.video || data.video.length === 0) return;

    const formData = new FormData();
    formData.append("video", data.video[0]);
    formData.append("title", data.title);
    formData.append("trainer", data.trainer);
    formData.append("preview", data.preview);

    try {
      await uploadVideo(formData).unwrap();
      toast.success("Workout video uploaded successfully!");
      reset();
      setSelectedFile(null);
    } catch (err) {
      toast.error("Failed to upload video. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Video</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mx-auto">
        {/* Upload Box */}
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 text-blue-500 mb-4" />
          <p className="text-lg font-medium text-gray-800 mb-1">
            Upload Your Video File Here
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Maximum Size Of The file Can Be 200 Mb
          </p>

          <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-blue-600 border border-blue-300 rounded-md shadow-sm hover:bg-blue-50 transition">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
            <input
              type="file"
              accept="video/*"
              {...register("video", { required: true })}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </label>
          {selectedFile && (
            <p className="mt-3 text-sm text-gray-700">{selectedFile.name}</p>
          )}
          {errors.video && (
            <p className="mt-2 text-sm text-red-600">Video file is required</p>
          )}
        </div>

        {/* Title */}
        <div className="border p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title Of The Workout
          </label>
          <input
            type="text"
            placeholder="In this week's message"
            {...register("title", { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">Title is required</p>
          )}
        </div>

        {/* Trainer */}
        <div className="border p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Set Trainer Name
          </label>
          <input
            type="text"
            placeholder=""
            {...register("trainer", { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.trainer && (
            <p className="mt-1 text-sm text-red-600">Trainer name is required</p>
          )}
        </div>

        {/* Preview */}
        <div className="border p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Write The Preview You Want To Show
          </label>
          <textarea
            rows={4}
            placeholder=""
            {...register("preview", { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.preview && (
            <p className="mt-1 text-sm text-red-600">Preview message is required</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition"
          >
            <Upload className="w-5 h-5" />
            {isLoading ? "Uploading..." : "Upload This New Workout Video"}
          </button>
        </div>
      </form>
    </div>
  );
}
