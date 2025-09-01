import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    StyleSheet,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    interpolate,
    withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Loader from "@/components/Loader";

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

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
        particle1.value = withSequence(
            withTiming(1, { duration: 3000 }),
            withTiming(0, { duration: 3000 })
        );

        particle2.value = withSequence(
            withTiming(1, { duration: 2500 }),
            withTiming(0, { duration: 2500 })
        );

        particle3.value = withSequence(
            withTiming(1, { duration: 3500 }),
            withTiming(0, { duration: 3500 })
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
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                >
                    <Animated.View style={[{ flex: 1 }, containerStyle]}>
                        {/* Header */}
                        <Animated.View style={[
                            headerStyle,
                            {
                                paddingTop: isSmallDevice ? 40 : 50,
                                paddingHorizontal: 16,
                                paddingBottom: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }
                        ]}>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={{
                                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                    padding: 10,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: 'rgba(75, 85, 99, 0.3)',
                                }}
                            >
                                <Text style={{ color: '#ffffff', fontSize: 16 }}>←</Text>
                            </TouchableOpacity>

                            <View style={{ alignItems: 'center', flex: 1, marginHorizontal: 10 }}>
                                <Text style={{
                                    color: '#ffffff',
                                    fontSize: isSmallDevice ? 20 : 24,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}>
                                    {isNew ? 'Add to Collection' : 'Edit Movie'}
                                </Text>
                                <Text style={{
                                    color: '#9ca3af',
                                    fontSize: isSmallDevice ? 12 : 14,
                                    marginTop: 4,
                                    textAlign: 'center',
                                }}>
                                    Track your cinema journey
                                </Text>
                            </View>

                            <View style={{ width: 40 }} />
                        </Animated.View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
                        >
                            <Animated.View style={[formStyle]}>
                                {/* Title Input */}
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.label}>
                                        Title *
                                    </Text>
                                    <AnimatedTextInput
                                        style={styles.input}
                                        placeholder="Enter movie or series title"
                                        placeholderTextColor="#9ca3af"
                                        value={movie.title}
                                        onChangeText={(text) => handleChange('title', text)}
                                    />
                                </View>

                                {/* Poster URL Input */}
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.label}>
                                        Poster URL (Optional)
                                    </Text>
                                    <AnimatedTextInput
                                        style={styles.input}
                                        placeholder="https://example.com/poster.jpg"
                                        placeholderTextColor="#9ca3af"
                                        value={movie.posterUrl}
                                        onChangeText={(text) => handleChange('posterUrl', text)}
                                        keyboardType="url"
                                    />
                                </View>

                                {/* Preview of poster if URL exists */}
                                {movie.posterUrl ? (
                                    <View style={{ marginBottom: 16, alignItems: 'center' }}>
                                        <Text style={[styles.label, { marginBottom: 8 }]}>
                                            Poster Preview
                                        </Text>
                                        <Image
                                            source={{ uri: movie.posterUrl }}
                                            style={{
                                                width: 100,
                                                height: 150,
                                                borderRadius: 8,
                                                borderWidth: 1,
                                                borderColor: 'rgba(75, 85, 99, 0.5)',
                                            }}
                                            resizeMode="cover"
                                        />
                                    </View>
                                ) : null}

                                {/* Type & Genre Row */}
                                <View style={styles.rowContainer}>
                                    {/* Type Picker */}
                                    <View style={styles.halfInput}>
                                        <Text style={styles.label}>
                                            Type
                                        </Text>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                selectedValue={movie.type}
                                                onValueChange={(value) => handleChange('type', value)}
                                                style={styles.picker}
                                                dropdownIconColor="#ffffff"

                                            >
                                                {types.map((type) => (
                                                    <Picker.Item
                                                        style={{ backgroundColor: '#1A202C' , margin:10 , borderColor : 'rgba(0,78,183,0.5)'}}
                                                        key={type}
                                                        label={type}
                                                        value={type}
                                                        color={movie.type === type ? '#fff' : '#9ca3af'}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>

                                    {/* Genre Picker */}
                                    <View style={styles.halfInput}>
                                        <Text style={styles.label}>
                                            Genre
                                        </Text>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                selectedValue={movie.genre}
                                                onValueChange={(value) => handleChange('genre', value)}
                                                style={styles.picker}
                                                dropdownIconColor="#ffffff"
                                            >
                                                {genres.map((genre) => (
                                                    <Picker.Item
                                                        style={{ backgroundColor: '#1A202C' , margin:10}}
                                                        key={genre}
                                                        label={genre}
                                                        value={genre}
                                                        color={movie.genre === genre ? '#fff' : '#9ca3af'}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                </View>

                                {/* Release Year & Status Row */}
                                <View style={styles.rowContainer}>
                                    {/* Release Year */}
                                    <View style={styles.halfInput}>
                                        <Text style={styles.label}>
                                            Release Year
                                        </Text>
                                        <AnimatedTextInput
                                            style={styles.input}
                                            placeholder="2024"
                                            placeholderTextColor="#9ca3af"
                                            value={movie.releaseYear.toString()}
                                            onChangeText={(text) => handleChange('releaseYear', parseInt(text) || '')}
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    {/* Status Picker */}
                                    <View style={styles.halfInput}>
                                        <Text style={styles.label}>
                                            Status
                                        </Text>
                                        <View style={styles.pickerContainer}>
                                            <Picker

                                                selectedValue={movie.status}
                                                onValueChange={(value) => handleChange('status', value)}
                                                style={styles.picker}
                                                dropdownIconColor="#ffffff"
                                            >
                                                {statuses.map((status) => (
                                                    <Picker.Item
                                                        style={{ backgroundColor: '#1A202C'}}
                                                        key={status}
                                                        label={status}
                                                        value={status}
                                                        color={movie.status === status ? '#1e8fdc' : '#9ca3af'}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                </View>

                                {/* Description Input */}
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={styles.label}>
                                        Description (Optional)
                                    </Text>
                                    <AnimatedTextInput
                                        style={[styles.input, { height: 100 }]}
                                        placeholder="Add your thoughts or notes..."
                                        placeholderTextColor="#9ca3af"
                                        value={movie.description}
                                        onChangeText={(text) => handleChange('description', text)}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
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
                                        style={styles.saveButton}
                                    >
                                        <Text style={{
                                            fontSize: 20,
                                            marginRight: 8,
                                            color: '#ffffff',
                                        }}>
                                            {isNew ? '🎬' : '✏'}
                                        </Text>
                                        <Text style={styles.saveButtonText}>
                                            {loading ? 'Saving...' : (isNew ? 'Add to Collection' : 'Update Movie')}
                                        </Text>
                                    </LinearGradient>
                                </AnimatedTouchableOpacity>
                            </Animated.View>
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>

                {/* Loading Modal */}
                <Loader visible={loading} />
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    label: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(75, 85, 99, 0.5)',
        padding: 16,
        borderRadius: 12,
        color: '#ffffff',
        fontSize: 16,
    },
    pickerContainer: {
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(75, 85, 99, 0.5)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    picker: {
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        color: '#ffffff',
        height: 50,
        width: '100%',
    },
    rowContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    saveButton: {
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
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Particle styles remain unchanged
    particle1Style: {
        position: 'absolute',
        top: height * 0.1,
        left: width * 0.8,
        width: 10,
        height: 10,
        backgroundColor: '#e50914',
        borderRadius: 5,
    },
    particle2Style: {
        position: 'absolute',
        top: height * 0.3,
        left: width * 0.1,
        width: 6,
        height: 6,
        backgroundColor: '#f59e0b',
        borderRadius: 3,
    },
    particle3Style: {
        position: 'absolute',
        top: height * 0.5,
        left: width * 0.9,
        width: 8,
        height: 8,
        backgroundColor: '#10b981',
        borderRadius: 4,
    },
});

export default AddMovieScreen;