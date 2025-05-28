import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 40, transition: { duration: 0.2 } },
};

export interface PatientForm {
  patientName: string;
  age: string;
  gender: string;
  contact: string;
}

interface PatientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: PatientForm) => Promise<void>;
}

export default function PatientModal({ open, onClose, onSubmit }: PatientModalProps) {
  const [form, setForm] = useState<PatientForm>({
    patientName: '',
    age: '',
    gender: '',
    contact: '',
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
    setForm({ patientName: '', age: '', gender: '', contact: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
          <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative" initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">Add New Patient</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Patient Name</label>
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
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact</label>
                <input type="text" name="contact" value={form.contact} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <button type="submit" disabled={submitting} className="w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Adding...' : 'Add Patient'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 