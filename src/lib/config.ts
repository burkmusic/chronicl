export const config = {
  github: {
    // Configuration for public GitHub repositories
  },
} as const;

// No configuration validation needed
export function validateConfig() {
  // Configuration is always valid for public repos
} 