import { Routes, Route } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import StoryDetail from "./pages/StoryDetail";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
      <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
        
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cuento/:id" element={<StoryDetail />} />
          </Routes>
        </main>

        {/* CHAT FLOTANTE */}
        <ChatWidget />

        <Footer />
      </div>
  );
}
