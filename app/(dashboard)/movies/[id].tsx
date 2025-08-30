import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
    Modal,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    interpolate,
    Extrapolate,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Movie/Series interface
interface MovieSeries {
    id: string;
    title: string;
    genre: string;
    releaseYear: number;
    status: 'Watchlist' | 'Watching' | 'Watched';
    type: 'Movie' | 'Series';
    posterUrl?: string;
    description?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
    'Romance', 'Thriller', 'Documentary', 'Animation', 'Fantasy'
];

const statuses = ['Watchlist', 'Watching', 'Watched'];
const types = ['Movie', 'Series'];

const AddMovieScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isNew = !id || id === "new";

    const [movie, setMovie] = useState<MovieSeries>({
        id: "",
        title: "",
        genre: "Action",
        releaseYear: new Date().getFullYear(),
        status: "Watchlist",
        type: "Movie",
        posterUrl: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [showGenreModal, setShowGenreModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);

    // Animation values
    const fadeAnim = useSharedValue(0);
    const slideAnim = useSharedValue(50);
    const headerAnim = useSharedValue(0);
    const formAnim = useSharedValue(0);
    const buttonAnim = useSharedValue(1);

    // Background particles
    const particle1 = useSharedValue(0);
    const particle2 = useSharedValue(0);
    const particle3 = useSharedValue(0);

    useEffect(() => {
        // Entry animations
        fadeAnim.value = withDelay(200, withTiming(1, { duration: 800 }));
        slideAnim.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }));
        headerAnim.value = withDelay(400, withSpring(1, { damping: 12, stiffness: 100 }));
        formAnim.value = withDelay(500, withTiming(1, { duration: 600 }));

        // Floating particles animation
        particle1.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3000 }),
                withTiming(0, { duration: 3000 })
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
                withTiming(1, { duration: 3500 }),
                withTiming(0, { duration: 3500 })
            ),
            -1,
            true
        );
    }, []);

    const handleChange = (key: keyof MovieSeries, value: string | number) => {
        setMovie(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!movie.title.trim()) {
            Alert.alert("Error", "Please enter a title");
            return;
        }

        if (!movie.releaseYear || movie.releaseYear < 1900 || movie.releaseYear > new Date().getFullYear() + 5) {
            Alert.alert("Error", "Please enter a valid release year");
            return;
        }

        // Button animation
        buttonAnim.value = withSequence(
            withTiming(0.95, { duration: 150 }),
            withSpring(1, { damping: 8, stiffness: 100 })
        );

        try {
            setLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would normally save to Firebase
            console.log("Saving movie:", movie);

            // Success animation
            buttonAnim.value = withSpring(1.05, { damping: 8 });

            setTimeout(() => {
                router.back();
            }, 500);
        } catch (error) {
            console.error("Error saving movie:", error);
            Alert.alert("Error", "Failed to save movie/series");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Watchlist': return '#f59e0b';
            case 'Watching': return '#10b981';
            case 'Watched': return '#6366f1';
            default: return '#9ca3af';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Watchlist': return '📋';
            case 'Watching': return '👀';
            case 'Watched': return '✅';
            default: return '📱';
        }
    };

    const getTypeIcon = (type: string) => {
        return type === 'Movie' ? '🎬' : '📺';
    };

    // Animated styles
    const containerStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        transform: [{ translateY: slideAnim.value }],
    }));

    const headerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: headerAnim.value }],
    }));

    const formStyle = useAnimatedStyle(() => ({
        opacity: formAnim.value,
    }));

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonAnim.value }],
    }));

    const particle1Style = useAnimatedStyle(() => ({
        opacity: interpolate(particle1.value, [0, 1], [0.3, 0.8]),
        transform: [
            { translateY: interpolate(particle1.value, [0, 1], [0, -100]) },
            { translateX: interpolate(particle1.value, [0, 1], [0, 30]) }
        ]
    }));

    const particle2Style = useAnimatedStyle(() => ({
        opacity: interpolate(particle2.value, [0, 1], [0.2, 0.6]),
        transform: [
            { translateY: interpolate(particle2.value, [0, 1], [0, -80]) },
            { translateX: interpolate(particle2.value, [0, 1], [0, -50]) }
        ]
    }));

    const particle3Style = useAnimatedStyle(() => ({
        opacity: interpolate(particle3.value, [0, 1], [0.4, 0.9]),
        transform: [
            { translateY: interpolate(particle3.value, [0, 1], [0, -120]) },
            { translateX: interpolate(particle3.value, [0, 1], [0, 20]) }
        ]
    }));

    const ModalSelector = ({
                               visible,
                               onClose,
                               title,
                               options,
                               selectedValue,
                               onSelect,
                               getIcon
                           }: {
        visible: boolean;
        onClose: () => void;
        title: string;
        options: string[];
        selectedValue: string;
        onSelect: (value: string) => void;
        getIcon?: (value: string) => string;
    }) => (
        <Modal transparent visible={visible} animationType="fade">
            <BlurView intensity={50} style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }}>
                    <View style={{
                        backgroundColor: '#1f2937',
                        borderRadius: 20,
                        padding: 20,
                        width: width * 0.8,
                        maxHeight: height * 0.6,
                        borderWidth: 1,
                        borderColor: 'rgba(75, 85, 99, 0.3)',
                    }}>
                        <Text style={{
                            color: '#ffffff',
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: 20,
                        }}>
                            Select {title}
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => {
                                        onSelect(option);
                                        onClose();
                                    }}
                                    style={{
                                        padding: 16,
                                        borderRadius: 12,
                                        marginBottom: 8,
                                        backgroundColor: selectedValue === option ? '#e50914' : 'rgba(55, 65, 81, 0.5)',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {getIcon && (
                                        <Text style={{ fontSize: 20, marginRight: 12 }}>
                                            {getIcon(option)}
                                        </Text>
                                    )}
                                    <Text style={{
                                        color: selectedValue === option ? '#ffffff' : '#9ca3af',
                                        fontSize: 16,
                                        fontWeight: selectedValue === option ? 'bold' : 'normal',
                                    }}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                marginTop: 16,
                                padding: 12,
                                backgroundColor: 'rgba(75, 85, 99, 0.5)',
                                borderRadius: 12,
                            }}
                        >
                            <Text style={{
                                color: '#9ca3af',
                                textAlign: 'center',
                                fontSize: 16,
                            }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Background */}
            <LinearGradient
                colors={['#000000', '#111827', '#000000']}
                style={{ flex: 1 }}
            >
                {/* Floating Particles */}
                <Animated.View style={[
                    {
                        position: 'absolute',
                        top: height * 0.1,
                        left: width * 0.8,
                        width: 10,
                        height: 10,
                        backgroundColor: '#e50914',
                        borderRadius: 5,
                    },
                    particle1Style
                ]} />

                <Animated.View style={[
                    {
                        position: 'absolute',
                        top: height * 0.3,
                        left: width * 0.1,
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
                        top: height * 0.5,
                        left: width * 0.9,
                        width: 8,
                        height: 8,
                        backgroundColor: '#10b981',
                        borderRadius: 4,
                    },
                    particle3Style
                ]} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <Animated.View style={[{ flex: 1 }, containerStyle]}>

                        {/* Header */}
                        <Animated.View style={[
                            headerStyle,
                            {
                                paddingTop: 50,
                                paddingHorizontal: 20,
                                paddingBottom: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }
                        ]}>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={{
                                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                    padding: 12,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: 'rgba(75, 85, 99, 0.3)',
                                }}
                            >
                                <Text style={{ color: '#ffffff', fontSize: 18 }}>←</Text>
                            </TouchableOpacity>

                            <View style={{ alignItems: 'center' }}>
                                <Text style={{
                                    color: '#ffffff',
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                }}>
                                    {isNew ? 'Add to Collection' : 'Edit Movie'}
                                </Text>
                                <Text style={{
                                    color: '#9ca3af',
                                    fontSize: 14,
                                    marginTop: 4,
                                }}>
                                    Track your cinema journey
                                </Text>
                            </View>

                            <View style={{ width: 44 }} />
                        </Animated.View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        >
                            <Animated.View style={[{ paddingHorizontal: 20 }, formStyle]}>

                                {/* Title Input */}
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={{
                                        color: '#ffffff',
                                        fontSize: 16,
                                        fontWeight: '600',
                                        marginBottom: 8,
                                    }}>
                                        Title *
                                    </Text>
                                    <AnimatedTextInput
                                        style={{
                                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                            borderWidth: 1,
                                            borderColor: 'rgba(75, 85, 99, 0.5)',
                                            padding: 16,
                                            borderRadius: 12,
                                            color: '#ffffff',
                                            fontSize: 16,
                                        }}
                                        placeholder="Enter movie or series title"
                                        placeholderTextColor="#9ca3af"
                                        value={movie.title}
                                        onChangeText={(text) => handleChange('title', text)}
                                    />
                                </View>

                                {/* Type & Genre Row */}
                                <View style={{
                                    flexDirection: 'row',
                                    marginBottom: 20,
                                    gap: 12,
                                }}>
                                    {/* Type Selector */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            color: '#ffffff',
                                            fontSize: 16,
                                            fontWeight: '600',
                                            marginBottom: 8,
                                        }}>
                                            Type
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => setShowTypeModal(true)}
                                            style={{
                                                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                                borderWidth: 1,
                                                borderColor: 'rgba(75, 85, 99, 0.5)',
                                                padding: 16,
                                                borderRadius: 12,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 16, marginRight: 8 }}>
                                                    {getTypeIcon(movie.type)}
                                                </Text>
                                                <Text style={{ color: '#ffffff', fontSize: 16 }}>
                                                    {movie.type}
                                                </Text>
                                            </View>
                                            <Text style={{ color: '#9ca3af', fontSize: 16 }}>▼</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Genre Selector */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            color: '#ffffff',
                                            fontSize: 16,
                                            fontWeight: '600',
                                            marginBottom: 8,
                                        }}>
                                            Genre
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => setShowGenreModal(true)}
                                            style={{
                                                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                                borderWidth: 1,
                                                borderColor: 'rgba(75, 85, 99, 0.5)',
                                                padding: 16,
                                                borderRadius: 12,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Text style={{ color: '#ffffff', fontSize: 16 }}>
                                                {movie.genre}
                                            </Text>
                                            <Text style={{ color: '#9ca3af', fontSize: 16 }}>▼</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Release Year & Status Row */}
                                <View style={{
                                    flexDirection: 'row',
                                    marginBottom: 20,
                                    gap: 12,
                                }}>
                                    {/* Release Year */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            color: '#ffffff',
                                            fontSize: 16,
                                            fontWeight: '600',
                                            marginBottom: 8,
                                        }}>
                                            Release Year
                                        </Text>
                                        <AnimatedTextInput
                                            style={{
                                                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                                borderWidth: 1,
                                                borderColor: 'rgba(75, 85, 99, 0.5)',
                                                padding: 16,
                                                borderRadius: 12,
                                                color: '#ffffff',
                                                fontSize: 16,
                                            }}
                                            placeholder="2024"
                                            placeholderTextColor="#9ca3af"
                                            value={movie.releaseYear.toString()}
                                            onChangeText={(text) => handleChange('releaseYear', parseInt(text) || '')}
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    {/* Status Selector */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            color: '#ffffff',
                                            fontSize: 16,
                                            fontWeight: '600',
                                            marginBottom: 8,
                                        }}>
                                            Status
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => setShowStatusModal(true)}
                                            style={{
                                                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                                borderWidth: 1,
                                                borderColor: 'rgba(75, 85, 99, 0.5)',
                                                padding: 16,
                                                borderRadius: 12,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 14, marginRight: 6 }}>
                                                    {getStatusIcon(movie.status)}
                                                </Text>
                                                <Text style={{ color: '#ffffff', fontSize: 16 }}>
                                                    {movie.status}
                                                </Text>
                                            </View>
                                            <Text style={{ color: '#9ca3af', fontSize: 16 }}>▼</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Description Input */}
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={{
                                        color: '#ffffff',
                                        fontSize: 16,
                                        fontWeight: '600',
                                        marginBottom: 8,
                                    }}>
                                        Description (Optional)
                                    </Text>
                                    <AnimatedTextInput
                                        style={{
                                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                            borderWidth: 1,
                                            borderColor: 'rgba(75, 85, 99, 0.5)',
                                            padding: 16,
                                            borderRadius: 12,
                                            color: '#ffffff',
                                            fontSize: 16,
                                            height: 100,
                                            textAlignVertical: 'top',
                                        }}
                                        placeholder="Add your thoughts or notes..."
                                        placeholderTextColor="#9ca3af"
                                        value={movie.description}
                                        onChangeText={(text) => handleChange('description', text)}
                                        multiline
                                        numberOfLines={4}
                                    />
                                </View>

                                {/* Save Button */}
                                <AnimatedTouchableOpacity
                                    style={[buttonStyle]}
                                    onPress={handleSubmit}
                                    disabled={loading}
                                >
                                    <LinearGradient
                                        colors={loading ? ['#6b7280', '#4b5563'] : ['#e50914', '#b8070f']}
                                        style={{
                                            padding: 18,
                                            borderRadius: 16,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            shadowColor: '#e50914',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 8,
                                            elevation: 8,
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 20,
                                            marginRight: 8,
                                            color: '#ffffff',
                                        }}>
                                            {isNew ? '🎬' : '✏️'}
                                        </Text>
                                        <Text style={{
                                            color: '#ffffff',
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                        }}>
                                            {loading ? 'Saving...' : (isNew ? 'Add to Collection' : 'Update Movie')}
                                        </Text>
                                    </LinearGradient>
                                </AnimatedTouchableOpacity>
                            </Animated.View>
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>

                {/* Modals */}
                <ModalSelector
                    visible={showGenreModal}
                    onClose={() => setShowGenreModal(false)}
                    title="Genre"
                    options={genres}
                    selectedValue={movie.genre}
                    onSelect={(value) => handleChange('genre', value)}
                />

                <ModalSelector
                    visible={showStatusModal}
                    onClose={() => setShowStatusModal(false)}
                    title="Status"
                    options={statuses}
                    selectedValue={movie.status}
                    onSelect={(value) => handleChange('status', value)}
                    getIcon={getStatusIcon}
                />

                <ModalSelector
                    visible={showTypeModal}
                    onClose={() => setShowTypeModal(false)}
                    title="Type"
                    options={types}
                    selectedValue={movie.type}
                    onSelect={(value) => handleChange('type', value)}
                    getIcon={getTypeIcon}
                />

                {/* Loading Modal */}
                <Modal transparent visible={loading} animationType="fade">
                    <BlurView intensity={50} style={{ flex: 1 }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        }}>
                            <View style={{
                                backgroundColor: '#1f2937',
                                padding: 32,
                                borderRadius: 20,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: 'rgba(75, 85, 99, 0.3)',
                            }}>
                                <ActivityIndicator size="large" color="#e50914" />
                                <Text style={{
                                    color: '#ffffff',
                                    fontSize: 18,
                                    marginTop: 16,
                                    fontWeight: '600',
                                }}>
                                    Adding to your collection...
                                </Text>
                            </View>
                        </View>
                    </BlurView>
                </Modal>
            </LinearGradient>
        </>
    );
};

export default AddMovieScreen;