import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, Heart, Shield, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = ({ onGetStarted }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Mental Health Support",
      description: "24/7 confidential AI chatbot for immediate support and guidance",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Anonymous Peer Community",
      description: "Connect with fellow students in a safe, moderated environment",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Resources",
      description: "Multilingual content tailored to your cultural background",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Complete Privacy",
      description: "Your real identity is never shared - only nicknames are public",
    },
  ];

  const trustIndicators = [
    "🎓 50+ Universities",
    "🛡️ HIPAA Compliant",
    "🌍 5 Languages",
    "⭐ 4.9/5 Rating",
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-wellness-calm/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-wellness-peace/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-gentle" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Digital Psychological Intervention System
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your anonymous, safe space for mental wellness. Connect, learn, and
            grow with AI-powered support and peer community.
          </motion.p>

          {/* Video/Animation Area */}
          <motion.div
            className="relative mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="dpis-card relative aspect-video rounded-2xl overflow-hidden bg-gradient-wellness border-2 border-white/20">
              {!isVideoPlaying ? (
                <div className="flex items-center justify-center h-full">
                  <Button
                    onClick={() => setIsVideoPlaying(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:scale-110 transition-all duration-300"
                    size="lg"
                  >
                    <Play className="w-8 h-8 mr-2" />
                    Watch Introduction
                  </Button>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Intro Video"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}

              {/* Floating elements */}
              <div className="absolute top-4 left-4 w-4 h-4 bg-white/40 rounded-full animate-bounce-gentle" />
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-white/30 rounded-full animate-pulse-gentle" />
              <div className="absolute top-1/2 right-8 w-3 h-3 bg-white/50 rounded-full animate-float" />
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 text-lg rounded-xl hover-lift shadow-wellness"
              size="lg"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              className="border-white/30 text-foreground hover:bg-white/10 px-8 py-3 text-lg rounded-xl hover-lift"
              size="lg"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          id="features"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="dpis-card text-center hover-lift"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <div className="text-primary mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <p className="text-muted-foreground mb-4">
            Trusted by students across India
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60 flex-wrap">
            {trustIndicators.map((item, idx) => (
              <div key={idx} className="text-sm">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </div>
  );
};

export default LandingPage;
