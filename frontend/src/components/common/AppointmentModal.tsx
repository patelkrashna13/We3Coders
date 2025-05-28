import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['M', 'F', 'Prefer not to say'];
const DISEASE_TYPES = ['ENT', 'OPD', 'Orthopaedic', 'Optics', 'Dental', 'Skin', 'Reproductive'];

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 40, transition: { duration: 0.2 } },
};

export interface AppointmentForm {
  patientName: string;
  age: string;
  gender: string;
  mobileNo: string;
  bloodGroup: string;
  typeOfDisease: string;
  timings: string;
}

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: AppointmentForm) => Promise<void>;
}

export default function AppointmentModal({ open, onClose, onSubmit }: AppointmentModalProps) {
  const [form, setForm] = useState<AppointmentForm>({
    patientName: '',
    age: '',
    gender: '',
    mobileNo: '',
    bloodGroup: '',
    typeOfDisease: '',
    timings: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
    setForm({ patientName: '', age: '', gender: '', mobileNo: '', bloodGroup: '', typeOfDisease: '', timings: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
          <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative" initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">Book Appointment</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" name="patientName" value={form.patientName} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input type="number" name="age" value={form.age} onChange={handleChange} required min="0" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400">
                    <option value="">Select</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile No</label>
                  <input type="tel" name="mobileNo" value={form.mobileNo} onChange={handleChange} required pattern="[0-9]{10}" maxLength={10} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Group</label>
                  <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400">
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type of Disease</label>
                  <select name="typeOfDisease" value={form.typeOfDisease} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400">
                    <option value="">Select</option>
                    {DISEASE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Timings</label>
                  <input type="time" name="timings" value={form.timings} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 