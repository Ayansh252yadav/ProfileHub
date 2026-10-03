import React, { useState } from "react";
import { Plus, Trash2, X, GraduationCap } from "lucide-react";

import {
    addEducation,
    deleteEducation
} from "../api/ProfileApi";

const Education = ({ profile, onProfileUpdated }) => {

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        school: "",
        degree: "",
        fieldOfStudy: ""
    });

    const [saving, setSaving] = useState(false);

    const educations = profile?.educations || [];

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddEducation = async () => {

        if (
            !formData.school.trim() ||
            !formData.degree.trim() ||
            !formData.fieldOfStudy.trim()
        ) {
            return;
        }

        try {
            setSaving(true);

            await addEducation({
                school: formData.school.trim(),
                degree: formData.degree.trim(),
                fieldOfStudy: formData.fieldOfStudy.trim()
            });

            setFormData({
                school: "",
                degree: "",
                fieldOfStudy: ""
            });

            setShowModal(false);

            await onProfileUpdated();

        } catch (error) {
            console.error(
                "Failed to add education:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEducation = async (id) => {

        try {
            setSaving(true);

            await deleteEducation(id);

            await onProfileUpdated();

        } catch (error) {
            console.error(
                "Failed to delete education:",
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
            school: "",
            degree: "",
            fieldOfStudy: ""
        });
    };

    return (
        <>
            {/* Education Section */}
            <section className="bg-white border border-gray-200 rounded-xl ml-20 mr-20 mt-5 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Education
                    </h2>

                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <Plus size={22} />
                    </button>

                </div>

                {/* Education List */}
                <div className="mt-5">

                    {educations.length === 0 ? (

                        <p className="text-sm text-gray-400">
                            Add your education details.
                        </p>

                    ) : (

                        <div className="border border-gray-200 rounded-lg overflow-hidden">

                            {educations.map((education) => (

                                <div
                                    key={education.id}
                                    className="flex items-center justify-between px-5 py-4 border-b last:border-b-0 border-gray-200 hover:bg-gray-50"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <GraduationCap
                                                size={23}
                                                className="text-gray-600"
                                            />
                                        </div>

                                        <div>

                                            <h3 className="font-medium text-gray-900">
                                                {education.school}
                                            </h3>

                                            <p className="text-sm text-gray-600 mt-1">
                                                {education.degree}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {education.fieldOfStudy}
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteEducation(
                                                education.id
                                            )
                                        }
                                        disabled={saving}
                                        title="Delete education"
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

            {/* Add Education Modal */}
            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Add Education
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* School */}
                        <div className="mb-4">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                School
                            </label>

                            <input
                                type="text"
                                name="school"
                                value={formData.school}
                                onChange={handleChange}
                                placeholder="e.g. Kanpur Institute of Technology"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* Degree */}
                        <div className="mb-4">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Degree
                            </label>

                            <input
                                type="text"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                placeholder="e.g. B.Tech"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* Field of Study */}
                        <div className="mb-6">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Field of Study
                            </label>

                            <input
                                type="text"
                                name="fieldOfStudy"
                                value={formData.fieldOfStudy}
                                onChange={handleChange}
                                placeholder="e.g. Computer Science"
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
                                onClick={handleAddEducation}
                                disabled={
                                    saving ||
                                    !formData.school.trim() ||
                                    !formData.degree.trim() ||
                                    !formData.fieldOfStudy.trim()
                                }
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving
                                    ? "Adding..."
                                    : "Add Education"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
};

export default Education;