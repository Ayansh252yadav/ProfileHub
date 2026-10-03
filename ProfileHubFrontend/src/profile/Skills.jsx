import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import {
    addSkill,
    removeSkill
} from "../api/ProfileApi";

const Skills = ({ profile, onProfileUpdated }) => {

    const [showModal, setShowModal] = useState(false);
    const [skill, setSkill] = useState("");
    const [saving, setSaving] = useState(false);

    const skills = profile?.skills || [];

    const handleAddSkill = async () => {

        const newSkill = skill.trim();

        if (!newSkill) {
            return;
        }

        try {
            setSaving(true);

            await addSkill({
                skill: newSkill
            });

            setSkill("");
            setShowModal(false);

            await onProfileUpdated();

        } catch (error) {
            console.error("Failed to add skill:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSkill = async (skillToDelete) => {

        try {
            setSaving(true);

            console.log("Deleting skill:", skillToDelete);

            await removeSkill(skillToDelete);

            await onProfileUpdated();

        } catch (error) {
            console.error("Failed to delete skill:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* Skills Section */}
            <section className="bg-white border border-gray-200 rounded-xl ml-20 mr-20 mt-5 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Skills
                    </h2>

                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <Plus size={22} />
                    </button>

                </div>

                {/* Skills List */}
                <div className="mt-5">

                    {skills.length === 0 ? (

                        <p className="text-sm text-gray-400">
                            Add your skills to showcase your expertise.
                        </p>

                    ) : (

                        <div className="border border-gray-200 rounded-lg overflow-hidden">

                            {skills.map((currentSkill, index) => (

                                <div
                                    key={`${currentSkill}-${index}`}
                                    className="flex items-center justify-between px-5 py-4 border-b last:border-b-0 border-gray-200 hover:bg-gray-50"
                                >

                                    {/* Skill */}
                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-gray-600">
                                                {currentSkill.charAt(0).toUpperCase()}
                                            </span>
                                        </div>

                                        <span className="text-base font-medium text-gray-800">
                                            {currentSkill}
                                        </span>

                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteSkill(currentSkill)
                                        }
                                        disabled={saving}
                                        title="Delete skill"
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


            {/* Add Skill Modal */}
            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Add Skill
                            </h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setSkill("");
                                }}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* Input */}
                        <div className="mb-6">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skill
                            </label>

                            <input
                                type="text"
                                value={skill}
                                onChange={(event) =>
                                    setSkill(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleAddSkill();
                                    }
                                }}
                                placeholder="e.g. Java"
                                autoFocus
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setSkill("");
                                }}
                                disabled={saving}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleAddSkill}
                                disabled={saving || !skill.trim()}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? "Adding..." : "Add Skill"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
};

export default Skills;