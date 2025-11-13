export enum AvailableLanguages {
    English = 'en',
    Spanish = 'es',
    French = 'fr',
    German = 'de',
    Chinese = 'zh',
    Japanese = 'ja',
    Russian = 'ru',
    Italian = 'it',
    Portuguese = 'pt',
}

export enum TranslationSettings {
    TranslateToLanguageMessage = 'settings-translate-to-language-message',
    TranslateToLanguageInput = 'settings-translate-to-language-input',
    TranslateAfterInference = 'settings-translate-after-inference',
}

export const TranslationSettingsDefault: Record<TranslationSettings, boolean | string> = {
    [TranslationSettings.TranslateToLanguageMessage]: AvailableLanguages.Spanish,
    [TranslationSettings.TranslateToLanguageInput]: AvailableLanguages.English,
    [TranslationSettings.TranslateAfterInference]: false,
}
