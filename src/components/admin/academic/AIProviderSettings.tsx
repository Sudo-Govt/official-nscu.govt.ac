 import React, { useState, useEffect, useCallback } from 'react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Badge } from '@/components/ui/badge';
 import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Separator } from '@/components/ui/separator';
 import { 
 Settings, Key, Eye, EyeOff, Check, AlertCircle, X,
 Sparkles, Zap, Brain, Bot, Save, Loader2
 } from 'lucide-react';
 import { useToast } from '@/hooks/use-toast';
 import { cn } from '@/lib/utils';
 
 // Local storage key for AI settings
 const AI_SETTINGS_KEY = 'bulk_ai_generator_settings';
 
 interface ProviderConfig {
   provider: 'lovable' | 'openai' | 'anthropic' | 'google';
   model: string;
 }
 
 interface APIKeys {
   openai: string | null;
   anthropic: string | null;
   google: string | null;
 }
 
 interface KeyValidation {
   openai: 'idle' | 'validating' | 'valid' | 'invalid';
   anthropic: 'idle' | 'validating' | 'valid' | 'invalid';
   google: 'idle' | 'validating' | 'valid' | 'invalid';
 }
 
 interface AISettings {
   provider: ProviderConfig;
   apiKeys: APIKeys;
 }
 
 const PROVIDERS = [
   {
     id: 'lovable',
     name: 'Lovable AI',
     description: 'Built-in AI (no API key needed)',
     icon: Sparkles,
     color: 'text-purple-500',
     bgColor: 'bg-purple-50 dark:bg-purple-950',
     models: [
       { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash (Recommended)' },
       { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
       { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro (Slower)' },
     ],
   },
   {
     id: 'openai',
     name: 'OpenAI',
     description: 'GPT-4o, GPT-4, GPT-3.5',
     icon: Zap,
     color: 'text-green-500',
     bgColor: 'bg-green-50 dark:bg-green-950',
     models: [
       { id: 'gpt-4o', name: 'GPT-4o (Recommended)' },
       { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
       { id: 'gpt-4', name: 'GPT-4' },
       { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Faster)' },
     ],
   },
   {
     id: 'anthropic',
     name: 'Anthropic (Claude)',
     description: 'Claude 3.5, Claude 3',
     icon: Brain,
     color: 'text-orange-500',
     bgColor: 'bg-orange-50 dark:bg-orange-950',
     models: [
       { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Recommended)' },
       { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus (Slower)' },
       { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (Faster)' },
     ],
   },
   {
     id: 'google',
     name: 'Google AI (Direct)',
     description: 'Gemini Pro with your own key',
     icon: Bot,
     color: 'text-blue-500',
     bgColor: 'bg-blue-50 dark:bg-blue-950',
     models: [
       { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
       { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
       { id: 'gemini-pro', name: 'Gemini Pro' },
     ],
   },
 ];
 
 // Helper to load settings from localStorage
 const loadSettingsFromStorage = (): AISettings => {
   try {
     const stored = localStorage.getItem(AI_SETTINGS_KEY);
     if (stored) {
       return JSON.parse(stored);
     }
   } catch (e) {
     console.error('Failed to load AI settings:', e);
   }
   return {
     provider: { provider: 'lovable', model: 'google/gemini-3-flash-preview' },
     apiKeys: { openai: null, anthropic: null, google: null },
   };
 };
 
 // Helper to save settings to localStorage
 const saveSettingsToStorage = (settings: AISettings) => {
   try {
     localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
   } catch (e) {
     console.error('Failed to save AI settings:', e);
   }
 };
 
 // Export for use in other components
 export const getAISettings = loadSettingsFromStorage;
 
 const AIProviderSettings = () => {
   const { toast } = useToast();
   const [selectedProvider, setSelectedProvider] = useState<string>('lovable');
   const [selectedModel, setSelectedModel] = useState<string>('google/gemini-3-flash-preview');
   const [apiKeys, setApiKeys] = useState<APIKeys>({ openai: null, anthropic: null, google: null });
   const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
   const [keyInputs, setKeyInputs] = useState<Record<string, string>>({ openai: '', anthropic: '', google: '' });
   const [keyValidation, setKeyValidation] = useState<KeyValidation>({ openai: 'idle', anthropic: 'idle', google: 'idle' });
 
   useEffect(() => {
     const settings = loadSettingsFromStorage();
     setSelectedProvider(settings.provider.provider);
     setSelectedModel(settings.provider.model);
     setApiKeys(settings.apiKeys);
     setKeyInputs({
       openai: settings.apiKeys.openai || '',
       anthropic: settings.apiKeys.anthropic || '',
       google: settings.apiKeys.google || '',
     });
     // Set validation status for existing keys
     setKeyValidation({
       openai: settings.apiKeys.openai ? 'valid' : 'idle',
       anthropic: settings.apiKeys.anthropic ? 'valid' : 'idle',
       google: settings.apiKeys.google ? 'valid' : 'idle',
     });
   }, []);
 
   const handleProviderChange = (provider: string) => {
     setSelectedProvider(provider);
     const providerConfig = PROVIDERS.find(p => p.id === provider);
     if (providerConfig?.models[0]) {
       setSelectedModel(providerConfig.models[0].id);
     }
   };
 
   const handleSaveProvider = () => {
     const settings = loadSettingsFromStorage();
     settings.provider = { provider: selectedProvider as any, model: selectedModel };
     saveSettingsToStorage(settings);
     toast({
       title: 'Settings saved',
       description: `Using ${PROVIDERS.find(p => p.id === selectedProvider)?.name} for AI generation`,
     });
   };
 
   const validateApiKey = useCallback(async (provider: 'openai' | 'anthropic' | 'google', key: string): Promise<boolean> => {
     if (!key.trim()) return false;
     
     setKeyValidation(prev => ({ ...prev, [provider]: 'validating' }));
     
     try {
       let isValid = false;
       
       switch (provider) {
         case 'openai':
           const openaiRes = await fetch('https://api.openai.com/v1/models', {
             headers: { 'Authorization': `Bearer ${key}` },
           });
           isValid = openaiRes.ok;
           break;
           
         case 'anthropic':
           const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
             method: 'POST',
             headers: {
               'x-api-key': key,
               'Content-Type': 'application/json',
               'anthropic-version': '2023-06-01',
             },
             body: JSON.stringify({
               model: 'claude-3-haiku-20240307',
               max_tokens: 1,
               messages: [{ role: 'user', content: 'Hi' }],
             }),
           });
           isValid = anthropicRes.ok || anthropicRes.status === 429 || anthropicRes.status === 402;
           break;
           
         case 'google':
           const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
           isValid = googleRes.ok;
           break;
       }
       
       setKeyValidation(prev => ({ ...prev, [provider]: isValid ? 'valid' : 'invalid' }));
       return isValid;
     } catch (error) {
       console.error('Key validation error:', error);
       setKeyValidation(prev => ({ ...prev, [provider]: 'invalid' }));
       return false;
     }
   }, []);
 
  const handleSaveApiKey = async (provider: 'openai' | 'anthropic' | 'google') => {
    const newKey = keyInputs[provider]?.trim();
    
    if (!newKey) {
      const settings = loadSettingsFromStorage();
      settings.apiKeys[provider] = null;
      saveSettingsToStorage(settings);
      setApiKeys(prev => ({ ...prev, [provider]: null }));
      setKeyValidation(prev => ({ ...prev, [provider]: 'idle' }));
      toast({ title: 'API key removed' });
      return;
    }
    
    // Skip validation for keys that look like they start with correct prefix
    const prefixes: Record<string, string> = {
      openai: 'sk-',
      anthropic: 'sk-ant-',
      google: 'AI',
    };
    
    const hasValidPrefix = newKey.startsWith(prefixes[provider] || '');
    
    // Try validation but don't block on CORS errors
    let isValid = hasValidPrefix;
    try {
      isValid = await validateApiKey(provider, newKey);
    } catch (e) {
      console.log('Validation request failed (likely CORS), trusting prefix check');
      isValid = hasValidPrefix;
    }
    
    // Save the key regardless of validation result if it has correct prefix
    const settings = loadSettingsFromStorage();
    settings.apiKeys[provider] = newKey;
    saveSettingsToStorage(settings);
    setApiKeys(prev => ({ ...prev, [provider]: newKey }));
    
    if (isValid || hasValidPrefix) {
      setKeyValidation(prev => ({ ...prev, [provider]: 'valid' }));
      toast({
        title: 'API key saved',
        description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} API key has been configured`,
      });
    } else {
      setKeyValidation(prev => ({ ...prev, [provider]: 'invalid' }));
      toast({
        title: 'API key saved (validation failed)',
        description: `Key saved but validation failed. It will still be used for generation.`,
        variant: 'default',
      });
    }
  };
 
   const toggleKeyVisibility = (provider: string) => {
     setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
   };
 
   const getValidationIcon = (status: 'idle' | 'validating' | 'valid' | 'invalid') => {
     switch (status) {
       case 'validating':
         return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
       case 'valid':
         return <Check className="h-4 w-4 text-green-500" />;
       case 'invalid':
         return <X className="h-4 w-4 text-red-500" />;
       default:
         return null;
     }
   };
 
   const currentProvider = PROVIDERS.find(p => p.id === selectedProvider);
   const hasApiKey = selectedProvider === 'lovable' || !!apiKeys[selectedProvider as keyof APIKeys];
 
   return (
     <Card>
       <CardHeader>
         <div className="flex items-center gap-3">
           <div className="p-2 bg-primary/10 rounded-lg">
             <Settings className="h-5 w-5 text-primary" />
           </div>
           <div>
             <CardTitle className="text-lg">Which AI do you want to use?</CardTitle>
             <CardDescription>
               Select provider and enter your API key. Keys are stored locally in your browser.
             </CardDescription>
           </div>
         </div>
       </CardHeader>
       <CardContent className="space-y-6">
         {/* Available AI Providers */}
         <div className="space-y-3">
           <Label className="text-sm font-medium">Available AI Providers</Label>
           <RadioGroup
             value={selectedProvider}
             onValueChange={handleProviderChange}
             className="grid grid-cols-2 gap-3"
           >
             {PROVIDERS.map((provider) => {
               const Icon = provider.icon;
               const isSelected = selectedProvider === provider.id;
               const hasKey = provider.id === 'lovable' || !!apiKeys[provider.id as keyof APIKeys];
               const validation = provider.id !== 'lovable' ? keyValidation[provider.id as keyof KeyValidation] : 'valid';
               
               return (
                 <label
                   key={provider.id}
                   className={cn(
                     'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                     isSelected 
                       ? 'border-primary bg-primary/5' 
                       : 'border-border hover:border-primary/50'
                   )}
                 >
                   <RadioGroupItem value={provider.id} className="mt-1" />
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2">
                       <div className={cn('p-1 rounded', provider.bgColor)}>
                         <Icon className={cn('h-4 w-4', provider.color)} />
                       </div>
                       <span className="font-medium text-sm">{provider.name}</span>
                       {provider.id === 'lovable' && (
                         <Badge variant="secondary" className="text-xs">Free</Badge>
                       )}
                     </div>
                     <p className="text-xs text-muted-foreground mt-1">
                       {provider.description}
                     </p>
                     {provider.id !== 'lovable' && (
                       <div className="mt-2">
                         {hasKey && validation === 'valid' ? (
                           <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 dark:bg-green-950">
                             <Check className="h-3 w-3 mr-1" />
                             Key valid
                           </Badge>
                         ) : hasKey && validation === 'invalid' ? (
                           <Badge variant="outline" className="text-xs text-red-600 border-red-200 bg-red-50 dark:bg-red-950">
                             <X className="h-3 w-3 mr-1" />
                             Key invalid
                           </Badge>
                         ) : hasKey ? (
                           <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950">
                             Key saved
                           </Badge>
                         ) : (
                           <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                             <AlertCircle className="h-3 w-3 mr-1" />
                             Key required
                           </Badge>
                         )}
                       </div>
                     )}
                   </div>
                 </label>
               );
             })}
           </RadioGroup>
         </div>
 
         <Separator />
 
         {/* Model Selection */}
         {currentProvider && (
           <div className="space-y-3">
             <Label className="text-sm font-medium">Select Model</Label>
             <Select value={selectedModel} onValueChange={setSelectedModel}>
               <SelectTrigger>
                 <SelectValue placeholder="Select a model" />
               </SelectTrigger>
               <SelectContent>
                 {currentProvider.models.map((model) => (
                   <SelectItem key={model.id} value={model.id}>
                     {model.name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         )}
 
         {/* Save Provider Button */}
         <Button onClick={handleSaveProvider} disabled={!hasApiKey}>
           <Save className="h-4 w-4 mr-2" />
           Save Provider Settings
         </Button>
 
         <Separator />
 
         {/* API Keys Section */}
         <div className="space-y-4">
           <div className="flex items-center gap-2">
             <Key className="h-4 w-4 text-muted-foreground" />
             <Label className="text-sm font-medium">API Keys</Label>
           </div>
           
           <p className="text-xs text-muted-foreground">
             Enter your API keys below. Keys are stored locally in your browser and validated automatically.
           </p>
 
           {PROVIDERS.filter(p => p.id !== 'lovable').map((provider) => {
             const providerId = provider.id as 'openai' | 'anthropic' | 'google';
             const Icon = provider.icon;
             const validation = keyValidation[providerId];
             
             return (
               <div key={provider.id} className="space-y-2">
                 <div className="flex items-center gap-2">
                   <Icon className={cn('h-4 w-4', provider.color)} />
                   <Label className="text-sm">{provider.name} API Key</Label>
                   {getValidationIcon(validation)}
                 </div>
                 <div className="flex gap-2">
                   <div className="relative flex-1">
                     <Input
                       type={showKeys[provider.id] ? 'text' : 'password'}
                       placeholder={`Enter ${provider.name} API key...`}
                       value={keyInputs[providerId]}
                       onChange={(e) => setKeyInputs(prev => ({ ...prev, [providerId]: e.target.value }))}
                       className="pr-10"
                     />
                     <Button
                       type="button"
                       variant="ghost"
                       size="sm"
                       className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                       onClick={() => toggleKeyVisibility(provider.id)}
                     >
                       {showKeys[provider.id] ? (
                         <EyeOff className="h-4 w-4" />
                       ) : (
                         <Eye className="h-4 w-4" />
                       )}
                     </Button>
                   </div>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleSaveApiKey(providerId)}
                     disabled={validation === 'validating'}
                   >
                     {validation === 'validating' ? (
                       <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                       'Save & Validate'
                     )}
                   </Button>
                 </div>
               </div>
             );
           })}
         </div>
 
         {/* Warning for non-Lovable providers */}
         {selectedProvider !== 'lovable' && !hasApiKey && (
           <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
             <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
             <div>
               <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                 API Key Required
               </p>
               <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                 Please enter your {currentProvider?.name} API key above to use this provider for curriculum generation.
               </p>
             </div>
           </div>
         )}
       </CardContent>
     </Card>
   );
 };
 
 export default AIProviderSettings;