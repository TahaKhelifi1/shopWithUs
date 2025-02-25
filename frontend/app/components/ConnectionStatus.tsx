'use client';
import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import '../globals.css';

const TEST_CONNECTION = gql`
  query TestConnection {
    getUsers {
      id
      nom
      prenom
      email
      is_admin
    }
  }
`;

export default function ConnectionStatus() {
    const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');
    const { loading, error } = useQuery(TEST_CONNECTION, {
        onCompleted: () => setDbStatus('connected'),
        onError: () => setDbStatus('error')
    });

    const getStatusColor = () => {
        switch (dbStatus) {
            case 'connected':
                return 'text-green-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-yellow-500';
        }
    };

    const getStatusMessage = () => {
        switch (dbStatus) {
            case 'connected':
                return '✅ Database Connected';
            case 'error':
                return '❌ Database Connection Failed';
            default:
                return '⏳ Checking Database Connection...';
        }
    };

    return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg bg-gray-800 ${getStatusColor()}`}>
            {getStatusMessage()}
        </div>
    );
}  