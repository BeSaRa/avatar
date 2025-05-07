export const Config = {
  VERSION: 'v0.0.13',
  BASE_ENVIRONMENT: '',
  ENVIRONMENTS_URLS: {},
  BASE_URL: '',
  KUNA: '',
  API_VERSION: 'v1',
  OCP_APIM_KEY: {} as Record<string, string>,
  EXTERNAL_PROTOCOLS: ['http', 'https'],
  IS_OCP: false,
  IDLE_AVATARS: [] as string[],
}

export type ConfigType = typeof Config
