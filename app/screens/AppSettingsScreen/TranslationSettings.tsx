import DropdownSheet from '@components/input/DropdownSheet'
import ThemedSwitch from '@components/input/ThemedSwitch'
import SectionTitle from '@components/text/SectionTitle'
import {
    AvailableLanguages as Languages,
    TranslationSettings as TransStt,
} from '@lib/constants/TranslationValues'
import { Theme } from '@lib/theme/ThemeManager'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv'

const selectorData = Object.keys(Languages).map((key) => {
    return { label: key, value: Languages[key] }
})

const TranslationSettingsFrame = () => {
    const { color } = Theme.useTheme()
    const [afterInference, setAfterInference] = useMMKVBoolean(TransStt.TranslateAfterInference)

    const [toLanguageMsg, setToLanguageMsg] = useMMKVString(TransStt.TranslateToLanguageMessage)
    const [toLanguageInput, setToLanguageInput] = useMMKVString(TransStt.TranslateToLanguageMessage)

    const [selectedMsg, setSelectedMsg] = useState<(typeof selectorData)[0]>(
        selectorData.find((e) => e.value === toLanguageMsg) ?? selectorData[0]
    )

    const [selectedInput, setSelectedInput] = useState<(typeof selectorData)[0]>(
        selectorData.find((e) => e.value === toLanguageInput) ?? selectorData[1]
    )

    return (
        <View style={{ rowGap: 8 }}>
            <SectionTitle>Translation</SectionTitle>

            <View>
                <Text style={{ color: color.text._300 }}>Translate Message To Language</Text>
            </View>
            <DropdownSheet
                data={selectorData}
                selected={selectedMsg}
                onChangeValue={(val) => {
                    setToLanguageMsg(val.value)
                    setSelectedMsg(val)
                }}
                labelExtractor={(item) => item.label}
            />
            <View>
                <Text style={{ color: color.text._300 }}>Translate Input To Language</Text>
            </View>
            <DropdownSheet
                data={selectorData}
                selected={selectedInput}
                onChangeValue={(val) => {
                    setToLanguageInput(val.value)
                    setSelectedInput(val)
                }}
                labelExtractor={(item) => item.label}
            />
            <ThemedSwitch
                label="Auto Translate"
                value={afterInference}
                onChangeValue={setAfterInference}
                description="Auto Translate message text after each generation"
            />
        </View>
    )
}

export default TranslationSettingsFrame
