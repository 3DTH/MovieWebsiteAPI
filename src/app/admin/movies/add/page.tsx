"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addMovie } from "@/app/api/movieApi";
import { FiSave, FiX } from "react-icons/fi";
import ImageUpload from '@/components/admin/ImageUpload';

export default function AddMoviePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tmdbId: Math.floor(Math.random() * 9000000) + 1000000, // Random 7-digit number
    title: "",
    originalTitle: "",
    overview: "",
    posterPath: "",
    backdropPath: "",
    releaseDate: "",
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    isPopular: false,
    nowPlaying: false,
    genres: [] as { id: number; name: string }[],
    videos: [] as { key: string; name: string; site: string; type: string }[],
    cast: [] as { 
      actor: { 
        _id: string;
        tmdbId: number;
        name: string;
        profilePath: string;
      };
      character: string;
      order: number;
    }[],
    directors: [] as {
      _id: string;
      tmdbId: number;
      name: string;
      profilePath: string;
    }[]
  });

  // Add new handlers for arrays
  const handleGenreAdd = () => {
    setFormData(prev => ({
      ...prev,
      genres: [...prev.genres, { id: 0, name: "" }]
    }));
  };

  const handleGenreChange = (index: number, field: string, value: string | number) => {
    const newGenres = [...formData.genres];
    newGenres[index] = { ...newGenres[index], [field]: field === 'id' ? Number(value) : value };
    setFormData(prev => ({ ...prev, genres: newGenres }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["tmdbId", "voteAverage", "voteCount", "popularity"].includes(name)
        ? value === "" ? 0 : Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      alert("You need to be logged in as admin");
      router.push("/admin/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await addMovie(formData);
      router.push("/admin/movies");
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("Error occurred while adding movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Movie</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TMDB ID
            </label>
            <input
              type="number"
              name="tmdbId"
              value={formData.tmdbId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Title
            </label>
            <input
              type="text"
              name="originalTitle"
              value={formData.originalTitle}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Release Date
            </label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>

        // Update the Images section in the form:
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poster Image
            </label>
            <ImageUpload 
              onImageUploaded={(url) => {
                setFormData(prev => ({
                  ...prev,
                  posterPath: url
                }));
              }}
            />
            {formData.posterPath && (
              <div className="mt-2 relative h-48 w-32 rounded-lg overflow-hidden">
                <img
                  src={formData.posterPath}
                  alt="Poster preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backdrop Image
            </label>
            <ImageUpload 
              onImageUploaded={(url) => {
                setFormData(prev => ({
                  ...prev,
                  backdropPath: url
                }));
              }}
            />
            {formData.backdropPath && (
              <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden">
                <img
                  src={formData.backdropPath}
                  alt="Backdrop preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Overview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overview
          </label>
          <textarea
            name="overview"
            value={formData.overview}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vote Average
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vote Count
            </label>
            <input
              type="number"
              name="voteCount"
              value={formData.voteCount}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Popularity
            </label>
            <input
              type="number"
              name="popularity"
              value={formData.popularity}
              onChange={handleInputChange}
              min="0"
              step="0.001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Genres */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Genres</label>
            <button
              type="button"
              onClick={handleGenreAdd}
              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Add Genre
            </button>
          </div>
          <div className="space-y-2">
            {formData.genres.map((genre, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="number"
                  value={genre.id}
                  onChange={(e) => handleGenreChange(index, 'id', e.target.value)}
                  placeholder="Genre ID"
                  className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
                <input
                  type="text"
                  value={genre.name}
                  onChange={(e) => handleGenreChange(index, 'name', e.target.value)}
                  placeholder="Genre Name"
                  className="mt-1 block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-6 pt-4 border-t">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isPopular"
              checked={formData.isPopular}
              onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-700">Popular Movie</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              name="nowPlaying"
              checked={formData.nowPlaying}
              onChange={(e) => setFormData(prev => ({ ...prev, nowPlaying: e.target.checked }))}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-700">Now Playing</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.push("/admin/movies")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiX className="inline-block mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            <FiSave className="inline-block mr-2" />
            {isSubmitting ? "Adding..." : "Add Movie"}
          </button>
        </div>
      </form>
    </div>
  );
}