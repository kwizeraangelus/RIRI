// src/app/contact/ContactClient.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_if8qxh6";
const EMAILJS_TEMPLATE_ID = "template_e84we2b";
const EMAILJS_PUBLIC_KEY = "2sFxf184ONQ3nezsQ";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          reply_to: formData.email,
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.log("FULL ERROR:", error);
      console.log("ERROR TEXT:", error?.text);
      console.log("ERROR STATUS:", error?.status);
    
      setErrorMsg(
        error?.text || "Failed to send message. Please try again."
      );
    
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900 flex flex-col">
      
      {/* DARK NAVY TOP BAND */}
      <div className="h-28 bg-[#050A14]" aria-hidden="true" />

      {/* === NAVIGATION BAR === */}
      

      {/* === HERO SECTION === */}
      <section className="relative -mt-28 pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-2xl sm:text-3xl md:text-4xl md:text-6xl font-bold text-[#050A14] mb-6">
            Get in <span className="text-[#FFD700]">Touch</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Have a question, feedback, or partnership idea? We’d love to hear from you.
          </p>
        </div>
      </section>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#050A14] to-[#1a237e] p-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Send us a Message</h2>
                <p className="text-gray-300">We will get back to you within 24 hours</p>
              </div>

              <div className="p-8">
                {status === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Thank you! Your message has been sent.
                  </div>
                )}

                {status === "error" && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition"
                      placeholder="Kwizera Angelus"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition"
                      placeholder="kwizeraangelus@gmail.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition"
                      placeholder="Partnership Inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#050A14] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#1a237e] transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Contact Info Cards */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-[#050A14] to-[#1a237e] p-8 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Contact Information</h2>
                  <p className="text-gray-300">Reach us through any of these channels</p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#050A14]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Visit Us</h3>
                      <p className="text-gray-600">KG 677 ST, Kigali<br />Gisozi-Kukibanza<br />Kigali, Rwanda</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#050A14]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Call Us</h3>
                      <p className="text-gray-600">+250 793211640<br />+250 785590020</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#050A14]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Email Us</h3>
                      <p className="text-gray-600">info@riri.rw<br/>support@riri.rw</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-[#050A14] to-[#1a237e] p-8 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Office Hours</h2>
                  <p className="text-gray-300">When we are available</p>
                </div>
                <div className="p-8">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Monday - Friday</span>
                      <span className="text-gray-600">8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Saturday</span>
                      <span className="text-gray-600">9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-700">Sunday</span>
                      <span className="text-gray-600">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-[#050A14] to-[#1a237e] p-8 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Find Us</h2>
                  <p className="text-gray-300">Our location on the map</p>
                </div>
                <div className="p-4">
                  <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                     <iframe
                    // Note: Changed the iframe source to a working Google Maps embed URL 
                    // (the original URL was a non-functional placeholder)
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.525501865955!2d30.0768993!3d-1.9472648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca41c6f4459f9%3A0x86701831c266471!2sKigali%20Innovation%20City%20(KIC)!5e0!3m2!1sen!2srw!4v1700057000000!5m2!1sen!2srw"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full mt-12">
        <div className="bg-gradient-to-r from-[#050A14] to-[#1a237e] rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to contribute to Rwanda research ecosystem?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/publications"
              className="bg-[#FFD700] text-[#050A14] px-10 py-4 rounded-full text-lg font-bold hover:bg-yellow-500 transition-all hover:scale-105"
            >
              Browse Research
            </Link>
            <Link 
              href="/login"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all"
            >
              Join Our Community
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0c1e30] text-white pt-14 pb-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Top grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">

            {/* Brand col */}
            <div className="lg:col-span-1">
              <p
                className="font-bold uppercase text-white mb-1"
                style={{ fontFamily: "'Bell MT', 'Palatino Linotype', Georgia, serif", fontSize: '38px', letterSpacing: '4px', fontStyle: 'italic', lineHeight: 1 }}
              >
                RIRI
              </p>
              <p className="text-[#FFD700] text-[9px] uppercase tracking-widest mb-4">Discover · Innovate · Inspire</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Rwanda's premier platform connecting researchers, innovators, and knowledge seekers.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {['Researchers', 'Theses', 'Publications', 'Innovations', 'Events'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-gray-300 hover:text-[#FFD700] transition text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-5">Contact Us</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">✉</span>
                  <span>info@riri.rw</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">📍</span>
                  <span>Kigali, Rwanda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">📞</span>
                  <span>+250 000 000 000</span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-5">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Facebook', icon: 'f' },
                  { name: 'WhatsApp', icon: 'w' },
                  { name: 'Instagram', icon: 'ig' },
                  { name: 'TikTok', icon: 'tt' },
                ].map((social) => (
                  <button
                    key={social.name}
                    onClick={() => notifyInfo(social.name)}
                    className="px-4 py-2 rounded-full border border-white/20 text-sm text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition"
                  >
                    {social.name}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-6 leading-relaxed">
                Stay updated with the latest research events and innovations from Rwanda.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} RIRI. All Rights Reserved.</p>
            <div className="flex gap-5">
              <Link href="/about" className="hover:text-[#FFD700] transition">About</Link>
              <Link href="/contact" className="hover:text-[#FFD700] transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}