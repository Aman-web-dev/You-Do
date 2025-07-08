'use client'

import React, { useState } from 'react';
import { User, Settings, Bell, Palette, Globe, Shield, Mail, Phone, Key, Eye, EyeOff, Github, Slack, Calendar, Database,MailIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    appName: 'My Todo App',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    
    // Account Settings
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Full-stack developer passionate about creating amazing user experiences.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Preferences
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    pushNotifications: false,
    soundEnabled: true,
    autoSync: true,
    compactView: false,
    
    // Integrations
    githubConnected: true,
    slackConnected: false,
    calendarConnected: true,
    databaseConnected: false
  });

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = (section) => {
    console.log(`Saving ${section} settings:`, settings);
    // Add your save logic here
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Globe }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Configure your application preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appName">Application Name</Label>
              <Input
                id="appName"
                value={settings.appName}
                onChange={(e) => handleInputChange('appName', e.target.value)}
                placeholder="Enter app name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <select
                id="dateFormat"
                value={settings.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSave('general')}>Save General Settings</Button>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={settings.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={settings.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Change your password and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={settings.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
                className="pl-10 pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 h-6 w-6 p-0"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={settings.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={settings.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSave('account')}>Save Account Settings</Button>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex gap-2">
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                onClick={() => handleInputChange('theme', 'light')}
                className="flex-1"
              >
                Light
              </Button>
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                onClick={() => handleInputChange('theme', 'dark')}
                className="flex-1"
              >
                Dark
              </Button>
              <Button
                variant={settings.theme === 'system' ? 'default' : 'outline'}
                onClick={() => handleInputChange('theme', 'system')}
                className="flex-1"
              >
                System
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Compact View</Label>
              <p className="text-sm text-gray-500">Use a more compact layout</p>
            </div>
            <Button
              variant={settings.compactView ? 'default' : 'outline'}
              onClick={() => handleInputChange('compactView', !settings.compactView)}
              className="ml-4"
            >
              {settings.compactView ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>All Notifications</Label>
              <p className="text-sm text-gray-500">Enable or disable all notifications</p>
            </div>
            <Button
              variant={settings.notifications ? 'default' : 'outline'}
              onClick={() => handleInputChange('notifications', !settings.notifications)}
              className="ml-4"
            >
              {settings.notifications ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Button
              variant={settings.emailNotifications ? 'default' : 'outline'}
              onClick={() => handleInputChange('emailNotifications', !settings.emailNotifications)}
              className="ml-4"
            >
              {settings.emailNotifications ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications</p>
            </div>
            <Button
              variant={settings.pushNotifications ? 'default' : 'outline'}
              onClick={() => handleInputChange('pushNotifications', !settings.pushNotifications)}
              className="ml-4"
            >
              {settings.pushNotifications ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Sound</Label>
              <p className="text-sm text-gray-500">Play sounds for notifications</p>
            </div>
            <Button
              variant={settings.soundEnabled ? 'default' : 'outline'}
              onClick={() => handleInputChange('soundEnabled', !settings.soundEnabled)}
              className="ml-4"
            >
              {settings.soundEnabled ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>Configure automatic synchronization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto Sync</Label>
              <p className="text-sm text-gray-500">Automatically sync data across devices</p>
            </div>
            <Button
              variant={settings.autoSync ? 'default' : 'outline'}
              onClick={() => handleInputChange('autoSync', !settings.autoSync)}
              className="ml-4"
            >
              {settings.autoSync ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSave('preferences')}>Save Preferences</Button>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>Manage your third-party integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        
          

          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-gray-600" />
              <div>
                <h3 className="font-medium">Calendar</h3>
                <p className="text-sm text-gray-500">Sync with your calendar app</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {settings.calendarConnected && (
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              )}
              <Button
                variant={settings.calendarConnected ? 'outline' : 'default'}
                onClick={() => handleInputChange('calendarConnected', !settings.calendarConnected)}
              >
                {settings.calendarConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <MailIcon className="h-8 w-8 text-gray-600" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-gray-500">Sync with your Google Mail</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {settings.calendarConnected && (
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              )}
              <Button
                variant={settings.calendarConnected ? 'outline' : 'default'}
                onClick={() => handleInputChange('calendarConnected', !settings.calendarConnected)}
              >
                {settings.calendarConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
          
       
        </CardContent>
      </Card>
      
    
      
      <div className="flex justify-end">
        <Button onClick={() => handleSave('integrations')}>Save Integration Settings</Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'account':
        return renderAccountSettings();
      case 'preferences':
        return renderPreferences();
      case 'integrations':
        return renderIntegrations();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full justify-start gap-2 h-12"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
          
          {/* Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}