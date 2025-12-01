"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, X, Dumbbell, TrendingUp } from "lucide-react";
import LogoutButton from "../pages/login-button";

interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
  notes: string;
}

const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Abs",
  "Cardio",
];

export default function GymWorkoutApp() {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const savedExercises = localStorage.getItem("gymExercises");
    return savedExercises ? JSON.parse(savedExercises) : [];
  });
  const [formData, setFormData] = useState({
    name: "",
    muscleGroup: "Chest",
    sets: "3",
    reps: "10",
    weight: "0",
    notes: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filterMuscle, setFilterMuscle] = useState("All");
  const [filterDate, setFilterDate] = useState("All");

  // Save to localStorage whenever exercises change
  useEffect(() => {
    localStorage.setItem("gymExercises", JSON.stringify(exercises));
  }, [exercises]);

  const handleAddExercise = () => {
    if (formData.name && formData.muscleGroup) {
      const today = new Date().toISOString().split("T")[0];

      if (editingId) {
        // UPDATE
        setExercises(
          exercises.map((ex) =>
            ex.id === editingId
              ? {
                  ...ex,
                  name: formData.name,
                  muscleGroup: formData.muscleGroup,
                  sets: Number.parseInt(formData.sets),
                  reps: Number.parseInt(formData.reps),
                  weight: Number.parseFloat(formData.weight),
                  notes: formData.notes,
                }
              : ex,
          ),
        );
        setEditingId(null);
      } else {
        // CREATE
        const newExercise: Exercise = {
          id: Date.now(),
          name: formData.name,
          muscleGroup: formData.muscleGroup,
          sets: Number.parseInt(formData.sets),
          reps: Number.parseInt(formData.reps),
          weight: Number.parseFloat(formData.weight),
          date: today,
          notes: formData.notes,
        };
        setExercises([...exercises, newExercise]);
      }
      setFormData({
        name: "",
        muscleGroup: "Chest",
        sets: "3",
        reps: "10",
        weight: "0",
        notes: "",
      });
      setShowForm(false);
    }
  };

  const handleEditExercise = (exercise: Exercise) => {
    setFormData({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      weight: exercise.weight.toString(),
      notes: exercise.notes,
    });
    setEditingId(exercise.id);
    setShowForm(true);
  };

  const handleDeleteExercise = (id: number) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
    setDeleteConfirm(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      muscleGroup: "Chest",
      sets: "3",
      reps: "10",
      weight: "0",
      notes: "",
    });
  };

  const filteredExercises = exercises.filter((ex) => {
    const muscleMatch =
      filterMuscle === "All" || ex.muscleGroup === filterMuscle;
    let dateMatch = true;

    if (filterDate === "Today") {
      const today = new Date().toISOString().split("T")[0];
      dateMatch = ex.date === today;
    } else if (filterDate === "Week") {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      dateMatch = ex.date >= weekAgo;
    } else if (filterDate === "Month") {
      const today = new Date();
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      dateMatch = ex.date >= monthAgo;
    }

    return muscleMatch && dateMatch;
  });

  const getMuscleColor = (muscle: string) => {
    const colors: { [key: string]: string } = {
      Chest: "bg-red-100 text-red-800",
      Back: "bg-blue-100 text-blue-800",
      Legs: "bg-green-100 text-green-800",
      Shoulders: "bg-purple-100 text-purple-800",
      Biceps: "bg-orange-100 text-orange-800",
      Triceps: "bg-pink-100 text-pink-800",
      Forearms: "bg-yellow-100 text-yellow-800",
      Abs: "bg-indigo-100 text-indigo-800",
      Cardio: "bg-cyan-100 text-cyan-800",
    };
    return colors[muscle] || "bg-gray-100 text-gray-800";
  };

  const totalWeight = filteredExercises.reduce(
    (sum, ex) => sum + ex.weight * ex.sets * ex.reps,
    0,
  );
  const totalVolume = filteredExercises.reduce(
    (sum, ex) => sum + ex.sets * ex.reps,
    0,
  );

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3 mb-2'>
              <Dumbbell className='w-8 h-8 text-red-500' />
              <h1 className='text-4xl font-bold text-white'>
                Gym Workout Tracker
              </h1>
            </div>

            <LogoutButton />
          </div>
          <p className='text-gray-300'>
            Track your exercises and monitor your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-linear-to-br from-red-600 to-red-700 rounded-lg p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-red-100 text-sm mb-1'>Total Exercises</p>
                <p className='text-3xl font-bold'>{filteredExercises.length}</p>
              </div>
              <Dumbbell className='w-12 h-12 text-red-300 opacity-50' />
            </div>
          </div>

          <div className='bg-linear-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-blue-100 text-sm mb-1'>Total Volume</p>
                <p className='text-3xl font-bold'>{totalVolume}</p>
              </div>
              <TrendingUp className='w-12 h-12 text-blue-300 opacity-50' />
            </div>
          </div>

          <div className='bg-linear-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-purple-100 text-sm mb-1'>Total Weight</p>
                <p className='text-3xl font-bold'>
                  {totalWeight.toLocaleString()}
                </p>
                <p className='text-purple-100 text-xs mt-1'>lbs</p>
              </div>
              <Dumbbell className='w-12 h-12 text-purple-300 opacity-50' />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Form Section */}
          {showForm && (
            <div className='lg:col-span-1'>
              <div className='bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 sticky top-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-xl font-bold text-white'>
                    {editingId ? "✏️ Edit Exercise" : "➕ Add Exercise"}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className='text-gray-400 hover:text-white transition'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>

                <form
                  className='space-y-4'
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddExercise();
                  }}
                >
                  <div>
                    <label className='block text-sm font-semibold text-gray-200 mb-2'>
                      Exercise Name *
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., Bench Press'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-200 mb-2'>
                      Muscle Group
                    </label>
                    <select
                      value={formData.muscleGroup}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          muscleGroup: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-700 text-white'
                    >
                      {MUSCLE_GROUPS.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-200 mb-2'>
                        Sets
                      </label>
                      <input
                        type='number'
                        placeholder='3'
                        min='1'
                        value={formData.sets}
                        onChange={(e) =>
                          setFormData({ ...formData, sets: e.target.value })
                        }
                        className='w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-200 mb-2'>
                        Reps
                      </label>
                      <input
                        type='number'
                        placeholder='10'
                        min='1'
                        value={formData.reps}
                        onChange={(e) =>
                          setFormData({ ...formData, reps: e.target.value })
                        }
                        className='w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-200 mb-2'>
                      Weight (lbs)
                    </label>
                    <input
                      type='number'
                      placeholder='0'
                      step='0.5'
                      min='0'
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-200 mb-2'>
                      Notes
                    </label>
                    <textarea
                      placeholder='e.g., Felt strong, good form'
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 h-20 resize-none'
                    />
                  </div>

                  <div className='flex gap-2 pt-4'>
                    <button
                      onClick={handleAddExercise}
                      className='flex-1 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
                    >
                      {editingId ? "Update" : "Add"} Exercise
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Exercises List Section */}
          <div className={`${showForm ? "lg:col-span-3" : "lg:col-span-4"}`}>
            <div className='bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden'>
              {/* Header */}
              <div className='bg-linear-to-r from-red-600 to-red-700 text-white p-6'>
                <div className='flex justify-between items-center mb-4'>
                  <div>
                    <h2 className='text-2xl font-bold'>💪 Your Workouts</h2>
                  </div>
                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className='flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 font-semibold py-2 px-4 rounded-lg transition duration-200'
                    >
                      <Plus className='w-5 h-5' />
                      Add Exercise
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className='grid grid-cols-2 md:grid-cols-2 gap-3'>
                  <div>
                    <p className='text-red-100 text-xs mb-2'>Muscle Group</p>
                    <select
                      value={filterMuscle}
                      onChange={(e) => setFilterMuscle(e.target.value)}
                      className='w-full px-3 py-1 text-sm border border-red-500 rounded-lg focus:outline-none bg-red-700 text-white'
                    >
                      <option>All</option>
                      {MUSCLE_GROUPS.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className='text-red-100 text-xs mb-2'>Time Period</p>
                    <select
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className='w-full px-3 py-1 text-sm border border-red-500 rounded-lg focus:outline-none bg-red-700 text-white'
                    >
                      <option value='All'>All Time</option>
                      <option value='Today'>Today</option>
                      <option value='Week'>This Week</option>
                      <option value='Month'>This Month</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Exercises List */}
              <div className='p-6'>
                {filteredExercises.length === 0 ? (
                  <div className='text-center py-16 px-6'>
                    <Dumbbell className='w-16 h-16 text-gray-600 mx-auto mb-4' />
                    <p className='text-gray-300 text-lg font-medium'>
                      No exercises found
                    </p>
                    <p className='text-gray-400 mt-1'>
                      {exercises.length === 0
                        ? "Add your first exercise to get started!"
                        : "Try a different filter"}
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {filteredExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className='bg-gray-700 hover:bg-gray-600 transition rounded-lg p-4 border border-gray-600'
                      >
                        <div className='flex justify-between items-start gap-4'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                              <h3 className='text-lg font-bold text-white'>
                                {exercise.name}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getMuscleColor(
                                  exercise.muscleGroup,
                                )}`}
                              >
                                {exercise.muscleGroup}
                              </span>
                            </div>

                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-3'>
                              <div className='bg-gray-800 rounded p-3'>
                                <p className='text-gray-400 text-xs mb-1'>
                                  Sets
                                </p>
                                <p className='text-white font-bold text-lg'>
                                  {exercise.sets}
                                </p>
                              </div>
                              <div className='bg-gray-800 rounded p-3'>
                                <p className='text-gray-400 text-xs mb-1'>
                                  Reps
                                </p>
                                <p className='text-white font-bold text-lg'>
                                  {exercise.reps}
                                </p>
                              </div>
                              <div className='bg-gray-800 rounded p-3'>
                                <p className='text-gray-400 text-xs mb-1'>
                                  Weight
                                </p>
                                <p className='text-white font-bold text-lg'>
                                  {exercise.weight} lbs
                                </p>
                              </div>
                              <div className='bg-gray-800 rounded p-3'>
                                <p className='text-gray-400 text-xs mb-1'>
                                  Volume
                                </p>
                                <p className='text-white font-bold text-lg'>
                                  {exercise.sets * exercise.reps}
                                </p>
                              </div>
                            </div>

                            {exercise.notes && (
                              <p className='text-gray-300 text-sm mt-3'>
                                📝 {exercise.notes}
                              </p>
                            )}
                            <p className='text-gray-400 text-xs mt-2'>
                              📅 {new Date(exercise.date).toLocaleDateString()}
                            </p>
                          </div>

                          <div className='flex gap-2'>
                            <button
                              onClick={() => handleEditExercise(exercise)}
                              className='p-2 text-blue-400 hover:bg-blue-900 rounded-lg transition duration-200'
                              title='Edit'
                            >
                              <Edit2 className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(exercise.id)}
                              className='p-2 text-red-400 hover:bg-red-900 rounded-lg transition duration-200'
                              title='Delete'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm'>
          <div className='bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-700'>
            <h3 className='text-xl font-bold text-white mb-4'>
              🗑️ Confirm Delete
            </h3>
            <p className='text-gray-300 mb-6 leading-relaxed'>
              Are you sure you want to delete this exercise? This action{" "}
              <span className='font-semibold'>cannot be undone</span>.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteExercise(deleteConfirm)}
                className='flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
