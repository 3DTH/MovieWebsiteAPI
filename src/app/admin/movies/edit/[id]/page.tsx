"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getMovieDetails,
  updateMovie,
  uploadMovieFile,
  deleteMovie,
} from "@/app/api/movieApi";
import type { Movie } from "@/app/api/movieApi";
import { FiTrash2, FiEdit2, FiUpload } from "react-icons/fi";
import Image from "next/image";

export default function EditMoviePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    voteAverage: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [params.id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await getMovieDetails(params.id);
      if (response.data.success) {
        const movieData = response.data.data;
        setMovie(movieData);
        setFormData({
          title: movieData.title,
          overview: movieData.overview,
          voteAverage: movieData.voteAverage,
        });
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "voteAverage" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for admin token
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      alert("Bạn cần đăng nhập với quyền admin");
      router.push("/admin/login");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Updating movie with data:", formData);
      await updateMovie(params.id, formData);

      if (selectedFile && movie) {
        // Add movie check
        const uploadFormData = new FormData();
        uploadFormData.append("movieFile", selectedFile);
        // Use movie._id instead of params.id
        const uploadResponse = await uploadMovieFile(movie._id, uploadFormData);
        console.log("Upload response:", uploadResponse.data);
      }

      router.push("/admin/movies");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Có lỗi xảy ra khi cập nhật phim");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!movie) return;

    // Check for admin token
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      alert("Bạn cần đăng nhập với quyền admin");
      router.push("/admin/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteMovie(params.id);
      router.push("/admin/movies");
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Có lỗi xảy ra khi xóa phim"); // Add error message
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Movie: {movie.title}</h1>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 flex items-center text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
        >
          <FiTrash2 className="mr-2" />
          Delete Movie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Movie Info Column */}
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg mb-4">
            <Image
              src={
                movie.posterPath
                  ? movie.posterPath.startsWith("http") // Check if it's a full URL (Cloudinary)
                    ? movie.posterPath
                    : `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                  : "/images/movie-placeholder.jpg"
              }
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Movie Info</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">TMDB ID:</span> {movie.tmdbId}
              </p>
              <p>
                <span className="text-gray-500">Original Title:</span>{" "}
                {movie.originalTitle}
              </p>
              <p>
                <span className="text-gray-500">Release Date:</span>{" "}
                {new Date(movie.releaseDate).toLocaleDateString()}
              </p>
              <p>
                <span className="text-gray-500">Current Rating:</span>{" "}
                {movie.voteAverage} ({movie.voteCount} votes)
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form Column */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiEdit2 className="inline mr-2" />
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiEdit2 className="inline mr-2" />
                Overview
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiEdit2 className="inline mr-2" />
                Rating
              </label>
              <input
                type="number"
                name="voteAverage"
                value={formData.voteAverage}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div className="border-t pt-6 mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUpload className="inline mr-2" />
                Movie File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="video/*"
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-50 file:text-red-600
                  hover:file:bg-red-100"
              />
              {movie.googleDrive?.embedUrl && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Current video is available
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/admin/movies")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Movie</h3>
            <p className="mb-6">
              Are you sure you want to delete "{movie.title}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
