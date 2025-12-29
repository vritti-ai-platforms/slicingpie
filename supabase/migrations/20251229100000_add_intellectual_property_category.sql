-- Add intellectual_property category (percentage-based, adds % of total slices at entry time)
INSERT INTO public.categories (id, name, multiplier, input_type, is_auto_calculated, commission_percent, color, emoji)
VALUES ('intellectual_property', 'Intellectual Property', 1, 'currency', false, NULL, 'green', '🧠')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  multiplier = EXCLUDED.multiplier,
  input_type = EXCLUDED.input_type,
  is_auto_calculated = EXCLUDED.is_auto_calculated,
  commission_percent = EXCLUDED.commission_percent,
  color = EXCLUDED.color,
  emoji = EXCLUDED.emoji;
