export interface Bot {
  settings: BotSettings;
  name: string;
  token: string;
  createdAt: Date;
  eventListeners: {[key: string]: BotEventListener};
}

export interface BotSettings {
  prefix: string;
  slashCommands: boolean;
  onlySlashCommands: boolean;
  ignoreSelf: boolean;
}

export interface DatabaseRoot {
  plugins: {
    enabled: string[],
  },
  bots: {[key: string]: Bot}
  selectedBot: string;
  settings: ApplicationSettings;
}

export interface ApplicationSettings {
  language: string;
}

export interface BotEventListener {
  code: Code;
}

export interface Code {
  code: string;
  prelexed: null;
}