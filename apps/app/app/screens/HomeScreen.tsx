import { FC } from "react"
import { View, ScrollView, Pressable, Platform, useWindowDimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Text, Avatar, Badge, PressableCard } from "@/components"
import { ANIMATION } from "@/config/constants"
import { useAuth } from "@/hooks"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { webDimension } from "@/types/webStyles"
import { haptics } from "@/utils/haptics"

// =============================================================================
// TYPES
// =============================================================================

interface HomeScreenProps extends MainTabScreenProps<"Home"> { }

// =============================================================================
// CONSTANTS
// =============================================================================

const isWeb = Platform.OS === "web"
const CONTENT_MAX_WIDTH = 800

// =============================================================================
// COMPONENT
// =============================================================================

export const HomeScreen: FC<HomeScreenProps> = function HomeScreen(_props) {
  const { navigation } = _props
  const { theme } = useUnistyles()
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const { width: windowWidth } = useWindowDimensions()

  const isLargeScreen = windowWidth > 768
  const contentStyle = isLargeScreen
    ? {
      maxWidth: CONTENT_MAX_WIDTH,
      alignSelf: "center" as const,
      width: webDimension("100%"),
    }
    : {}

  const handleNavigateToChallenge = () => {
    haptics.buttonPress()
    navigation.navigate("Challenge" as any)
  }

  const handleNavigateToAppSelection = () => {
    haptics.buttonPress()
    navigation.navigate("AppSelection" as any)
  }

  // Use unified user object from useAuth
  const userName = user?.displayName ?? user?.email?.split("@")[0] ?? "Athlete"
  const userInitials = userName.slice(0, 2).toUpperCase()
  const avatarUrl = user?.avatarUrl ?? undefined

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
            contentStyle,
            { paddingTop: insets.top + theme.spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
            <View style={styles.headerLeft}>
              <Avatar
                source={avatarUrl ? { uri: avatarUrl } : undefined}
                fallback={userInitials}
                size="md"
              />
              <View style={styles.headerText}>
                <Text size="sm" color="secondary">
                  Welcome back
                </Text>
                <Text size="xl" weight="bold">
                  {userName}
                </Text>
              </View>
            </View>
            <Pressable
              style={styles.settingsButton}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="settings-outline" size={24} color={theme.colors.foreground} />
            </Pressable>
          </Animated.View>

          {/* Featured Challenge Card */}
          <PressableCard
            style={styles.featuredCard}
            delay={ANIMATION.STAGGER_DELAY}
            onPress={handleNavigateToChallenge}
          >
            <View style={styles.featuredContent}>
              <Badge text="Ready to Unlock" variant="info" size="sm" />
              <View style={styles.titleRow}>
                <View style={styles.featuredIconBox}>
                  <Ionicons
                    name="fitness-outline"
                    size={28}
                    color={theme.colors.palette.primary600}
                  />
                </View>
                <Text
                  size="2xl"
                  weight="bold"
                  style={styles.featuredTitle}
                >
                  Do Your Burpees!
                </Text>
              </View>
              <Text
                color="secondary"
                style={styles.featuredSubtitle}
              >
                Complete 5 burpees to unlock your locked apps. The camera will verify your form.
              </Text>
              <Pressable
                style={styles.startButton}
                onPress={handleNavigateToChallenge}
              >
                <Text weight="semiBold" style={styles.startButtonText}>
                  Start Challenge
                </Text>
                <Ionicons name="play-circle" size={22} color={theme.colors.card} />
              </Pressable>
            </View>
          </PressableCard>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <PressableCard
              style={styles.statCard}
              containerStyle={styles.statCardContainer}
              delay={ANIMATION.STAGGER_DELAY * 2}
            >
              <View style={styles.statIconBox}>
                <Ionicons name="flame-outline" size={18} color={theme.colors.palette.accent500} />
              </View>
              <Text size="2xl" weight="bold">
                0
              </Text>
              <Text size="xs" color="secondary">
                Day Streak
              </Text>
            </PressableCard>
            <PressableCard
              style={styles.statCard}
              containerStyle={styles.statCardContainer}
              delay={ANIMATION.STAGGER_DELAY * 2.5}
            >
              <View style={styles.statIconBox}>
                <Ionicons
                  name="barbell-outline"
                  size={18}
                  color={theme.colors.success}
                />
              </View>
              <Text size="2xl" weight="bold">
                0
              </Text>
              <Text size="xs" color="secondary">
                Burpees Done
              </Text>
            </PressableCard>
            <PressableCard
              style={styles.statCard}
              containerStyle={styles.statCardContainer}
              delay={ANIMATION.STAGGER_DELAY * 3}
            >
              <View style={styles.statIconBox}>
                <Ionicons name="lock-closed-outline" size={18} color={theme.colors.warning} />
              </View>
              <Text size="2xl" weight="bold">
                0
              </Text>
              <Text size="xs" color="secondary">
                Apps Locked
              </Text>
            </PressableCard>
          </View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(ANIMATION.STAGGER_DELAY * 3.5).springify()}>
            <Text size="xl" weight="bold" style={styles.sectionTitle}>
              Manage
            </Text>
          </Animated.View>

          <PressableCard
            style={styles.actionCard}
            onPress={handleNavigateToAppSelection}
            delay={ANIMATION.STAGGER_DELAY * 4}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionTitleRow}>
                <View
                  style={[styles.iconBox, { backgroundColor: theme.colors.palette.primary100 }]}
                >
                  <Ionicons
                    name="apps-outline"
                    size={24}
                    color={theme.colors.palette.primary600}
                  />
                </View>
                <Text weight="semiBold" style={styles.actionTitle}>
                  Lock Apps
                </Text>
              </View>
              <Text size="sm" color="secondary" style={styles.actionDescription}>
                Choose which apps require burpees before opening
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.foregroundTertiary} />
          </PressableCard>

          <PressableCard
            style={styles.actionCard}
            onPress={handleNavigateToChallenge}
            delay={ANIMATION.STAGGER_DELAY * 4.5}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionTitleRow}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: theme.colors.palette.secondary100 },
                  ]}
                >
                  <Ionicons
                    name="videocam-outline"
                    size={24}
                    color={theme.colors.palette.secondary600}
                  />
                </View>
                <Text weight="semiBold" style={styles.actionTitle}>
                  Quick Workout
                </Text>
              </View>
              <Text size="sm" color="secondary" style={styles.actionDescription}>
                Do a quick burpee session with AI verification
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.foregroundTertiary} />
          </PressableCard>

          <PressableCard
            style={styles.actionCard}
            onPress={() => navigation.navigate("Profile")}
            delay={ANIMATION.STAGGER_DELAY * 5}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionTitleRow}>
                <View
                  style={[styles.iconBox, { backgroundColor: theme.colors.palette.accent100 }]}
                >
                  <Ionicons
                    name="trophy-outline"
                    size={24}
                    color={theme.colors.palette.accent600}
                  />
                </View>
                <Text weight="semiBold" style={styles.actionTitle}>
                  Your Progress
                </Text>
              </View>
              <Text size="sm" color="secondary" style={styles.actionDescription}>
                View stats, streaks, and workout history
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.foregroundTertiary} />
          </PressableCard>
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    // Web needs explicit height
    ...(isWeb && {
      minHeight: webDimension("100vh"),
    }),
  },
  gradient: {
    flex: 1,
    // Web needs explicit height
    ...(isWeb && {
      minHeight: webDimension("100vh"),
    }),
  },
  scrollView: {
    flex: 1,
    // Enable mouse wheel scrolling on web
    ...(isWeb && {
      overflowY: "auto" as unknown as "scroll",
    }),
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerText: {
    gap: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  featuredCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius["3xl"],
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.xl,
  },
  featuredContent: {
    gap: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  featuredIconBox: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.palette.primary100,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredTitle: {
    flex: 1,
    lineHeight: theme.typography.lineHeights["2xl"],
    letterSpacing: -0.5,
  },
  featuredSubtitle: {
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeights.base,
  },
  startButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.foreground,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
    minHeight: theme.sizes.button.md,
    ...theme.shadows.sm,
  },
  startButtonText: {
    color: theme.colors.card,
    fontSize: theme.typography.sizes.base,
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  statCardContainer: {
    flex: 1,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.xl,
    alignItems: "center",
    gap: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xxs,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  actionContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  actionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  actionTitle: {
    flex: 1,
  },
  actionDescription: {
    marginLeft: 0,
  },
}))
