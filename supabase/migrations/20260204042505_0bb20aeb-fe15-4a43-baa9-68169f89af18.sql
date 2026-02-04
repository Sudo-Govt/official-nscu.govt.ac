-- Add AI provider settings to content_generation_settings table
-- Store the selected provider and encrypted API keys

-- Insert default provider setting
INSERT INTO content_generation_settings (key, value, updated_at)
VALUES 
  ('ai_provider', '{"provider": "lovable", "model": "google/gemini-3-flash-preview"}', now()),
  ('ai_api_keys', '{"openai": null, "anthropic": null, "google": null}', now())
ON CONFLICT (key) DO NOTHING;