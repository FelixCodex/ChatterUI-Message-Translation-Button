import { AvailableLanguages } from '@lib/constants/TranslationValues'
import { Logger } from './Logger'

const WarningEmptyText = '[Translator] Empty Translation'
const WarningWrongText = '[Translator] Something went wrong with the translation. Try again'
const WarningConnectionText =
    '[Translator] Something went wrong with the translation. Check your connection'

export const translate = async (text: string, language: AvailableLanguages) => {
    if (!text) return { success: false, text: null }
    Logger.info('[Translator] To Language: ' + language)
    Logger.info('[Translator] Original text: ' + text)
    const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${text}`
    )
    if (res.status === 500) {
        Logger.infoToast(WarningConnectionText)
        return { success: false, text: null }
    }
    if (!(res.status === 200)) {
        Logger.infoToast(WarningWrongText)
        return { success: false, text: null }
    }
    const json = await res.json()
    if (!json[0][0][0]) {
        Logger.infoToast(WarningEmptyText)
        return { success: false, text: null }
    }
    let translation = json[0][0][0]
    let i = 1
    while (json[0][i]) {
        try {
            Logger.info(`[${i}] ` + json[0][i][0])
            translation += json[0][i][0]
            i++
        } catch (e) {
            Logger.info('Error getting string on ' + i + ' position')
        }
    }

    Logger.info('[Translator] Translated text: ' + translation)
    return { success: true, text: translation }
}
