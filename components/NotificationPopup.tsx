import React, {  useEffect } from 'react';
import { useSharedValue, withTiming, withSpring, withDelay, interpolate, Extrapolate, withRepeat, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Movie } from '../types/movie';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,

    Modal, Dimensions,
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');


// Notification Popup Component
const NotificationPopup = ({ visible, movies, onClose, onMoviePress }: {
    visible: boolean;
    movies: Movie[];
    onClose: () => void;
    onMoviePress: (movie: Movie) => void;
}) => {
    const popupAnim = useSharedValue(0);
    const overlayAnim = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            overlayAnim.value = withTiming(1, { duration: 300 });
            popupAnim.value = withDelay(100, withSpring(1, { damping: 15, stiffness: 100 }));
        } else {
            popupAnim.value = withTiming(0, { duration: 200 });
            overlayAnim.value = withDelay(100, withTiming(0, { duration: 200 }));
        }
    }, [visible]);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayAnim.value,
    }));

    const popupStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: popupAnim.value },
            { translateY: interpolate(popupAnim.value, [0, 1], [50, 0]) },
        ],
        opacity: popupAnim.value,
    }));

    if (!visible) return null;

    return (
        <SafeAreaView>
        <Modal transparent visible={visible} animationType="none">
            <Animated.View style={[
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                },
                overlayStyle
            ]}>
                <Animated.View style={[popupStyle]}>
                    <BlurView intensity={30} style={{ borderRadius: 20, overflow: 'hidden', margin: 20 }}>
                        <LinearGradient
                            colors={['rgba(31, 41, 55, 0.95)', 'rgba(17, 24, 39, 0.95)']}
                            style={{
                                padding: 24,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'rgba(229, 9, 20, 0.3)',
                                //maxWidth: width * 0.9,
                                //maxHeight: height * 0.7,
                            }}
                        >
                            {/* Header */}
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <Text style={{ fontSize: 40, marginBottom: 8 }}>🔔</Text>
                                <Text style={{
                                    color: '#ffffff',
                                    fontSize: 22,
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}>
                                    Weekly Reminder
                                </Text>
                                <Text style={{
                                    color: '#9ca3af',
                                    fontSize: 14,
                                    textAlign: 'center',
                                    marginTop: 4
                                }}>
                                    You have movies waiting to be watched!
                                </Text>
                            </View>

                            {/* Movies List */}
                            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                                {movies.map((movie, index) => (
                                    <TouchableOpacity
                                        key={movie.id}
                                        onPress={() => onMoviePress(movie)}
                                        style={{
                                            flexDirection: 'row',
                                            backgroundColor: 'rgba(75, 85, 99, 0.3)',
                                            borderRadius: 12,
                                            padding: 12,
                                            marginBottom: 12,
                                            borderWidth: 1,
                                            borderColor: 'rgba(229, 9, 20, 0.2)',
                                        }}
                                    >
                                        <View style={{
                                            width: 50,
                                            height: 70,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            backgroundColor: '#374151',
                                        }}>
                                            <Image
                                                source={{ uri: movie.posterUrl }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode="cover"
                                            />
                                        </View>

                                        <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
                                            <Text style={{
                                                color: '#ffffff',
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                marginBottom: 4,
                                            }}>
                                                {movie.title}
                                            </Text>
                                            <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                                                {movie.genre} • {movie.releaseYear}
                                            </Text>
                                            <Text style={{
                                                color: '#f59e0b',
                                                fontSize: 11,
                                                marginTop: 4,
                                                fontStyle: 'italic'
                                            }}>
                                                📋 In watchlist for 7+ days
                                            </Text>
                                        </View>

                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: '#e50914', fontSize: 16 }}>▶️</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Action Buttons */}
                            <View style={{
                                flexDirection: 'row',
                                marginTop: 20,
                                gap: 12,
                            }}>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'rgba(75, 85, 99, 0.5)',
                                        padding: 12,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                                        Later
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={onClose}
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#e50914',
                                        padding: 12,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                                        Got it!
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </BlurView>
                </Animated.View>
            </Animated.View>
        </Modal>
        </SafeAreaView>
    );
};

export default NotificationPopup;