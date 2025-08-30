import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  interpolate,
  Extrapolate,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface LoaderProps {
  visible: boolean;
  text?: string;
}

const CineTrackLoader: React.FC<LoaderProps> = ({
                                                  visible,
                                                  text = "Loading your collection..."
                                                }) => {
  // Animation values
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0);
  const rotateAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const filmStripAnim = useSharedValue(0);
  const particlesAnim = useSharedValue(0);
  const textAnim = useSharedValue(0);

  // Film reel dots animation
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  const dot4 = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Entry animations
      fadeAnim.value = withTiming(1, { duration: 300 });
      scaleAnim.value = withDelay(100, withSpring(1, { damping: 12, stiffness: 100 }));
      textAnim.value = withDelay(200, withTiming(1, { duration: 400 }));

      // Continuous animations
      rotateAnim.value = withRepeat(
          withTiming(360, { duration: 2000 }),
          -1,
          false
      );

      pulseAnim.value = withRepeat(
          withSequence(
              withTiming(1.1, { duration: 800 }),
              withTiming(1, { duration: 800 })
          ),
          -1,
          true
      );

      filmStripAnim.value = withRepeat(
          withTiming(1, { duration: 1500 }),
          -1,
          true
      );

      particlesAnim.value = withRepeat(
          withSequence(
              withTiming(1, { duration: 2000 }),
              withTiming(0, { duration: 2000 })
          ),
          -1,
          true
      );

      // Film reel dots animation (staggered)
      const dotAnimation = withRepeat(
          withSequence(
              withTiming(1, { duration: 200 }),
              withTiming(0.3, { duration: 200 })
          ),
          -1,
          true
      );

      dot1.value = dotAnimation;
      dot2.value = withDelay(150, dotAnimation);
      dot3.value = withDelay(300, dotAnimation);
      dot4.value = withDelay(450, dotAnimation);

    } else {
      // Exit animations
      fadeAnim.value = withTiming(0, { duration: 200 });
      scaleAnim.value = withTiming(0, { duration: 200 });
      textAnim.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const filmReelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const filmStripStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(filmStripAnim.value, [0, 1], [0, -20]) }
    ],
    opacity: interpolate(filmStripAnim.value, [0, 0.5, 1], [0.3, 1, 0.3]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textAnim.value,
    transform: [
      { translateY: interpolate(textAnim.value, [0, 1], [10, 0]) }
    ],
  }));

  const particle1Style = useAnimatedStyle(() => ({
    opacity: interpolate(particlesAnim.value, [0, 1], [0.4, 1]),
    transform: [
      { translateX: interpolate(particlesAnim.value, [0, 1], [0, 50]) },
      { translateY: interpolate(particlesAnim.value, [0, 1], [0, -30]) }
    ]
  }));

  const particle2Style = useAnimatedStyle(() => ({
    opacity: interpolate(particlesAnim.value, [0, 1], [0.6, 0.2]),
    transform: [
      { translateX: interpolate(particlesAnim.value, [0, 1], [0, -40]) },
      { translateY: interpolate(particlesAnim.value, [0, 1], [0, -50]) }
    ]
  }));

  const particle3Style = useAnimatedStyle(() => ({
    opacity: interpolate(particlesAnim.value, [0, 1], [0.3, 0.8]),
    transform: [
      { translateX: interpolate(particlesAnim.value, [0, 1], [0, 30]) },
      { translateY: interpolate(particlesAnim.value, [0, 1], [0, 40]) }
    ]
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: dot1.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: dot2.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: dot3.value }],
  }));

  const dot4Style = useAnimatedStyle(() => ({
    opacity: dot4.value,
    transform: [{ scale: dot4.value }],
  }));

  if (!visible) return null;

  return (
      <Animated.View style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
        },
        containerStyle
      ]}>
        <BlurView intensity={20} style={{ flex: 1 }}>
          <LinearGradient
              colors={['rgba(0, 0, 0, 0.8)', 'rgba(17, 24, 39, 0.9)', 'rgba(0, 0, 0, 0.8)']}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
          >
            {/* Background Particles */}
            <Animated.View style={[
              {
                position: 'absolute',
                top: height * 0.2,
                left: width * 0.1,
                width: 8,
                height: 8,
                backgroundColor: '#e50914',
                borderRadius: 4,
              },
              particle1Style
            ]} />

            <Animated.View style={[
              {
                position: 'absolute',
                top: height * 0.7,
                right: width * 0.2,
                width: 6,
                height: 6,
                backgroundColor: '#f59e0b',
                borderRadius: 3,
              },
              particle2Style
            ]} />

            <Animated.View style={[
              {
                position: 'absolute',
                top: height * 0.4,
                right: width * 0.1,
                width: 10,
                height: 10,
                backgroundColor: '#10b981',
                borderRadius: 5,
              },
              particle3Style
            ]} />

            {/* Main Loader Container */}
            <Animated.View style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
              },
              loaderStyle
            ]}>

              {/* Film Strip Background */}
              <Animated.View style={[
                {
                  position: 'absolute',
                  width: 120,
                  height: 160,
                  backgroundColor: 'rgba(229, 9, 20, 0.1)',
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: 'rgba(229, 9, 20, 0.3)',
                },
                filmStripStyle
              ]} />

              {/* Film Reel */}
              <Animated.View style={[
                {
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderWidth: 3,
                  borderColor: '#e50914',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  shadowColor: '#e50914',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                },
                filmReelStyle,
                pulseStyle
              ]}>

                {/* Film Reel Spokes */}
                <View style={{
                  position: 'absolute',
                  width: 2,
                  height: 60,
                  backgroundColor: '#e50914',
                }} />
                <View style={{
                  position: 'absolute',
                  width: 60,
                  height: 2,
                  backgroundColor: '#e50914',
                }} />
                <View style={{
                  position: 'absolute',
                  width: 2,
                  height: 42,
                  backgroundColor: '#e50914',
                  transform: [{ rotate: '45deg' }],
                }} />
                <View style={{
                  position: 'absolute',
                  width: 42,
                  height: 2,
                  backgroundColor: '#e50914',
                  transform: [{ rotate: '45deg' }],
                }} />

                {/* Center Circle */}
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#ffffff',
                }} />
              </Animated.View>

              {/* Loading Dots */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <Animated.View style={[
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e50914',
                    marginHorizontal: 4,
                  },
                  dot1Style
                ]} />
                <Animated.View style={[
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e50914',
                    marginHorizontal: 4,
                  },
                  dot2Style
                ]} />
                <Animated.View style={[
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e50914',
                    marginHorizontal: 4,
                  },
                  dot3Style
                ]} />
                <Animated.View style={[
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e50914',
                    marginHorizontal: 4,
                  },
                  dot4Style
                ]} />
              </View>

              {/* CineTrack Logo */}
              <View style={{
                backgroundColor: 'rgba(229, 9, 20, 0.2)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'rgba(229, 9, 20, 0.3)',
                marginBottom: 16,
              }}>
                <Text style={{
                  color: '#e50914',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                  🎬 CineTrack
                </Text>
              </View>

              {/* Loading Text */}
              <Animated.View style={textStyle}>
                <Text style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  {text}
                </Text>
                <Text style={{
                  color: '#9ca3af',
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  Please wait...
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Bottom Cinema Elements */}
            <View style={{
              position: 'absolute',
              bottom: 80,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              {[...Array(5)].map((_, index) => (
                  <View
                      key={index}
                      style={{
                        width: 12,
                        height: 20,
                        backgroundColor: 'rgba(229, 9, 20, 0.3)',
                        marginHorizontal: 2,
                        borderRadius: 2,
                      }}
                  />
              ))}
            </View>
          </LinearGradient>
        </BlurView>
      </Animated.View>
  );
};

export default CineTrackLoader;