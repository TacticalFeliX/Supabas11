import React, { useState, useEffect } from "react";
import { WebConsentScreen } from "./components/WebConsentScreen.jsx";
import { AuthScreen } from "./components/AuthScreen.jsx";
import { Dashboard } from "./components/Dashboard.jsx";
import { AdminDashboard } from "./components/AdminDashboard.jsx";
import { ReportGrievance } from "./components/ReportGrievance.jsx";
import { ComplaintTimeline } from "./components/ComplaintTimeline.jsx";
import { ChatBot } from "./components/ChatBot.jsx";
import { RAGChatBot } from "./components/RAGChatBot.jsx";
import { AlertsCenter } from "./components/AlertsCenter.jsx";
import { ReportSuspicious } from "./components/ReportSuspicious.jsx";
import { ProfileSettings } from "./components/ProfileSettings.jsx";
import { NotificationCenter } from "./components/NotificationCenter.jsx";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("consent");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ragContext, setRagContext] = useState(null);

  // Check for existing user session
  useEffect(() => {
    const storedUser = localStorage.getItem("cyberapp_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setCurrentScreen("dashboard");
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("cyberapp_user");
      }
    }
  }, []);

  const handleConsentGiven = () => {
    setCurrentScreen("auth");
  };

  const handleAuthentication = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("cyberapp_user", JSON.stringify(userData));
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("cyberapp_user");
    setCurrentScreen("consent");
  };

  const navigateTo = (screen, context = null) => {
    if (context) {
      setRagContext(context);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "consent":
        return <WebConsentScreen onConsentGiven={handleConsentGiven} />;
      case "auth":
        return <AuthScreen onAuthenticated={handleAuthentication} />;
      case "dashboard":
        if (user?.userType === "official") {
          return (
            <AdminDashboard
              user={user}
              onNavigate={navigateTo}
              onLogout={handleLogout}
            />
          );
        } else {
          return (
            <Dashboard
              user={user}
              onNavigate={navigateTo}
              onLogout={handleLogout}
            />
          );
        }
      case "report":
        return (
          <ReportGrievance
            user={user}
            onBack={() => navigateTo("dashboard")}
            onNavigate={navigateTo}
          />
        );
      case "timeline":
        return (
          <ComplaintTimeline
            user={user}
            onBack={() => navigateTo("dashboard")}
          />
        );
      case "suspicious":
        return (
          <ReportSuspicious
            user={user}
            onBack={() => navigateTo("dashboard")}
          />
        );
      case "alerts":
        return (
          <AlertsCenter
            user={user}
            onBack={() => navigateTo("dashboard")}
          />
        );
      case "notifications":
        return (
          <NotificationCenter
            user={user}
            onBack={() => navigateTo("dashboard")}
            onNavigate={navigateTo}
          />
        );
      case "profile":
        return (
          <ProfileSettings
            user={user}
            onBack={() => navigateTo("dashboard")}
            onUpdateUser={setUser}
          />
        );
      case "chatbot":
        return <ChatBot onBack={() => navigateTo("dashboard")} />;
      case "rag-chatbot":
        return (
          <RAGChatBot
            onBack={() => navigateTo("dashboard")}
            context={ragContext}
          />
        );
      default:
        return <ConsentScreen onConsentGiven={handleConsentGiven} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {renderScreen()}
    </div>
  );
}