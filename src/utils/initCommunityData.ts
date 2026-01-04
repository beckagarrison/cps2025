import { adminApi } from './communityApi';

/**
 * Initialize community data on first app launch
 * Seeds sample advocates and resource links
 */
export async function initializeCommunityData(): Promise<boolean> {
  // Check if already initialized
  const hasInit = localStorage.getItem('cps_community_initialized');
  if (hasInit) {
    console.log('Community data already initialized');
    return true;
  }

  console.log('Initializing community data...');
  
  // Try to call the seed endpoint (may fail if server not running)
  try {
    const result = await adminApi.seedData();
    console.log('Community data seeded:', result);
    localStorage.setItem('cps_community_initialized', 'true');
    return true;
  } catch (error: any) {
    // Server not available or already seeded - this is expected in dev mode
    console.warn('Community data seed skipped:', error.message || 'Server not responding');
    
    // Mark as initialized anyway to avoid repeated errors
    // The community components will handle empty data gracefully
    localStorage.setItem('cps_community_initialized', 'true');
    return true;
  }
}