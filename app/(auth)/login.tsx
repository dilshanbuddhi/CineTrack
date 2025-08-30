import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { login } from "@/services/authService";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withRepeat,
    withSequence,
    interpolate,
    Extrapolate,
    runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Loader from "@/components/Loader";

const { width, height } = Dimensions.get('window');

// Animated Components
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Animation values
    const fadeAnim = useSharedValue(0);
    const slideAnim = useSharedValue(50);
    const scaleAnim = useSharedValue(0.8);
    const logoAnim = useSharedValue(0);
    const inputFocusAnim1 = useSharedValue(0);
    const inputFocusAnim2 = useSharedValue(0);
    const buttonPressAnim = useSharedValue(1);
    const backgroundAnim = useSharedValue(0);

    // Floating particles animation
    const particle1 = useSharedValue(0);
    const particle2 = useSharedValue(0);
    const particle3 = useSharedValue(0);

    useEffect(() => {
        // Initial animations
        fadeAnim.value = withTiming(1, { duration: 1000 });
        slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
        scaleAnim.value = withSpring(1, { damping: 12, stiffness: 100 });
        logoAnim.value = withSequence(
            withTiming(1, { duration: 800 }),
            withSpring(1, { damping: 8, stiffness: 100 })
        );

        // Background gradient animation
        backgroundAnim.value = withRepeat(
            withTiming(1, { duration: 3000 }),
            -1,
            true
        );

        // Floating particles
        particle1.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2000 }),
                withTiming(0, { duration: 2000 })
            ),
            -1,
            true
        );

        particle2.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2500 }),
                withTiming(0, { duration: 2500 })
            ),
            -1,
            true
        );

        particle3.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3000 }),
                withTiming(0, { duration: 3000 })
            ),
            -1,
            true
        );
    }, []);

    const handleEmailChange = (text: string) => setEmail(text);
    const handlePasswordChange = (text: string) => setPassword(text);

    const handleLogin = async () => {
        if (!email || !password) {
            // Shake animation for error
            buttonPressAnim.value = withSequence(
                withTiming(0.95, { duration: 100 }),
                withSpring(1, { damping: 8, stiffness: 300 })
            );
            alert("Please fill all fields!");
            return;
        }

        setLoading(true);
        buttonPressAnim.value = withTiming(0.95, { duration: 150 });

        try {
            await login(email, password);
            buttonPressAnim.value = withSpring(1.05, { damping: 8 });
            setTimeout(() => {
                router.push('/(dashboard)/home');
            }, 200);
        } catch (err) {
            console.log(err);
            buttonPressAnim.value = withSequence(
                withTiming(0.9, { duration: 100 }),
                withSpring(1, { damping: 8, stiffness: 300 })
            );
            alert("Login failed!");
        } finally {
            setLoading(false);
        }
    };

    // Animated styles
    const containerStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        transform: [
            { translateY: slideAnim.value },
            { scale: scaleAnim.value }
        ],
    }));

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoAnim.value }],
    }));

    const emailInputStyle = useAnimatedStyle(() => {
        const borderColor = interpolate(
            inputFocusAnim1.value,
            [0, 1],
            [0.5, 1],
            Extrapolate.CLAMP
        ) > 0.75 ? '#e50914' : '#374151';

        return {
            transform: [{ scale: withTiming(inputFocusAnim1.value > 0 ? 1.02 : 1) }],
            borderColor: borderColor,
        };
    });

    const passwordInputStyle = useAnimatedStyle(() => {
        const borderColor = interpolate(
            inputFocusAnim2.value,
            [0, 1],
            [0.5, 1],
            Extrapolate.CLAMP
        ) > 0.75 ? '#e50914' : '#374151';

        return {
            transform: [{ scale: withTiming(inputFocusAnim2.value > 0 ? 1.02 : 1) }],
            borderColor: borderColor,
        };
    });

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonPressAnim.value }],
    }));

    const backgroundStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: interpolate(
                backgroundAnim.value,
                [0, 1],
                [-50, 50],
                Extrapolate.CLAMP
            )
        }]
    }));

    const particle1Style = useAnimatedStyle(() => ({
        opacity: particle1.value,
        transform: [
            { translateY: interpolate(particle1.value, [0, 1], [0, -100]) },
            { translateX: interpolate(particle1.value, [0, 1], [0, 50]) }
        ]
    }));

    const particle2Style = useAnimatedStyle(() => ({
        opacity: particle2.value,
        transform: [
            { translateY: interpolate(particle2.value, [0, 1], [0, -80]) },
            { translateX: interpolate(particle2.value, [0, 1], [0, -30]) }
        ]
    }));

    const particle3Style = useAnimatedStyle(() => ({
        opacity: particle3.value,
        transform: [
            { translateY: interpolate(particle3.value, [0, 1], [0, -120]) },
            { translateX: interpolate(particle3.value, [0, 1], [0, 70]) }
        ]
    }));

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Background */}
            <LinearGradient
                colors={['#000000', '#1a1a1a', '#000000']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Animated Background Elements */}
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            top: height * 0.1,
                            left: width * 0.1,
                            width: 100,
                            height: 100,
                            backgroundColor: '#e50914',
                            borderRadius: 50,
                            opacity: 0.1,
                        },
                        backgroundStyle
                    ]}
                />

                {/* Floating Particles */}
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            top: height * 0.2,
                            left: width * 0.8,
                            width: 8,
                            height: 8,
                            backgroundColor: '#e50914',
                            borderRadius: 4,
                        },
                        particle1Style
                    ]}
                />

                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            top: height * 0.3,
                            left: width * 0.2,
                            width: 6,
                            height: 6,
                            backgroundColor: '#ffffff',
                            borderRadius: 3,
                        },
                        particle2Style
                    ]}
                />

                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            top: height * 0.4,
                            left: width * 0.9,
                            width: 4,
                            height: 4,
                            backgroundColor: '#e50914',
                            borderRadius: 2,
                        },
                        particle3Style
                    ]}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Animated.View style={[{ paddingHorizontal: 24 }, containerStyle]}>

                            {/* Logo Section */}
                            <Animated.View style={[{ alignItems: 'center', marginBottom: 48 }, logoStyle]}>
                                <View style={{
                                    backgroundColor: '#e50914',
                                    width: 64,
                                    height: 64,
                                    borderRadius: 16,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold' }}>🎬</Text>
                                </View>
                                <Text style={{
                                    color: '#ffffff',
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}>
                                    Movie Tracker
                                </Text>
                                <Text style={{
                                    color: '#9CA3AF',
                                    fontSize: 18,
                                    textAlign: 'center',
                                    marginTop: 8
                                }}>
                                    Your Cinema Journey Starts Here
                                </Text>
                            </Animated.View>

                            {/* Email Input */}
                            <Animated.View style={emailInputStyle}>
                                <TextInput
                                    style={{
                                        backgroundColor: '#1f2937',
                                        borderWidth: 2,
                                        borderColor: '#374151',
                                        padding: 16,
                                        marginBottom: 16,
                                        borderRadius: 12,
                                        color: '#ffffff',
                                        fontSize: 16,
                                    }}
                                    placeholder="Email"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={handleEmailChange}
                                    onFocus={() => {
                                        inputFocusAnim1.value = withSpring(1, { damping: 15, stiffness: 100 });
                                    }}
                                    onBlur={() => {
                                        inputFocusAnim1.value = withSpring(0, { damping: 15, stiffness: 100 });
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Animated.View>

                            {/* Password Input */}
                            <Animated.View style={passwordInputStyle}>
                                <View style={{ position: 'relative' }}>
                                    <TextInput
                                        style={{
                                            backgroundColor: '#1f2937',
                                            borderWidth: 2,
                                            borderColor: '#374151',
                                            padding: 16,
                                            paddingRight: 50,
                                            marginBottom: 24,
                                            borderRadius: 12,
                                            color: '#ffffff',
                                            fontSize: 16,
                                        }}
                                        placeholder="Password"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={handlePasswordChange}
                                        onFocus={() => {
                                            inputFocusAnim2.value = withSpring(1, { damping: 15, stiffness: 100 });
                                        }}
                                        onBlur={() => {
                                            inputFocusAnim2.value = withSpring(0, { damping: 15, stiffness: 100 });
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            right: 16,
                                            top: 16,
                                            padding: 4,
                                        }}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Text style={{ color: '#9CA3AF', fontSize: 18 }}>
                                            {showPassword ? '🙈' : '👁️'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>

                            {/* Login Button */}
                            <AnimatedTouchableOpacity
                                style={[buttonStyle]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={['#e50914', '#b8070f']}
                                    style={{
                                        padding: 16,
                                        borderRadius: 12,
                                        marginBottom: 24
                                    }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={{
                                        textAlign: 'center',
                                        color: '#ffffff',
                                        fontSize: 18,
                                        fontWeight: 'bold'
                                    }}>
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </Text>
                                </LinearGradient>
                            </AnimatedTouchableOpacity>

                            {/* Sign Up Link */}
                            <TouchableOpacity
                                onPress={() => router.push('/register')}
                                style={{ alignItems: 'center' }}
                            >
                                <Text style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 16 }}>
                                    Don't have an account?{' '}
                                    <Text style={{ color: '#e50914', fontWeight: '600' }}>Sign Up</Text>
                                </Text>
                            </TouchableOpacity>

                            {/* Forgot Password */}
                            <TouchableOpacity style={{ alignItems: 'center', marginTop: 16 }}>
                                <Text style={{ textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Loading Modal */}
                <Loader visible={loading}/>
            </LinearGradient>
        </>
    );
};

export default Login;