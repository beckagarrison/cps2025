import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ServerStatusProps {
  show?: boolean;
}

export function ServerStatus({ show = true }: ServerStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  const [details, setDetails] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  const checkServer = async () => {
    setStatus('checking');
    try {
      const response = await fetch(
        'https://rewgkrgmcmikivxjnfdq.supabase.co/functions/v1/make-server-a24eaa40/health',
        { 
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status === 'ok' ? 'online' : 'error');
        setDetails({
          statusCode: response.status,
          timestamp: new Date().toISOString(),
          response: data
        });
      } else {
        setStatus('error');
        setDetails({
          statusCode: response.status,
          error: `Server returned ${response.status}`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error: any) {
      setStatus('offline');
      setDetails({
        error: error.message,
        timestamp: new Date().toISOString(),
        type: error.name
      });
    }
  };

  useEffect(() => {
    if (show) {
      checkServer();
      // Check every 30 seconds
      const interval = setInterval(checkServer, 30000);
      return () => clearInterval(interval);
    }
  }, [show]);

  if (!show) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'checking':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Server Online';
      case 'offline':
        return 'Server Offline';
      case 'error':
        return 'Server Error';
      case 'checking':
        return 'Checking...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-50 border-green-200';
      case 'offline':
        return 'bg-red-50 border-red-200';
      case 'error':
        return 'bg-yellow-50 border-yellow-200';
      case 'checking':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card className={`p-3 border-2 ${getStatusColor()} shadow-lg max-w-sm`}>
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{getStatusText()}</p>
            {details && (
              <p className="text-xs text-gray-600">
                Last check: {new Date(details.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={checkServer}
              disabled={status === 'checking'}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`w-4 h-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
            </Button>
            {details && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setExpanded(!expanded)}
                className="h-8 px-2 text-xs"
              >
                {expanded ? 'Hide' : 'Details'}
              </Button>
            )}
          </div>
        </div>

        {expanded && details && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs space-y-1">
              {details.statusCode && (
                <p><strong>Status Code:</strong> {details.statusCode}</p>
              )}
              {details.error && (
                <p className="text-red-600"><strong>Error:</strong> {details.error}</p>
              )}
              {details.type && (
                <p><strong>Type:</strong> {details.type}</p>
              )}
              {details.response && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">
                    View Response
                  </summary>
                  <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(details.response, null, 2)}
                  </pre>
                </details>
              )}
            </div>

            <div className="mt-3 p-2 bg-white rounded border border-gray-200">
              <p className="text-xs font-medium mb-1">Quick Info:</p>
              <ul className="text-xs space-y-0.5 text-gray-700">
                {status === 'online' && (
                  <>
                    <li>✅ Server is running</li>
                    <li>✅ Authentication available</li>
                    <li>✅ Data persistence active</li>
                  </>
                )}
                {status === 'offline' && (
                  <>
                    <li>⚠️ Server not responding</li>
                    <li>💡 App works in dev mode</li>
                    <li>💡 Data saved locally</li>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <li>⚠️ Server has issues</li>
                    <li>💡 Check server logs</li>
                    <li>💡 Dev mode available</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
