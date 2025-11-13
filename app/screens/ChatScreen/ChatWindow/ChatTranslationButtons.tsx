import ThemedButton from '@components/buttons/ThemedButton'
import { Chats, useInference } from '@lib/state/Chat'
import { Logger } from '@lib/state/Logger'
import { Translator } from '@lib/state/Translator'
import { Theme } from '@lib/theme/ThemeManager'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, {
    ZoomIn,
    ZoomOut,
    RotateInDownLeft,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface OptionsStateProps {
    activeIndex?: number
    setActiveIndex: (n: number | undefined) => void
}

useInference.subscribe(({ nowGenerating }) => {
    if (nowGenerating) {
        useChatActionsState.getState().setActiveIndex(undefined)
    }
})
export const useChatActionsState = create<OptionsStateProps>()((set) => ({
    setActiveIndex: (n) => set({ activeIndex: n }),
}))

interface ChatTranslationButtonsProps {
    index: number
    nowGenerating: boolean
}

const ChatTranslationButtons: React.FC<ChatTranslationButtonsProps> = ({
    index,
    nowGenerating,
}) => {
    const { activeIndex, setShowOptions } = useChatActionsState(
        useShallow((state) => ({
            setShowOptions: state.setActiveIndex,
            activeIndex: state.activeIndex,
        }))
    )
    const { updateEntry } = Chats.useEntry()
    const { color } = Theme.useTheme()
    const [loadingTranslation, setLoadingTranslation] = useState(false)
    const { updateSwipeTranslation } = Translator.useTranslate()
    const { swipe, swipeText, swipeTranslation, swipeShowingTranslation } =
        Chats.useSwipeData(index)
    const showOptions = activeIndex === index
    const rotation = useSharedValue(0)

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1500,
                easing: Easing.elastic(2),
            }),
            -1,
            false
        )
    }, [])

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        }
    })

    if (!swipe) return

    const originalText = swipeText ? swipeText : ''

    const handleRemoveTranslation = () => {
        updateEntry(index, originalText, {}, { translation: '', showingTranslation: false })
    }

    const handleSwapTranslation = () => {
        updateEntry(
            index,
            originalText,
            {},
            {
                showingTranslation: !swipeShowingTranslation,
            }
        )
    }

    const handleTranslate = async () => {
        if (swipeTranslation) {
            handleSwapTranslation()
            return
        }
        setLoadingTranslation(true)
        await updateSwipeTranslation(index, originalText)
        setLoadingTranslation(false)
    }

    return (
        <>
            {swipeShowingTranslation && (
                <Animated.View entering={ZoomIn.duration(200)} exiting={ZoomOut.duration(200)}>
                    <ThemedButton
                        variant="tertiary"
                        iconName="close"
                        iconSize={24}
                        iconStyle={{
                            color: color.text._500,
                        }}
                        onPress={() => {
                            if (showOptions) setShowOptions(undefined)
                            if (!nowGenerating) handleRemoveTranslation()
                        }}
                    />
                </Animated.View>
            )}

            <Animated.View
                style={{ flexDirection: 'row' }}
                entering={ZoomIn.duration(200)}
                exiting={ZoomOut.duration(200)}>
                {loadingTranslation ? (
                    <Animated.View style={animatedStyle}>
                        <ThemedButton
                            variant="tertiary"
                            iconName="loading2"
                            iconSize={24}
                            iconStyle={{
                                color: color.text._500,
                            }}
                            onPress={() => {
                                Logger.infoToast('Translation in progress')
                            }}
                        />
                    </Animated.View>
                ) : (
                    <ThemedButton
                        variant="tertiary"
                        iconName={swipeShowingTranslation ? 'retweet' : 'earth'}
                        iconSize={24}
                        iconStyle={{
                            color: color.text._500,
                        }}
                        onPress={() => {
                            if (showOptions) setShowOptions(undefined)
                            if (nowGenerating) return
                            if (swipeShowingTranslation) handleSwapTranslation()
                            else handleTranslate()
                        }}
                    />
                )}
            </Animated.View>
        </>
    )
}

export default ChatTranslationButtons
