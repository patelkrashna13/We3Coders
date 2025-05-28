import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, MessageSquare, Calendar, ClipboardList, Heart, ArrowRight, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AppointmentModal from '../components/common/AppointmentModal';

const roleModalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const SPECIALIZATIONS = ['ENT', 'OPD', 'Orthopaedic', 'Optics', 'Dental', 'Skin', 'Reproductive'];

const QUALIFICATIONS = [
  'MBBS - Bachelor of Medicine, Bachelor of Surgery',
  'MD – Doctor of Medicine',
  'MS - Master of Surgery',
  'DDS – Doctor of Dental Surgery',
  'BHMS – Bachelor of Homeopathic Medicine and Surgery',
  'PharmD – Doctor of Pharmacy',
  'Another',
];

const TelemedicinePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(true);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorForm, setDoctorForm] = useState({ doctorName: '', mobileNo: '', date: '', time: '', specialization: '', yearOfExperience: '', qualification: '' });
  const [doctorSubmitting, setDoctorSubmitting] = useState(false);
  const [doctorSuccess, setDoctorSuccess] = useState(false);
  const [consultancies, setConsultancies] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleBookAppointment = async (form: any) => {
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      alert('Failed to book appointment.');
    }
  };

  const handleDoctorConsult = async (form: any) => {
    setDoctorSubmitting(true);
    try {
      await fetch('/api/consultancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setDoctorSuccess(true);
      setTimeout(() => setDoctorSuccess(false), 2000);
      setDoctorModalOpen(false);
      setDoctorForm({ doctorName: '', mobileNo: '', date: '', time: '', specialization: '', yearOfExperience: '', qualification: '' });
      fetchConsultancies();
    } catch (err) {
      alert('Failed to schedule consultancy.');
    }
    setDoctorSubmitting(false);
  };

  const fetchConsultancies = async () => {
    const res = await fetch('/api/consultancies');
    const data = await res.json();
    setConsultancies(data);
  };

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  useEffect(() => {
    fetchConsultancies();
    fetchAppointments();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-20"
    >
      {/* Panel Name at the very top */}
      <div className="w-full flex flex-row items-center justify-center mt-4 mb-8 gap-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
          className="text-4xl font-extrabold text-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-wide"
          style={{ textShadow: '2px 2px 8px #000, 0 0 2px #000' }}
        >
          {role === 'doctor' ? 'Doctor' : role === 'patient' ? 'Patient' : ''}
        </motion.h2>
        <button onClick={() => navigate('/')} className="p-2 rounded-lg transition-colors flex items-center justify-center">
          <Home className="w-7 h-7 text-primary-300" />
        </button>
      </div>
      {/* Role Selection Modal */}
      <AnimatePresence>
        {roleModalOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" initial="hidden" animate="visible" exit="exit" variants={roleModalVariants}>
            <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-xs text-center" initial="hidden" animate="visible" exit="exit" variants={roleModalVariants}>
              <h2 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-300">Continue as</h2>
              <div className="flex flex-col gap-4">
                <button className="btn-primary" onClick={() => { setRole('patient'); setRoleModalOpen(false); }}>Patient</button>
                <button className="btn-accent" onClick={() => { setRole('doctor'); setRoleModalOpen(false); setDoctorModalOpen(true); }}>Doctor</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Patient Appointment Modal */}
      <AppointmentModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleBookAppointment} />
      {success && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-lg">
          Appointment Booked!
        </motion.div>
      )}
      {/* Doctor Consultancy Modal */}
      <AnimatePresence>
        {doctorModalOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" initial="hidden" animate="visible" exit="exit" variants={roleModalVariants}>
            <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative" initial="hidden" animate="visible" exit="exit" variants={roleModalVariants}>
              <button onClick={() => setDoctorModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
              <h2 className="text-2xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">Schedule Consultancy</h2>
              <form onSubmit={e => { e.preventDefault(); handleDoctorConsult(doctorForm); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Doctor Name</label>
                    <input type="text" name="doctorName" value={doctorForm.doctorName} onChange={e => setDoctorForm({ ...doctorForm, doctorName: e.target.value })} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mobile No</label>
                    <input type="tel" name="mobileNo" value={doctorForm.mobileNo} onChange={e => setDoctorForm({ ...doctorForm, mobileNo: e.target.value })} required pattern="[0-9]{10}" maxLength={10} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" name="date" value={doctorForm.date} onChange={e => setDoctorForm({ ...doctorForm, date: e.target.value })} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <input type="time" name="time" value={doctorForm.time} onChange={e => setDoctorForm({ ...doctorForm, time: e.target.value })} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Specialization</label>
                    <select name="specialization" value={doctorForm.specialization} onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400">
                      <option value="">Select</option>
                      {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year of Experience</label>
                    <input type="number" name="yearOfExperience" value={doctorForm.yearOfExperience} onChange={e => setDoctorForm({ ...doctorForm, yearOfExperience: e.target.value })} required min="0" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Qualification</label>
                    <select name="qualification" value={doctorForm.qualification} onChange={e => setDoctorForm({ ...doctorForm, qualification: e.target.value })} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400">
                      <option value="">Select</option>
                      {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" disabled={doctorSubmitting} className="w-full py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-semibold transition-colors duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                    {doctorSubmitting ? 'Scheduling...' : 'Schedule Consultancy'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {doctorSuccess && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-lg">
          Consultancy Scheduled!
        </motion.div>
      )}
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white dark:from-primary-950 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Advanced Telemedicine & Virtual Care
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Connect with patients anywhere, anytime with our secure, reliable virtual care platform designed specifically for healthcare providers.
              </motion.p>
              {role === 'patient' && (
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <button className="btn-primary" onClick={() => setModalOpen(true)}>Get Started</button>
                  <button className="bg-transparent border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 py-2 px-4 rounded-md transition-colors duration-300">
                    Watch Demo
                  </button>
                </motion.div>
              )}
              {role === 'doctor' && (
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <button className="btn-accent" onClick={() => setDoctorModalOpen(true)}>Schedule Consultancy</button>
                </motion.div>
              )}
            </div>
            <div className="lg:w-1/2">
              <motion.img 
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Telemedicine Consultation" 
                className="rounded-xl shadow-lg w-full h-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Virtual Care Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to deliver exceptional care remotely
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Video className="h-8 w-8 text-primary-600 dark:text-primary-400" />,
                title: "HD Video Consultations",
                description: "Crystal clear video with minimal latency, even with low bandwidth connections."
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-primary-600 dark:text-primary-400" />,
                title: "Secure Messaging",
                description: "HIPAA-compliant messaging for follow-ups and quick patient questions."
              },
              {
                icon: <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />,
                title: "Smart Scheduling",
                description: "AI-powered scheduling to optimize your availability and reduce no-shows."
              },
              {
                icon: <ClipboardList className="h-8 w-8 text-primary-600 dark:text-primary-400" />,
                title: "Digital Prescriptions",
                description: "Send prescriptions electronically to the patient's preferred pharmacy."
              },
              {
                icon: <Heart className="h-8 w-8 text-primary-600 dark:text-primary-400" />,
                title: "Vital Monitoring",
                description: "Connect with patient wearables to monitor vital signs remotely."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="glass-card p-6 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How Telemedicine Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Simple, secure, and effective virtual care delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Schedule Appointment",
                description: "Patients book appointments through the app or you send them invitations via SMS or email."
              },
              {
                step: "02",
                title: "Join Virtual Consultation",
                description: "Both parties join the secure video call with one click, no downloads required."
              },
              {
                step: "03",
                title: "Provide Care & Follow-Up",
                description: "Conduct the visit, share documents, send prescriptions, and schedule follow-ups as needed."
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg relative z-10">
                  <div className="text-5xl font-bold text-primary-100 dark:text-primary-900 absolute -top-6 -left-2">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-[-30px] transform -translate-y-1/2 z-0">
                    <ArrowRight size={30} className="text-primary-300 dark:text-primary-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 dark:bg-primary-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Transform Your Practice?
            </motion.h2>
            <motion.p 
              className="text-lg text-primary-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join thousands of healthcare providers delivering exceptional care virtually.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to="/"
                className="bg-white text-primary-600 hover:bg-primary-50 py-2 px-6 rounded-md transition-colors duration-300 font-medium"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/"
                className="bg-transparent border border-white text-white hover:bg-primary-700 dark:hover:bg-primary-900 py-2 px-6 rounded-md transition-colors duration-300 font-medium"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Doctor Panel: Show all patient appointments */}
      {role === 'doctor' && appointments.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-primary-700 dark:text-primary-300 mb-6">Patient Appointments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((a, idx) => (
              <div key={idx} className="rounded-xl shadow-lg bg-white dark:bg-gray-900 p-6 flex flex-col gap-2 border-t-4 border-primary-600 hover:scale-105 transition-transform duration-300">
                <div className="font-bold text-lg text-primary-700 dark:text-primary-400">{a.patientName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Mobile: <span className="font-semibold">{a.mobileNo}</span></div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Age: {a.age} | Gender: {a.gender}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Blood Group: {a.bloodGroup}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Type of Disease: {a.typeOfDisease}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Timings: {a.timings}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {role === 'patient' && consultancies.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-primary-700 dark:text-primary-300 mb-6">Available Doctor Consultancies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultancies.map((c, idx) => (
              <div key={idx} className="rounded-xl shadow-lg bg-white dark:bg-gray-900 p-6 flex flex-col gap-2 border-t-4 border-accent-600 hover:scale-105 transition-transform duration-300">
                <div className="font-bold text-lg text-accent-700 dark:text-accent-400">Dr. {c.doctorName}</div>
                {c.mobileNo && <div className="text-sm text-gray-600 dark:text-gray-300">Mobile: <span className="font-semibold">{c.mobileNo}</span></div>}
                <div className="text-sm text-gray-600 dark:text-gray-300">Specialization: <span className="font-semibold">{c.specialization}</span></div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Date: {c.date} | Time: {c.time}</div>
                {c.yearOfExperience && <div className="text-sm text-gray-600 dark:text-gray-300">Experience: {c.yearOfExperience} years</div>}
                {c.qualification && <div className="text-sm text-gray-600 dark:text-gray-300">Qualification: {c.qualification}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default TelemedicinePage;