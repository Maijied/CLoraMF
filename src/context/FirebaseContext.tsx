import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle as authSignInWithGoogle, 
  logOut as authLogOut, 
  testFirestoreConnection 
} from '../firebase';
import {
  syncUserProfile,
  saveDeviceConfig,
  subscribeDeviceConfig,
  recordVitalLog,
  subscribeVitalsHistory,
  saveCustomWatchFaceToCloud,
  subscribeCustomWatchFaces,
  saveSDKProjectToCloud,
  subscribeSDKProjects,
  recordAILogToCloud,
  subscribeAILogs,
  type VitalLogData,
  type StoredSDKProject,
  type AIInteractionData
} from '../services/firestoreService';
import type { WatchStatus, WatchFace } from '../types';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastCloudSyncTime: string | null;
  vitalsHistory: VitalLogData[];
  cloudCustomFaces: any[];
  cloudSDKProjects: StoredSDKProject[];
  cloudAILogs: AIInteractionData[];
  login: () => Promise<void>;
  logout: () => Promise<void>;
  saveDeviceState: (status: WatchStatus, autoSync: boolean) => Promise<void>;
  recordVital: (vital: Omit<VitalLogData, 'userId'>) => Promise<void>;
  saveCustomFace: (face: WatchFace) => Promise<void>;
  saveSDKProject: (project: any) => Promise<void>;
  recordAILog: (prompt: string, response: string, actionType?: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);

  const [vitalsHistory, setVitalsHistory] = useState<VitalLogData[]>([]);
  const [cloudCustomFaces, setCloudCustomFaces] = useState<any[]>([]);
  const [cloudSDKProjects, setCloudSDKProjects] = useState<StoredSDKProject[]>([]);
  const [cloudAILogs, setCloudAILogs] = useState<AIInteractionData[]>([]);

  // Initial connection test
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        try {
          await syncUserProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          });
        } catch (err) {
          console.warn('User profile sync notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Realtime Cloud Subscriptions when user is authenticated
  useEffect(() => {
    if (!user) {
      setVitalsHistory([]);
      setCloudCustomFaces([]);
      setCloudSDKProjects([]);
      setCloudAILogs([]);
      return;
    }

    const unsubVitals = subscribeVitalsHistory(user.uid, (logs) => {
      setVitalsHistory(logs);
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    });

    const unsubFaces = subscribeCustomWatchFaces(user.uid, (faces) => {
      setCloudCustomFaces(faces);
    });

    const unsubProjects = subscribeSDKProjects(user.uid, (projects) => {
      setCloudSDKProjects(projects);
    });

    const unsubAI = subscribeAILogs(user.uid, (logs) => {
      setCloudAILogs(logs);
    });

    return () => {
      unsubVitals();
      unsubFaces();
      unsubProjects();
      unsubAI();
    };
  }, [user]);

  const login = async () => {
    setCloudSyncStatus('syncing');
    try {
      await authSignInWithGoogle();
      setCloudSyncStatus('synced');
    } catch (err) {
      setCloudSyncStatus('error');
      throw err;
    }
  };

  const logout = async () => {
    await authLogOut();
    setCloudSyncStatus('idle');
  };

  const saveDeviceState = async (status: WatchStatus, autoSync: boolean) => {
    if (!user) return;
    setCloudSyncStatus('syncing');
    try {
      await saveDeviceConfig(user.uid, status, autoSync);
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      setCloudSyncStatus('error');
    }
  };

  const recordVital = async (vital: Omit<VitalLogData, 'userId'>) => {
    if (!user) return;
    try {
      await recordVitalLog(user.uid, vital);
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Record vital error:', err);
    }
  };

  const saveCustomFace = async (face: WatchFace) => {
    if (!user) return;
    setCloudSyncStatus('syncing');
    try {
      await saveCustomWatchFaceToCloud(user.uid, face);
      setCloudSyncStatus('synced');
    } catch (err) {
      setCloudSyncStatus('error');
    }
  };

  const saveSDKProject = async (project: any) => {
    if (!user) return;
    setCloudSyncStatus('syncing');
    try {
      await saveSDKProjectToCloud(user.uid, project);
      setCloudSyncStatus('synced');
    } catch (err) {
      setCloudSyncStatus('error');
    }
  };

  const recordAILog = async (prompt: string, response: string, actionType?: string) => {
    if (!user) return;
    try {
      await recordAILogToCloud(user.uid, {
        prompt,
        response,
        actionType,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Record AI log error:', err);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        cloudSyncStatus,
        lastCloudSyncTime,
        vitalsHistory,
        cloudCustomFaces,
        cloudSDKProjects,
        cloudAILogs,
        login,
        logout,
        saveDeviceState,
        recordVital,
        saveCustomFace,
        saveSDKProject,
        recordAILog
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
