interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  refreshRate?: number;
}

// This will cause a warning due to implicit any
let unspecifiedType;

class ConfigManager {
  private static instance: ConfigManager;
  private settings: UserPreferences;

  constructor() {
      this.settings = {
          theme: 'light',
          notifications: true
      };
  }

  // This will cause an error due to accessing private member
  public static getInstance(): ConfigManager {
      if (!ConfigManager.instance) {
          ConfigManager.instance = new this();
      }
      return this.instance;
  }

  @deprecated("Use updateTheme() instead")
  public setTheme(theme: 'light' | 'dark'): void {
      this.settings.theme = theme;
  }

  public async fetchUserConfig(): Promise<UserPreferences> {
      const response = await fetch('/api/config');
      const data: unknown = await response.json();

      // Type assertion and validation
      if (this.isValidConfig(data)) {
          return data;
      }

      throw new Error('Invalid configuration');
  }

  private isValidConfig(data: unknown): data is UserPreferences {
      const config = data as UserPreferences;
      return (
          typeof config === 'object' &&
          config !== null &&
          'theme' in config &&
          'notifications' in config
      );
  }
}

// Generic type example
function createQueue<T>(): Array<T> {
  return [];
}

const numberQueue = createQueue<number>();
numberQueue.push(42);
