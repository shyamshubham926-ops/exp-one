// Strategy Design Pattern: each platform owns its own validation algorithm.
// Adding a new platform means adding one entry here — nothing else has to change
// (Open/Closed Principle).

export const PLATFORM_CONFIG = {
  twitter: {
    label: 'Twitter / X',
    limit: 280,
    color: '#1D9BF0',
    hint: 'Short-form. Every character counts.'
  },
  linkedin: {
    label: 'LinkedIn',
    limit: 3000,
    color: '#0A66C2',
    hint: 'Long-form allowed. First 2-3 lines matter most.'
  },
  instagram: {
    label: 'Instagram',
    limit: 2200,
    color: '#DD2A7B',
    hint: 'Caption + hashtags share this limit.'
  }
};

// Each strategy: (content) => { valid: boolean, message: string | null }
export const validationStrategies = {
  twitter: (content) => {
    const limit = PLATFORM_CONFIG.twitter.limit;
    if (content.trim().length === 0) {
      return { valid: false, message: 'Post cannot be empty.' };
    }
    if (content.length > limit) {
      return { valid: false, message: `Exceeds Twitter limit by ${content.length - limit} characters.` };
    }
    return { valid: true, message: null };
  },
  linkedin: (content) => {
    const limit = PLATFORM_CONFIG.linkedin.limit;
    if (content.trim().length === 0) {
      return { valid: false, message: 'Post cannot be empty.' };
    }
    if (content.length > limit) {
      return { valid: false, message: `Exceeds LinkedIn limit by ${content.length - limit} characters.` };
    }
    return { valid: true, message: null };
  },
  instagram: (content) => {
    const limit = PLATFORM_CONFIG.instagram.limit;
    if (content.trim().length === 0) {
      return { valid: false, message: 'Caption cannot be empty.' };
    }
    if (content.length > limit) {
      return { valid: false, message: `Exceeds Instagram limit by ${content.length - limit} characters.` };
    }
    const hashtagCount = (content.match(/#[\w]+/g) || []).length;
    if (hashtagCount > 30) {
      return { valid: false, message: `Instagram allows max 30 hashtags (found ${hashtagCount}).` };
    }
    return { valid: true, message: null };
  }
};

// Dynamic strategy selector — chooses the algorithm at runtime based on context.
export function validate(platform, content) {
  const strategy = validationStrategies[platform];
  if (!strategy) {
    return { valid: false, message: `No validation strategy registered for "${platform}".` };
  }
  return strategy(content);
}
