// CPS Case Defense Analyzer - Main App Component
import React, { useState, useEffect } from "react";
import { initGA, trackPageView, trackCPSEvent } from "./utils/analytics";
import { initSentry } from "./utils/sentry";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { getEnv, isDev } from "./utils/env";
import { CPSPunisherLogo } from "./components/CPSPunisherLogo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Toaster, toast } from "sonner@2.0.3";
import { CaseDocuments } from "./components/CaseDocuments";
import { CaseTimeline } from "./components/CaseTimeline";
import { ViolationChecker } from "./components/ViolationChecker";
import { IncidentAnalyzer } from "./components/IncidentAnalyzer";
import { DefenseStrategy } from "./components/DefenseStrategy";
import { RightsGuide } from "./components/RightsGuide";
import { EvidenceChecklist } from "./components/EvidenceChecklist";
import { DocumentGenerator } from "./components/DocumentGenerator";
import { DocumentGeneratorEnhanced } from "./components/DocumentGeneratorEnhanced";
import { DocumentReviewAnalyzer } from "./components/DocumentReviewAnalyzer";
import { FederalCivilRights } from "./components/FederalCivilRights";
import { CasePodcast } from "./components/CasePodcast";
import { QuickRightsChecker } from "./components/QuickRightsChecker";
import { CommunityHub } from "./components/CommunityHub";
import { VirtualCaseBinder } from "./components/VirtualCaseBinder";
import { ViolationReport } from "./components/ViolationReport";
import { PremiumUpgrade } from "./components/PremiumUpgrade";
import { AttorneyDashboard } from "./components/AttorneyDashboard";
import { AIParalegal } from "./components/AIParalegal";
import { MultiStateLaw } from "./components/MultiStateLaw";
import { EnhancedAIAnalysis } from "./components/EnhancedAIAnalysis";
import { CPSPolicyEngine } from "./components/CPSPolicyEngine";
import { AILegalAssistant } from "./components/AILegalAssistant";
import { LegalAlerts } from "./components/LegalAlerts";
import { CitationNetwork } from "./components/CitationNetwork";
import { LegalResourceLibrary } from "./components/LegalResourceLibrary";
import { AILegalResearch } from "./components/AILegalResearch";
import { LegalResearchPro } from "./components/LegalResearchPro";
import { BulkDataManager } from "./components/BulkDataManager";
import { SemanticSearchEngine } from "./components/SemanticSearchEngine";
import { AdvancedAnalytics } from "./components/AdvancedAnalytics";
import { OfflineMode } from "./components/OfflineMode";
import { LegalDisclaimerPages as LegalDisclaimer, FooterDisclaimer, AIContentDisclaimer } from "./components/LegalDisclaimerPages";
import { AuthForm } from "./components/AuthForm";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { AccessibilityProvider, SkipToContent } from "./components/AccessibilityProvider";
// import { StickyDisclaimerBanner } from "./components/StickyDisclaimerBanner"; // REMOVED
import { DashboardOverview } from "./components/DashboardOverview";
import { NavigationSidebar } from "./components/NavigationSidebar";
import { WelcomeTour } from "./components/WelcomeTour";
import { HelpCenter } from "./components/HelpCenter";
import { QuickTipsBar } from "./components/QuickTipsBar";
import { HelpBot } from "./components/HelpBot";
import { CriminalCaseComponent } from "./components/CriminalCaseComponent";
import { Scale, FileText, AlertTriangle, Lightbulb, Shield, CheckSquare, Calendar, FileEdit, LogOut, Loader2, Cloud, HardDrive, Mic, Crown, FileCheck, Menu, Moon, Sun, Heart, Target, MessageSquare, Clock, Flag } from "lucide-react";
import { Book, Library, Brain, BookOpen } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { api } from "./utils/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { MapPin } from "lucide-react";
import { Users } from "lucide-react";
import { Settings as SettingsIcon } from "lucide-react";
import { Settings } from "./components/Settings";
import { Database, Network, Sparkles, TrendingUp, WifiOff } from "lucide-react";
import { BellRing, Search } from "lucide-react";
import { Gavel } from "lucide-react";
import { CourtListenerSearch } from "./components/CourtListenerSearch";
import { CPSEducation } from "./components/CPSEducation";
import { LandingPageRouter } from "./components/LandingPageRouter";
import { LegalQA } from "./components/LegalQA";
import { LegalResourcesLibrary } from "./components/LegalResourcesLibrary";
import { initializeCommunityData } from "./utils/initCommunityData.ts";
import { CaseManager, type CaseData } from "./components/CaseManager";
import { CaseSelector } from "./components/CaseSelector";
import { MyCases } from "./components/MyCases";
import { NoCaseSelected } from "./components/NoCaseSelected";
import { FolderOpen } from "lucide-react";
import { NotarizationService } from "./components/NotarizationService";
import { ActionWarning, CommonWarnings } from "./components/ActionWarning";
import { SpecialAccessDialog } from "./components/SpecialAccessDialog";
import { LegalResearchHub } from "./components/LegalResearchHub";
import { VisitationLog } from "./components/VisitationLog";
import { ServiceTracker } from "./components/ServiceTracker";
import { CommunicationLog } from "./components/CommunicationLog";
import { CourtCountdown } from "./components/CourtCountdown";
import { MississippiLegalResources } from "./components/MississippiLegalResources";
import { MississippiCourtsDirectory } from "./components/MississippiCourtsDirectory";
import { FederalCPSResources } from "./components/FederalCPSResources";
import { OnboardingFlow } from "./components/OnboardingFlow";

// DEV MODE: Set to true to bypass authentication while building
const DEV_MODE = false; // Set to false for production deployment

interface Document {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface AuthState {
  accessToken: string | null;
  userId: string | null;
}

export default function App() {
  // Landing page state
  const [showLandingPage, setShowLandingPage] = useState(() => {
    // Check if user has seen landing page before
    const hasSeenLanding = localStorage.getItem('cpsHasSeenLanding');
    return !hasSeenLanding;
  });

  // Onboarding flow state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('cpsHasCompletedOnboarding');
    return !hasCompletedOnboarding;
  });

  const [userType, setUserType] = useState<'parent' | 'attorney'>('parent');

  // Authentication state
  const [auth, setAuth] = useState<AuthState>(() => {
    // DEV MODE: Skip authentication
    if (DEV_MODE) {
      return {
        accessToken: 'dev_token',
        userId: 'dev_user_123'
      };
    }
    return { accessToken: null, userId: null };
  });
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(true);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('cps-theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // App state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [userState, setUserState] = useState<string>("");
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const [caseDetails, setCaseDetails] = useState({
    caseNumber: "",
    county: "",
    dateOpened: "",
    caseworker: "",
    attorney: "",
  });

  const [violations, setViolations] = useState({
    // Constitutional
    fourthAmendment: false,
    fourteenthAmendment: false,
    firstAmendment: false,
    // Procedural
    noMirandaRights: false,
    noWrittenNotice: false,
    improperInvestigation: false,
    missedDeadlines: false,
    noSafetyPlan: false,
    noReasonableEfforts: false,
    // Evidence
    falsifiedReports: false,
    hearsayEvidence: false,
    noPhysicalEvidence: false,
    biasedInvestigation: false,
    cherryPickedEvidence: false,
    // Rights
    deniedLegalCounsel: false,
    forcedToSign: false,
    deniedVisitation: false,
    noInterpreter: false,
    // Services
    noServicesOffered: false,
    inappropriatePlacement: false,
    separatedSiblings: false,
    noRelativePlacement: false,
  });

  // Case Management State
  const [cases, setCases] = useState<CaseData[]>([]);
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);
  const [showCaseManager, setShowCaseManager] = useState(false);
  const [caseToEdit, setCaseToEdit] = useState<CaseData | undefined>(undefined);
  const [caseManagerMode, setCaseManagerMode] = useState<'create' | 'edit'>('create');

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cps-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cps-theme', 'light');
    }
  }, [isDarkMode]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Comprehensive suppression of MetaMask and crypto wallet warnings
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    const originalLog = console.log;
    const originalDebug = console.debug;
    
    const shouldSuppress = (...args: any[]) => {
      try {
        const message = args.map(arg => {
          if (typeof arg === 'string') return arg;
          if (arg && typeof arg === 'object') return JSON.stringify(arg);
          return String(arg);
        }).join(' ').toLowerCase();
        
        return (
          message.includes('metamask') || 
          message.includes('ethereum') ||
          message.includes('wallet') ||
          message.includes('web3') ||
          message.includes('failed to connect') ||
          message.includes('coinbase') ||
          message.includes('walletconnect')
        );
      } catch {
        return false;
      }
    };

    console.error = (...args) => {
      if (!shouldSuppress(...args)) {
        originalError.apply(console, args);
      }
    };

    console.warn = (...args) => {
      if (!shouldSuppress(...args)) {
        originalWarn.apply(console, args);
      }
    };

    console.info = (...args) => {
      if (!shouldSuppress(...args)) {
        originalInfo.apply(console, args);
      }
    };

    console.log = (...args) => {
      if (!shouldSuppress(...args)) {
        originalLog.apply(console, args);
      }
    };

    console.debug = (...args) => {
      if (!shouldSuppress(...args)) {
        originalDebug.apply(console, args);
      }
    };

    const handleError = (event: ErrorEvent) => {
      const message = event.message?.toLowerCase() || '';
      if (
        message.includes('metamask') || 
        message.includes('ethereum') ||
        message.includes('wallet') ||
        message.includes('failed to connect')
      ) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    };

    window.addEventListener('error', handleError, true);

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason || '').toLowerCase();
      if (
        reason.includes('metamask') || 
        reason.includes('ethereum') ||
        reason.includes('wallet') ||
        reason.includes('failed to connect')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      console.log = originalLog;
      console.debug = originalDebug;
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Initialize analytics and error tracking on mount
  useEffect(() => {
    // Initialize Sentry for error tracking
    initSentry();
    
    // Initialize Google Analytics
    try {
      const GA_MEASUREMENT_ID = getEnv('VITE_GA_MEASUREMENT_ID', '');
      if (GA_MEASUREMENT_ID) {
        initGA(GA_MEASUREMENT_ID);
        trackPageView(window.location.pathname);
        if (isDev()) {
          console.info('✅ Google Analytics initialized:', GA_MEASUREMENT_ID);
        }
      } else {
        // Only show info in development mode
        if (isDev()) {
          console.info('ℹ️ Google Analytics not configured. To enable tracking, add VITE_GA_MEASUREMENT_ID to your .env file.');
        }
      }
    } catch (error) {
      if (isDev()) {
        console.warn('⚠️ Could not initialize Google Analytics:', error);
      }
    }
  }, []);

  // Track tab changes
  useEffect(() => {
    if (activeTab) {
      trackCPSEvent.tabSwitched(activeTab);
      trackPageView(`/app/${activeTab}`, `CPS Punisher - ${activeTab}`);
    }
  }, [activeTab]);

  // Load data on mount
  useEffect(() => {
    loadLocalData();
    detectUserLocation();
    
    // Initialize community data (advocates & resources)
    // Silent initialization - errors are handled internally
    initializeCommunityData().catch(error => {
      // Silently handle - error already logged in initializeCommunityData
      // Community features will work with empty data or show appropriate messages
    });
    
    // Check for saved auth
    const savedAuth = localStorage.getItem('cpsAuth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setAuth(parsed);
        setUseLocalStorage(false);
        syncFromCloud(parsed.accessToken);
      } catch (error) {
        console.error('Error loading auth:', error);
      }
    }
    
    // Load accessibility settings
    const fontSize = localStorage.getItem('cps-font-size');
    if (fontSize) {
      document.documentElement.classList.add(`font-${fontSize}`);
    }
    
    const highContrast = localStorage.getItem('cps-high-contrast');
    if (highContrast === 'true') {
      document.documentElement.classList.add('high-contrast');
    }
    
    setIsLoading(false);
  }, []);

  // Auto-detect user location
  const detectUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.region) {
        setDetectedLocation(data.region);
        const savedState = localStorage.getItem('cpsUserState');
        if (!savedState) {
          toast.info(`Location detected: ${data.region}. Set your state for customized legal information.`);
        }
      }
    } catch (error) {
      console.error('Error detecting location:', error);
    }
  };

  // Handle state selection
  const handleStateChange = (state: string) => {
    setUserState(state);
    localStorage.setItem('cpsUserState', state);
    toast.success(`State set to ${state}. Information customized for your jurisdiction.`);
  };

  // Load from localStorage
  const loadLocalData = () => {
    try {
      const saved = localStorage.getItem('cpsDefenseData');
      if (saved) {
        const data = JSON.parse(saved);
        setDocuments(data.documents || []);
        setTimelineEvents(data.timelineEvents || []);
        setCaseDetails(data.caseDetails || {
          caseNumber: "",
          county: "",
          dateOpened: "",
          caseworker: "",
          attorney: "",
        });
        // Set violations with proper defaults
        if (data.violations) {
          setViolations(data.violations);
        }
        
        // Load cases
        if (data.cases && data.cases.length > 0) {
          setCases(data.cases);
          if (data.activeCaseId) {
            const active = data.cases.find((c: CaseData) => c.id === data.activeCaseId);
            if (active) {
              setActiveCase(active);
            }
          }
        }
      }
      
      // Load saved state
      const savedState = localStorage.getItem('cpsUserState');
      if (savedState) {
        setUserState(savedState);
      }
    } catch (error) {
      console.error('Error loading local data:', error);
    }
  };

  // Save to localStorage
  const saveLocalData = () => {
    try {
      const data = {
        documents,
        timelineEvents,
        caseDetails,
        violations,
        cases,
        activeCaseId: activeCase?.id || null,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem('cpsDefenseData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving local data:', error);
    }
  };

  // Auto-save to localStorage
  useEffect(() => {
    saveLocalData();
  }, [documents, timelineEvents, caseDetails, violations, cases, activeCase]);

  // Sync from cloud
  const syncFromCloud = async (accessToken: string) => {
    try {
      const response = await api.loadData(accessToken);
      
      if (response.data && response.data.documents && response.data.documents.length > 0) {
        setDocuments(response.data.documents || []);
        setTimelineEvents(response.data.timelineEvents || []);
        setCaseDetails(response.data.caseDetails || caseDetails);
        setViolations(response.data.violations || violations);
        
        // Load cases from cloud
        if (response.data.cases && response.data.cases.length > 0) {
          setCases(response.data.cases);
          if (response.data.activeCaseId) {
            const active = response.data.cases.find((c: CaseData) => c.id === response.data.activeCaseId);
            if (active) {
              setActiveCase(active);
            }
          }
        }
        
        toast.success('Cloud data synced successfully!');
      }
    } catch (error: any) {
      console.error('Error syncing from cloud:', error);
      toast.error('Using local storage mode');
      setUseLocalStorage(true);
    }
  };

  // Save to cloud (if authenticated)
  useEffect(() => {
    if (!auth.accessToken || useLocalStorage) return;
    
    const saveToCloud = async () => {
      try {
        await api.saveData(auth.accessToken!, {
          documents,
          timelineEvents,
          caseDetails,
          violations,
          cases,
          activeCaseId: activeCase?.id || null,
        });
        console.log('Data auto-saved to cloud at:', new Date().toLocaleTimeString());
      } catch (error: any) {
        console.error('Error saving to cloud:', error);
        // Fall back to local storage only
        setUseLocalStorage(true);
      }
    };

    const timeoutId = setTimeout(saveToCloud, 1000);
    return () => clearTimeout(timeoutId);
  }, [documents, timelineEvents, caseDetails, violations, cases, activeCase, auth.accessToken, useLocalStorage]);

  const handleAuthSuccess = (accessToken: string, userId: string) => {
    const authData = { accessToken, userId };
    setAuth(authData);
    localStorage.setItem('cpsAuth', JSON.stringify(authData));
    setUseLocalStorage(false);
    
    // Upload current local data to cloud
    api.saveData(accessToken, {
      documents,
      timelineEvents,
      caseDetails,
      violations,
      cases,
      activeCaseId: activeCase?.id || null,
    }).then(() => {
      toast.success('Your local data has been backed up to the cloud!');
    }).catch((error) => {
      console.error('Error uploading to cloud:', error);
      toast.error('Continuing in local storage mode');
      setUseLocalStorage(true);
    });
  };

  const handleLogout = () => {
    setAuth({ accessToken: null, userId: null });
    localStorage.removeItem('cpsAuth');
    setUseLocalStorage(true);
    toast.success('Logged out - continuing in local storage mode');
  };

  const addDocument = (doc: Omit<Document, "id">) => {
    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const addTimelineEvent = (event: Omit<TimelineEvent, "id">) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setTimelineEvents((prev) => [...prev, newEvent]);
  };

  const removeTimelineEvent = (id: string) => {
    setTimelineEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const editTimelineEvent = (id: string, updatedEvent: Omit<TimelineEvent, "id">) => {
    setTimelineEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...updatedEvent, id } : event
      )
    );
  };

  const updateViolation = (field: string, value: boolean) => {
    setViolations((prev) => ({ ...prev, [field]: value }));
  };

  const handleViolationsDetected = (detectedViolations: string[]) => {
    if (detectedViolations.length > 0) {
      const updates: any = {};
      let newViolationsFound = false;
      
      detectedViolations.forEach((violation) => {
        if (violations[violation as keyof typeof violations] === false) {
          updates[violation] = true;
          newViolationsFound = true;
        }
      });

      if (newViolationsFound) {
        setViolations(prev => ({ ...prev, ...updates }));
        toast.success(`Document analyzed! ${detectedViolations.length} violation(s) identified and automatically added.`);
      }
    }
  };

  const handleTimelineEventsDetected = (events: Array<{ date: string; title: string; description: string }>) => {
    if (events.length > 0) {
      events.forEach((event) => {
        const newEvent: TimelineEvent = {
          ...event,
          id: Date.now().toString() + Math.random(),
        };
        setTimelineEvents((prev) => [...prev, newEvent]);
      });
      toast.success(`${events.length} timeline event(s) extracted from document.`);
    }
  };

  const handleCaseInfoDetected = (info: { caseNumber?: string; dates?: string[]; names?: string[]; locations?: string[] }) => {
    const updates: any = {};
    
    if (info.caseNumber && !caseDetails.caseNumber) {
      updates.caseNumber = info.caseNumber;
    }
    
    if (info.locations && info.locations.length > 0 && !caseDetails.county) {
      const countyMatch = info.locations.find(loc => loc.includes('County'));
      if (countyMatch) {
        updates.county = countyMatch;
      }
    }
    
    if (info.names && info.names.length > 0) {
      if (!caseDetails.caseworker) {
        updates.caseworker = info.names[0];
      }
    }
    
    if (Object.keys(updates).length > 0) {
      setCaseDetails(prev => ({ ...prev, ...updates }));
      toast.success('Case information extracted and saved!');
    }
  };

  // Handle landing page "Get Started" click
  const handleGetStarted = (selectedUserType: 'parent' | 'attorney') => {
    setUserType(selectedUserType);
    setShowLandingPage(false);
    localStorage.setItem('cpsHasSeenLanding', 'true');
    trackCPSEvent.userAction('landing_page_get_started', 'clicked');
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (caseData: CaseData, uploadedDocs?: File[]) => {
    // Save the case
    const newCases = [...cases, caseData];
    setCases(newCases);
    setActiveCase(caseData);
    localStorage.setItem('cpsCases', JSON.stringify(newCases));
    
    // If documents were uploaded, add them to the documents state
    if (uploadedDocs && uploadedDocs.length > 0) {
      const newDocuments = uploadedDocs.map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        title: file.name,
        content: '', // Will be populated when file is read
        date: new Date().toISOString().split('T')[0],
        type: file.type || 'application/pdf'
      }));
      setDocuments(prev => [...prev, ...newDocuments]);
    }
    
    // Mark onboarding as complete
    setShowOnboarding(false);
    localStorage.setItem('cpsHasCompletedOnboarding', 'true');
    
    // Show success message
    toast.success(`Welcome! Your case "${caseData.caseName}" has been created.`);
    trackCPSEvent.userAction('onboarding_completed', 'success');
  };

  // Case Management Functions
  const handleCreateCase = () => {
    setCaseToEdit(undefined);
    setCaseManagerMode('create');
    setShowCaseManager(true);
  };

  const handleEditCase = (caseData: CaseData) => {
    setCaseToEdit(caseData);
    setCaseManagerMode('edit');
    setShowCaseManager(true);
  };

  const handleSaveCase = (caseData: CaseData) => {
    if (caseManagerMode === 'create') {
      setCases(prev => [...prev, caseData]);
      setActiveCase(caseData);
      toast.success(`Case "${caseData.caseName}" created successfully!`);
    } else {
      setCases(prev => prev.map(c => c.id === caseData.id ? caseData : c));
      if (activeCase?.id === caseData.id) {
        setActiveCase(caseData);
      }
      toast.success(`Case "${caseData.caseName}" updated successfully!`);
    }
  };

  const handleDeleteCase = (caseId: string) => {
    const caseToDelete = cases.find(c => c.id === caseId);
    setCases(prev => prev.filter(c => c.id !== caseId));
    
    // If deleting active case, switch to first available case or null
    if (activeCase?.id === caseId) {
      const remainingCases = cases.filter(c => c.id !== caseId);
      setActiveCase(remainingCases.length > 0 ? remainingCases[0] : null);
    }
    
    toast.success(`Case "${caseToDelete?.caseName}" deleted successfully.`);
  };

  const handleSelectCase = (caseId: string) => {
    const selectedCase = cases.find(c => c.id === caseId);
    if (selectedCase) {
      setActiveCase(selectedCase);
      toast.success(`Switched to case: ${selectedCase.caseName}`);
    }
  };

  // Show landing page first (if user hasn't seen it)
  if (showLandingPage) {
    return <LandingPageRouter onGetStarted={handleGetStarted} />;
  }

  // Show onboarding flow after landing page (if not completed)
  if (showOnboarding && !showLandingPage) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        userType={userType}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your case data...</p>
        </div>
      </div>
    );
  }

  // Show authentication screen if not authenticated
  if (!auth.accessToken) {
    return (
      <SubscriptionProvider>
        <AuthForm onAuth={(userId, accessToken, tier) => {
          setAuth({ userId, accessToken });
          
          // If tier was selected, it will be passed from AuthForm
          // Store it in localStorage so SubscriptionProvider can pick it up
          if (tier) {
            localStorage.setItem('cps_user_tier', tier);
          }
          
          toast.success('Welcome to The CPS Punisher!');
        }} />
      </SubscriptionProvider>
    );
  }

  const violationCount = Object.values(violations).filter(Boolean).length;

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <SubscriptionProvider>
          <LegalDisclaimer onAccept={(userType) => {
            console.log('User accepted disclaimer as:', userType);
            // You could save userType to state if needed
          }} />
          <SkipToContent />
          {/* StickyDisclaimerBanner was removed */}
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900" lang="en">
          <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm" role="banner">
            <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <CPSPunisherLogo size="header" showText={true} variant="image" />
                <div className="flex items-center gap-1.5 sm:gap-3">
                  {/* Case Selector in Header */}
                  {cases.length > 0 && activeCase && (
                    <div className="hidden lg:block max-w-xs">
                      <Select
                        value={activeCase?.id || ''}
                        onValueChange={handleSelectCase}
                      >
                        <SelectTrigger className="h-9 text-sm border-gray-300 dark:border-gray-600">
                          <SelectValue>
                            <span className="font-medium text-sm truncate">{activeCase.caseName}</span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {cases.map((caseItem) => (
                            <SelectItem key={caseItem.id} value={caseItem.id}>
                              <div className="flex flex-col">
                                <div className="font-semibold text-sm">{caseItem.caseName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {caseItem.docketNumber} • {caseItem.county}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {violationCount > 0 && (
                    <div className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 px-3 py-1.5 rounded-lg border-2 border-red-200 dark:border-red-800 shadow-sm">
                      <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-red-700 dark:text-red-300">{violationCount}</span>
                        <span className="text-red-600 dark:text-red-400 ml-1">Violations</span>
                      </div>
                    </div>
                  )}
                  {/* Special Access Code Button */}
                  <SpecialAccessDialog />
                  {/* Theme Toggle Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleDarkMode}
                    className="h-9 w-9 p-0 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDarkMode ? (
                      <Sun className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-gray-700" />
                    )}
                  </Button>
                  <HelpCenter />
                  <div className="flex items-center gap-1.5 text-xs bg-white dark:bg-gray-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    {!useLocalStorage && auth.accessToken ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                        <span className="hidden md:inline font-medium text-gray-700 dark:text-gray-300">Cloud</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                        <span className="hidden md:inline font-medium text-gray-700 dark:text-gray-300">Local</span>
                      </>
                    )}
                  </div>
                  {auth.accessToken && (
                    <Button variant="outline" size="sm" onClick={handleLogout} className="h-8 sm:h-10 px-2 sm:px-4 border-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                      <span className="text-xs sm:text-sm hidden sm:inline">Logout</span>
                    </Button>
                  )}
                  {!auth.accessToken && (
                    <Button variant="default" size="sm" onClick={() => {
                      // This will never show since we redirect to AuthForm when not authenticated
                      // But keeping for consistency
                      setAuth({ accessToken: null, userId: null });
                    }} className="h-8 px-3">
                      <span className="text-xs font-semibold">Sign In</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main id="main-content" className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl" role="main">
            <Alert className="mb-4 sm:mb-6 border-l-4 border-l-red-600 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 shadow-sm w-full" role="alert" aria-live="polite">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <AlertTitle className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-1 text-justify">⚖️ Educational Tool - Not Legal Advice</AlertTitle>
                  <AlertDescription className="text-xs text-gray-700 dark:text-gray-300 text-justify">
                    <strong>Important:</strong> This tool helps you identify potential issues in your CPS case for educational purposes only. 
                    <strong> This does not constitute legal advice.</strong> Always consult with a qualified family law attorney licensed in your state
                    for legal advice specific to your situation. Laws vary by jurisdiction and individual circumstances. 
                    {useLocalStorage && " Currently using local storage - sign in for cloud backup."}
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            {/* Location/State Selector */}
            <Card className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary shadow-lg"
  role="region"
  aria-label="State Selection">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" aria-hidden="true">
               <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
</div>

<div className="flex-1 min-w-0 w-full">
  <h2 className="mb-2 text-base sm:text-lg font-bold text-primary">
    Set Your State for Customized Legal Information
  </h2>

  <p className="text-xs sm:text-sm text-primary mb-3 sm:mb-4 leading-relaxed">
    <strong>Important:</strong> CPS laws and procedures vary significantly by state. Select your state to receive jurisdiction-specific guidance, case law, and defense strategies.
    This ensures the information you receive is relevant to your legal jurisdiction.
    {detectedLocation && !userState && ` We detected you may be in ${detectedLocation}.`}
  </p>
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
    <label htmlFor="state-selector" className="sr-only">Select your state</label>
    <Select value={userState} onValueChange={handleStateChange}>
      <SelectTrigger className="w-full sm:w-72 bg-white dark:bg-gray-900 border-2 border-primary h-10 sm:h-11 shadow-sm">
                        <SelectValue placeholder="Select your state..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alabama">Alabama</SelectItem>
                        <SelectItem value="Alaska">Alaska</SelectItem>
                        <SelectItem value="Arizona">Arizona</SelectItem>
                        <SelectItem value="Arkansas">Arkansas</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="Colorado">Colorado</SelectItem>
                        <SelectItem value="Connecticut">Connecticut</SelectItem>
                        <SelectItem value="Delaware">Delaware</SelectItem>
                        <SelectItem value="Florida">Florida</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Hawaii">Hawaii</SelectItem>
                        <SelectItem value="Idaho">Idaho</SelectItem>
                        <SelectItem value="Illinois">Illinois</SelectItem>
                        <SelectItem value="Indiana">Indiana</SelectItem>
                        <SelectItem value="Iowa">Iowa</SelectItem>
                        <SelectItem value="Kansas">Kansas</SelectItem>
                        <SelectItem value="Kentucky">Kentucky</SelectItem>
                        <SelectItem value="Louisiana">Louisiana</SelectItem>
                        <SelectItem value="Maine">Maine</SelectItem>
                        <SelectItem value="Maryland">Maryland</SelectItem>
                        <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                        <SelectItem value="Michigan">Michigan</SelectItem>
                        <SelectItem value="Minnesota">Minnesota</SelectItem>
                        <SelectItem value="Mississippi">Mississippi</SelectItem>
                        <SelectItem value="Missouri">Missouri</SelectItem>
                        <SelectItem value="Montana">Montana</SelectItem>
                        <SelectItem value="Nebraska">Nebraska</SelectItem>
                        <SelectItem value="Nevada">Nevada</SelectItem>
                        <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                        <SelectItem value="New Jersey">New Jersey</SelectItem>
                        <SelectItem value="New Mexico">New Mexico</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="North Carolina">North Carolina</SelectItem>
                        <SelectItem value="North Dakota">North Dakota</SelectItem>
                        <SelectItem value="Ohio">Ohio</SelectItem>
                        <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                        <SelectItem value="Oregon">Oregon</SelectItem>
                        <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                        <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                        <SelectItem value="South Carolina">South Carolina</SelectItem>
                        <SelectItem value="South Dakota">South Dakota</SelectItem>
                        <SelectItem value="Tennessee">Tennessee</SelectItem>
                        <SelectItem value="Texas">Texas</SelectItem>
                        <SelectItem value="Utah">Utah</SelectItem>
                        <SelectItem value="Vermont">Vermont</SelectItem>
                        <SelectItem value="Virginia">Virginia</SelectItem>
                        <SelectItem value="Washington">Washington</SelectItem>
                        <SelectItem value="West Virginia">West Virginia</SelectItem>
                        <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                        <SelectItem value="Wyoming">Wyoming</SelectItem>
                      </SelectContent>
                    </Select>
                    {userState && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{userState} selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Case Selector */}
            <CardclassName="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary shadow-lg"
  role="region"
  aria-label="Case Selection">
              <CaseSelector
                cases={cases}
                activeCase={activeCase}
                onSelectCase={handleSelectCase}
                onCreateCase={handleCreateCase}
                onEditCase={handleEditCase}
                onDeleteCase={handleDeleteCase}
              />
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-2 sm:p-3 mb-4 sm:mb-6 overflow-x-auto">
              <TabsList className="inline-flex lg:grid lg:grid-cols-8 xl:grid-cols-15 gap-1.5 sm:gap-2 bg-transparent p-0 h-auto min-w-max lg:min-w-0 lg:w-full">
                <TabsTrigger 
                  value="mycases" 
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all whitespace-nowrap"
                  aria-label="My Cases"
                >
                  <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">My Cases</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all whitespace-nowrap"
                  aria-label="Overview Dashboard"
                >
                  <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all whitespace-nowrap"
                  aria-label="Case Documents"
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">Documents</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="casebinder" 
                  className="modern-tab"
                  aria-label="Virtual Case Binder - Premium Feature"
                >
                  <FileText className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Binder</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline" 
                  className="modern-tab"
                  aria-label="Case Timeline"
                >
                  <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Timeline</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="violations" 
                  className="modern-tab"
                  aria-label={`Violation Checker${violationCount > 0 ? ` - ${violationCount} violations found` : ''}`}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Violations</span>
                  {violationCount > 0 && (
                    <span 
                      className="ml-1 px-1.5 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full font-semibold"
                      aria-label={`${violationCount} violations`}
                    >
                      {violationCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="incidents" 
                  className="modern-tab"
                  aria-label="Incident Analyzer - Analyze specific rights violations"
                >
                  <Gavel className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Incidents</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="criminal" 
                  className="modern-tab"
                  aria-label="Criminal Case Component - Manage related criminal charges"
                >
                  <Gavel className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Criminal</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="report" 
                  className="modern-tab"
                  aria-label="Violation Report - Premium Feature"
                >
                  <FileCheck className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Report</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="defense" 
                  className="modern-tab"
                  aria-label="Defense Strategy Generator"
                >
                  <Lightbulb className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Defense</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="podcast" 
                  className="modern-tab"
                  aria-label="Case Analysis Podcast"
                >
                  <Mic className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Podcast</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="generator" 
                  className="modern-tab"
                  aria-label="Document Generator"
                >
                  <FileEdit className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Generator</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="doc-reviewer" 
                  className="modern-tab"
                  aria-label="Document Review & Analyzer - Attorney Tool"
                >
                  <Gavel className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Doc Review</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="federal-lawsuit" 
                  className="modern-tab"
                  aria-label="Federal Civil Rights Lawsuit - Section 1983"
                >
                  <Scale className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>§1983 Lawsuit</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="rights" 
                  className="modern-tab"
                  aria-label="Rights Guide"
                >
                  <Shield className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Rights</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="modern-tab"
                  aria-label="CPS Education - Understanding Violations"
                >
                  <Book className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Education</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="evidence" 
                  className="modern-tab"
                  aria-label="Evidence Checklist"
                >
                  <CheckSquare className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Evidence</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="visitation" 
                  className="modern-tab"
                  aria-label="Visitation Log - Document Every Visit"
                >
                  <Heart className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Visitation</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="modern-tab"
                  aria-label="Service Tracker - Track Case Plan Compliance"
                >
                  <Target className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Services</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="communications" 
                  className="modern-tab"
                  aria-label="Communication Log - Track All CPS Communications"
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Communications</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="court-countdown" 
                  className="modern-tab"
                  aria-label="Court Countdown - Never Miss a Hearing"
                >
                  <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Court Countdown</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="quickrights" 
                  className="modern-tab"
                  aria-label="Quick Rights Checker"
                >
                  <Shield className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Quick Rights</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="legal-qa" 
                  className="modern-tab"
                  aria-label="Legal Q&A - AI Research Assistant"
                >
                  <Search className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Legal Q&A</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="legal-resources" 
                  className="modern-tab"
                  aria-label="Legal Resources Library - Bench Books, Maxims, Constitution"
                >
                  <BookOpen className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Resources</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="mississippi-resources" 
                  className="modern-tab"
                  aria-label="Mississippi Legal Resources - State-Specific CPS Info"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>MS Resources</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="mississippi-courts" 
                  className="modern-tab"
                  aria-label="Mississippi Courts Directory - All Court Locations"
                >
                  <Scale className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>MS Courts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="federal-resources" 
                  className="modern-tab"
                  aria-label="Federal CPS Resources - DOJ, Federal Courts, National Info"
                >
                  <Flag className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Federal</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="legal-research" 
                  className="modern-tab"
                  aria-label="Legal Research Hub - Access 40+ Million Cases"
                >
                  <Database className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Research</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="ai-assistant" 
                  className="modern-tab"
                  aria-label="AI Legal Assistant - Ask Questions"
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>AI Assistant</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="policy" 
                  className="modern-tab"
                  aria-label="CPS Policy Engine - State-Specific Regulations"
                >
                  <Book className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Policy</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="alerts" 
                  className="modern-tab"
                  aria-label="Legal Alerts - Premium Feature"
                >
                  <BellRing className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Alerts</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="forum" 
                  className="modern-tab"
                  aria-label="Community Forum"
                >
                  <Users className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Forum</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="attorney" 
                  className="modern-tab"
                  aria-label="Attorney Dashboard - Premium Feature"
                >
                  <Scale className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Attorney</span>
                  <Crown className="w-3 h-3 text-amber-500 ml-1" aria-label="Premium feature" />
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="modern-tab"
                  aria-label="Settings and Configuration"
                >
                  <SettingsIcon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>
              </div>

              <TabsContent value="mycases">
                <MyCases
                  cases={cases}
                  activeCase={activeCase}
                  onSelectCase={handleSelectCase}
                  onEditCase={handleEditCase}
                  onDeleteCase={handleDeleteCase}
                  onCreateCase={handleCreateCase}
                />
              </TabsContent>

              <TabsContent value="overview">
                <DashboardOverview
                  documentCount={documents.length}
                  timelineEventCount={timelineEvents.length}
                  violationCount={violationCount}
                  caseDetails={caseDetails}
                  onNavigate={setActiveTab}
                />
              </TabsContent>

              <WelcomeTour onComplete={() => {
                toast.success('Welcome! Start by uploading a document or exploring your rights.');
              }} />

              <TabsContent value="settings">
                <Settings />
              </TabsContent>

              <TabsContent value="attorney">
                <AttorneyDashboard 
                  caseDetails={caseDetails}
                  violations={violations}
                  documents={documents}
                  timelineEvents={timelineEvents}
                />
              </TabsContent>

              <TabsContent value="policy">
                {!userState && (
                  <ActionWarning
                    {...CommonWarnings.selectState}
                    onAction={() => {
                      toast.info('Select your state from the dropdown above to access state-specific CPS policies');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mb-4"
                  />
                )}
                <CPSPolicyEngine 
                  userState={userState}
                  violations={violations}
                  onViolationFound={(violation, reference) => {
                    toast.info(`Violation reference added: ${reference}`);
                  }}
                />
              </TabsContent>

              <TabsContent value="quickrights">
                <QuickRightsChecker />
              </TabsContent>

              <TabsContent value="legal-qa">
                <LegalQA userState={userState} />
              </TabsContent>

              <TabsContent value="legal-resources">
                <LegalResourcesLibrary />
              </TabsContent>

              <TabsContent value="mississippi-resources">
                <MississippiLegalResources />
              </TabsContent>

              <TabsContent value="mississippi-courts">
                <MississippiCourtsDirectory />
              </TabsContent>

              <TabsContent value="federal-resources">
                <FederalCPSResources />
              </TabsContent>

              <TabsContent value="legal-research">
                <PremiumUpgrade 
                  featureName="Legal Research Hub"
                  featureDescription="Access 40+ million court cases, federal regulations, congressional bills, and state legislation. Search Fourth Amendment violations, due process cases, ASFA requirements, and more. Includes CourtListener, Caselaw Access Project, Regulations.gov, Congress.gov, GovInfo, LegiScan, and OpenLaws APIs. Professional legal research tools at your fingertips."
                  requiredTier="professional"
                >
                  <LegalResearchHub />
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="ai-assistant">
                <PremiumUpgrade 
                  featureName="AI Legal Assistant"
                  featureDescription="Get instant answers to your case questions with our advanced AI assistant. Ask about violations, motions, discovery strategies, appeals, and more. Includes unlimited questions with detailed, case-specific legal guidance."
                  requiredTier="premium"
                >
                  <AILegalAssistant 
                    caseDetails={caseDetails}
                    violations={violations}
                    documents={documents}
                    timelineEvents={timelineEvents}
                  />
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="research-pro">
                <PremiumUpgrade 
                  featureName="Legal Research Pro"
                  featureDescription="Westlaw-grade AI legal research platform with natural language search, brief analyzer, Shepardizing, and AI-powered case analysis. Search millions of cases, analyze your briefs for weaknesses, get missing authority suggestions, and validate citations—all with advanced AI comparable to Westlaw Edge and Casetext."
                  requiredTier="premium"
                >
                  <LegalResearchPro 
                    documents={documents}
                    violations={violations}
                  />
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="alerts">
                <PremiumUpgrade 
                  featureName="Legal Alerts"
                  featureDescription="Get real-time notifications about new case law, legal developments, and specific cases relevant to your CPS defense. Set up custom search alerts and track active dockets with email or webhook notifications powered by CourtListener."
                  requiredTier="premium"
                >
                  <LegalAlerts 
                    violations={violations}
                    caseDetails={caseDetails}
                  />
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="forum">
                <CommunityHub userState={userState} />
              </TabsContent>

              <TabsContent value="documents">
                <QuickTipsBar section="documents" />
                {!activeCase && (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                    className="mb-4"
                  />
                )}
                <CaseDocuments
                  documents={documents}
                  onAddDocument={addDocument}
                  onRemoveDocument={removeDocument}
                  onViolationsDetected={handleViolationsDetected}
                  onTimelineEventsDetected={handleTimelineEventsDetected}
                  onCaseInfoDetected={handleCaseInfoDetected}
                />
              </TabsContent>

              <TabsContent value="casebinder">
                {!activeCase && (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                    className="mb-4"
                  />
                )}
                {activeCase && documents.length === 0 && (
                  <ActionWarning
                    {...CommonWarnings.noDocuments}
                    onAction={() => setActiveTab('documents')}
                    className="mb-4"
                  />
                )}
                <VirtualCaseBinder
                  documents={documents}
                  timelineEvents={timelineEvents}
                  caseDetails={caseDetails}
                  violations={violations}
                />
              </TabsContent>

              <TabsContent value="timeline">
                <QuickTipsBar section="timeline" />
                {!activeCase && (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                    className="mb-4"
                  />
                )}
                <Card className="p-6">
                  <CaseTimeline events={timelineEvents} onAddEvent={addTimelineEvent} onDeleteEvent={removeTimelineEvent} onEditEvent={editTimelineEvent} />
                </Card>
              </TabsContent>

              <TabsContent value="violations">
                <QuickTipsBar section="violations" />
                {!activeCase && (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                    className="mb-4"
                  />
                )}
                {activeCase && !userState && (
                  <ActionWarning
                    {...CommonWarnings.selectState}
                    onAction={() => {
                      toast.info('Select your state from the dropdown above');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mb-4"
                  />
                )}
                {activeCase && documents.length === 0 && timelineEvents.length === 0 && (
                  <ActionWarning
                    {...CommonWarnings.noViolations}
                    onAction={() => setActiveTab('documents')}
                    className="mb-4"
                  />
                )}
                <ViolationChecker violations={violations} onUpdate={updateViolation} />
              </TabsContent>

              <TabsContent value="incidents">
                <Card className="p-6">
                  <IncidentAnalyzer 
                    onAddToTimeline={addTimelineEvent}
                    onNavigateToDocuments={() => setActiveTab('documents')}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="criminal">
                {!activeCase && (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                    className="mb-4"
                  />
                )}
                <CriminalCaseComponent
                  criminalCase={activeCase?.criminalCase || {
                    hasCharges: false,
                    caseNumber: '',
                    court: '',
                    prosecutor: '',
                    defenseAttorney: '',
                    nextCourtDate: '',
                    charges: [],
                    bondStatus: '',
                    bondAmount: '',
                    relationToCPS: '',
                    parallelInvestigation: false,
                    sharedEvidence: '',
                    strategicConsiderations: ''
                  }}
                  onUpdate={(criminalCase) => {
                    if (activeCase) {
                      const updatedCase = { ...activeCase, criminalCase };
                      // Update in cases array
                      setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
                      // Update activeCase
                      setActiveCase(updatedCase);
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="report">
                {!activeCase && (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                    className="mb-4"
                  />
                )}
                {activeCase && violationCount === 0 && (
                  <ActionWarning
                    title="No Violations to Report"
                    message="Upload documents or add timeline events to scan for violations. The AI will analyze your case and generate a comprehensive violation report with legal citations."
                    actionLabel="Scan for Violations"
                    onAction={() => setActiveTab('violations')}
                    variant="info"
                    className="mb-4"
                  />
                )}
                <ViolationReport
                  violations={violations}
                  documents={documents}
                  timelineEvents={timelineEvents}
                  caseDetails={caseDetails}
                />
              </TabsContent>

              <TabsContent value="defense">
                <QuickTipsBar section="defense" />
                {!activeCase && (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                    className="mb-4"
                  />
                )}
                {activeCase && violationCount === 0 && (
                  <ActionWarning
                    title="No Violations to Strategize"
                    message="Add documents or timeline events first. AI will scan for violations and generate defense strategies based on your specific case circumstances."
                    actionLabel="Check for Violations"
                    onAction={() => setActiveTab('violations')}
                    variant="info"
                    className="mb-4"
                  />
                )}
                <DefenseStrategy violations={violations} caseDetails={caseDetails} />
              </TabsContent>

              <TabsContent value="podcast">
                {!activeCase && (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                    className="mb-4"
                  />
                )}
                {activeCase && documents.length === 0 && violationCount === 0 && (
                  <ActionWarning
                    title="Add Case Data First"
                    message="Upload documents or add violations to generate a comprehensive podcast. The AI needs case information to create meaningful legal discussions."
                    actionLabel="Upload Documents"
                    onAction={() => setActiveTab('documents')}
                    variant="info"
                    className="mb-4"
                  />
                )}
                <CasePodcast
                  documents={documents}
                  violations={violations}
                  timelineEvents={timelineEvents}
                  caseDetails={caseDetails}
                />
              </TabsContent>

              <TabsContent value="generator">
                {!activeCase && (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                    className="mb-4"
                  />
                )}
                {activeCase && !userState && (
                  <ActionWarning
                    {...CommonWarnings.selectState}
                    onAction={() => {
                      toast.info('Select your state from the dropdown above to generate state-specific documents');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mb-4"
                  />
                )}
                <DocumentGeneratorEnhanced
                  violations={violations}
                  documents={documents}
                  timelineEvents={timelineEvents}
                  caseDetails={caseDetails}
                  userState={userState}
                />
              </TabsContent>

              <TabsContent value="notarization">
                <NotarizationService />
              </TabsContent>

              <TabsContent value="doc-reviewer">
                <PremiumUpgrade 
                  featureName="Document Review & Analyzer"
                  featureDescription="Professional AI-powered legal document critique tool that acts as your senior attorney reviewer. Upload any court document (motion, brief, pleading) for comprehensive analysis including error detection, argument strength scoring, fact verification, legal writing quality assessment, and strategic strengthening suggestions. Identifies weak arguments, false information, missing legal authorities, and provides specific case law recommendations. Includes professional grading (A-F), exportable PDF reports, and unlimited document analyses."
                  requiredTier="premium"
                >
                  <DocumentReviewAnalyzer />
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="federal-lawsuit">
                <PremiumUpgrade 
                  featureName="Federal Civil Rights Lawsuit Generator"
                  featureDescription="Generate Section 1983 civil rights lawsuits, Notices of Liability Under Color of Law, Notice of Removal to Federal Court, and federal constitutional hearing documents. Sue CPS workers personally for constitutional violations. Includes templates for federal complaints, injunctions, removal to federal court for constitutional issues, and comprehensive briefs with case law citations. This is serious federal litigation that holds government officials personally liable."
                  requiredTier="attorney"
                >
                  <FederalCivilRights 
                    parentInfo={{
                      fullName: caseDetails.attorney || "",
                      address: "",
                      city: "",
                      state: userState,
                      zip: "",
                      phone: "",
                      email: "",
                      childrenNames: ""
                    }}
                    caseDetails={caseDetails}
                    violations={violations}
                  />
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="rights">
                <QuickTipsBar section="rights" />
                <RightsGuide />
              </TabsContent>

              <TabsContent value="education">
                <CPSEducation />
              </TabsContent>

              <TabsContent value="evidence">
                <QuickTipsBar section="evidence" />
                <EvidenceChecklist />
              </TabsContent>

              <TabsContent value="visitation">
                <PremiumUpgrade 
                  featureName="Visitation Log"
                  featureDescription="Document every visit with your children. Track visit dates, duration, child's emotional state, what happened, supervisor issues, and more. Export professional visit logs for court to prove your ongoing parent-child bond and consistent visitation."
                  requiredTier="professional"
                >
                  {activeCase ? (
                    <VisitationLog caseId={activeCase.id} />
                  ) : (
                    <ActionWarning
                      {...CommonWarnings.noCase}
                      onAction={handleCreateCase}
                    />
                  )}
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="services">
                <PremiumUpgrade 
                  featureName="Service Completion Tracker"
                  featureDescription="Track all court-ordered services and case plan requirements. Monitor completion status, upload certificates, document barriers, and generate compliance reports for court. Show the judge you're doing everything required!"
                  requiredTier="essential"
                >
                  {activeCase ? (
                    <ServiceTracker caseId={activeCase.id} />
                  ) : (
                    <ActionWarning
                      {...CommonWarnings.noCase}
                      onAction={handleCreateCase}
                    />
                  )}
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="communications">
                <PremiumUpgrade 
                  featureName="Communication Log"
                  featureDescription="Track ALL communications with CPS workers, attorneys, service providers, and case stakeholders. Document threats, coercion, lies, and violations. Record exact quotes for evidence. Export comprehensive communication logs for discovery and court."
                  requiredTier="essential"
                >
                  {activeCase ? (
                    <CommunicationLog caseId={activeCase.id} />
                  ) : (
                    <ActionWarning
                      {...CommonWarnings.noCase}
                      onAction={handleCreateCase}
                    />
                  )}
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="court-countdown">
                {activeCase ? (
                  <CourtCountdown caseId={activeCase.id} />
                ) : (
                  <ActionWarning
                    {...CommonWarnings.noCase}
                    onAction={handleCreateCase}
                  />
                )}
              </TabsContent>

              <TabsContent value="bulk-data">
                <BulkDataManager accessToken={auth.accessToken || 'dev_token'} />
              </TabsContent>

              <TabsContent value="citations">
                <PremiumUpgrade 
                  featureName="Citation Network Analysis"
                  featureDescription="Explore the web of legal precedent with interactive citation network analysis powered by CourtListener. Discover which cases cite your key authorities, trace legal reasoning through time, and identify the most influential precedents for your defense strategy."
                  requiredTier="premium"
                >
                  <CitationNetwork 
                    violations={violations}
                    caseDetails={caseDetails}
                  />
                </PremiumUpgrade>
              </TabsContent>

              <TabsContent value="semantic">
                <SemanticSearchEngine accessToken={auth.accessToken || 'dev_token'} />
              </TabsContent>

              <TabsContent value="analytics">
                <AdvancedAnalytics 
                  accessToken={auth.accessToken || 'dev_token'} 
                  userState={userState}
                />
              </TabsContent>

              <TabsContent value="offline">
                <OfflineMode accessToken={auth.accessToken || 'dev_token'} />
              </TabsContent>
            </Tabs>
          </main>

          <FooterDisclaimer />
          <Toaster />
          
          {/* Help Bot */}
          <HelpBot />
          
          {/* Case Manager Dialog */}
          <CaseManager
            isOpen={showCaseManager}
            onClose={() => setShowCaseManager(false)}
            onSave={handleSaveCase}
            existingCase={caseToEdit}
            mode={caseManagerMode}
          />
        </div>
      </SubscriptionProvider>
    </AccessibilityProvider>
    </ErrorBoundary>
  );
}