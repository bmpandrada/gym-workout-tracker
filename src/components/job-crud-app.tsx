"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, X } from "lucide-react";

interface Job {
  id: number;
  company: string;
  position: string;
  source: string;
  salary: string;
  location: string;
  schedule: string;
  status: string;
}

const SCHEDULE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];
const STATUS_OPTIONS = [
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Accepted",
];

export default function JobCrudApp() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    source: "",
    salary: "",
    location: "",
    schedule: "Full-time",
    status: "Applied",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (error) {
        console.error("Error loading jobs:", error);
      }
    }
  }, []);

  // Save to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const handleAddJob = () => {
    if (
      formData.company &&
      formData.position &&
      formData.source &&
      formData.salary &&
      formData.location
    ) {
      if (editingId) {
        // UPDATE
        setJobs(
          jobs.map((job) =>
            job.id === editingId
              ? {
                  ...job,
                  company: formData.company,
                  position: formData.position,
                  source: formData.source,
                  salary: formData.salary,
                  location: formData.location,
                  schedule: formData.schedule,
                  status: formData.status,
                }
              : job,
          ),
        );
        setEditingId(null);
      } else {
        // CREATE
        const newJob: Job = {
          id: Date.now(),
          company: formData.company,
          position: formData.position,
          source: formData.source,
          salary: formData.salary,
          location: formData.location,
          schedule: formData.schedule,
          status: formData.status,
        };
        setJobs([...jobs, newJob]);
      }
      setFormData({
        company: "",
        position: "",
        source: "",
        salary: "",
        location: "",
        schedule: "Full-time",
        status: "Applied",
      });
      setShowForm(false);
    }
  };

  const handleEditJob = (job: Job) => {
    setFormData({
      company: job.company,
      position: job.position,
      source: job.source,
      salary: job.salary,
      location: job.location,
      schedule: job.schedule,
      status: job.status,
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
    setDeleteConfirm(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      company: "",
      position: "",
      source: "",
      salary: "",
      location: "",
      schedule: "Full-time",
      status: "Applied",
    });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Interviewing":
        return "bg-purple-100 text-purple-800";
      case "Offer":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Accepted":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScheduleColor = (schedule: string) => {
    switch (schedule) {
      case "Full-time":
        return "bg-indigo-100 text-indigo-800";
      case "Part-time":
        return "bg-orange-100 text-orange-800";
      case "Contract":
        return "bg-cyan-100 text-cyan-800";
      case "Freelance":
        return "bg-pink-100 text-pink-800";
      case "Internship":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            💼 Job Applications
          </h1>
          <p className='text-gray-600'>
            Track and manage your job applications
          </p>
        </div>

        {/* Main Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Form Section */}
          {showForm && (
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    {editingId ? "✏️ Edit Job" : "➕ Add Job"}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className='text-gray-500 hover:text-gray-700 transition'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>

                <form
                  className='space-y-4'
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddJob();
                  }}
                >
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Company *
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., Google'
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Position *
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., Frontend Developer'
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Source *
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., LinkedIn'
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Salary *
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., $50k - $80k'
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Location *
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., San Francisco, CA'
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Schedule
                    </label>
                    <select
                      value={formData.schedule}
                      onChange={(e) =>
                        setFormData({ ...formData, schedule: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                    >
                      {SCHEDULE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='flex gap-2 pt-4'>
                    <button
                      onClick={handleAddJob}
                      className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
                    >
                      {editingId ? "Update Job" : "Add Job"}
                    </button>
                    <button
                      type='button'
                      onClick={handleCancel}
                      className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Jobs List Section */}
          <div className={`${showForm ? "lg:col-span-3" : "lg:col-span-4"}`}>
            <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
              {/* Header */}
              <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h2 className='text-2xl font-bold'>📋 Jobs List</h2>
                    <p className='text-blue-100 mt-1'>
                      {filteredJobs.length} jobs
                    </p>
                  </div>
                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className='flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition duration-200'
                    >
                      <Plus className='w-5 h-5' />
                      Add Job
                    </button>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className='p-6 border-b border-gray-200'>
                <input
                  type='text'
                  placeholder='Search by company, position, or location...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Jobs Table/List */}
              <div className='overflow-x-auto'>
                {filteredJobs.length === 0 ? (
                  <div className='text-center py-16 px-6'>
                    <p className='text-gray-500 text-lg font-medium'>
                      📭 No jobs found
                    </p>
                    <p className='text-gray-400 mt-1'>
                      {jobs.length === 0
                        ? "Add your first job application to get started!"
                        : "Try a different search term"}
                    </p>
                  </div>
                ) : (
                  <table className='w-full'>
                    <thead>
                      <tr className='bg-gray-50 border-b-2 border-gray-200'>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700'>
                          Company
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700'>
                          Position
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700'>
                          Source
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700'>
                          Salary
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700'>
                          Location
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700'>
                          Schedule
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700'>
                          Status
                        </th>
                        <th className='text-center py-4 px-6 font-semibold text-gray-700'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job, index) => (
                        <tr
                          key={job.id}
                          className={`border-b hover:bg-blue-50 transition ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className='py-4 px-6 text-gray-900 font-semibold'>
                            {job.company}
                          </td>
                          <td className='py-4 px-6 text-gray-800'>
                            {job.position}
                          </td>
                          <td className='py-4 px-6 text-gray-800'>
                            {job.source}
                          </td>
                          <td className='py-4 px-6 text-green-600 font-semibold'>
                            {job.salary}
                          </td>
                          <td className='py-4 px-6 text-gray-800'>
                            {job.location}
                          </td>
                          <td className='py-4 px-6'>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getScheduleColor(
                                job.schedule,
                              )}`}
                            >
                              {job.schedule}
                            </span>
                          </td>
                          <td className='py-4 px-6'>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                job.status,
                              )}`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td className='py-4 px-6'>
                            <div className='flex justify-center gap-3'>
                              <button
                                onClick={() => handleEditJob(job)}
                                className='p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200'
                                title='Edit'
                              >
                                <Edit2 className='w-4 h-4' />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(job.id)}
                                className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200'
                                title='Delete'
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              🗑️ Confirm Delete
            </h3>
            <p className='text-gray-700 mb-6 leading-relaxed'>
              Are you sure you want to delete this job application? This action{" "}
              <span className='font-semibold'>cannot be undone</span>.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deleteConfirm)}
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
