import React from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';

export default function LandingPage() {
  // Testimonials data
  const testimonials = [
    {
      name: "Sarah K.",
      role: "Finance Manager",
      text: "Revolutionized our expense tracking!",
      rating: 5
    },
    {
      name: "Raj P.",
      role: "Legal Advisor",
      text: "Best contract analysis tool I've used.",
      rating: 5
    }
  ];

  // Features data
  const features = [
    {
      title: 'Document Analysis',
      content: 'Analyze and extract data from Legal documents.',
      icon: '📄'
    },
    {
      title: 'Compliance Interaction',
      content: 'Real-time regulatory compliance checks.',
      icon: '🛡️'
    },
    {
      title: 'Smart Expense Tracking',
      content: 'Helps you track and manage expenses efficiently.',
      icon: '📊'
    }
  ];

  // Stats data
  const stats = [
    { number: "5000+", label: "Active Users" },
    { number: "98%", label: "Accuracy Rate" },
    { number: "120+", label: "Enterprise Clients" }
  ];

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <header className="app-bar">
        <nav className="toolbar">
          <div className="logo">Insightify</div>
          <div className="desktop-menu">
            <a href="#features" className="nav-button">Features</a>
            <a href="#testimonials" className="nav-button">Testimonials</a>
            <a href="#contact" className="nav-button">Contact</a>
            <a href="/login" className="login-button nav-button">Login</a>
            <a href="/signup" className="signup-button nav-button">Sign Up</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <h1 className="hero-title">
            Transform Your <span className="highlight">Management Ops</span>
          </h1>
          <p className="hero-subtitle">
          Automated Financial and Legal Document Analyzer
          </p>
          <motion.a
            href="/signup"
            className="demo-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up!!→
          </motion.a>
        </div>
      </section>

      {/* Animated Stats Banner */}
      <section className="stats-banner">
        {stats.map((stat, idx) => (
          <motion.div className="stat-item" key={stat.label} whileHover={{ scale: 1.07 }}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2 className="section-title">Smart Solutions</h2>
        <div className="feature-cards">
          {features.map((feature, idx) => (
            <motion.div
              className="feature-card"
              key={feature.title}
              whileHover={{ scale: 1.04, y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-title">{feature.title}</div>
              <div className="feature-content">{feature.content}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonial-cards">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              className="testimonial-card"
              key={testimonial.name}
              whileHover={{ y: -5, boxShadow: "0 8px 32px rgba(24,255,255,0.25)" }}
            >
              <div className="quote-icon">“</div>
              <p>{testimonial.text}</p>
              <div className="author">
                <div className="rating">
                  {"★".repeat(testimonial.rating)}
                </div>
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="newsletter-cta">
        <div className="cta-content">
          <h2>Stay Updated</h2>
          <p>Get exclusive insights and updates</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button className="cta-button" type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="contact-card">
          <h2 className="section-title" style={{ color: "var(--cyan)" }}>Contact Us</h2>
          <form className="contact-form" onSubmit={e => e.preventDefault()}>
            <input className="contact-input" type="text" placeholder="Your Name" required />
            <input className="contact-input" type="email" placeholder="Your Email" required />
            <textarea className="contact-input" placeholder="Your Message" rows={4} required />
            <button type="submit" className="send-message-button">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="about-text" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          &copy; {new Date().getFullYear()} Insightify. All rights reserved.<br />
          <span style={{ color: "var(--cyan)" }}>Empowering learning, together.</span>
        </div>
        <div className="social-icons" style={{ justifyContent: "center", marginTop: 20 }}>
          <a href="#" className="social-icon" aria-label="Twitter">🐦</a>
          <a href="#" className="social-icon" aria-label="LinkedIn">💼</a>
          <a href="#" className="social-icon" aria-label="GitHub">🐙</a>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <motion.div 
        className="chat-bubble"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ rotate: 15, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        💬
      </motion.div>
    </div>
  );
}
