import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EncryptionKeyContextType {
  encryptionKey: string | null;
  setEncryptionKey: (key: string) => void;
  isKeySet: boolean;
}

const EncryptionKeyContext = createContext<EncryptionKeyContextType | undefined>(undefined);

export const useEncryptionKey = () => {
  const context = useContext(EncryptionKeyContext);
  if (!context) {
    throw new Error('useEncryptionKey must be used within an EncryptionKeyProvider');
  }
  return context;
};

interface EncryptionKeyProviderProps {
  children: ReactNode;
}

export const EncryptionKeyProvider: React.FC<EncryptionKeyProviderProps> = ({ children }) => {
  const [encryptionKey, setEncryptionKeyState] = useState<string | null>(null);
  const [isKeySet, setIsKeySet] = useState(false);
  const [tempKey, setTempKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('encryptionKey');
    if (storedKey) {
      setEncryptionKeyState(storedKey);
      setIsKeySet(true);
    }
  }, []);

  const handleSetKey = () => {
    if (tempKey.length < 8) {
      alert('Encryption key must be at least 8 characters long.');
      return;
    }
    localStorage.setItem('encryptionKey', tempKey);
    setEncryptionKeyState(tempKey);
    setIsKeySet(true);
    setTempKey('');
  };

  const setEncryptionKey = (key: string) => {
    localStorage.setItem('encryptionKey', key);
    setEncryptionKeyState(key);
    setIsKeySet(true);
  }

  if (!isKeySet) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Set Encryption Key</h2>
          <p className="text-gray-600 mb-6">
            Please set an encryption key to secure your API keys. This key will be stored in your browser.
            You will need this key to access your API keys on other devices or if your browser storage is cleared.
            <strong>Please save this key in a safe place.</strong>
          </p>
          <div className="space-y-4">
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your encryption key (min. 8 characters)"
            />
            <button
              onClick={handleSetKey}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Set and Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EncryptionKeyContext.Provider value={{ encryptionKey, setEncryptionKey, isKeySet }}>
      {children}
    </EncryptionKeyContext.Provider>
  );
};
