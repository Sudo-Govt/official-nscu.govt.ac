import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, Key, Eye, EyeOff, Check, AlertCircle, 
  Sparkles, Zap, Brain, Bot, Save, RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProviderConfig {
  provider: 'lovable' | 'openai' | 'anthropic' | 'google';
  model: string;
}

interface APIKeys {
  openai: string | null;
  anthropic: string | null;
  google: string | null;
}

const PROVIDERS = [
  {
    id: 'lovable',
    name: 'Lovable AI',
    description: 'Built-in AI (no API key needed)',
    icon: Sparkles,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
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
    bgColor: 'bg-green-50',
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
    bgColor: 'bg-orange-50',
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
    bgColor: 'bg-blue-50',
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
      { id: 'gemini-pro', name: 'Gemini Pro' },
    ],
  },
];

const AIProviderSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [selectedProvider, setSelectedProvider] = useState<string>('lovable');
  const [selectedModel, setSelectedModel] = useState<string>('google/gemini-3-flash-preview');
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    openai: null,
    anthropic: null,
    google: null,
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [keyInputs, setKeyInputs] = useState<Record<string, string>>({
    openai: '',
    anthropic: '',
    google: '',
  });
  const [keyEditing, setKeyEditing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [providerRes, keysRes] = await Promise.all([
        supabase
          .from('content_generation_settings')
          .select('value')
          .eq('key', 'ai_provider')
          .single(),
        supabase
          .from('content_generation_settings')
          .select('value')
          .eq('key', 'ai_api_keys')
          .single(),
      ]);

      if (providerRes.data?.value) {
        const config = providerRes.data.value as unknown as ProviderConfig;
        setSelectedProvider(config.provider || 'lovable');
        setSelectedModel(config.model || 'google/gemini-3-flash-preview');
      }

      if (keysRes.data?.value) {
        const keys = keysRes.data.value as unknown as APIKeys;
        setApiKeys(keys);
        // Show masked versions in inputs
        setKeyInputs({
          openai: keys.openai ? '••••••••••••' + keys.openai.slice(-4) : '',
          anthropic: keys.anthropic ? '••••••••••••' + keys.anthropic.slice(-4) : '',
          google: keys.google ? '••••••••••••' + keys.google.slice(-4) : '',
        });
        setKeyEditing({
          openai: false,
          anthropic: false,
          google: false,
        });
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    // Set default model for the provider
    const providerConfig = PROVIDERS.find(p => p.id === provider);
    if (providerConfig?.models[0]) {
      setSelectedModel(providerConfig.models[0].id);
    }
  };

  const handleSaveProvider = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('content_generation_settings')
        .upsert({
          key: 'ai_provider',
          value: { provider: selectedProvider, model: selectedModel },
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: `Using ${PROVIDERS.find(p => p.id === selectedProvider)?.name} for AI generation`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveApiKey = async (provider: 'openai' | 'anthropic' | 'google') => {
    const newKey = keyInputs[provider];
    
    // Don't save if it's a masked value and not being edited
    if (newKey.includes('••••') && !keyEditing[provider]) return;
    
    // Don't save empty keys when editing
    if (!newKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key',
        variant: 'destructive',
      });
      return;
    }
    
    setSaving(true);
    try {
      const updatedKeys = { ...apiKeys, [provider]: newKey || null };
      
      const { error } = await supabase
        .from('content_generation_settings')
        .upsert({
          key: 'ai_api_keys',
          value: updatedKeys,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setApiKeys(updatedKeys);
      setKeyEditing(prev => ({ ...prev, [provider]: false }));
      // Update displayed key to masked version
      setKeyInputs(prev => ({
        ...prev,
        [provider]: newKey ? '••••••••••••' + newKey.slice(-4) : '',
      }));
      
      toast({
        title: 'API key saved',
        description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} API key has been updated`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleKeyInputChange = (provider: 'openai' | 'anthropic' | 'google', value: string) => {
    // If user starts typing and there's a masked value, clear it
    if (keyInputs[provider].includes('••••') && !keyEditing[provider]) {
      setKeyEditing(prev => ({ ...prev, [provider]: true }));
      setKeyInputs(prev => ({ ...prev, [provider]: value }));
    } else {
      setKeyInputs(prev => ({ ...prev, [provider]: value }));
    }
  };

  const handleKeyInputFocus = (provider: 'openai' | 'anthropic' | 'google') => {
    // Clear masked value when focusing to edit
    if (keyInputs[provider].includes('••••')) {
      setKeyEditing(prev => ({ ...prev, [provider]: true }));
      setKeyInputs(prev => ({ ...prev, [provider]: '' }));
    }
  };

  const currentProvider = PROVIDERS.find(p => p.id === selectedProvider);
  const hasApiKey = selectedProvider === 'lovable' || apiKeys[selectedProvider as keyof APIKeys];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Provider Settings</CardTitle>
            <CardDescription>
              Choose your AI provider for curriculum generation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select AI Provider</Label>
          <RadioGroup
            value={selectedProvider}
            onValueChange={handleProviderChange}
            className="grid grid-cols-2 gap-3"
          >
            {PROVIDERS.map((provider) => {
              const Icon = provider.icon;
              const isSelected = selectedProvider === provider.id;
              const hasKey = provider.id === 'lovable' || apiKeys[provider.id as keyof APIKeys];
              
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
                        {hasKey ? (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                            <Check className="h-3 w-3 mr-1" />
                            Key configured
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200 bg-yellow-50">
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
        <Button onClick={handleSaveProvider} disabled={saving || !hasApiKey}>
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
            Enter your API keys for external providers. Keys are stored securely and used only for curriculum generation.
          </p>

          {PROVIDERS.filter(p => p.id !== 'lovable').map((provider) => {
            const providerId = provider.id as 'openai' | 'anthropic' | 'google';
            const Icon = provider.icon;
            
            return (
              <div key={provider.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-4 w-4', provider.color)} />
                  <Label className="text-sm">{provider.name} API Key</Label>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showKeys[provider.id] ? 'text' : 'password'}
                      placeholder={`Enter ${provider.name} API key...`}
                      value={keyInputs[providerId]}
                      onChange={(e) => handleKeyInputChange(providerId, e.target.value)}
                      onFocus={() => handleKeyInputFocus(providerId)}
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
                    disabled={saving || (!keyEditing[providerId] && keyInputs[providerId].includes('••••')) || !keyInputs[providerId].trim()}
                  >
                    Save
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning for non-Lovable providers */}
        {selectedProvider !== 'lovable' && !hasApiKey && (
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                API Key Required
              </p>
              <p className="text-xs text-yellow-700 mt-1">
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
