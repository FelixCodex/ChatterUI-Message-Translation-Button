import { AvailableLanguages, TranslationSettings } from '@lib/constants/TranslationValues'
import { Chats } from './Chat'
import { translate } from './TranslatorService'
import { mmkv } from '@lib/storage/MMKV'

export namespace Translator {
    export const useTranslate = () => {
        const { updateEntry } = Chats.useEntry()
        const updateSwipeTranslation = async (index: number, originalText: string) => {
            const language = mmkv.getString(
                TranslationSettings.TranslateToLanguageMessage
            ) as AvailableLanguages
            const translation = await translate(originalText, language)
            if (translation.success) {
                updateEntry(
                    index,
                    originalText,
                    {},
                    {
                        translation: translation.text,
                        showingTranslation: true,
                    }
                )
            }
        }
        return { translate, updateSwipeTranslation }
    }
}
