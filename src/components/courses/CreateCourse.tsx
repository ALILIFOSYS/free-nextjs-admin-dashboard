"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";

import Select from "react-select";

// Load Quill dynamically (to avoid SSR issues)


import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

type FormData = {
  thumbnail: File | null;
  title: string;
  category: string;
  instructors: { value: string; label: string }[];
  regularPrice: number;
  offerPrice: number;
  isFree: boolean;
  descriptionTitle: string;
  description: string;
};

const instructorsOptions = [
  { value: "john", label: "John Doe" }, 
  { value: "jane", label: "Jane Smith" },
  { value: "mike", label: "Mike Johnson" },
];

export default function CreateCourseForm() {
  const { register, handleSubmit, control, setValue } = useForm<FormData>({
    defaultValues: {
      thumbnail: null,
      title: "",
      category: "",
      instructors: [],
      regularPrice: 0,
      offerPrice: 0,
      isFree: false,
      descriptionTitle: "",
      description: "",
    },
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    // --- Mock S3 Upload ---
    if (data.thumbnail) {
      const formData = new FormData();
      formData.append("file", data.thumbnail);

      // Replace with your API endpoint for S3
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploaded = await uploadRes.json();
      console.log("Uploaded Image URL:", uploaded.url);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("thumbnail", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w mx-auto p-6 space-y-6 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-bold">Create New Course</h2>

      {/* Thumbnail Upload */}
      <div>
        <Label>Thumbnail Image</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 w-40 rounded-lg" />}
      </div>

      {/* Course Title */}
      <div>
        <Label>Course Title</Label>
        <Input type="text"  placeholder="Enter course title" />
      </div>

      {/* Category Name */}
      <div>
        <Label>Category Name</Label>
        <Input type="text" placeholder="Enter category" />
      </div>

      {/* Instructor Multi Selector */}
      <div>
        <Label>Instructors</Label>
        <Controller
          name="instructors"
          control={control}
          render={({ field }: { field: any }) => (
            <Select
              {...field}
              isMulti
              options={instructorsOptions}
              onChange={(val:any) => field.onChange(val)}
            />
          )}
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Regular Price</Label>
          <Input type="number"  placeholder="0" />
        </div>
        <div>
          <Label>Offer Price</Label>
          <Input type="number"  placeholder="0" />
        </div>
      </div>

      {/* Is Free */}
      <div className="flex items-center gap-2">
        <input type="checkbox"  />
        <Label>Is Free?</Label>
      </div>

      {/* Description Section */}
      <div>
        <Label>Description Title</Label>
        <Input type="text"  placeholder="Section title" />
      </div>
    

      <button type="submit" className="w-full">
        Create Course
      </button>
    </form>
  );
}
