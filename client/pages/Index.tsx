import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Calendar,
  Settings,
  Sun,
  Moon
} from 'lucide-react';

interface ServerStatus {
  id: string;
  name: string;
  type: 'server' | 'database' | 'api' | 'service';
  status: 'online' | 'offline' | 'outraged' | 'maintenance';
  lastChecked: string;
  nextCheck: string;
  teamAlerted: boolean;
  hasAlertTeam: boolean;
}

const mockServers: ServerStatus[] = [
  {
    id: '1',
    name: 'API Gateway',
    type: 'api',
    status: 'online',
    lastChecked: '2 minutes ago',
    nextCheck: 'in 3 minutes',
    teamAlerted: false,
    hasAlertTeam: true
  },
  {
    id: '2',
    name: 'Database Primary',
    type: 'database',
    status: 'online',
    lastChecked: '1 minute ago',
    nextCheck: 'in 4 minutes',
    teamAlerted: false,
    hasAlertTeam: false
  },
  {
    id: '3',
    name: 'Backup Server',
    type: 'server',
    status: 'outraged',
    lastChecked: '5 minutes ago',
    nextCheck: 'in 30 seconds',
    teamAlerted: true,
    hasAlertTeam: true
  },
  {
    id: '4',
    name: 'Load Balancer',
    type: 'service',
    status: 'maintenance',
    lastChecked: '10 minutes ago',
    nextCheck: 'in 2 hours',
    teamAlerted: false,
    hasAlertTeam: false
  },
  {
    id: '5',
    name: 'CDN Service',
    type: 'service',
    status: 'online',
    lastChecked: '30 seconds ago',
    nextCheck: 'in 4 minutes',
    teamAlerted: false,
    hasAlertTeam: false
  },
  {
    id: '6',
    name: 'Auth Service',
    type: 'service',
    status: 'offline',
    lastChecked: '8 minutes ago',
    nextCheck: 'in 2 minutes',
    teamAlerted: false,
    hasAlertTeam: false
  }
];

const predefinedContacts = [
  { id: 'john', name: 'John Smith - DevOps Lead', email: 'john@company.com' },
  { id: 'sarah', name: 'Sarah Johnson - Backend Team', email: 'sarah@company.com' },
  { id: 'mike', name: 'Mike Brown - Infrastructure', email: 'mike@company.com' },
  { id: 'lisa', name: 'Lisa Davis - SRE Team', email: 'lisa@company.com' }
];

export default function Index() {
  const [servers, setServers] = useState<ServerStatus[]>(mockServers);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    server: '',
    date: '',
    reason: '',
    notifyTeam: false,
    selectedContacts: [] as string[]
  });
  const [emailForm, setEmailForm] = useState({
    emails: '',
    subject: '',
    content: '',
    selectedContacts: [] as string[]
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prev => prev.map(server => ({
        ...server,
        lastChecked: Math.random() > 0.7 ? 'Just now' : server.lastChecked,
        nextCheck: Math.random() > 0.8 ? 'in 30 seconds' : server.nextCheck
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'outraged': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'maintenance': return <Settings className="h-5 w-5 text-blue-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'api': return <Globe className="h-4 w-4" />;
      case 'service': return <Shield className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      online: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      offline: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      outraged: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
      maintenance: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleAlertTeam = (serverId: string) => {
    setServers(prev => prev.map(server => 
      server.id === serverId ? { ...server, teamAlerted: true } : server
    ));
  };

  const handleScheduleMaintenance = () => {
    console.log('Schedule maintenance:', maintenanceForm);
    setMaintenanceForm({ server: '', date: '', reason: '', notifyTeam: false, selectedContacts: [] });
    setShowMaintenanceModal(false);
  };

  const handleSendEmail = () => {
    console.log('Send email:', emailForm);
    setEmailForm({ emails: '', subject: '', content: '', selectedContacts: [] });
    setShowEmailModal(false);
  };

  const toggleEmailContact = (contactId: string) => {
    setEmailForm(prev => ({
      ...prev,
      selectedContacts: prev.selectedContacts.includes(contactId)
        ? prev.selectedContacts.filter(id => id !== contactId)
        : [...prev.selectedContacts, contactId]
    }));
  };

  const toggleMaintenanceContact = (contactId: string) => {
    setMaintenanceForm(prev => ({
      ...prev,
      selectedContacts: prev.selectedContacts.includes(contactId)
        ? prev.selectedContacts.filter(id => id !== contactId)
        : [...prev.selectedContacts, contactId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                System Health Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Monitor server status and infrastructure health in real-time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setShowMaintenanceModal(true)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Schedule Maintenance
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                      <div className="w-24 h-5 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    </div>
                    <div className="w-5 h-5 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="w-12 h-4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                      <div className="w-16 h-6 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    </div>
                    <div className="w-full h-4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    <div className="w-full h-8 bg-slate-200 dark:bg-slate-600 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <div key={server.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(server.type)}
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{server.name}</h3>
                  </div>
                  {getStatusIcon(server.status)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Status:</span>
                    {getStatusBadge(server.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Last checked:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{server.lastChecked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Next check:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{server.nextCheck}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {server.hasAlertTeam && !server.teamAlerted && (
                      <button 
                        onClick={() => handleAlertTeam(server.id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                      >
                        Alert Team
                      </button>
                    )}
                    {server.teamAlerted && (
                      <button 
                        disabled
                        className="flex-1 px-3 py-2 bg-amber-100 text-amber-800 text-sm rounded-md border border-amber-300 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                      >
                        Team Alerted
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Schedule Maintenance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Server/Service</label>
                <select 
                  value={maintenanceForm.server}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, server: e.target.value }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="">Select server to maintain</option>
                  {servers.map(server => (
                    <option key={server.id} value={server.id}>{server.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Maintenance Date</label>
                <input 
                  type="datetime-local"
                  value={maintenanceForm.date}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Reason</label>
                <textarea 
                  placeholder="Describe the maintenance work..."
                  value={maintenanceForm.reason}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notify Team Members</label>
                {predefinedContacts.map(contact => (
                  <label key={contact.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={maintenanceForm.selectedContacts.includes(contact.id)}
                      onChange={() => toggleMaintenanceContact(contact.id)}
                      className="rounded border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{contact.name}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => setShowMaintenanceModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleScheduleMaintenance}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Send Email</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Email Addresses</label>
                <textarea 
                  placeholder="Enter email addresses (comma separated)"
                  value={emailForm.emails}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, emails: e.target.value }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quick Add Contacts</label>
                {predefinedContacts.map(contact => (
                  <label key={contact.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={emailForm.selectedContacts.includes(contact.id)}
                      onChange={() => toggleEmailContact(contact.id)}
                      className="rounded border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{contact.name}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Subject</label>
                <input 
                  type="text"
                  placeholder="Email subject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Content</label>
                <textarea 
                  placeholder="Email content..."
                  value={emailForm.content}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  rows={4}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendEmail}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
