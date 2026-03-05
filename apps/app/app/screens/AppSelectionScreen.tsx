import { FC, useState } from "react"
import { View, ScrollView, Pressable, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Text, PressableCard } from "@/components"
import { ANIMATION } from "@/config/constants"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { haptics } from "@/utils/haptics"

// =============================================================================
// TYPES
// =============================================================================

interface AppSelectionScreenProps extends AppStackScreenProps<"AppSelection"> { }

// Mock list of apps the user can choose to lock
const LOCKABLE_APPS = [
    { id: "tiktok", name: "TikTok", icon: "logo-tiktok" as const, color: "#000000" },
    { id: "instagram", name: "Instagram", icon: "logo-instagram" as const, color: "#E4405F" },
    { id: "youtube", name: "YouTube", icon: "logo-youtube" as const, color: "#FF0000" },
    { id: "twitter", name: "Twitter", icon: "logo-twitter" as const, color: "#1DA1F2" },
    { id: "facebook", name: "Facebook", icon: "logo-facebook" as const, color: "#1877F2" },
    { id: "snapchat", name: "logo-snapchat" as const, icon: "logo-snapchat" as const, color: "#FFFC00" },
    { id: "reddit", name: "Reddit", icon: "logo-reddit" as const, color: "#FF4500" },
    { id: "discord", name: "Discord", icon: "logo-discord" as const, color: "#5865F2" },
]

// =============================================================================
// COMPONENT
// =============================================================================

export const AppSelectionScreen: FC<AppSelectionScreenProps> = function AppSelectionScreen(_props) {
    const { navigation } = _props
    const { theme } = useUnistyles()
    const insets = useSafeAreaInsets()
    const [selectedApps, setSelectedApps] = useState<string[]>([])
    const [burpeeCount, setBurpeeCount] = useState(5)

    const toggleApp = (appId: string) => {
        haptics.buttonPress()
        setSelectedApps((prev) =>
            prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId],
        )
    }

    const handleSave = () => {
        haptics.buttonPress()
        // TODO: Save to AsyncStorage and configure Device Activity
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.gradientStart, theme.colors.gradientMiddle, theme.colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: insets.top + theme.spacing.lg },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
                        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.foreground} />
                        </Pressable>
                        <Text size="2xl" weight="bold">
                            Lock Apps
                        </Text>
                        <View style={{ width: 44 }} />
                    </Animated.View>

                    {/* Description */}
                    <Animated.View entering={FadeInDown.delay(ANIMATION.STAGGER_DELAY).springify()}>
                        <Text color="secondary" style={styles.description}>
                            Select apps you want to lock. To unlock them, you'll need to complete your burpee
                            challenge! 💪
                        </Text>
                    </Animated.View>

                    {/* Burpee Count Selector */}
                    <PressableCard style={styles.countCard} delay={ANIMATION.STAGGER_DELAY * 1.5}>
                        <View style={styles.countContent}>
                            <View style={styles.countHeader}>
                                <View style={styles.countIconBox}>
                                    <Ionicons name="fitness-outline" size={24} color={theme.colors.palette.primary600} />
                                </View>
                                <Text weight="semiBold" size="lg">
                                    Burpees Required
                                </Text>
                            </View>
                            <Text color="secondary" size="sm" style={styles.countDescription}>
                                How many burpees to unlock your apps?
                            </Text>
                            <View style={styles.countSelector}>
                                <Pressable
                                    style={[styles.countButton, { backgroundColor: theme.colors.backgroundSecondary }]}
                                    onPress={() => {
                                        haptics.buttonPress()
                                        setBurpeeCount(Math.max(1, burpeeCount - 1))
                                    }}
                                >
                                    <Ionicons name="remove" size={24} color={theme.colors.foreground} />
                                </Pressable>
                                <Text size="3xl" weight="bold" style={styles.countNumber}>
                                    {burpeeCount}
                                </Text>
                                <Pressable
                                    style={[styles.countButton, { backgroundColor: theme.colors.backgroundSecondary }]}
                                    onPress={() => {
                                        haptics.buttonPress()
                                        setBurpeeCount(Math.min(50, burpeeCount + 1))
                                    }}
                                >
                                    <Ionicons name="add" size={24} color={theme.colors.foreground} />
                                </Pressable>
                            </View>
                        </View>
                    </PressableCard>

                    {/* App List */}
                    <Animated.View entering={FadeInDown.delay(ANIMATION.STAGGER_DELAY * 2).springify()}>
                        <Text size="xl" weight="bold" style={styles.sectionTitle}>
                            Choose Apps to Lock
                        </Text>
                    </Animated.View>

                    {LOCKABLE_APPS.map((app, index) => {
                        const isSelected = selectedApps.includes(app.id)
                        return (
                            <PressableCard
                                key={app.id}
                                style={[
                                    styles.appCard,
                                    isSelected && {
                                        borderColor: theme.colors.palette.primary500,
                                        borderWidth: 2,
                                    },
                                ]}
                                onPress={() => toggleApp(app.id)}
                                delay={ANIMATION.STAGGER_DELAY * (2.5 + index * 0.3)}
                            >
                                <View style={styles.appContent}>
                                    <View style={[styles.appIconBox, { backgroundColor: app.color + "20" }]}>
                                        <Ionicons name={app.icon} size={28} color={app.color} />
                                    </View>
                                    <Text weight="semiBold" size="lg" style={styles.appName}>
                                        {app.name}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.checkbox,
                                        isSelected
                                            ? { backgroundColor: theme.colors.palette.primary500 }
                                            : { borderColor: theme.colors.border, borderWidth: 2 },
                                    ]}
                                >
                                    {isSelected && <Ionicons name="checkmark" size={18} color="white" />}
                                </View>
                            </PressableCard>
                        )
                    })}

                    {/* Save Button */}
                    {selectedApps.length > 0 && (
                        <Animated.View entering={FadeInDown.springify()} style={styles.saveContainer}>
                            <Pressable style={[styles.saveButton, { backgroundColor: theme.colors.foreground }]} onPress={handleSave}>
                                <Text weight="bold" style={{ color: theme.colors.card, fontSize: 16 }}>
                                    Lock {selectedApps.length} App{selectedApps.length > 1 ? "s" : ""}
                                </Text>
                                <Ionicons name="lock-closed" size={20} color={theme.colors.card} />
                            </Pressable>
                        </Animated.View>
                    )}
                </ScrollView>
            </LinearGradient>
        </View>
    )
}

// =============================================================================
// STYLES
// =============================================================================

const isWeb = Platform.OS === "web"

const styles = StyleSheet.create((theme) => ({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 120,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing.lg,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.card,
        alignItems: "center",
        justifyContent: "center",
        ...theme.shadows.sm,
    },
    description: {
        marginBottom: theme.spacing.xl,
        lineHeight: 22,
    },
    countCard: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius["3xl"],
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.xl,
    },
    countContent: {
        gap: theme.spacing.sm,
    },
    countHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    countIconBox: {
        width: 44,
        height: 44,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.palette.primary100,
        alignItems: "center",
        justifyContent: "center",
    },
    countDescription: {
        marginBottom: theme.spacing.xs,
    },
    countSelector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing.xl,
    },
    countButton: {
        width: 48,
        height: 48,
        borderRadius: theme.radius.full,
        alignItems: "center",
        justifyContent: "center",
    },
    countNumber: {
        minWidth: 60,
        textAlign: "center",
    },
    sectionTitle: {
        marginBottom: theme.spacing.md,
    },
    appCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.xl,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    appContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
    },
    appIconBox: {
        width: 48,
        height: 48,
        borderRadius: theme.radius.lg,
        alignItems: "center",
        justifyContent: "center",
    },
    appName: {
        flex: 1,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: theme.radius.full,
        alignItems: "center",
        justifyContent: "center",
    },
    saveContainer: {
        marginTop: theme.spacing.xl,
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.full,
        paddingVertical: theme.spacing.md,
        gap: theme.spacing.sm,
        ...theme.shadows.lg,
    },
}))
