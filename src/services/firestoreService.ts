import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  type Unsubscribe
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import type { WatchStatus, WatchFace, CustomAppPackage } from '../types';

export interface UserProfileData {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
  lastActiveAt?: string;
}

export interface VitalLogData {
  userId: string;
  timestamp: number;
  heartRate: number;
  steps: number;
  calories: number;
  distanceKm?: number;
  sleepHours?: number;
}

export interface StoredSDKProject {
  userId: string;
  projectId: string;
  name: string;
  version: string;
  category?: string;
  code: string;
  manifestJson?: string;
  updatedAt?: number;
}

export interface AIInteractionData {
  userId: string;
  prompt: string;
  response: string;
  actionType?: string;
  timestamp: number;
}

/**
 * Upsert User Profile
 */
export async function syncUserProfile(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const payload: Record<string, any> = {
      userId: user.uid,
      email: user.email || 'anonymous@cmf.watch',
      lastActiveAt: new Date().toISOString()
    };
    if (user.displayName) payload.displayName = user.displayName;
    if (user.photoURL) payload.photoURL = user.photoURL;

    await setDoc(userRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save Watch Hardware & Sync Settings to Firestore
 */
export async function saveDeviceConfig(userId: string, status: WatchStatus, autoSyncEnabled: boolean): Promise<void> {
  const path = `users/${userId}/device/main_watch`;
  try {
    const deviceRef = doc(db, 'users', userId, 'device', 'main_watch');
    const payload = {
      userId,
      deviceName: status.deviceName || 'CMF Watch 3 Pro',
      firmwareVersion: status.firmwareVersion || '1.4.2-AI',
      activeFaceId: status.activeFaceId || 'face_cmf_matrix_01',
      autoSyncEnabled,
      battery: status.battery,
      lastSyncTime: status.lastSync || 'Just now',
      updatedAt: new Date().toISOString()
    };
    await setDoc(deviceRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to realtime device config updates
 */
export function subscribeDeviceConfig(
  userId: string, 
  onUpdate: (config: any) => void
): Unsubscribe {
  const path = `users/${userId}/device/main_watch`;
  const deviceRef = doc(db, 'users', userId, 'device', 'main_watch');
  
  return onSnapshot(
    deviceRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data());
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Record a Biometric Vital Telemetry snapshot in Firestore
 */
export async function recordVitalLog(userId: string, vitals: Omit<VitalLogData, 'userId'>): Promise<void> {
  const logId = `vital_${vitals.timestamp}`;
  const path = `users/${userId}/vitals/${logId}`;
  try {
    const vitalRef = doc(db, 'users', userId, 'vitals', logId);
    const payload: VitalLogData = {
      userId,
      timestamp: vitals.timestamp,
      heartRate: vitals.heartRate,
      steps: vitals.steps,
      calories: vitals.calories,
      distanceKm: vitals.distanceKm,
      sleepHours: vitals.sleepHours
    };
    await setDoc(vitalRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Subscribe to recent Vitals history
 */
export function subscribeVitalsHistory(
  userId: string,
  onUpdate: (logs: VitalLogData[]) => void
): Unsubscribe {
  const path = `users/${userId}/vitals`;
  const vitalsColl = collection(db, 'users', userId, 'vitals');
  const q = query(vitalsColl, orderBy('timestamp', 'desc'), limit(30));

  return onSnapshot(
    q,
    (snapshot) => {
      const logs: VitalLogData[] = [];
      snapshot.forEach((docSnap) => {
        logs.push(docSnap.data() as VitalLogData);
      });
      onUpdate(logs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Save / Update a Custom Watch Face in Firestore
 */
export async function saveCustomWatchFaceToCloud(userId: string, face: WatchFace): Promise<void> {
  const path = `users/${userId}/customFaces/${face.id}`;
  try {
    const faceRef = doc(db, 'users', userId, 'customFaces', face.id);
    const payload = {
      userId,
      faceId: face.id,
      name: face.name,
      style: face.style,
      activeThemeId: face.activeThemeId,
      rating: face.rating || 5.0,
      author: face.author || 'You',
      createdAt: Date.now()
    };
    await setDoc(faceRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to Custom Watch Faces in Cloud
 */
export function subscribeCustomWatchFaces(
  userId: string,
  onUpdate: (faces: any[]) => void
): Unsubscribe {
  const path = `users/${userId}/customFaces`;
  const collRef = collection(db, 'users', userId, 'customFaces');

  return onSnapshot(
    collRef,
    (snapshot) => {
      const faces: any[] = [];
      snapshot.forEach((docSnap) => {
        faces.push(docSnap.data());
      });
      onUpdate(faces);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Save an SDK Project in Cloud
 */
export async function saveSDKProjectToCloud(userId: string, project: { id: string; name: string; version: string; code: string; manifest: any; category?: string }): Promise<void> {
  const cleanId = project.id.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  const path = `users/${userId}/sdkProjects/${cleanId}`;
  try {
    const projRef = doc(db, 'users', userId, 'sdkProjects', cleanId);
    const payload: StoredSDKProject = {
      userId,
      projectId: cleanId,
      name: project.name,
      version: project.version,
      category: project.category || 'Utility',
      code: project.code,
      manifestJson: JSON.stringify(project.manifest),
      updatedAt: Date.now()
    };
    await setDoc(projRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to user SDK Projects
 */
export function subscribeSDKProjects(
  userId: string,
  onUpdate: (projects: StoredSDKProject[]) => void
): Unsubscribe {
  const path = `users/${userId}/sdkProjects`;
  const collRef = collection(db, 'users', userId, 'sdkProjects');

  return onSnapshot(
    collRef,
    (snapshot) => {
      const projects: StoredSDKProject[] = [];
      snapshot.forEach((docSnap) => {
        projects.push(docSnap.data() as StoredSDKProject);
      });
      onUpdate(projects);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Log AI Health Query and Response
 */
export async function recordAILogToCloud(userId: string, log: Omit<AIInteractionData, 'userId'>): Promise<void> {
  const logId = `ai_${log.timestamp}`;
  const path = `users/${userId}/aiLogs/${logId}`;
  try {
    const aiRef = doc(db, 'users', userId, 'aiLogs', logId);
    const payload: AIInteractionData = {
      userId,
      prompt: log.prompt,
      response: log.response,
      actionType: log.actionType || 'chat',
      timestamp: log.timestamp
    };
    await setDoc(aiRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Subscribe to AI Interaction Logs
 */
export function subscribeAILogs(
  userId: string,
  onUpdate: (logs: AIInteractionData[]) => void
): Unsubscribe {
  const path = `users/${userId}/aiLogs`;
  const collRef = collection(db, 'users', userId, 'aiLogs');
  const q = query(collRef, orderBy('timestamp', 'desc'), limit(20));

  return onSnapshot(
    q,
    (snapshot) => {
      const logs: AIInteractionData[] = [];
      snapshot.forEach((docSnap) => {
        logs.push(docSnap.data() as AIInteractionData);
      });
      onUpdate(logs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}
