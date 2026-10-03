import React, { useState } from "react";
import { Plus, Trash2, X, Briefcase } from "lucide-react";

import {
    addWorkExperience,
    deleteWorkExperience
} from "../api/ProfileApi";

const Experience = ({ profile, onProfileUpdated }) => {

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        companyName: "",
        positionName: "",
        workExperience: ""
    });

    const [saving, setSaving] = useState(false);

    const experiences = profile?.workExperiences || [];

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddExperience = async () => {

        if (
            !formData.companyName.trim() ||
            !formData.positionName.trim() ||
            !formData.workExperience.trim()
        ) {
            return;
        }

        try {
            setSaving(true);

            await addWorkExperience({
                companyName: formData.companyName.trim(),
                positionName: formData.positionName.trim(),
                workExperience: formData.workExperience.trim()
            });

            setFormData({
                companyName: "",
                positionName: "",
                workExperience: ""
            });

            setShowModal(false);

            await onProfileUpdated();

        } catch (error) {
            console.error(
                "Failed to add experience:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteExperience = async (id) => {

        try {
            setSaving(true);

            await deleteWorkExperience(id);

            await onProfileUpdated();

        } catch (error) {
            console.error(
                "Failed to delete experience:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);

        setFormData({
            companyName: "",
            positionName: "",
            workExperience: ""
        });
    };

    return (
        <>
            {/* Experience Section */}
            <section className="bg-white border border-gray-200 rounded-xl ml-20 mr-20 mt-5 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Experience
                    </h2>

                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <Plus size={22} />
                    </button>

                </div>

                {/* Experience List */}
                <div className="mt-5">

                    {experiences.length === 0 ? (

                        <p className="text-sm text-gray-400">
                            Add your work experience.
                        </p>

                    ) : (

                        <div className="border border-gray-200 rounded-lg overflow-hidden">

                            {experiences.map((experience) => (

                                <div
                                    key={experience.id}
                                    className="flex items-center justify-between px-5 py-4 border-b last:border-b-0 border-gray-200 hover:bg-gray-50"
                                >

                                    <div className="flex items-center gap-4">

                                        {/* Icon */}
                                        <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Briefcase
                                                size={22}
                                                className="text-gray-600"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div>

                                            <h3 className="font-medium text-gray-900">
                                                {experience.position}
                                            </h3>

                                            <p className="text-sm text-gray-600 mt-1">
                                                {experience.companyName}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {experience.year}
                                            </p>

                                        </div>

                                    </div>

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteExperience(
                                                experience.id
                                            )
                                        }
                                        disabled={saving}
                                        title="Delete experience"
                                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                                    >
                                        <Trash2 size={19} />
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </section>

            {/* Add Experience Modal */}
            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Add Experience
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* Company */}
                        <div className="mb-4">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company
                            </label>

                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="e.g. Google"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* Position */}
                        <div className="mb-4">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Position
                            </label>

                            <input
                                type="text"
                                name="positionName"
                                value={formData.positionName}
                                onChange={handleChange}
                                placeholder="e.g. Software Engineer"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* Work Experience */}
                        <div className="mb-6">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience
                            </label>

                            <input
                                type="text"
                                name="workExperience"
                                value={formData.workExperience}
                                onChange={handleChange}
                                placeholder="e.g. 2 Years"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleAddExperience}
                                disabled={
                                    saving ||
                                    !formData.companyName.trim() ||
                                    !formData.positionName.trim() ||
                                    !formData.workExperience.trim()
                                }
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving
                                    ? "Adding..."
                                    : "Add Experience"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
};

export default Experience;