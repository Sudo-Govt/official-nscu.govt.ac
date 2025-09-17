-- Fix function search path security warnings
-- Update functions to have proper search_path settings

CREATE OR REPLACE FUNCTION public.get_user_permission(user_uuid uuid, module_key text, permission_action text)
 RETURNS access_level
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  role_permission public.access_level;
  user_override public.access_level;
  result_permission public.access_level;
BEGIN
  -- Get role-based permission
  SELECT rp.access_level INTO role_permission
  FROM public.profiles p
  JOIN public.roles r ON p.role::text = r.key
  JOIN public.role_permissions rp ON r.id = rp.role_id
  JOIN public.permissions perm ON rp.permission_id = perm.id
  JOIN public.modules m ON perm.module_id = m.id
  WHERE p.user_id = user_uuid
    AND m.key = module_key
    AND perm.action = permission_action;

  -- Get user override permission
  SELECT up.access_level INTO user_override
  FROM public.user_permissions up
  JOIN public.permissions perm ON up.permission_id = perm.id
  JOIN public.modules m ON perm.module_id = m.id
  WHERE up.user_id = user_uuid
    AND m.key = module_key
    AND perm.action = permission_action;

  -- Return user override if exists, otherwise role permission
  result_permission := COALESCE(user_override, role_permission, 'none');
  
  RETURN result_permission;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_permission(user_uuid uuid, module_key text, permission_action text, required_level access_level DEFAULT 'read'::access_level)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_level public.access_level;
  level_hierarchy INTEGER[];
BEGIN
  -- Define permission hierarchy (higher number = more access)
  level_hierarchy := ARRAY[0, 1, 2, 3, 4, 5, 6, 7]; -- none, access, read, write, delete, approve, manage, full
  
  user_level := public.get_user_permission(user_uuid, module_key, permission_action);
  
  -- Compare permission levels using hierarchy
  RETURN (
    CASE user_level
      WHEN 'none' THEN 0
      WHEN 'access' THEN 1
      WHEN 'read' THEN 2
      WHEN 'write' THEN 3
      WHEN 'delete' THEN 4
      WHEN 'approve' THEN 5
      WHEN 'manage' THEN 6
      WHEN 'full' THEN 7
    END
  ) >= (
    CASE required_level
      WHEN 'none' THEN 0
      WHEN 'access' THEN 1
      WHEN 'read' THEN 2
      WHEN 'write' THEN 3
      WHEN 'delete' THEN 4
      WHEN 'approve' THEN 5
      WHEN 'manage' THEN 6
      WHEN 'full' THEN 7
    END
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;