-- Seed daily questions
INSERT INTO questions (question_text, category) VALUES
('What moment today made you feel most alive?', 'reflection'),
('How did you handle a challenge you faced today?', 'resilience'),
('What are you grateful for right now?', 'gratitude'),
('Describe a conversation that impacted you today.', 'connection'),
('What emotion dominated your day, and why?', 'emotion'),
('What did you learn about yourself today?', 'self-awareness'),
('How did you practice self-care today?', 'wellness'),
('What would you do differently if you could redo today?', 'growth'),
('Who made a positive impact on your day?', 'connection'),
('What are you looking forward to tomorrow?', 'optimism'),
('How did you step outside your comfort zone today?', 'growth'),
('What thoughts kept returning to you today?', 'mindfulness'),
('Describe a small win you had today.', 'achievement'),
('How did you show kindness to yourself or others today?', 'compassion'),
('What made you smile today?', 'joy')
ON CONFLICT DO NOTHING;

-- Seed rewards catalog
INSERT INTO rewards (name, description, points_required, category, availability) VALUES
('$5 Amazon Gift Card', 'Redeem your points for a $5 Amazon gift card', 500, 'gift_cards', true),
('$10 Starbucks Gift Card', 'Enjoy a coffee on us with a $10 Starbucks card', 800, 'gift_cards', true),
('Premium Theme Pack', 'Unlock exclusive app themes and colors', 200, 'customization', true),
('Extended AI Insights', 'Get deeper analysis on your reflections for a week', 300, 'features', true),
('$25 Amazon Gift Card', 'Redeem your points for a $25 Amazon gift card', 2000, 'gift_cards', true),
('Monthly Wellness Box', 'Curated self-care items delivered to you', 3000, 'physical', true),
('1-on-1 Coaching Session', '30-minute session with a certified life coach', 5000, 'services', true),
('Custom Avatar', 'Design your own unique avatar for your profile', 150, 'customization', true)
ON CONFLICT DO NOTHING;
