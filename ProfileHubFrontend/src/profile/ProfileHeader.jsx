import React, { useState } from "react";
import {
    UserRound,
    Pencil,
    X,
    Camera,
    ZoomIn,
    ZoomOut
} from "lucide-react";

import Cropper from "react-easy-crop";

import {
    updateBio,
    uploadProfilePicture
} from "../api/ProfileApi";

const ProfileHeader = ({ profile, onProfileUpdated }) => {

    const name = profile?.name || "Your Name";
    const profilePicture = profile?.profilePicture;

    const [isEditing, setIsEditing] = useState(false);

    const [bio, setBio] = useState(profile?.bio || "");

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [saving, setSaving] = useState(false);

    // Cropper states
    const [cropImage, setCropImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [showCropper, setShowCropper] = useState(false);


    // ================= EDIT =================

    const handleEdit = () => {

        setBio(profile?.bio || "");

        setSelectedFile(null);
        setPreview(null);

        setIsEditing(true);
    };


    // ================= IMAGE SELECT =================

    const handleImageChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setCropImage(imageUrl);

        setCrop({ x: 0, y: 0 });
        setZoom(1);

        setShowCropper(true);
    };


    // ================= CROP COMPLETE =================

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {

        setCroppedAreaPixels(croppedAreaPixels);
    };


    // ================= CREATE CROPPED IMAGE =================

    const createCroppedImage = async () => {

        try {

            const image = new Image();

            image.src = cropImage;

            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
            });

            const canvas = document.createElement("canvas");

            const ctx = canvas.getContext("2d");

            const {
                width,
                height,
                x,
                y
            } = croppedAreaPixels;

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(
                image,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height
            );

            return new Promise((resolve) => {

                canvas.toBlob(
                    (blob) => {

                        const file = new File(
                            [blob],
                            "profile-picture.jpg",
                            {
                                type: "image/jpeg"
                            }
                        );

                        resolve(file);
                    },
                    "image/jpeg",
                    0.9
                );
            });

        } catch (error) {

            console.error(
                "Failed to crop image:",
                error
            );

            return null;
        }
    };


    // ================= SAVE CROP =================

    const handleCropSave = async () => {

        const croppedFile = await createCroppedImage();

        if (!croppedFile) {
            return;
        }

        setSelectedFile(croppedFile);

        const previewUrl =
            URL.createObjectURL(croppedFile);

        setPreview(previewUrl);

        setShowCropper(false);
    };


    // ================= CANCEL CROP =================

    const handleCropCancel = () => {

        setShowCropper(false);

        setCropImage(null);
        setSelectedFile(null);
    };


    // ================= SAVE PROFILE =================

    const handleSave = async () => {

        try {

            setSaving(true);

            // Update bio
            await updateBio({
                bio: bio
            });

            // Upload cropped image
            if (selectedFile) {

                await uploadProfilePicture(
                    selectedFile
                );
            }

            /*
             * Fetch complete profile again
             * from /api/profile/me
             */
            await onProfileUpdated();

            setIsEditing(false);

            setSelectedFile(null);
            setPreview(null);

        } catch (error) {

            console.error(
                "Failed to update profile:",
                error
            );

        } finally {

            setSaving(false);
        }
    };


    return (
        <>
            {/* ================================================= */}
            {/* PROFILE HEADER */}
            {/* ================================================= */}

            <section className="bg-white border border-gray-200 rounded-xl overflow-hidden ml-20 mr-20">

                {/* COVER */}

                <div className="h-32 bg-gray-200"></div>


                {/* PROFILE INFORMATION */}

                <div className="px-8 pb-6">

                    <div className="flex items-end justify-between">

                        {/* LEFT SIDE */}

                        <div className="flex items-end gap-5">


                            {/* PROFILE PICTURE */}

                            <div className="-mt-16 w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-sm">

                                {profilePicture ? (

                                    <img
                                        src={profilePicture}
                                        alt={name}
                                        className="w-full h-full object-cover"
                                    />

                                ) : (

                                    <UserRound
                                        size={60}
                                        strokeWidth={1.5}
                                        className="text-gray-400"
                                    />

                                )}

                            </div>


                            {/* USER INFORMATION */}

                            <div className="pb-2">

                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {name}
                                </h1>

                                {profile?.email && (

                                    <p className="text-gray-500 mt-1">
                                        {profile.email}
                                    </p>

                                )}

                                {profile?.bio ? (

                                    <p className="text-gray-600 mt-2">
                                        {profile.bio}
                                    </p>

                                ) : (

                                    <p className="text-sm text-gray-400 mt-2">
                                        Add your professional details
                                    </p>

                                )}

                            </div>

                        </div>


                        {/* EDIT BUTTON */}

                        <button
                            onClick={handleEdit}
                            className="mb-2 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >

                            <Pencil size={16} />

                            Edit Profile

                        </button>

                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* EDIT PROFILE MODAL */}
            {/* ================================================= */}

            {isEditing && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">


                        {/* HEADER */}

                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Edit Profile
                            </h2>

                            <button
                                onClick={() =>
                                    setIsEditing(false)
                                }
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* PROFILE PICTURE */}

                        <div className="flex justify-center mb-6">

                            <div className="relative">

                                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">

                                    {preview || profilePicture ? (

                                        <img
                                            src={
                                                preview ||
                                                profilePicture
                                            }
                                            alt={name}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <UserRound
                                            size={55}
                                            strokeWidth={1.5}
                                            className="text-gray-400"
                                        />

                                    )}

                                </div>


                                {/* CAMERA BUTTON */}

                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">

                                    <Camera size={16} />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="hidden"
                                    />

                                </label>

                            </div>

                        </div>


                        {/* NAME */}

                        <div className="mb-5">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                disabled
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                            />

                        </div>


                        {/* BIO */}

                        <div className="mb-6">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>

                            <textarea
                                value={bio}
                                onChange={(event) =>
                                    setBio(event.target.value)
                                }
                                rows={4}
                                placeholder="Tell people about yourself..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />

                        </div>


                        {/* BUTTONS */}

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() =>
                                    setIsEditing(false)
                                }
                                disabled={saving}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save"}
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* ================================================= */}
            {/* IMAGE CROPPER MODAL */}
            {/* ================================================= */}

            {showCropper && cropImage && (

                <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center">

                    <div className="bg-white w-full max-w-xl rounded-xl overflow-hidden">


                        {/* CROPPER */}

                        <div className="relative w-full h-[400px] bg-black">

                            <Cropper
                                image={cropImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={
                                    handleCropComplete
                                }
                            />

                        </div>


                        {/* CONTROLS */}

                        <div className="p-5">

                            {/* ZOOM */}

                            <div className="flex items-center gap-3 mb-5">

                                <ZoomOut size={18} />

                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(event) =>
                                        setZoom(
                                            Number(
                                                event.target.value
                                            )
                                        )
                                    }
                                    className="flex-1"
                                />

                                <ZoomIn size={18} />

                            </div>


                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3">

                                <button
                                    onClick={
                                        handleCropCancel
                                    }
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={
                                        handleCropSave
                                    }
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
                                    Crop
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
};

export default ProfileHeader;