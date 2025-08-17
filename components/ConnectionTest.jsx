import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Key } from 'lucide-react';
import { testConnection } from '../utils/supabase/client';

export function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState({
    loading: true,
    connected: false,
    error: null,
    details: null
  });

  const checkConnection = async () => {
    setConnectionStatus({ loading: true, connected: false, error: null, details: null });
    
    try {
      const result = await testConnection();
      setConnectionStatus({
        loading: false,
        connected: result.success,
        error: result.success ? null : result.error,
        details: result
      });
    } catch (error) {
      setConnectionStatus({
        loading: false,
        connected: false,
        error: error.message,
        details: null
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const envVars = {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium">Supabase Connection</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Variables Check */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Environment Variables</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>VITE_SUPABASE_URL</span>
              {envVars.url ? (
                <Badge className="bg-green-100 text-green-800">Set</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">Missing</Badge>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>VITE_SUPABASE_ANON_KEY</span>
              {envVars.key ? (
                <Badge className="bg-green-100 text-green-800">Set</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">Missing</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Connection Status</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkConnection}
              disabled={connectionStatus.loading}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${connectionStatus.loading ? 'animate-spin' : ''}`} />
              Test
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {connectionStatus.loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm">Testing connection...</span>
              </>
            ) : connectionStatus.connected ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Connected successfully</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">Connection failed</span>
              </>
            )}
          </div>

          {connectionStatus.error && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <p className="text-xs text-red-800">{connectionStatus.error}</p>
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        {!connectionStatus.connected && !connectionStatus.loading && (
          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium mb-1">Setup Required</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Create a Supabase project</li>
                  <li>Copy .env.example to .env</li>
                  <li>Add your Supabase URL and anon key</li>
                  <li>Run the database migrations</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}